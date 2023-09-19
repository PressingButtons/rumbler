const database = { 

    player_controls: { }

};

database.init = async function( ) {
    await databaseFetch( this );
    loadControlSchemes( this );
}

database.saveControlScheme = function( ) {
    window.localStorage.setItem('game-control_scheme', JSON.stringify(this.player_controls))
}

database.clearControls = function( ) {
    window.localStorage.removeItem('game-control_scheme');
}


//==================================
// External Methods
//==================================

const databaseFetch = async function( db ) {
    return Object.assign( db, 
        await fetch('/data/stages.json').then(res => res.json( )),
        await fetch('/data/settings.json').then( res => res.json( )),
        await fetch('/data/objects.json').then( res=> res.json( ))
    );
}

const loadControlSchemes = function( db ) {
    const control_schemes = JSON.parse(window.localStorage.getItem('game-control_scheme'));
    if( control_schemes ) Object.assign( db.player_controls, control_schemes );
    else console.log('No control scheme found.')
}

//==================================
// EXPORT
//==================================
export default database;