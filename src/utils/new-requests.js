import assign from '../utils/assign';

export default function(requests, request) {
  const id = requests.length + 1;
  return requests.concat([assign({}, request, { id })]);
}
