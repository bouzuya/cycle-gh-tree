import addRepo from './add-repo';
import removeRepo from './remove-repo';
import updateRepo from './update-repo';
import updateUser from './update-user';

export default function(responses) {
  return {
    repos: {
      ...addRepo(responses),
      ...removeRepo(responses),
      ...updateRepo(responses),
      ...updateUser(responses)
    }
  };
}
