import { h } from '@cycle/dom';
import Rx from 'rx';

function renderTokenForm(state) {
  const { settings, token } = state;
  return h('div', [
    h('input.token', { value: token.value }),
    h('button.save-token', ['save token']),
    h('span.token', [
      settings.token.replace(/^(.*)(.{4})$/, (_, p1, p2) => {
        const masked = new Array(p1.length + 1).join('*');
        const opened = p2;
        return masked + opened;
      })
    ])
  ]);
}

export default function(state$) {
  const vtree$ = state$
  .map(state => {
    const { issues, user, repo, repos } = state;
    return h('div', [
      h('div', [
        h('input.user'),
        '/',
        h('input.repo'),
        h('button.add', ['add'])
      ]),
      renderTokenForm(state),
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
