import sysmain from "./system/sys_main.js";

window.onload = async function(event) {
    await sysmain.init( );

    sysmain.game_system.createGame({
        mode: 'sandbox', 
        players:[{ team: ['dummy', 'dummy', 'dummy'], controller: 'human:0'}, {team: ['dummy', 'dummy', 'dummy'], controller: 'computer: 0'}],
        stage: 'sandbox'
    });

    
}