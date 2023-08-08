import GameController from "./input_controller.js";gamepads
import { poll } from "./input_reader";

const cnt1 = new GameController('keyboard');
const cnt2 = new GameController('null');

export function init( updater ) {
    updater.run('poll-gamepads', poll);
    document.addEventListener('gamepad_connected', onGamepadConnected );
    document.addEventListener('gamepad_disconnected', onGamepadDisconnected );
}

function onGamepadConnected( event ) {

}

function onGamepadDisconnected( event ) {
    
}

export { cnt1, cnt2 };