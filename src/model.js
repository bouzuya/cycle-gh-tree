import Rx from 'rx';

export default function(actions) {
  const {
    fetchIssue$
  } = actions;
  const state = { message: 'Hello, world!', count: 0 };
  const actions$ = Rx.Observable.merge(
    fetchIssue$.map(body => state => {
      state.count += 1;
      return state;
    })
  );
  const state$ = Rx.Observable.just(state)
    .merge(actions$)
    .scan((state, action) => action(state))
    .share();
  return state$;
}
