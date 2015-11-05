export default function({ DOM }) {
  const update$ = DOM.select('input.token').events('input')
  .map(e => e.target.value);
  return { update$ };
}
