import World from '../world/world.js';
import preload from '../../preload.js';

window.Game = (( ) => {

  const RESOLUTION = [16, 9];
  const CAMERA_SIZE = [384, 216];

  const main = function(shaders) {
    Game.Shaders = shaders;
    let world = new World({name: "test"});
    //world.run( );
  }

  return {
    RESOLUTION: RESOLUTION,
    CAMERA_SIZE: CAMERA_SIZE,
    main: main
  }

})( );
