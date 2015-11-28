export default function({ DOM }) {
  const fetchIssues$ = DOM.select('button.fetch-issues').events('click');
  return { fetchIssues$ };
}
