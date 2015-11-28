import { Observable } from 'rx';
import assign from '../utils/assign';
import transform from '../utils/transform';

function saveTransform({ save$ }) {
  return save$.map(transform(({ token, settings }) => {
    const newSettings = assign({}, settings, { token: token.value });
    const newToken = assign({}, token, { value: null });
    return { settings: newSettings, token: newToken };
  }));
}

function updateTransform({ update$ }) {
  return update$.map(transform(({ token }, value) => {
    return { token: assign({}, token, { value }) };
  }));
}

export default function({ token }) {
  const actions = token;
  return Observable
    .merge(
      saveTransform(actions),
      updateTransform(actions)
    );
}
