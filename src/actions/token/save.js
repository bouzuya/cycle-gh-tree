export default function({ DOM }) {
  const save$ = DOM.select('button.save-token').events('click');
  return { save$ };
}
