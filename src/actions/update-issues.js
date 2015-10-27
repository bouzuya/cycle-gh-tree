function parseIssue(response) {
  const { html_url, title, number } = response;
  return { url: html_url, title, number };
}

export default function({ HTTP }) {
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
  return { updateIssues$ };
}
