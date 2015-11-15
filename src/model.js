import Rx from 'rx';
import issues from './transforms/issues';
import repos from './transforms/repos';
import token from './transforms/token';

function initializeRepos() {
  return {
    // TODO: settings.repos: []
    settings: null,
    repo: {
      repo: null,
      user: null
    }
  };
}
function initializeToken() {
  return {
    // TODO: settings.token: 'xxx'
    settings: null,
    token: {
      value: ''
    }
  };
}

export default function(actions) {
  const { loadSettings$ } = actions;
  const state = {
    currentTab: "settings",
    issues: [],
    requests: [],
    ...initializeRepos(),
    ...initializeToken()
  };
  const reposMaxLength = 10;
  const actions$ = Rx.Observable.merge(
    loadSettings$
      .map(storage => state => {
        state.settings = storage;
        return state;
      }),
    issues(actions, { reposMaxLength }),
    repos(actions, { reposMaxLength }),
    token(actions)
  );
  const state$ = Rx.Observable.just(state)
    .merge(actions$)
    .scan((state, action) => action(state))
    .shareReplay(1);
  return state$;
}
