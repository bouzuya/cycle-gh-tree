import Rx from 'rx';
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
    fetchIssues$,
    updateIssue$,
  } = actions;
  const state = {
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
    fetchIssues$
    .map((_, i) => state => {
      const { settings } = state;
      const repos = settings && settings.repos ? settings.repos : [];
      const newRequests = repos.map(({ user, repo }, j) => {
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
    repos(actions, { reposMaxLength }),
    token(actions),
    updateIssue$
    .map(issue => state => {
      state.issues = merge(state.issues, issue);
      return state;
    })
  );
  const state$ = Rx.Observable.just(state)
    .merge(actions$)
    .scan((state, action) => action(state))
    .shareReplay(1);
  return state$;
}
