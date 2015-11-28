import { Observable } from 'rx';
import assign from '../utils/assign';

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

function filter(issues, filters) {
  return filters.reduce((issues, filter) => {
    return issues.filter(issue => {
      switch (filter.type) {
        case 'label':
          return issue.labels.filter(l => l === filter.name).length > 0;
        default:
          return true;
      }
    });
  }, issues);
}

function fetchIssuesTransform({ fetchIssues$ }) {
  return fetchIssues$
    .map(() => state => assign({}, state, { issues: [] }));
}

function updateIssueTransform({ updateIssue$ }) {
  return updateIssue$
    .map(issue => state => {
      const { issues, filters } = state;
      const newIssues = filter(merge(issues, issue), filters);
      return assign({}, state, { issues: newIssues });
    });
}

export default function(actions) {
  // NOTE: no namespace
  return Observable.merge(
    fetchIssuesTransform(actions),
    updateIssueTransform(actions)
  );
}
