export function createContext2D(width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  return ctx;
}

export function createSVG(type, namespace = "", attributes = {}) {
  const svg = document.createElementNS(namespace, type);
  for(const name in attributes) svg.setAttribute(name, attributes[name]);
  return svg;
}
