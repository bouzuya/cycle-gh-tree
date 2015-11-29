import { Observable } from 'rx';
import transform from '../utils/transform';

function fetchAssigneesTransform({ fetchAssignees$ }) {
  return fetchAssignees$.map(transform(() => ({ assignees: [] })));
}

function updateAssigneeTransform({ updateAssignee$ }) {
  return updateAssignee$.map(transform(({ assignees }, assignee) => {
    if (assignees.indexOf(assignee) < 0) {
      return { assignees: assignees.concat([assignee]) };
    }
  }));
}

export default function(actions) {
  // NOTE: no namespace
  return Observable.merge(
    fetchAssigneesTransform(actions),
    updateAssigneeTransform(actions)
  );
}
