import save from './save';
import update from './update';
import assign from '../../utils/assign';

export default function(responses) {
  return {
    token: assign(
      {},
      save(responses),
      update(responses)
    )
  };
}
