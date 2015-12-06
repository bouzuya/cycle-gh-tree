import { Observable } from 'rx';
import transform from '../utils/transform';

function fetchLabelsTransform({ fetchLabels$ }) {
  return fetchLabels$.map(transform(() => ({ labels: [] })));
}

function updateLabelTransform({ updateLabel$ }) {
  return updateLabel$.map(transform(({ labels }, label) => {
    if (labels.indexOf(label) < 0) return { labels: labels.concat([label]) };
  }));
}

export default function labels(actions) {
  // NOTE: no namespace
  return Observable.of(
    fetchLabelsTransform(actions),
    updateLabelTransform(actions)
  ).mergeAll();
}
