import * as Graphics from '../libs/graphics/graphics.js';
import * as Runner from './runner.js'
import preload from './preload.js';
import * as Input from '../libs/input.js';
import * as Menus from './menu.js';
import * as BattleSystem from '../libs/battle/battle.js'

let initialized = false;
let game; 

//==========================================
// library setups
//==========================================
Runner.run( 'polling', Input.poll );
//==========================================
// methods
//==========================================
const createGame = function( config ) {

}


export default {

    get initialized( ) {return initialized },

    init: async function( ) {
        await Graphics.init(document.querySelector('canvas'));        
        Object.defineProperties( this, {
            graphics: { value: Graphics },
            _createGame: { value: createGame },
            _game: { get( ) { return game } },
            input: { value: Input },
            runner: { value: Runner },
            menu: {value: Menus},
            battle_system: {value: BattleSystem}
        });

        await preload( this );

    }

}
