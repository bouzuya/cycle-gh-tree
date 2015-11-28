import Rx from 'rx';
import assign from '../utils/assign';

function updateLabelTransform({ updateLabel$ }) {
  return updateLabel$
    .map(label => state => {
      const { labels } = state;
      const index = labels.indexOf(label);
      if (index >= 0) return state;
      const newLabels = labels.concat([label]);
      return assign({}, state, { labels: newLabels });
    });
}

export default function labels(actions) {
  // NOTE: no namespace
  return updateLabelTransform(actions);
}
