import * as Graphics from '../libs/graphics/graphics.js';
import * as Runner from './runner.js'
import preload from './preload.js';
import * as Input from '../libs/input.js';
import * as Menus from './menu.js';
import * as BattleSystem from '../libs/battle/battle.js'
import GameController from './controller.js';


let initialized = false;
let game; 
//==========================================
// Initiate GameControllers
//==========================================
const controller1 = new GameController('keyboard');
const controller2 = new GameController(null);
controller1.configureDefaultKeyboard( );

document.addEventListener('gamepad_connected', event => {
    controller2.setSource( event.detail );
    controller2.configureDefaultGamepad( );
})
//==========================================
// library setups
//==========================================
Runner.run( 'polling', Input.poll );
//==========================================
// Admin
//==========================================
const admin = { };

admin.init = async function( ) {
    await Graphics.init(document.querySelector('canvas')); 
    admin.graphics = Graphics;
    admin.runner = Runner;
    admin.input = Input;
    admin.menu = Menus;
    admin.battle = BattleSystem;
    admin.getRumbler = name => {
        return admin.db.gameobjects.fighters[name];
    }
    admin.cnt1 = controller1;
    admin.cnt2 = controller2;
    
    await preload( this );
}


document.addEventListener('keydown', event => {

    if( event.key == 'D' && event.altKey ) {
        Graphics.debug( );
    }

});

export default admin;