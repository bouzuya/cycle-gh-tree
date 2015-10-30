export default function({ DOM }) {
  const addRepo$ = DOM.select('button.add').events('click');
  return { addRepo$ };
}
