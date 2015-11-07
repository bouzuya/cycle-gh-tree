// https://html.spec.whatwg.org/multipage/webstorage.html#the-storage-interface
// interface Storage {
//   readonly attribute unsigned long length;
//   DOMString? key(unsigned long index);
//   getter DOMString? getItem(DOMString key);
//   setter void setItem(DOMString key, DOMString value);
//   deleter void removeItem(DOMString key);
//   void clear();
// };

export class Storage {
  constructor(initialState = {}) {
    this.keys = Object.keys(initialState);
    this.storage = { ...initialState };
  }

  get length() {
    return this.keys.length;
  }

  key(index) {
    return this.keys[index];
  }

  getItem(key) {
    return this.storage[key];
  }

  setItem(key, value) {
    if (this.keys.indexOf(key) < 0) this.keys.push(key);
    this.storage[key] = value;
  }

  removeItem(key) {
    const index = this.keys.indexOf(key);
    if (index < 0) return;
    this.keys.splice(index, 1);
    delete this.storage[key];
  }

  clear() {
    this.keys = [];
    this.storage = {};
  }
}
