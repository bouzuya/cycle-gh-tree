function parseIssue(response) {
  const { html_url, title } = response;
  return { url: html_url, title };
}

export default function(responses) {
  const { DOM, HTTP } = responses;
  const fetchIssue$ = DOM.select('button').events('click');
  const updateIssues$ = HTTP.filter(({ request }) => {
    const baseUrl = 'https://api.github.com';
    const owner = 'bouzuya';
    const repo = 'blog.bouzuya.net';
    const url = `${baseUrl}/repos/${owner}/${repo}/issues`;
    return request.url === url;
  })
  .mergeAll()
  .map(({ body }) => {
    const json = JSON.parse(body);
    const issues = json.map(parseIssue);
    return { issues };
  });
  const actions = {
    fetchIssue$,
    updateIssues$
  };
  return actions;
}
