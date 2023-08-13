import Sequence from "../sequence.js";

const sequence = new Sequence('test');

sequence.enter = async function( ) {
    const config = { on_enter: { 
        stage: "summit", p1: { type: 'garf' }, p2: { type: 'garf' }
    }} 
    this.signal( 'battle', config );
}

sequence.exit = async function( ) {

}

export { sequence }