GameSystem.GameInstance = class extends Signaler {

    constructor(config) {
        super( );
        this.camera     = new GameLib.Components.Camera( );
        this.stage      = new GameLib.Objects.StageObject('stage_summit');
        this.objects    = [ ];
    }

    currentState( ) {
        return {
            camera: this.camera.rect,
            entries: [this.stage.pack( )]
        }
    }

    closeRoutes( )  {

    }

    update( ) {
        return this.currentState( );
    }
    
}
