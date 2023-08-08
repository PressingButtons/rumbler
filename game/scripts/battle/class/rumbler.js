class Rumbler extends GameActor {

    constructor( config ) {
        super(1, 1);
        this.#init( config );
    }


    #init( ) {
        Object.assign( this, config );
        this.setSignal('update', this.applyGravity);
    }

    

}