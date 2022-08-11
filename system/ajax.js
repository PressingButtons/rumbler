export async function getDataFile(url) {
  let main = await getJSON(url);
  let subfiles = getSubFiles(main.subfiles);
}

export function getJSON(url) {
  return fetch(url).then(response => response.json( ));
}

export function getText(url) {
  return fetch(url).then(response => response.text( ));
}

export function postData(url, body, content_type) {
  return fetch(url, {
    method: "POST",
    headers: {"Content-Type": content_type},
    body: body
  });
}

//private helpers
async function getSubFiles(filelist) {
  for(let id in filelist) {
    let url = filelist[id];
    let filetype = System.parse.fileType(url);
    if(fileType == 'json') filelist[id] = await getDataFile(url);
    else if(fileType == 'webp') filelist[id] = await System.load.loadImage(url);
    else filelist[id] = await getText(url)
  }
  return filelist;
}
