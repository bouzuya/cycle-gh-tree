export default function({ DOM }) {
  const fetchAssignees$ = DOM
    .select('button.fetch-assignees')
    .events('click');
  return { fetchAssignees$ };
}
