export default function({ DOM }) {
  const switchTab$ = DOM.select('nav a').events('click')
  .map(e => e.target.getAttribute('href').replace(/^#/, ''));
  return { switchTab$ };
}
