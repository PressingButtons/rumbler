import TFrame from './frame.js';

let timeline = {
  body: null,
  frames: []
}

export function init( ) {
  timeline.body = document.getElementById('timeline');
}

export function addFrame(frame)  {
  const tf = new TFrame(frame);
  timeline.frames.push(tf);
  timeline.body.querySelector('.rail').appendChild(tf.body);
}
