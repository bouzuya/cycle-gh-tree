export default function(responses) {
  const { DOM } = responses;
  const fetchIssue$ = DOM.select('button').events('click');
  const actions = {
    fetchIssue$
  };
  return actions;
}
