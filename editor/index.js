import { loadDatabase } from "../utils/code.js";

window.onload = async event => {
    const database = await loadDatabase( );
    /** ================================================
     *  Populate Navigation 
     ** ===============================================*/
    const db_nav = document.getElementById('database-entries');
    // Setting Stages 
    db_nav.appendChild(createDatabseList('Stages', database.stages));
    /*
    db_nav.appendChild(createDatabseList('Rumblers', data.base.gameobjects.rumblers));
    db_nav.appendChild(createDatabseList('Projectiles', data.base.gameobjects.projectiles));
    db_nav.appendChild(createDatabseList('Special Effects', data.base.gameobjects.sfx));
    /** ================================================
     *  Selecting Projects
     ** ===============================================*/
    const iframe = document.getElementById('editor_screen');
    document.addEventListener('select-project', event => {     
        console.clear( );
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


const save = async function( database ) { 
    return sendPost('/db', database)
    .catch( err => {
        console.log('Error during Update', err);
    });
}

const sendPost = (route, data) => {
    return fetch( route, {
        method: "POST", headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    });
}