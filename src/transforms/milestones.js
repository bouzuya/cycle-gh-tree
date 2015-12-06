import { Observable } from 'rx';
import transform from '../utils/transform';

function fetchMilestonesTransform({ fetchMilestones$ }) {
  return fetchMilestones$.map(transform(() => ({ milestones: [] })));
}

function updateMilestoneTransform({ updateMilestone$ }) {
  return updateMilestone$.map(transform(({ milestones }, milestone) => {
    if (milestones.indexOf(milestone) < 0) {
      return { milestones: milestones.concat([milestone]) };
    }
  }));
}

export default function(actions) {
  // NOTE: no namespace
  return Observable.of(
    fetchMilestonesTransform(actions),
    updateMilestoneTransform(actions)
  ).mergeAll();
}
