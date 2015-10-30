import fetchIssues from './actions/fetch-issues';
import updateIssue from './actions/update-issue';
import updateRepo from './actions/update-repo';
import updateUser from './actions/update-user';

export default function(responses) {
  const actions = {
    ...fetchIssues(responses),
    ...updateIssue(responses),
    ...updateRepo(responses),
    ...updateUser(responses)
  };
  return actions;
}
