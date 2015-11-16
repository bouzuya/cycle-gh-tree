import Rx from 'rx';

function saveTransform({ save$ }) {
  return save$
    .map(() => state => {
      const { token } = state;
      const { settings } = state;
      const newSettings = Object.assign({}, settings, { token: token.value });
      const newToken = Object.assign({}, token, { value: null });
      return Object.assign({}, state, {
        settings: newSettings, token: newToken
      });
    });
}

function updateTransform({ update$ }) {
  return update$
    .map(value => state => {
      const { token } = state;
      const newToken = Object.assign({}, token, { value });
      return Object.assign({}, state, { token: newToken });
    });
}

export default function({ token }) {
  const actions = token;
  return Rx.Observable
    .merge(
      saveTransform(actions),
      updateTransform(actions)
    );
}
