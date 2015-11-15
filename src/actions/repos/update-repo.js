export default function({ DOM }) {
  const updateRepo$ = DOM.select('input.repo').events('input')
  .map(e => e.target.value);
  return { updateRepo$ };
}
