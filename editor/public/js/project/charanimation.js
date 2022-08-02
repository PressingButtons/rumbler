export async function CharAnimation(name, url, width, height) {

  //const image = await System.loadImage(url);
  const frames = [];

  const addFrame = function( ) {
    return frames[frames.push(new Frame( )) - 1];
  }

  const removeFrame = function(index) {
    frames.splice(index, 1);
  }

  const getFrame = function(index) {
    return frames[index];
  }

  const packageData = function( ) {
    return {
      src: url,
      name: name,
      width: width,
      height: height,
      frames: frames
    }
  }

  const save = async function( ) {
    const data = packageData( );
    const response = await fetch(`/save/charanimation/${name}.json`, {
      method: "POST",
      body: JSON.stringify(data)
    });
    return response.json( );
  }

  const load = async function(name) {
    const data = await fetch(`/load/charanimation/${name}`).then(res => res.json());
    name = data.name;
    url = data.src;
    width = data.width;
    height = data.height;
    frames = data.frames.map(x => x.data);
  }

  return {
    addFrame: addFrame,
    removeFrame: removeFrame,
    getFrame: getFrame,
    packageData: packageData,
    save: save,
    load: load
  }

}

class Frame extends EventTarget {
  constructor( ) {
    super( );
    this.data = {
      index: 0,
      body: [0, 0, 0, 0],
      hitzones: [],
      hurtzones: [],
      signal: null,
      events: [],
      duration: 500
    }
  }
}
