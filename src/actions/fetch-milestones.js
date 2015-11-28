export default function({ DOM }) {
  const fetchMilestones$ = DOM
    .select('button.fetch-milestones')
    .events('click');
  return { fetchMilestones$ };
}
