import fetchIssues from './actions/fetch-issues';
import loadSettings from './actions/load-settings';
import repo from './actions/repos/';
import updateIssue from './actions/update-issue';
import token from './actions/token/';

export default function(responses) {
  const actions = {
    ...fetchIssues(responses),
    ...loadSettings(responses),
    ...repo(responses),
    ...updateIssue(responses),
    ...token(responses)
  };
  return actions;
}
