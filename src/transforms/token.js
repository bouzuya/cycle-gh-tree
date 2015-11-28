import { Observable } from 'rx';
import assign from '../utils/assign';

function saveTransform({ save$ }) {
  return save$
    .map(() => state => {
      const { token } = state;
      const { settings } = state;
      const newSettings = assign({}, settings, { token: token.value });
      const newToken = assign({}, token, { value: null });
      return assign({}, state, {
        settings: newSettings, token: newToken
      });
    });
}

function updateTransform({ update$ }) {
  return update$
    .map(value => state => {
      const { token } = state;
      const newToken = assign({}, token, { value });
      return assign({}, state, { token: newToken });
    });
}

export default function({ token }) {
  const actions = token;
  return Observable
    .merge(
      saveTransform(actions),
      updateTransform(actions)
    );
}
