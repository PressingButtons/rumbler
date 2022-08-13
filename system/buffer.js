const bufferData = new ArrayBuffer(1024);

const bufferViews = new Array(16).fill(0).map((x, i) => new Float32Array(bufferData, i))
