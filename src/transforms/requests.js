import { Observable } from 'rx';
import assign from '../utils/assign';
import transform from '../utils/transform';

function newRequests(requests, request) {
  const id = requests.length + 1;
  return requests.concat([assign({}, request, { id })]);
}

function newAssigneeRequest({ user, repo, token }) {
  const url = `https://api.github.com/repos/${user}/${repo}/assignees`;
  const ua = { 'User-Agent': 'gh-tree' };
  const auth = token ? { 'Authorization': `token ${token}` } : {};
  const headers = assign({}, ua, auth);
  return { method: 'GET', url, headers };
}

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

function newMilestoneRequest({ user, repo, token }) {
  const url = `https://api.github.com/repos/${user}/${repo}/milestones`;
  const ua = { 'User-Agent': 'gh-tree' };
  const auth = token ? { 'Authorization': `token ${token}` } : {};
  const headers = assign({}, ua, auth);
  return { method: 'GET', url, headers };
}

function fetchAssigneesTransform({ fetchAssignees$ }) {
  return fetchAssignees$.map(transform(({ settings, requests }) => {
    const repos = settings && settings.repos ? settings.repos : [];
    const token = settings.token;
    const newAllRequests = repos.reduce((requests, { user, repo }) => {
      return newRequests(requests, newAssigneeRequest({ user, repo, token }));
    }, requests);
    return { requests: newAllRequests };
  }));
}

function fetchIssuesTransform({ fetchIssues$ }) {
  return fetchIssues$.map(transform(({ settings, requests }) => {
    const repos = settings && settings.repos ? settings.repos : [];
    const token = settings.token;
    const newAllRequests = repos.reduce((requests, { user, repo }) => {
      return newRequests(requests, newIssueRequest({ user, repo, token }));
    }, requests);
    return { requests: newAllRequests };
  }));
}

function fetchLabelsTransform({ fetchLabels$ }) {
  return fetchLabels$.map(transform(({ settings, requests }) => {
    const repos = settings && settings.repos ? settings.repos : [];
    const token = settings.token;
    const newAllRequests = repos.reduce((requests, { user, repo }) => {
      return newRequests(requests, newLabelRequest({ user, repo, token }));
    }, requests);
    return { requests: newAllRequests };
  }));
}

function fetchMilestonesTransform({ fetchMilestones$ }) {
  return fetchMilestones$.map(transform(({ settings, requests }) => {
    const repos = settings && settings.repos ? settings.repos : [];
    const token = settings.token;
    const newAllRequests = repos.reduce((requests, { user, repo }) => {
      return newRequests(requests, newMilestoneRequest({ user, repo, token }));
    }, requests);
    return { requests: newAllRequests };
  }));
}

export default function labels(actions) {
  // NOTE: no namespace
  return Observable.of(
    fetchAssigneesTransform(actions),
    fetchIssuesTransform(actions),
    fetchLabelsTransform(actions),
    fetchMilestonesTransform(actions)
  ).mergeAll();
}
