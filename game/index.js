import * as ini from './sequences/init.js'
import * as battle from './sequences/battle/seq.battle.js';
import * as test from './sequences/test.js'

const sequences = { current: null};
const system = { };

const switchSequence = async ( sequence, options = { } ) => {
    if( sequences.current ) await sequences.current.exit( options.on_exit );
    sequences.current = sequence;
    if(DEBUG) console.log('current sequence', sequences.current.name);
    await sequence.enter( options.on_enter );
}

const setSequence = (...sequence_list) => {
    for(const sequence of sequence_list ) {
        sequences[ sequence.name ] = sequence; 
        sequence.signal = gotoSequence;
        sequence.system = system;
    }
}

const gotoSequence = (name, options ) => {
    const detail = Object.assign({ sequence: name, options: options});
    document.dispatchEvent(new CustomEvent( 'switch-sequence', { detail: detail }));
}

document.addEventListener('switch-sequence', event => {
    const sequence = sequences[ event.detail.sequence ];
    if( !sequence ) return;
    switchSequence( sequence, event.detail.options );
});

// initialize sequences ==============================================
setSequence( ini.sequence, battle.sequence, test.sequence);
// on load event =====================================================
window.onload = async event => {
    gotoSequence('init', {on_enter: system});
}
