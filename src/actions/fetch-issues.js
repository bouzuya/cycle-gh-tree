export default function({ DOM }) {
  const fetchIssues$ = DOM.select('button.fetch').events('click');
  return { fetchIssues$ };
}
