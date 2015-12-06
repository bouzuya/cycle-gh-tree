import { Observable } from 'rx';

function addAssigneeFilter({ DOM }) {
  return DOM
    .select('.filter-assignee input[type=checkbox]')
    .events('click')
    .filter(e => e.target.checked)
    .map(e => {
      const type = 'assignee';
      const { name, id } = JSON.parse(e.target.value);
      return { type, name, id };
    });
}

function addLabelFilter({ DOM }) {
  return DOM
    .select('.filter-label input[type=checkbox]')
    .events('click')
    .filter(e => e.target.checked)
    .map(e => {
      const type = 'label';
      const name = e.target.value;
      return { type, name };
    });
}

function addMilestoneFilter({ DOM }) {
  return DOM
    .select('.filter-milestone input[type=checkbox]')
    .events('click')
    .filter(e => e.target.checked)
    .map(e => {
      const type = 'milestone';
      const name = e.target.value;
      return { type, name };
    });
}

export default function(responses) {
  const addFilter$ = Observable.of(
    addAssigneeFilter(responses),
    addLabelFilter(responses),
    addMilestoneFilter(responses)
  ).mergeAll();
  return { addFilter$ };
}
