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
    admin.graphics.fill([0, 0, 1, 0.2]);
    //==========================================
    // Draw Render Detail
    //==========================================
    admin.runner.run('render', ( ) => {
        admin.graphics.render( render_detail );
    });
    //==========================================
    // 
    //==========================================
    document.addEventListener('input_pressed', event => {
        console.log( event.detail );
    });
    //==========================================
    // Updating State Detail
    //==========================================
    const updateState = state => {
        render_detail = state;
    }
    //==========================================
    // 
    //==========================================
    admin.battle_system.create({
        time: 100, mode: 0,
        player1: { width: 96, height: 96, animations: [] },
        player2: { width: 96, height: 96, animations: [] },
    }, updateState);
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