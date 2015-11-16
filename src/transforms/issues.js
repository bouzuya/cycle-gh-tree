import Rx from 'rx';

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

function fetchIssuesTransform({ fetchIssues$ }, { reposMaxLength }) {
  return fetchIssues$
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
      state.issues = [];
      state.requests = state.requests.concat(newRequests);
      return state;
    });
}

function updateIssueTransform({ updateIssue$ }) {
  return updateIssue$
    .map(issue => state => {
      state.issues = merge(state.issues, issue);
      return state;
    });
}

export default function(actions, { reposMaxLength }) {
  // NOTE: no namespace
  return Rx.Observable.merge(
    fetchIssuesTransform(actions, { reposMaxLength }),
    updateIssueTransform(actions),
  );
}
