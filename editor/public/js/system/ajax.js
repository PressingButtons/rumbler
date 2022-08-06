export function getJSON(url) {
  return fetch(url).then(response => response.json( ));
}
