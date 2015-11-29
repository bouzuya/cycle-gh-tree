import { h } from '@cycle/dom';
import reposSettingView from '../views/repos-setting-view';

function renderTokenForm({ settings, token }) {
  const currentToken = settings && settings.token ? settings.token : '';
  return h('div', [
    h('input.token', { value: token.value }),
    h('button.save-token', ['save token']),
    h('span.token', [
      currentToken.replace(/^(.*)(.{4})$/, (_, p1, p2) => {
        const masked = new Array(p1.length + 1).join('*');
        const opened = p2;
        return masked + opened;
      })
    ])
  ]);
}

export default function(state) {
  return h('section.settings', [
    h('h1', ['Settings']),
    h('div', [
      h('h1', ['Token']),
      renderTokenForm(state)
    ]),
    reposSettingView(state)
  ]);
}
