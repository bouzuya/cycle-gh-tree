import fetchIssues from './actions/fetch-issues';
import updateIssues from './actions/update-issues';

export default function(responses) {
  const actions = {
    ...fetchIssues(responses),
    ...updateIssues(responses)
  };
  return actions;
}
