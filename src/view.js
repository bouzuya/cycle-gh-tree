import { h } from '@cycle/dom';
import Rx from 'rx';

export default function(state$) {
  const vtree$ = state$
  .map(({ issues, user, repo, repos }) => {
    return h('div', [
      h('div', [
        h('input.user'),
        '/',
        h('input.repo'),
        h('button.add', ['add'])
      ]),
      h('ul', repos.map(({ user, repo }) => {
        return h('li', [user, '/', repo]);
      })),
      h('button.fetch', ['fetch']),
      h('ul', issues.map(({ user, repo, url, title, number, children }) => {
        return h('li', [
          h('a', { href: url }, [`${user}/${repo}#${number}`]),
          ' ',
          title,
          children.length === 0 ? null : h('ul', children.map(i => {
            const { user, repo, url, title, number } = i;
            return h('li', [
              h('a', { href: url }, [`${user}/${repo}#${number}`]),
              ' ',
              title
            ]);
          }))
        ]);
      }))
    ])
  });
  const request$ = state$
  .flatMap(({ requests }) => Rx.Observable.from(requests));
  const requests = {
    DOM: vtree$,
    HTTP: request$
  };
  return requests;
}
