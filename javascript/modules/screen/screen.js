export default function Screen(canvas) {

  const gl = canvas.getContext('webgl', {premultipliedAlpha: false});

  let aspectRatio = [16, 9]

  function setAspect(width, height) {
    aspectRatio = [width, height];
  }

  function setResolution(width, height) {
    canvas.width = Math.floor(width/aspectRatio[0]) * aspectRatio[0];
    canvas.height = Math.floor(height/aspectRatio[1]) * aspectRatio[1];
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  return {
    get aspect( ) {return aspectRatio},
    get resolution( ) {return [canvas.width, canvas.height]},
    get gl( ) {return gl},
    setAspect: setAspect,
    setResolution: setResolution
  }

}
