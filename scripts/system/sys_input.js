const keys = {};

const gamepads = { };

// Keyboard =========================================================

function onKeyDown(event) {
    keys[event.key] = 1;
    dispatchInputEvent('keyboard', event.key, 1);
}

function onKeyUp(event) {
    keys[event.key] = 0;
    dispatchInputEvent('keyboard', event.key, 0);
}


function dispatchInputEvent(type, key, value) {
    document.dispatchEvent(new CustomEvent('inputevent', {
        detail: {type: type, key: key, value: value}
    }));
}

// Gamepads =========================================================
function compareGamepadRecord(gamepad) {
    for(let i = 0, button; button = gamepad.buttons[i]; i++) {
        if(gamepads[gamepad.index][i] != button.value) return true;
    }
    return false;
}

function gamepadConnected(gamepad) {
    dispatchInputEvent('gamepad-connected', gamepad.index, gamepad.id);
    recordGamepad(gamepad);
}

function gamepadDisconnected(index) {
    dispatchInputEvent('gamepad-disconnected', index, 0);
}

function handleGamepad(index, gamepad) {
    if(!gamepads[index] && gamepad) return gamepadConnected(gamepad);
    else if(gamepads[index] && !gamepad) return gamepadDisconnected(index);
    else return readGamepad(gamepad);
}

function pollGamepads( ) {
    const query = navigator.getGamepads( );
    for(let i = 0; i < query.length; i++ ) handleGamepad(i, query[i]);
    requestAnimationFrame(pollGamepads);
}

function readGamepad(gamepad) {
    let change = compareGamepadRecord(gamepad);
    recordGamepad(gamepad);
    if(change) dispatchInputEvent(`gamepad`, gamepad.index, gamepads[gamepad.index]);
}

function recordGamepad(gamepad) {
    gamepads[gamepad.index] = { }
    for(let i = 0, button; button = gamepad.buttons[i]; i++) gamepads[gamepad.index][i] = button.value;
}

export default function sys_input_init( ) {
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    requestAnimationFrame(pollGamepads);
}