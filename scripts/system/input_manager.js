import SignalObject from "./signal_object.js";
import VirtualController from "./virtual_controller.js";

const input_manager = new SignalObject( );

const controllers = {
    p1: {id: 'keyboard', vc: new VirtualController( ).DEFAULT_KEYBOARD( )},
    p2: {id: 'gamepad',  vc: new VirtualController( ).DEFAULT_PLAYSTATION( )}
}

document.addEventListener('inputevent', event => {
    input_manager.signal('input', event.detail);
});

input_manager.setHook('input', function(options) {
    for(const id in controllers) updateController(controllers[id], options);
});

function updateController(controller, options) {
    if(controller.id != options.type) return;
    controller.vc.set(options);
}

input_manager.serialize = ( ) => {
    return {
        p1: controllers.p1.vc.serialize( ),
        p2: controllers.p2.vc.serialize( )
    }
}

input_manager.configureController = (id, options) => {
    ///
}

export default input_manager;