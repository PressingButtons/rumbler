import sys_input_init from "./sys_input.js"
import VirtualController from "./virtual_controller.js";

const controllers = {
    p1: {id: 'keyboard', controller: new VirtualController( ).DEFAULT_KEYBOARD( )},
    p2: {id: 'gamepad', controller: new VirtualController( ).DEFAULT_PLAYSTATION( )}
}

function oninput(detail) {
    console.log(detail.type);
    for(const name in controllers) 
        if(controllers[name].id == detail.type) 
            controllers[name].controller.set(detail);
}

function serialize( ) {
    return {
        p1: controllers.p1.controller.serialize( ),
        p2: controllers.p2.controller.serialize( )
    }
}

const input_manager = { };

input_manager.update = function(detail) {
    oninput(detail);
    return serialize( );
}

export default input_manager;