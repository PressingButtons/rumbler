export async function loadMapData( ) {
  return await loadObject('/assets/stages/config.json');
}


export async function loadObject(url, cache = { }) {
  let filename = System.parse.getFileName(url);
  if(filename.includes('.webp')) {
    cache[filename] = await System.load.loadCanvas(url);
    return cache;
  }
  else if(filename.includes('.json')) {
    cache[filename] = await System.ajax.getJSON(url);
    for(const suburl of cache[filename].subfiles) return loadObject(suburl, cache);
  }
}
