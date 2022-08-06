export function sendError(err, message) {
  console.error('Error ----------------------->');
  console.log(err, message);
  console.error('----------------------------->');
  throw null;
}
