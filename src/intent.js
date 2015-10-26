export default function(responses) {
  const { DOM, HTTP } = responses;
  const fetchIssue$ = DOM.select('button').events('click');
  const updateIssue$ = HTTP.mergeAll().map(({ body }) => body);
  const actions = {
    fetchIssue$,
    updateIssue$
  };
  return actions;
}
