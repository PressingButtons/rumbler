export function loadImage(url, image = new Image( )) {
  return new Promise(function(resolve, reject) {
    image.onload = event => resolve(image);
    image.onerror = event => reject(event);
    image.src = url;
  });}

export async function loadCanvas(url) {
  const image = await loadImage(url);
  const ctx = System.dom.create2DContext(image.width, image.height);
  ctx.drawImage(image, 0, 0);
  return ctx;
}
