import Rx from 'rx';
import assign from '../utils/assign';
import newRequests from '../utils/new-requests';

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
  return issues
    .map(issue => {
      const m = (issue.body || '').match(/^(?:([^\/]+)\/([^#]+))?#(\d+)/);
      if (!m) return assign({}, issue, { parent: null });
      const [_, u, r, n] = m;
      return assign({}, issue, {
        parent: {
          user: u || issue.user,
          repo: r || issue.repo,
          number: parseInt(n, 10)
        }
      });
    });
}

function addChildren(issues) {
  return issues
    .map(issue => {
      const { user, repo, number } = issue;
      const children = issues.filter(i => {
        const p = i.parent;
        return p && p.user === user && p.repo === repo && p.number === number;
      });
      return assign({}, issue, { children });
    });
}

function newRequest({ user, repo, token }) {
  const url = `https://api.github.com/repos/${user}/${repo}/issues`;
  const ua = { 'User-Agent': 'gh-tree' };
  const auth = token ? { 'Authorization': `token ${token}` } : {};
  const headers = assign({}, ua, auth);
  return { method: 'GET', url, headers };
}

function fetchIssuesTransform({ fetchIssues$ }) {
  return fetchIssues$
    .map(() => state => {
      const { settings, requests } = state;
      const repos = settings && settings.repos ? settings.repos : [];
      const token = settings.token;
      const newAllRequests = repos.reduce((requests, { user, repo }) => {
        return newRequests(requests, newRequest({ user, repo, token }));
      }, requests);
      return assign({}, state, { issues: [], requests: newAllRequests });
    });
}

function updateIssueTransform({ updateIssue$ }) {
  return updateIssue$
    .map(issue => state => {
      const { issues } = state;
      const newIssues = merge(issues, issue);
      return assign({}, state, { issues: newIssues });
    });
}

export default function(actions) {
  // NOTE: no namespace
  return Rx.Observable
    .merge(
      fetchIssuesTransform(actions),
      updateIssueTransform(actions)
    );
}
