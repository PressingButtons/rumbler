const dispatchInputEvent = (type, source, index ) => {
    document.dispatchEvent( 
        new CustomEvent( type, {detail: {
            index: index,
            timestamp: performance.now( ),
            source, source
        }})
    );
}

//keyboard
const onkeydown = event => {
    dispatchInputEvent('input-pressed', 'keyboard', event.key.toLowerCase( ));
}

const onkeyup = event => {
    dispatchInputEvent('input-released', 'keyboard', event.key.toLowerCase( ));
}

//gamepads
const gamepads = { };

const handleGamepad = (i, gamepad) => {
    if( !gamepads[i] && gamepad ) connectGamepad( gamepad );
    else if ( gamepads[i] && !gamepad ) disconnectGamepad( i );
    else if ( gamepads[i] &&  gamepad ) updateGamepad( gamepad );
}

const buildGamepad = gamepad => {
    gamepads[gamepad.index] = { 
        index: gamepad.index, 
        id: gamepad.id, 
        axes: [0, 0, 0, 0],
        buttons: new Array( gamepad.buttons.length ).fill(0)
    }
}

const connectGamepad = gamepad => {
    buildGamepad( gamepad );
    document.dispatchEvent( new CustomEvent('gamepad-connected', { detail: gamepad }));
}

const disconnectGamepad = gamepad => {
    delete gamepads[i];
    document.dispatchEvent( new CustomEvent('gamepad-discconected', { detail: index }));
}

const updateGamepad = gamepad => {
    const virtual_pad = gamepads[gamepad.index];
    for( const index in gamepad.buttons ) updateGamepadButton( virtual_pad, gamepad, index );
}

const updateGamepadButton = (vp, gamepad, index ) => {
    if( vp.buttons[index] == gamepad.buttons[index].value ) return;
    if( gamepad.buttons[index].value == 1) dispatchInputEvent('input-pressed', 'gamepad' + gamepad.index, index );
    else dispatchInputEvent('input-released', 'gamepad' + gamepad.index, index );
    vp.buttons[index] = gamepad.buttons[index].value;
}

export function init( ) {
    document.addEventListener('keydown', onkeydown );
    document.addEventListener('keyup',   onkeyup );
}

export function query( ) {
    const source = navigator.getGamepads( );
    for( let i = 0; i < 4; i++ ) handleGamepad( i, source[i]);
}