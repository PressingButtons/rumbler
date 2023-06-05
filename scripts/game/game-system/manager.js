//==========================================================
// GameManager 
// Static Class that manages GameClasses
//==========================================================
GameSystem.Manager = class {

    constructor(config ) {
        super( );
        this.#init( config )
    }

    #init(config) {
        this.camera = new GameLib.Components.Camera( );
        this.stage = new GameLib.Objects.StageObject(config.stage);
    }

    #openRoutes( ) {
        messenger.setRoute('play', this.#onplay.bind(this)); 
        messenger.setRoute('stop', this.#onstop.bind(this)); 
    }

    #onplay( message ) {

    }

    #onstop( message ) {

    }

    createGameState( ) {
        return {
            camera: this.camera.rect( )
        }
    }

    closeRoutes( ) {

    }

    update( interval ) {
        
    }

}