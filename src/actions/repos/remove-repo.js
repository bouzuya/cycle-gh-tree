export default function({ DOM }) {
  const removeRepo$ = DOM.select('button.remove-repo').events('click')
  .map(e => {
    return Array.from(e.target.classList)
      .filter(i => i.match(/^item-/))
      .map(i => parseInt(i.replace(/^item-/, ''), 10))[0];
  });
  return { removeRepo$ };
}
