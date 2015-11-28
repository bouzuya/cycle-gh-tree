export default function({ DOM }) {
  const fetchLabels$ = DOM.select('button.fetch-labels').events('click');
  return { fetchLabels$ };
}
