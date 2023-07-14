export function open( name ) {
    return loadMenu( document.getElementById('menu_container'), name );
}

export function close( ) {
    const container = document.getElementById('menu_container');
    container.innerHTML = '';
}

const loadMenu = async (container, name) => {
    const html = await fetch(`/html/${name}.html`).then( res => res.text( ));
    if( !html ) throw `Error: Menu ${name} does not exist.`;
    container.innerHTML = html;
    setupMenu( container.firstChild );
    container.classList.add('active');
}

const setupMenu = menu => {
    switch( menu.id ) {
        case 'options_menu': setupOptionsMenu( menu );
    }
}

const setupOptionsMenu = menu => {

    menu.querySelector('#match_settings_btn').onclick = event => {
        selectElement(event.target);
        selectElement(menu.querySelector('#match_settings'))
    }

    menu.querySelector('#control_settings_btn').onclick = event => {
        selectElement(event.target);
        selectElement(menu.querySelector('#control_settings'));
    }

}


const selectElement = element => {
    for( const child of element.parentElement.children) 
        child.classList.remove('active');
    element.classList.add('active');
}
