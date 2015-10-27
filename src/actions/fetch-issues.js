export default function({ DOM }) {
  const fetchIssues$ = DOM.select('button').events('click');
  return { fetchIssues$ };
}
