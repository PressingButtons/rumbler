import Sequence from "../sequence.js";

const sequence = new Sequence('test');

sequence.enter = async function( ) {

    const control1 = this.system.input.defaultKeyboard( );
    const control2 = this.system.input.defaultGamepad(0);

    const config = { on_enter: { 
        stage: "summit", p1: { type: 'garf', control_settings: control1 }, p2: { type: 'garf', control_settings: control2 }
    }} 
    this.signal( 'battle', config );
}

sequence.exit = async function( ) {

}


export { sequence }