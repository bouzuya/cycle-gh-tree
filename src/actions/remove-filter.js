import { Observable } from 'rx';

function removeAssigneeFilter({ DOM }) {
  return DOM
    .select('.filter-assignee input[type=checkbox]')
    .events('click')
    .filter(e => !e.target.checked)
    .map(e => {
      const type = 'assignee';
      const { name, id } = JSON.parse(e.target.value);
      return { type, name, id };
    });
}

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
    removeAssigneeFilter(responses),
    removeLabelFilter(responses),
    removeMilestoneFilter(responses)
  );
  return { removeFilter$ };
}
