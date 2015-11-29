import { h } from '@cycle/dom';
import reposSettingView from '../views/repos-setting-view';
import tokenSettingView from '../views/token-setting-view';

export default function(state) {
  return h('section.settings', [
    h('h1', ['Settings']),
    tokenSettingView(state),
    reposSettingView(state)
  ]);
}
