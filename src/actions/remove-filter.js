import { Observable } from 'rx';

function removeLabelFilter({ DOM }) {
  return DOM
    .select('.filter-label input[type=checkbox]')
    .events('click')
    .filter(e => !e.target.checked)
    .map(e => {
      const type = 'label';
      const name = e.target.value;
      return { type, name };
    });
}

function removeMilestoneFilter({ DOM }) {
  return DOM
    .select('.filter-milestone input[type=checkbox]')
    .events('click')
    .filter(e => !e.target.checked)
    .map(e => {
      const type = 'milestone';
      const name = e.target.value;
      return { type, name };
    });
}

export default function(responses) {
  const removeFilter$ = Observable.merge(
    removeLabelFilter(responses),
    removeMilestoneFilter(responses)
  );
  return { removeFilter$ };
}
