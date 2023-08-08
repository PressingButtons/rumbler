export function fetchDatabase( ) {
    return fetch('../client/data/db.json').then( res => res.json( ));
}