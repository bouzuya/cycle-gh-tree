export default function(responses) {
  const { DOM, HTTP } = responses;
  const fetchIssue$ = DOM.select('button').events('click');
  const updateIssues$ = HTTP.mergeAll().map(({ body }) => body);
  const actions = {
    fetchIssue$,
    updateIssues$
  };
  return actions;
}
