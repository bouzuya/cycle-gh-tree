import Rx from 'rx';
import token from './transforms/token';

function initializeToken() {
  return {
    // TODO
    settings: null,
    token: {
      value: ''
    }
  };
}

function indexOf(issues, issue) {
  const indexes = issues
  .map((i, index) => [i, index])
  .filter(([i, _]) => i.url === issue.url)
  .map(([_, index]) => index);
  return indexes.length > 0 ? indexes[0] : -1;
}

function merge(issues, issue) {
  const index = indexOf(issues, issue);
  if (index >= 0) {
    issues[index] = issue;
  } else {
    issues.push(issue);
  }
  return addChildren(addParent(issues));
}

function addParent(issues) {
  return issues.map(issue => {
    const m = (issue.body || '').match(/^(?:([^\/]+)\/([^#]+))?#(\d+)/);
    if (!m) return Object.assign({}, issue, { parent: null });
    const [_, u, r, n] = m;
    return Object.assign({}, issue, {
      parent: {
        user: u || issue.user,
        repo: r || issue.repo,
        number: parseInt(n, 10)
      }
    });
  });
}

function addChildren(issues) {
  return issues.map(issue => {
    const { user, repo, number } = issue;
    const children = issues.filter(i => {
      const p = i.parent;
      return p && p.user === user && p.repo === repo && p.number === number;
    });
    return Object.assign({}, issue, { children });
  });
}

export default function(actions) {
  const {
    loadSettings$,
    addRepo$,
    fetchIssues$,
    updateIssue$,
    updateRepo$,
    updateUser$
  } = actions;
  const state = {
    issues: [],
    repos: [],
    requests: [],
    repo: null,
    user: null,
    ...initializeToken()
  };
  const reposMaxLength = 10;
  const actions$ = Rx.Observable.merge(
    loadSettings$
    .map(storage => state => {
      state.settings = storage;
      return state;
    }),
    fetchIssues$
    .map((_, i) => state => {
      const { settings } = state;
      const newRequests = state.repos.map(({ user, repo }, j) => {
        const id = i * reposMaxLength + j;
        const url = `https://api.github.com/repos/${user}/${repo}/issues`;
        const ua = { 'User-Agent': 'gh-tree' };
        const auth = settings.token ? {
          'Authorization': `token ${settings.token}`
        } : {};
        const headers = Object.assign({}, ua, auth);
        return { id, method: 'GET', url, headers };
      });
      state.requests = state.requests.concat(newRequests);
      return state;
    }),
    addRepo$
    .map(repo => state => {
      const { user, repo } = state;
      if (state.repos.length > reposMaxLength) return state;
      const duplicated = state.repos.filter(i => {
        return i.user === user && i.repo === repo;
      }).length > 0;
      if (duplicated) return state;
      state.repos.push({ user, repo });
      return state;
    }),
    token(actions),
    updateIssue$
    .map(issue => state => {
      state.issues = merge(state.issues, issue);
      return state;
    }),
    updateRepo$
    .map(repo => state => {
      state.repo = repo;
      return state;
    }),
    updateUser$
    .map(user => state => {
      state.user = user;
      return state;
    })
  );
  const state$ = Rx.Observable.just(state)
    .merge(actions$)
    .scan((state, action) => action(state))
    .shareReplay(1);
  return state$;
}
