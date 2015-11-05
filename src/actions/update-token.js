export default function({ DOM }) {
  const updateToken$ = DOM.select('input.token').events('input')
  .map(e => e.target.value);
  return { updateToken$ };
}
