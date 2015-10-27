function parseIssue(response) {
  const { html_url, title } = response;
  return { url: html_url, title };
}

export default function({ HTTP }) {
  const updateIssue$ = HTTP.filter(({ request }) => {
    const baseUrl = 'https://github.com';
    const owner = 'bouzuya';
    const repo = 'blog.bouzuya.net';
    const url = `${baseUrl}/repos/${owner}/${repo}/issues/\\d+`;
    const pattern = new RegExp(url);
    return request.url.match(pattern);
  })
  .mergeAll()
  .map(({ body }) => {
    const json = JSON.parse(body);
    const issues = json.map(parseIssue);
    return { issues };
  });
  return { updateIssue$ };
}
