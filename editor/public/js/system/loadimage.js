export function loadImage(url) {
  return new Promise(function(resolve, reject) {
    let image = new Image( );
    image.onload = event => {
      resolve(image);
    }
    image.onerror = event => {
      reject(event);
    }
    image.src = url;
  });
}
