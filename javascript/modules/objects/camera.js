function Camera(aspect, min, max, scaling) {

  let x = 0;
  let y = 0;
  let width = min[0]
  let height = min[1]

  function center(...objects) {
    let minx, miny, maxx, maxy;
    // find mins and maxes
    for(const object of objects) {
      if(object.left < minx || minx == null) minx = object.left;
      if(object.top  < miny || miny == null) miny = object.top;
      if(object.right > maxx || maxx == null) maxx = object.right;
      if(object.bottom > maxy || maxy == null) maxy = object.bottom;
    }
    //resize camera to fit
    resize(maxx - minx, maxy - miny);
  }


  function resize(w = 0, h = 0) {
    width = Math.floor(w / aspect[0]) * aspect[0];
    height = Math.floor(h / aspect[1]) * aspect[1];
    if(width < min[0]) width = min[0];
    if(width > max[0]) width = max[0];
    if(height < min[1]) height = min[1];
    if(height > max[1]) height = max[1];
  }

  function projection( ) {
    //requires glMatrix Library
    const m4 = glMatrix.mat4 || mat4;
    if(!m4) {
      console.trace( );
      throw "Error - glMatrix library (mat4) not found.";
    }
    matrix = buffer ? m4.identity(buffer) : m4.create( );
    return m4.ortho(matrix, x, x + width, y + height, y, 1, -1);
  }

  function setX(n) {
    x = n;
    if(this.left < 0) this.left = 0;
    if(this.right > max[0]) this.right = max[0]
  }

  function setY(n) {
    y = n;
    if(this.top < 0) this.top = 0;
    if(this.bottom > max[1]) this.bottom = max[1];
  }

  return {
    get left( ) { return x - width * 0.5; },
    set left(n) { x = n + width * 0.5; },
    get right( ) { return x + width * 0.5; },
    set right(n) { x = n - width * 0.5; },
    get up( ) { return y - height * 0.5; },
    set up(n) { y = n + height * 0.5; },
    get down( ) { return y + height * 0.5; },
    set down(n) { y = n - height * 0.5; },
    get width( ) {return width},
    get height( ) {return height},
    get x( ) {return x},
    set x(n) {setX(n)},
    get y( ) {return y},
    set y( ) {setY(n)},
    projection: projection,
    resize: resize
  }

}

export default new Camera([16, 9], [640, 360], [1280, 720], [1, 2]);
