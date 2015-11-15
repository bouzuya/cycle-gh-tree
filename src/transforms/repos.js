import Rx from 'rx';

export default function({ repos }, { reposMaxLength }) {
  const { addRepo$, updateRepo$, updateUser$ } = repos; // actions
  return Rx.Observable.merge(
    addRepo$
    .map(repo => state => {
      const { user, repo } = state;
      if (state.repos.length > reposMaxLength) return state;
      const duplicated = state.repos.filter(i => {
        return i.user === user && i.repo === repo;
      }).length > 0;
      if (duplicated) return state;
      state.repos.push({ user, repo });
      return state;
    }),
    updateRepo$
    .map(repo => state => {
      state.repo = repo;
      return state;
    }),
    updateUser$
    .map(user => state => {
      state.user = user;
      return state;
    })
  );
}
