export function loadImage(url, image = new Image( )) {
  return new Promise(function(resolve, reject) {
    image.onload = event => resolve(image);
    image.onerror = event => reject(event);
    image.src = url;
  });
}
