const keys = { };
const gamepads = { };

const createButton = key => {
    return { index: key, value: 0, pressed_timestamp: null  }
}

const keyboardPress = key => {
    const button = keys[key];
    button.pressed_timestamp = performance.now( );
    button.value = 1;
    document.dispatchEvent(new CustomEvent('input_pressed', { detail: {
        index: key, timestamp: performance.now( ), source: 'keyboard'
    }}));
}

const keyboardRelease = key => {
    const button = keys[key];
    button.value = 0;
    document.dispatchEvent(new CustomEvent('input_released', { detail: {
        index: key, timestamp: performance.now( ), source: 'keyboard'
    }}));
}

const keyboardListener = event => {
    if(!keys[event.key]) keys[event.key] = createButton(event.key);
    if(event.type == 'keydown') keyboardPress( event.key );
    else keyboardRelease( event.key );
}

document.addEventListener('keydown', keyboardListener);
document.addEventListener('keyup', keyboardListener);

export { keys };

export function keyIsDown( key ) {
    if( !keys[key] ) return false; 
    return keys[key].value == 1;
}

//////////// gamepads
const handleGamepad = ( index, gamepad ) => {
    if( !gamepads[index] && gamepad ) connectGamepad( gamepad );
    else if(  gamepads[index] && gamepad ) updateGamepad( gamepad );
    else if(  gamepads[index] && !gamepad) disconnectGamepad( index );
}

const connectGamepad = gamepad => {
    gamepads[gamepad.index] = { index: gamepad.index, buttons: [ ], axes: [0, 0, 0, 0] }
    for( let i = 0; i < gamepad.buttons.length; i ++ ) gamepads[gamepad.index].buttons.push({ value: 0, pressed_timestamp: null});
    document.dispatchEvent(new CustomEvent('gamepad_connected', {detail: gamepad }));
}

const disconnectGamepad = index => {
    delete gamepads[index];
    document.dispatchEvent(new CustomEvent('gamepad_disconnected', {detail: index })); 
}

const updateGamepad = source => {
    const gamepad = gamepads[source.index];
    for( let i = 0; i < gamepad.buttons.length; i++ ) updateGamepadButton( i, gamepad, source );
}

const updateGamepadButton = (index, gamepad, source) => {
    if( gamepad.buttons[index].value == 0 && source.buttons[index].pressed ) {
        gamepad.buttons[index].value = 1;
        gamepad.buttons[index].pressed_timestamp = performance.now( );
        document.dispatchEvent(new CustomEvent('input_pressed', { detail: {
            index: index, timestamp: performance.now( ), source: source
        }}))
    }
    else if ( gamepad.buttons[index].value == 1 && !source.buttons[index].pressed) {
        gamepad.buttons[index].value = 0;
        document.dispatchEvent(new CustomEvent('input_released', { detail: {
            index: index, timestamp: performance.now( ), source: source
        }}))
    }
}

export function poll( ) {
    let source = navigator.getGamepads( );
    for(let i = 0; i < 4; i++ ) handleGamepad( i, source[i] );
}

export { gamepads }