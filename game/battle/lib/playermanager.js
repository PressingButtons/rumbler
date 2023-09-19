const PlayerManager = class {

    constructor( config ) {
        this.buttons = new Components.ButtonSet( );
        this.inputBuffer = new Components.InputBuffer( );
        this.rumbler = new Rumbler.Rumbler( config.rumbler.character );
        this.rumbler.buttons = this.buttons;
    }

    handleInput( input ) {
        if( input.event == 'input_pressed') this.buttons.press( input.index, input.timestamp );
        else this.buttons.release( input.index, input.timestamp );
        this.inputBuffer.log( this.buttons, input.timestamp );
    }

}