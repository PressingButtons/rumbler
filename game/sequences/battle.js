import WrappedWorker from "../../utils/classes/wrapped_worker.js"

export default function seqBattle( sequence ) {

    let worker;

    const listener = event => {
        worker.sendMessage('input_event', { type: event.type, detail: event.detail });
    }

    sequence.enter = async function( config ) {
        // load worker ========================================
        const worker = new WrappedWorker('/engine/wrk.engine.js');
        // set routes =========================================
        worker.setRoute('instance', sequence.host.render);
        // start worker =======================================
        await worker.sendMessage('init', config);
        // setting input listener =============================
        document.addEventListener('input_pressed', listener);
        document.addEventListener('input_released', listener);
        // starting to scenario ===============================
        worker.sendMessage('run');
    }

    sequence.exit = async function( config ) {
        if( worker ) await worker.sendMessage('close');
        // setting input listener =============================
        document.removeEventListener('input_pressed', listener);
        document.removeEventListener('input_released', listener);
    }

    sequence.stop = function( ) {
        return worker.sendMessage('stop');
    }

    sequence.run = function( ) {
        return worker.sendMessage('run');
    }

}