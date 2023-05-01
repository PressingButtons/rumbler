import scene_manager from '../../scene_manager.js';
import sys_init from './sys_init.js';

const system = await sys_init( );
scene_manager(system);


document.addEventListener('inputevent', event => {
    const data = event.detail.data;
    system.input_signaler.signal('input', detail);
});

// =============== creating the worker environments =================


export default system;