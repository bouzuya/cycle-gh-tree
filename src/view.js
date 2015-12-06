import { Observable } from 'rx';
import appView from './views/app-view';

export default function(state$) {
  const vtree$ = state$.map(appView);
  const request$ = state$
    .map(({ requests }) => Observable.from(requests))
    .mergeAll();
  const data$ = state$.map(({ settings }) => settings);
  const requests = {
    DOM: vtree$,
    HTTP: request$,
    Storage: data$
  };
  return requests;
}
