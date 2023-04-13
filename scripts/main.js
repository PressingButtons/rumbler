import sysmain from "./system/sys_main.js";

window.onload = async function(event) {
    await sysmain.init( );
    sysmain.game_system.createGame({mode: 'sandbox', p1: { type: 'dummy', controller: 'human:0'}, p2: {type: 'dummy', controller: 'computer: 0'}, p3: null, p4: null});
}