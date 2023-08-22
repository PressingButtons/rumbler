import GameController from "./input_controller.js";
import { poll } from "./input_reader.js";


const cnt1 = new GameController('keyboard');
const cnt2 = new GameController('null');

export function init( updater ) {
    updater.run( poll );
    document.addEventListener('gamepad_connected', onGamepadConnected );
    document.addEventListener('gamepad_disconnected', onGamepadDisconnected );
}

function onGamepadConnected( event ) {
    //prompt which user is using the gamepad
}

function onGamepadDisconnected( event ) {
    //if gamepad is tied to user report disconnection.
}

export {createScheme, defaultKeyboard, defaultGamepad } from './input.control_scheme.js'

