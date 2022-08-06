export function saveToLocalFile(url, content) {
  return fetch(url, {
    method: "POST",
    headers: {'Content-Type': "application/json"},
    credentials: 'same-origin',
    body: content
  })
  .then(response => {
    if(response.status == 200) console.log("Save operation to file", url, response.message);
    else System.sendError(response.error, response.message);
  })
  .catch(response => {
    System.sendError(response.error, response.message);
  });
}
