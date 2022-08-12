export async function loadEditor(type) {
  const html = await System.ajax.getText('/page/' + name + '.html');
  document.querySelector('.wrapper').innerHTML = html;
}
