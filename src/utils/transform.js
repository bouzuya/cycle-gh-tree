import assign from '../utils/assign';

export default function(f) {
  return value => state => assign({}, state, f(state, value));
}
