import addRepo from './actions/add-repo';
import fetchIssues from './actions/fetch-issues';
import loadSettings from './actions/load-settings';
import updateIssue from './actions/update-issue';
import updateRepo from './actions/update-repo';
import updateUser from './actions/update-user';
import token from './actions/token/';

export default function(responses) {
  const actions = {
    ...addRepo(responses),
    ...fetchIssues(responses),
    ...loadSettings(responses),
    ...updateIssue(responses),
    ...updateRepo(responses),
    ...updateUser(responses),
    ...token(responses)
  };
  return actions;
}
