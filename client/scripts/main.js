//import * as System from './system/driver.js';
//==========================================
// Imports 
//==========================================
import admin from "./admin/admin.js";
//==========================================
// Global Variables
//==========================================
let render_detail = { };
//==========================================
// Execute on Load
//==========================================
window.onload = async event => {
    await admin.init( );
    admin.graphics.fill([0, 0, 0.2, 1]);
    //==========================================
    // Draw Render Detail
    //==========================================
    admin.runner.run('render', ( ) => {
        admin.graphics.render( render_detail );
    });
    //==========================================
    // DEBUG INPUT
    //==========================================
    //document.addEventListener('input_pressed', event => { console.log( event.detail );});
    //==========================================
    // Updating State Detail
    //==========================================
    const updateState = state => {
        render_detail = state;
        admin.battle.sendInput({cnt1: admin.cnt1.pressed, cnt2: admin.cnt2.pressed});
    }
    //==========================================
    // 
    //==========================================
    admin.battle.create({
        mode: 0, time: 10000, 
        player1: { palette: 0, data: admin.getRumbler('garf')} , 
        player2: {palette: 1, data: admin.getRumbler('garf')}}, 
        updateState
    );
    //==========================================
    // 
    //==========================================
    //==========================================
    // 
    //==========================================
    //==========================================
    // 
    //==========================================
    //admin.menu.open('menu-options');
    //System.init( );
}