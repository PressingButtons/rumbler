export function getJSON(url) {
  return fetch(url).then(response => response.json( ));
}

export function getText(url) {
  return fetch(url).then(response => response.text( ));
}

export async function getPage(name) {
  try {
    const html = await fetch(`/page/${name}.html`).then(res => res.text( ));
    document.body.querySelector('.wrapper').innerHTML = html;
  } catch(err) {
    System.sendError(err, 'Failure to load page: ' + name);
  }
}
