import updateIssue from './actions/update-issue';
import updateIssues from './actions/update-issues';

export default function(responses) {
  const { DOM, HTTP } = responses;
  const fetchIssue$ = DOM.select('button').events('click');
  const actions = {
    fetchIssue$,
    ...updateIssue(responses),
    ...updateIssues(responses)
  };
  return actions;
}
