import { Rx, ReplaySubject } from 'rx';
import hash from 'object-hash';
import { Storage } from '../utils/storage';

function getGlobal() {
  return new Function('return this')();
}

function map(storage, callback) {
  const resultList = [];
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    const value = storage.getItem(key);
    const result = callback({ key, value }, i);
    resultList.push(result);
  }
  return resultList;
}

function getData(storage) {
  return map(storage, ({ key, value }) => {
    try {
      const parsed = JSON.parse(value)
      return { key, value: parsed };
    } catch (e) {
      // FIXME
      console.error(e);
      return null;
    }
  })
  .filter(i => i)
  .reduce(((data, { key, value }) => {
    data[key] = value;
    return data;
  }), {});
}

function setData(storage, data) {
  Object.keys(data).forEach(key => {
    const value = data[key];
    storage.setItem(key, JSON.stringify(value));
  });
  return data;
}

function makeStorageDriver(initialState = {}) {
  const g = getGlobal()
  const storage = g && g.localStorage ?
    g.localStorage : new Storage(initialState);
  return function(data$) {
    const response$ = data$
      .distinctUntilChanged(hash)
      .map(data => data ? setData(storage, data) : getData(storage))
      .multicast(new ReplaySubject(1));
    response$.connect();
    return response$;
  };
}

export { makeStorageDriver };
