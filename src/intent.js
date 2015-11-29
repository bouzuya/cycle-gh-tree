import addFilter from './actions/add-filter';
import fetchAssignees from './actions/fetch-assignees';
import fetchIssues from './actions/fetch-issues';
import fetchLabels from './actions/fetch-labels';
import fetchMilestones from './actions/fetch-milestones';
import loadSettings from './actions/load-settings';
import removeFilter from './actions/remove-filter';
import repo from './actions/repos/';
import switchTab from './actions/switch-tab';
import token from './actions/token/';
import updateAssignee from './actions/update-assignee';
import updateIssue from './actions/update-issue';
import updateLabel from './actions/update-label';
import updateMilestone from './actions/update-milestone';
import assign from './utils/assign';

export default function(responses) {
  const actions = assign(
    {},
    addFilter(responses),
    fetchAssignees(responses),
    fetchIssues(responses),
    fetchLabels(responses),
    fetchMilestones(responses),
    loadSettings(responses),
    removeFilter(responses),
    repo(responses),
    switchTab(responses),
    token(responses),
    updateAssignee(responses),
    updateIssue(responses),
    updateLabel(responses),
    updateMilestone(responses)
  );
  return actions;
}
