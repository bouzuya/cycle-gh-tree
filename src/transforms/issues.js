import { Observable } from 'rx';
import assign from '../utils/assign';
import transform from '../utils/transform';

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
  const labels = filters
    .filter(i => i.type === 'label')
    .map(i => i.name);
  const milestones = filters
    .filter(i => i.type === 'milestone')
    .map(i => i.name);
  return issues
    .filter(issue => {
      if (labels.length === 0) return true;
      return labels.some(i => issue.labels.some(j => i === j));
    })
    .filter(issue => {
      if (milestones.length === 0) return true;
      return milestones.some(i => i === issue.milestone);
    });
}

function fetchIssuesTransform({ fetchIssues$ }) {
  return fetchIssues$.map(transform(() => ({ issues: [] })));
}

function updateIssueTransform({ updateIssue$ }) {
  return updateIssue$.map(transform(({ issues, filters }, issue) => {
    const newIssues = filter(merge(issues, issue), filters);
    return { issues: newIssues };
  }));
}

export default function(actions) {
  // NOTE: no namespace
  return Observable.merge(
    fetchIssuesTransform(actions),
    updateIssueTransform(actions)
  );
}
