import WorkspaceElement from "../../global/workspace_element.js";

export default class StageWorkspace extends WorkspaceElement {

    constructor( ) {
        super('stage-workspace');
        this.tilesize(16);
        this.#initLayers( );
    }

    #initLayers( project ) {
        this.skybox = this.query('div.content').appendChild(new Image( ));
        this.skybox.className = 'skybox';
        this.background = this.query('div.content').appendChild(new Image( ));
        this.background.className = 'background';
        this.mainground = this.query('div.content').appendChild(new Image( ));
        this.mainground.className = 'mainground';
    }

    #loadLayers( project ) {
        return new Promise((resolve, reject) => {
            this.skybox.src = `/images/skybox/${project.skybox.texture}.webp`;
            if( project.background.texture ) this.background.src = `/images/backcground/${project.background.texture}.webp`;
            this.mainground.onload = event => { this.#setCanvas( ), resolve( )};
            this.mainground.src = `/images/stage/${project.mainground.texture}.webp`;
        });
    }

    #setCanvas( ) {
        this.ctx = this.query('.content').appendChild(document.createElement('canvas')).getContext('2d');
        this.ctx.canvas.className = 'plot-canvas';
        const {width, height} = this.mainground.getBoundingClientRect( );
        this.ctx.canvas.width = width;
        this.ctx.canvas.height = height;   
    }

    async init( project ) {
        await this.#loadLayers( project );
    }

    stamp( coord, color ) {
        this.ctx.fillStyle = color;
        this.ctx.clearRect(
            coord.col * WorkspaceElement.TILESIZE, 
            coord.row * WorkspaceElement.TILESIZE, 
            WorkspaceElement.TILESIZE,
            WorkspaceElement.TILESIZE
        );
        if( !color ) return;
        this.ctx.fillRect( 
            coord.col * WorkspaceElement.TILESIZE, 
            coord.row * WorkspaceElement.TILESIZE, 
            WorkspaceElement.TILESIZE,
            WorkspaceElement.TILESIZE
        );
    }

    anchor( element ) {
        super.anchor( element );
    }

}