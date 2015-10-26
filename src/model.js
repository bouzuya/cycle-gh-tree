import Rx from 'rx';

export default function(actions) {
  const state = { message: 'Hello, world!' };
  const state$ = Rx.Observable.just(state)
  return state$;
}
