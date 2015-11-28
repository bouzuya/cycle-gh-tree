import Rx from 'rx';
import issues from './transforms/issues';
import repos from './transforms/repos';
import token from './transforms/token';
import assign from './utils/assign';

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

function labels(actions) {
  const { updateLabel$ } = actions;
  return updateLabel$
    .map(label => state => {
      const { labels } = state;
      const index = labels.indexOf(label);
      if (index >= 0) return state;
      const newLabels = labels.concat([label]);
      return assign({}, state, { labels: newLabels });
    });
}

export default function(actions) {
  const { loadSettings$, switchTab$ } = actions;
  const state = assign(
    {
      currentTab: "settings",
      issues: [],
      labels: [],
      requests: []
    },
    initializeRepos(),
    initializeToken()
  );
  const reposMaxLength = 10;
  const actions$ = Rx.Observable.merge(
    loadSettings$
      .map(storage => state => {
        state.settings = storage;
        return state;
      }),
    switchTab$
      .map(value => state => {
        state.currentTab = value;
        return state
      }),
    labels(actions),
    issues(actions),
    repos(actions, { reposMaxLength }),
    token(actions)
  );
  const state$ = Rx.Observable
    .just(state)
    .merge(actions$)
    .scan((state, action) => action(state))
    .shareReplay(1);
  return state$;
}
