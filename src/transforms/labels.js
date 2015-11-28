import Rx from 'rx';
import assign from '../utils/assign';
import newRequests from '../utils/new-requests';

function newLabelRequest({ user, repo, token }) {
  const url = `https://api.github.com/repos/${user}/${repo}/labels`;
  const ua = { 'User-Agent': 'gh-tree' };
  const auth = token ? { 'Authorization': `token ${token}` } : {};
  const headers = assign({}, ua, auth);
  return { method: 'GET', url, headers };
}

export default function labels(actions) {
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
