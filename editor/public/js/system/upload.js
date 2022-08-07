export function upload(url, content, content_type) {

  let pkg = content_type == 'application/json' ? JSON.stringify(content) : content;

  return fetch(url, { method: 'POST', body: pkg, headers: {"Content-Type": content_type } } );

}
