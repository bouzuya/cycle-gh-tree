import addRepo from './add-repo';
import removeRepo from './remove-repo';
import updateRepo from './update-repo';
import updateUser from './update-user';
import assign from '../../utils/assign';

export default function(responses) {
  return {
    repos: assign(
      {},
      addRepo(responses),
      removeRepo(responses),
      updateRepo(responses),
      updateUser(responses)
    )
  };
}
