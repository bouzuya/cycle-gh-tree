import fetchIssues from './actions/fetch-issues';
import loadSettings from './actions/load-settings';
import repo from './actions/repos/';
import switchTab from './actions/switch-tab';
import token from './actions/token/';
import updateIssue from './actions/update-issue';
import assign from './utils/assign';

export default function(responses) {
  const actions = assign(
    {},
    fetchIssues(responses),
    loadSettings(responses),
    repo(responses),
    switchTab(responses),
    token(responses),
    updateIssue(responses)
  );
  return actions;
}
