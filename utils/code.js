export async function loadDatabase( ) {

    const db = { };

    Object.assign( 
        db, 
        await fetch('/data/stages.json').then(res => res.json( )),
        await fetch('/data/settings.json').then( res => res.json( )),
        await fetch('/data/objects.json').then( res=> res.json( ))
    )

    return db;

}