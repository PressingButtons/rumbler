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
    //defining methods 
    this.createGame = function( config, func ) {
        BattleSystem.create({
            time: config.time,
            mode: config.mode, 
            player1:  {
                palette: config.player1. palette || 0,
                data: { ...this.db.gameobjects.fighters[config.player1.name] }
            },
            player2: {
                palette: config.player2.palette || 0,
               data: { ...this.db.gameobjects.fighters[config.player2.name] }
            }
        }, func);
    }

    await preload( this );
}

export default admin;