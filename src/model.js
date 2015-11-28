import Rx from 'rx';
import issues from './transforms/issues';
import repos from './transforms/repos';
import token from './transforms/token';
import assign from './utils/assign';
import newRequests from './utils/new-requests';

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

function newLabelRequest({ user, repo, token }) {
  const url = `https://api.github.com/repos/${user}/${repo}/labels`;
  const ua = { 'User-Agent': 'gh-tree' };
  const auth = token ? { 'Authorization': `token ${token}` } : {};
  const headers = assign({}, ua, auth);
  return { method: 'GET', url, headers };
}

function labels(actions) {
  const { updateLabel$, fetchLabels$ } = actions;
  return Rx.Observable.merge(
    fetchLabels$
      .map(() => state => {
        const { settings, requests } = state;
        const repos = settings && settings.repos ? settings.repos : [];
        const token = settings.token;
        const newAllRequests = repos.reduce((requests, { user, repo }) => {
          return newRequests(requests, newLabelRequest({ user, repo, token }));
        }, requests);
        return assign({}, state, { requests: newAllRequests });
      }),
    updateLabel$
      .map(label => state => {
        const { labels } = state;
        const index = labels.indexOf(label);
        if (index >= 0) return state;
        const newLabels = labels.concat([label]);
        return assign({}, state, { labels: newLabels });
      })
  );
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
