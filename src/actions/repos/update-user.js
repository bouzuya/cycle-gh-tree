export default function({ DOM }) {
  const updateUser$ = DOM.select('input.user').events('input')
  .map(e => e.target.value);
  return { updateUser$ };
}
