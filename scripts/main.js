import sysmain from "./system/sys_main.js";

window.onload = async function(event) {
    await sysmain.init( ).catch( err => console.error(err));

    const instance = {
        camera: [0, 800, 450, 0]
    }

    sysmain.renderer.fill([0.3, 0.3, 0.3, 0.3]);
    sysmain.renderer.send('instance', instance);

}