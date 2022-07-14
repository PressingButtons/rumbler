export default function Camera() {
  this.data = new ArrayBuffer(92);
  this.transform = new Float32Array(this.data, 0, 16);
  this.scale = new Float32Array(this.data, 64, 1);
  this.quat = new Float32Array(this.data,68, 4);
  this.position = new Int16Array(this.data, 68, 2);
  this.size = new Int16Array(this.data, 72, 2);
  this.size.set(Game.CAMERA_SIZE);
}

Camera.prototype = {
  get width( ) {return this.size[0]},
  get height( ) {return this.size[1]},
  get x( ) {return this.position[0]},
  set x(n) {this.position[0] = n},
  get y( ) {return this.position[1]},
  set y(n) {this.position[1] = n},
  get left( ) {return this.x - this.width * 0.5},
  set left(n) {this.x = n + this.width * 0.5},
  get top( ) {return this.y - this.height * 0.5},
  set top(n) {this.y = n + this.height * 0.5},
  get right( ) {return this.x + this.width * 0.5},
  set right(n) {this.x = n - this.width * 0.5},
  get bottom( ) {return this.x + this.height * 0.5},
  set bottom(n) {this.x = n - this.height * 0.5}
}

Camera.prototype.center = function(...objects) {
  let min = {x: null, y: null},
      max = {x: null, y: null};
  for(const object of objects) {
    min.x = (!min.x || object.left < min.x) ? object.left : min.x;
    min.y = (!min.y || object.top < min.y) ? object.top : min.y;
    max.x = (!max.x || object.right < max.x) ? object.right : max.x;
    max.y = (!max.y || object.bottom < max.y) ? object.bottom : max.y;
  }

  let centerX = min.x + (max.x - min.x) * 0.5;
  let centerY = min.y + (max.y - min.y) * 0.5;

  this.x = centerX;
  this.y = centerY;

}

Camera.prototype.getTransform = function( ) {
  const mat4 = glMatrix ? glMatrix.mat4 : mat4 ? mat4 : null;
  if(!mat4) throw 'Error, glMatrix (mat4) not defined for matrix operations!';
  mat4.fromRotationTranslationScale(this.transform, this.quat, )
}
