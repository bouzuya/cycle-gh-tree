import fetchIssues from './actions/fetch-issues';
import updateIssue from './actions/update-issue';

export default function(responses) {
  const actions = {
    ...fetchIssues(responses),
    ...updateIssue(responses)
  };
  return actions;
}
