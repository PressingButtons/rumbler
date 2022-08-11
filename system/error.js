export function logError(err, message) {
  console.log("Error |---------------------------|>");
  console.error(err);
  if(message) console.error(message);
  console.log("Error |---------------------------|>");
}
