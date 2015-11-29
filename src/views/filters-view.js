import { h } from '@cycle/dom';

export default function(state) {
  const { assignees, filters, labels, milestones } = state;
  const assigneeFilters = filters
    .filter(i => i.type === 'assignee');
  const labelFilters = filters
    .filter(i => i.type === 'label')
    .map(i => i.name);
  const milestoneFilters = filters
    .filter(i => i.type === 'milestone')
    .map(i => i.title);
  return h('section.filters', [
    h('h1', ['Filters']),
    h('button.fetch-assignees', ['fetch assignees']),
    h('ul.filter-assignees', assignees.map(assignee => {
      const checked = assigneeFilters.some(i => i.id === assignee.id);
      const value = JSON.stringify({ id: assignee.id, name: assignee.name });
      return h('li', [
        h('label.filter-assignee', [
          h('input.value', { type: 'checkbox', checked, value }),
          h('span.label', [assignee.name])
        ])
      ]);
    })),
    h('button.fetch-labels', ['fetch labels']),
    h('ul.filter-labels', labels.map(label => {
      const checked = labelFilters.indexOf(label) >= 0;
      const value = label;
      return h('li', [
        h('label.filter-label', [
          h('input.value', { type: 'checkbox', checked, value }),
          h('span.label', [label])
        ])
      ]);
    })),
    h('button.fetch-milestones', ['fetch milestones']),
    h('ul.filter-milestones', milestones.map(milestone => {
      const checked = milestoneFilters.indexOf(milestone) >= 0;
      const value = milestone;
      return h('li', [
        h('label.filter-milestone', [
          h('input.value', { type: 'checkbox', checked, value }),
          h('span.label', [milestone])
        ])
      ]);
    }))
  ]);
}
