import { getText } from "../../../utils/methods.js";

export default class SandboxUI extends EventTarget {

    constructor( ) {
        super( );
    }

    async #loadHTML( ) {
        const html = await getText(new URL('./sandbox.html', import.meta.url));
        this.html = document.body.querySelector('.wrapper').appendChild(document.createElement('aside'));
        this.html.classname = 'sandbox-ui-container';
        this.html.innerHTML = html;
    }

    #populateCharacters( rumblers ) {
        for( const key in rumblers ) {
            const p1 = document.getElementById('player-1-character').appendChild(document.createElement('option'));
            const p2 = document.getElementById('player-2-character').appendChild(document.createElement('option'));
            p1.setAttribute('value', key); p1.innerHTML = rumblers[key].name;
            p2.setAttribute('value', key); p2.innerHTML = rumblers[key].name;
        }
    }

    #pullFromDatabase( database ) {
        this.#populateCharacters( database.rumblers );
    }

    #removeBinds( ) {

    }

    close( ) {
        this.#removeBinds( );
        this.html.remove( );
    }

    async load( sequence ) {
        await this.#loadHTML( );
        this.#pullFromDatabase( sequence.host.database );
    }

}