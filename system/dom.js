export function create2DContext(width, height, canvas = document.createElement('canvas')) {
  const ctx = canvas.getContext('2d', {premultipliedAlpha: true});
  ctx.imageSmoothingEnabled = true;
  canvas.width = width;
  canvas.height = height;
  return ctx;
}

export function createContext(context, width, height, options, canvas = document.createElement('canvas')) {
  const ctx = canvas.getContext(context, options);
  if(context.toLowerCase( ) == '2d') ctx.imageSmoothingEnabled = false;
  canvas.width = width;
  canvas.height = height;
  return ctx;
}

export function createSVG(type, attributes = { }, namespace = "http://www.w3.org/2000/svg") {
  const svg = document.createElementNS(namespace, type);
  for(const name in attributes) svg.setAttribute(name, attributes[name]);
  return svg;
}
