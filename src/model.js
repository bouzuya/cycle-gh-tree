import Rx from 'rx';

function initializeToken() {
  return {
    token: '',
    tokenFormValue: ''
  };
}

function updateAndSaveToken(actions) {
  const { saveToken$, updateToken$ } = actions;
  return Rx.Observable.merge(
    saveToken$
    .map(() => state => {
      state.token = state.tokenFormValue;
      state.tokenFormValue = '';
      return state;
    }),
    updateToken$
    .map(token => state => {
      state.tokenFormValue = token;
      return state;
    })
  );
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
    fetchIssues$
    .map((_, i) => state => {
      const newRequests = state.repos.map(({ user, repo }, j) => {
        const id = i * reposMaxLength + j;
        const url = `https://api.github.com/repos/${user}/${repo}/issues`;
        const headers = { 'User-Agent': 'gh-tree' };
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
    updateAndSaveToken(actions),
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
    .share();
  return state$;
}
