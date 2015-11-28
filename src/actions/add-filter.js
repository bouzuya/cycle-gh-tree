export default function({ DOM }) {
  const addFilter$ = DOM
    .select('.filter-label input[type=checkbox]')
    .events('click')
    .filter(e => e.target.checked)
    .map(e => {
      const type = 'label';
      const name = e.target.value;
      return { type, name };
    });
  return { addFilter$ };
}
