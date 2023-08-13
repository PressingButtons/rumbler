window.onload = async event => {
    const database = await fetch('/db.json').then( res => res.json( ));
    /** ================================================
     *  Populate Navigation 
     ** ===============================================*/
    const db_nav = document.getElementById('database-entries');
    // Setting Stages 
    db_nav.appendChild(createDatabseList('Stages', database.stages));
    db_nav.appendChild(createDatabseList('Rumblers', database.gameobjects.rumblers));
    db_nav.appendChild(createDatabseList('Projectiles', database.gameobjects.projectiles));
    db_nav.appendChild(createDatabseList('Special Effects', database.gameobjects.sfx));
    /** ================================================
     *  Selecting Projects
     ** ===============================================*/
    const iframe = document.getElementById('editor_screen');
    document.addEventListener('select-project', event => {     

        const project = event.detail.project;

        iframe.onload = event => {
            const win = iframe.contentWindow
            win.project = project;   
            iframe.contentWindow.document.addEventListener('update', event => save(database));
        }
   
        switch( event.detail.type ) {
            case 'Stages': iframe.src = '/editor/programs/stage/stage.html'; break;
        }
    });
}

const createDatabseList = ( name, group ) => {
    const container = document.createElement('div');
    container.setAttribute('class', 'database-list-container');
    const title = container.appendChild(document.createElement('header'));
    title.setAttribute('class', 'list-header')
    title.textContent = name;
    const list = container.appendChild(document.createElement('ul'));
    for( const key in group ) {
        const entry = list.appendChild(document.createElement('li'));
        entry.textContent = key;
        entry.onclick = event => document.dispatchEvent(new CustomEvent('select-project', { detail: {type: name, project: group[key]}}));
    }
    return container;
}


const save = function( database ) { 
    return fetch('/db.json', {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(database)
    }).then( success => {
        console.log('update successful');
        Object.assign( database, success );
    }).catch( failure => {
        console.log('update-failed', failure );
    })
}


