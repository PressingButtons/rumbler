export default function Screen(canvas, config) {

  const gl = canvas.getContext('webgl', {premultipliedAlpha: false});

  const aspect = [16, 9];

  function resize(width, height) {
    canvas.width = Math.floor(width / aspect[0]) * aspect[0];
    canvas.height = Math.floor(height / apsect[1]) * aspect[1];
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  return {
    get aspect( ) {return aspect},
    get resolution( ) {return [canvas.width, canvas.height]}
    get gl( ) {return gl},
    resize: resize
  }

}
