import updateIssues from './actions/update-issues';

export default function(responses) {
  const { DOM, HTTP } = responses;
  const fetchIssue$ = DOM.select('button').events('click');
  const actions = {
    fetchIssue$,
    ...updateIssues(responses)
  };
  return actions;
}
