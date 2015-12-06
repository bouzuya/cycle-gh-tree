import { Observable } from 'rx';
import assignees from './transforms/assignees';
import filters from './transforms/filters';
import issues from './transforms/issues';
import labels from './transforms/labels';
import milestones from './transforms/milestones';
import repos from './transforms/repos';
import requests from './transforms/requests';
import token from './transforms/token';
import assign from './utils/assign';

function initializeAssignees() {
  return { assignees: [] };
}

function initializeFilters() {
  return { filters: [] };
}

function initializeLabels() {
  return { labels: [] };
}

function initializeMilestones() {
  return { milestones: [] };
}

function initializeRepos() {
  return {
    // TODO: settings.repos: []
    settings: null,
    repo: {
      repo: null,
      user: null
    }
  };
}

function initializeRequests() {
  return { requests: [] };
}

function initializeToken() {
  return {
    // TODO: settings.token: 'xxx'
    settings: null,
    token: {
      value: ''
    }
  };
}

export default function(actions) {
  const { loadSettings$, switchTab$ } = actions;
  const state = assign(
    {
      currentTab: "settings",
      issues: []
    },
    initializeAssignees(),
    initializeFilters(),
    initializeLabels(),
    initializeMilestones(),
    initializeRepos(),
    initializeRequests(),
    initializeToken()
  );
  const reposMaxLength = 10;
  const actions$ = Observable.of(
    assignees(actions),
    loadSettings$
      .map(storage => state => {
        state.settings = storage;
        return state;
      }),
    switchTab$
      .map(value => state => {
        state.currentTab = value;
        return state
      }),
    filters(actions),
    issues(actions),
    labels(actions),
    milestones(actions),
    repos(actions, { reposMaxLength }),
    requests(actions),
    token(actions)
  ).mergeAll();
  const state$ = Observable
    .just(state)
    .merge(actions$)
    .scan((state, action) => action(state))
    .shareReplay(1);
  return state$;
}
