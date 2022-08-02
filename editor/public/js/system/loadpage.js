export async function loadPage(name) {
  try {
    const html = await fetch(`/pages/${name}`).then(res => res.text( ));
    document.body.querySelector('.wrapper').innerHTML = html;
  } catch(err) {
    console.error(err);
    throw err;
  }
}
