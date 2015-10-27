import fetchIssues from './actions/fetch-issues';
import updateIssue from './actions/update-issue';
import updateIssues from './actions/update-issues';

export default function(responses) {
  const actions = {
    ...fetchIssues(responses),
    ...updateIssue(responses),
    ...updateIssues(responses)
  };
  return actions;
}
