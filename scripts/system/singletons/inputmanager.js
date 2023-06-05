import signalobject from "../objects/signalobject.js"
//==========================================================
// Create Input Template for Game
//==========================================================
const scheme_template = {
    source: null, 
    buttons: {
        menu    : { key: null, active: false, pressed: 0},
        confirm : { key: null, active: false, pressed: 0},
        cancel  : { key: null, active: false, pressed: 0},
        up      : { key: null, active: false, pressed: 0},
        left    : { key: null, active: false, pressed: 0},
        down    : { key: null, active: false, pressed: 0},
        right   : { key: null, active: false, pressed: 0},
        A       : { key: null, active: false, pressed: 0},
        B       : { key: null, active: false, pressed: 0},
        C       : { key: null, active: false, pressed: 0},
        D       : { key: null, active: false, pressed: 0},
    }
} 

//==========================================================
//  Create Input Manager Object - Signaler
//==========================================================
const InputManager = new signalobject( );
//==========================================================
//  Create Player1 and Player2 Inputs
//==========================================================
Object.assign( InputManager, { p1: Object.create( scheme_template ), p2: Object.create( scheme_template )});
//==========================================================
//  Creating a set to hold on active keys pressed
//==========================================================
InputManager.keyboard = new Set( );
//==========================================================
//  Function(s) to manage Keyboard updates and signal when
//  Event is fired
//==========================================================
document.addEventListener('keydown', event => {
    InputManager.keyboard.add(event.key.toLowerCase( ));
    InputManager.signal('keydown');
});

document.addEventListener('keyup', event => {
    InputManager.keyboard.delete(event.key.toLocaleLowerCase( ));
    InputManager.signal('keyup');
});
//==========================================================
//  Updating Player Input
//==========================================================
InputManager.update = function(timestamp) {
    if( p1.source == 'keyboard') this.updateByKeyboard( this.p1, timestamp );
}
//==========================================================
//  Updating Player Input by Keyboard
//==========================================================
InputManager.updateByKeyboard = function( config, timestamp ) {
    for( const button_name in config.buttons ) {
        const button = config.buttons[button_name];
        if( InputManager.keyboard.has( button.key ) ) InputManager.handlePress( button, timestamp );
        else InputManager.handleRelease( button );
    }
}
//==========================================================
//  handlePress - handles an activated button
//==========================================================
InputManager.handlePress = function( button, timestamp ) {
    if( button.active ) return;
    button.active = true; 
    button.pressed = timestamp; 
}
//==========================================================
//  handleRelease - "release" button 
//==========================================================
InputManager.handleRelease = function( button ) {
    button.active = false; 
}
//==========================================================
// Updating By Gamepad
//==========================================================
//==========================================================
//  Setting Controller Scheme
//==========================================================
InputManager.setScheme = function( p_id, source, buttons) {
    this[p_id].source = source; 
    for(const button_name in this[p_id].buttons) {
        if( buttons[button_name] ) this[p_id].buttons[button_name].key = buttons[button_name];
    }
}
//==========================================================
//
//==========================================================
//==========================================================
//
//==========================================================
//==========================================================
//
//==========================================================
//==========================================================
//
//==========================================================
//==========================================================
//
//==========================================================
//==========================================================
//  Export Class
//==========================================================
export default InputManager; 
