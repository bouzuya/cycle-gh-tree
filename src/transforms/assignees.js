import { Observable } from 'rx';
import transform from '../utils/transform';

function fetchAssigneesTransform({ fetchAssignees$ }) {
  return fetchAssignees$.map(transform(() => ({ assignees: [] })));
}

function updateAssigneeTransform({ updateAssignee$ }) {
  return updateAssignee$.map(transform(({ assignees }, assignee) => {
    if (!assignees.some(i => i.name === assignee.name)) {
      return { assignees: assignees.concat([assignee]) };
    }
  }));
}

export default function(actions) {
  // NOTE: no namespace
  return Observable.of(
    fetchAssigneesTransform(actions),
    updateAssigneeTransform(actions)
  ).mergeAll();
}
