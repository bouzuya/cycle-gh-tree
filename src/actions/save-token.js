export default function({ DOM }) {
  const saveToken$ = DOM.select('button.save-token').events('click');
  return { saveToken$ };
}
