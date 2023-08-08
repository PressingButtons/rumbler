import { fetchDatabase } from "./global/util.js"

window.onload = async event => {
    const data = await fetchDatabase( );
    createList('stages', data.stages);
}

function createList( name,  object ) {

    const container = document.createElement('div');
    container.classList.add('folder');
    container.innerHTML = `<p>${name}</p><ul></ul>`
    //
    const list = container.querySelector('ul');

    for( var key in object ) {
        const el = document.createElement('li');
        el.innerHTML = key;
        el.addEventListener('click', event => selectObject( name, key ));
        list.appendChild( el );
    }

    document.getElementById('file-list').appendChild(container);

    container.querySelector('p').onclick = event => {
        container.classList.toggle('active');
    }

}

function selectObject( type, name ) {
    document.dispatchEvent(new CustomEvent('select-asset', {detail: [type, name]}));
}


document.addEventListener('select-asset', event => {

    const iframe  = document.getElementById('main-frame');

    switch( event.detail[0] ) {
        case 'stages': 
            iframe.src = '/editor/programs/stage/stage.html/#' + event.detail[1];
        break;
    }

});