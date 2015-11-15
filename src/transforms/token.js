import Rx from 'rx';

export default function({ token }) {
  const { save$, update$ } = token; // actions
  return Rx.Observable.merge(
    save$
    .map(() => state => {
      const { token } = state;
      const { settings } = state;
      const newSettings = Object.assign({}, settings, { token: token.value });
      const newToken = Object.assign({}, token, { value: null });
      return Object.assign({}, state, {
        settings: newSettings, token: newToken
      });
    }),
    update$
    .map(value => state => {
      const { token } = state;
      const newToken = Object.assign({}, token, { value });
      return Object.assign({}, state, { token: newToken });
    })
  );
}
