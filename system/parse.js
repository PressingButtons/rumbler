export function fileExtension(url) {
  const split = getFileName(url).split('.');
  if(split.length == 1) return undefined;
  return split[1];
}

export function getFileName(url) {
  return url.substring(url.lastIndexOf('/') + 1)
}
