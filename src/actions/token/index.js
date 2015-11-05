import save from './save';
import update from './update';

export default function(responses) {
  return {
    token: {
      ...save(responses),
      ...update(responses)
    }
  };
}
