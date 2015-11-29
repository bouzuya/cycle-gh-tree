import { h } from '@cycle/dom';
import filtersView from '../views/filters-view';

export default function({ issues }) {
  return h('section.issues', [
    h('h1', ['Issues']),
    h('button.fetch-issues', ['fetch issues']),
    h('ul', issues.map(({ user, repo, url, title, number, children }) => {
      return h('li', [
        h('a', { href: url }, [`${user}/${repo}#${number}`]),
        ' ',
        title,
        children.length === 0 ? null : h('ul', children.map(i => {
          const { user, repo, url, title, number } = i;
          return h('li', [
            h('a', { href: url }, [`${user}/${repo}#${number}`]),
            ' ',
            title
          ]);
        }))
      ]);
    }))
  ]);
}
