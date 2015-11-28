import fetchIssues from './actions/fetch-issues';
import fetchLabels from './actions/fetch-labels';
import loadSettings from './actions/load-settings';
import repo from './actions/repos/';
import switchTab from './actions/switch-tab';
import token from './actions/token/';
import updateIssue from './actions/update-issue';
import updateLabel from './actions/update-label';
import assign from './utils/assign';

export default function(responses) {
  const actions = assign(
    {},
    fetchIssues(responses),
    fetchLabels(responses),
    loadSettings(responses),
    repo(responses),
    switchTab(responses),
    token(responses),
    updateIssue(responses),
    updateLabel(responses)
  );
  return actions;
}
