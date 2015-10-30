import fetchIssues from './actions/fetch-issues';
import updateIssue from './actions/update-issue';
import updateUser from './actions/update-user';

export default function(responses) {
  const actions = {
    ...fetchIssues(responses),
    ...updateIssue(responses),
    ...updateUser(responses)
  };
  return actions;
}
