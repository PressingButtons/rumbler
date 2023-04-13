import sysmain from "./system/sys_main";

window.onload = async function(event) {

    await sysmain.init( );

    function test(x, y) {
        sysmain.renderer.render({
            projection: {left: 0, right: 800, top: 0, bottom: 450},
            objects: [{
                position: [x, y, 0],
                rotation: [0, 0, 0],
                width: 50, height: 50,
                render_detail: {
                    buffer: 'square',
                    program: 'single_texture',
                    textures: [{
                        name: 'placeholder',
                        wrap_s: 'CLAMP_TO_EDGE',
                        wrap_t: 'CLAMP_TO_EDGE',
                    }],
                    draw_method: 'TRIANGLE_STRIP',
                    first_array: 0,
                    indices: 4,
                    tint: [1, 1, 1, 1],
                }
            }] 
        })
    }

    document.addEventListener('keydown', event => {
        if(event.key == 'd') pos[0] ++;
        if(event.key == 'a') pos[0] --;
        if(event.key == 'w') pos[1] --;
        if(event.key == 's') pos[1] ++;
        sysmain.renderer.fill(new Array(4).fill(0).map(x => Math.random( )));
        test(...pos);
    });



}