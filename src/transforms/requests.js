import { Observable } from 'rx';
import assign from '../utils/assign';
import newRequests from '../utils/new-requests';

function newIssueRequest({ user, repo, token }) {
  const url = `https://api.github.com/repos/${user}/${repo}/issues`;
  const ua = { 'User-Agent': 'gh-tree' };
  const auth = token ? { 'Authorization': `token ${token}` } : {};
  const headers = assign({}, ua, auth);
  return { method: 'GET', url, headers };
}

function newLabelRequest({ user, repo, token }) {
  const url = `https://api.github.com/repos/${user}/${repo}/labels`;
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
        return newRequests(requests, newIssueRequest({ user, repo, token }));
      }, requests);
      return assign({}, state, { requests: newAllRequests });
    });
}

function fetchLabelsTransform({ fetchLabels$ }) {
  return fetchLabels$
    .map(() => state => {
      const { settings, requests } = state;
      const repos = settings && settings.repos ? settings.repos : [];
      const token = settings.token;
      const newAllRequests = repos.reduce((requests, { user, repo }) => {
        return newRequests(requests, newLabelRequest({ user, repo, token }));
      }, requests);
      return assign({}, state, { requests: newAllRequests });
    });
}

export default function labels(actions) {
  // NOTE: no namespace
  return Observable.merge(
    fetchIssuesTransform(actions),
    fetchLabelsTransform(actions)
  );
}
