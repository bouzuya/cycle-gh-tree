import { h } from '@cycle/dom';

export default function({ settings, token }) {
  const currentToken = settings && settings.token ? settings.token : '';
  return h('div', [
    h('h1', ['Token']),
    h('div', [
      h('input.token', { value: token.value }),
      h('button.save-token', ['save token']),
      h('span.token', [
        currentToken.replace(/^(.*)(.{4})$/, (_, p1, p2) => {
          const masked = new Array(p1.length + 1).join('*');
          const opened = p2;
          return masked + opened;
        })
      ])
    ])
  ]);
}

