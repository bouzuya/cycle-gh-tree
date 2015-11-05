import addRepo from './actions/add-repo';
import fetchIssues from './actions/fetch-issues';
import updateIssue from './actions/update-issue';
import updateRepo from './actions/update-repo';
import updateUser from './actions/update-user';
import updateToken from './actions/update-token';

export default function(responses) {
  const actions = {
    ...addRepo(responses),
    ...fetchIssues(responses),
    ...updateIssue(responses),
    ...updateRepo(responses),
    ...updateUser(responses),
    ...updateToken(responses)
  };
  return actions;
}
