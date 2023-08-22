import WorkspaceElement from "../../global/workspace_element.js";

const TILESIZE = 16;

export default class StageWorkspace extends WorkspaceElement {

    static TILESIZE = TILESIZE;

    constructor( ) {
        super('stage-workspace');
        this.tilesize(TILESIZE);
        this.#initListeners( );
        this.#initLayers( );
    }

    #initLayers( ) {
        this.skybox = this.query('div.content').appendChild(new Image( ));
        this.skybox.className = 'skybox';
        this.background = this.query('div.content').appendChild(new Image( ));
        this.background.className = 'background';
        this.mainground = this.query('div.content').appendChild(new Image( ));
        this.mainground.className = 'mainground';
        this.origin = { x: this.mainground.width / 2, y: this.mainground.height / 2 }
    }

    #initListeners( ) {
        const listener = this.query('.workspace-listener');
        const cursor   = this.query('.workspace-cursor');

        listener.addEventListener('mousemove', event => {
            const coord = this.convertCoord( event );
            cursor.setAttribute('x', coord.col * TILESIZE);
            cursor.setAttribute('y', coord.row * TILESIZE);
            if( this.contact == 1) this.#signalStamp( event );
        });

        listener.addEventListener('mousedown', event => {
            this.#signalStamp(event);
        });
    }

    #loadLayers( project ) {
        return new Promise((resolve, reject) => {
            this.#loadLayer( `/images/skybox/${project.skybox.texture}.webp`, this.skybox, event => {
                project.skybox.width = event.target.width;
                project.skybox.height = event.target.height;
            });

            if( project.background ) {
                this.#loadLayer( `/images/background/${project.background.texture}.webp`, this.background, event => {
                    project.background.width = event.target.width;
                    project.background.height = event.target.height;
                });
            }

            this.#loadLayer(`/images/mainground/${project.mainground.texture}.webp`, this.mainground, event => {
                project.mainground.width = event.target.width;
                project.mainground.height = event.target.height;
                this.#setCanvas( );
                resolve( );
            });
        });
    }

    #loadLayer( url, image, method ) {
        image.onload = method;
        image.src = url;
    }

    #setCanvas( ) {
        this.ctx = this.query('.content').appendChild(document.createElement('canvas')).getContext('2d');
        this.ctx.canvas.className = 'plot-canvas';
        const {width, height} = this.mainground.getBoundingClientRect( );
        this.ctx.canvas.width = width;
        this.ctx.canvas.height = height;   
        this.origin = { x: this.mainground.width / 2, y: this.mainground.height / 2 }
    }

    #signalStamp( event ) {
        const coord = this.getCoord(event);
        coord.x -= this.origin.x;
        coord.y -= this.origin.y;
        this.dispatchEvent(new CustomEvent('stamp', {detail: coord}));
    }

    async init( project ) {
        await this.#loadLayers( project );
        console.log( project );
    }

    clear( ) {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    convertCoord( event ) {
        const point = this.getCoord(event);
        return {
            col: Math.floor( point.x / TILESIZE),
            row: Math.floor( point.y / TILESIZE)
        }
    }

    mapPoint( event ) {
        const point = this.getCoord( event );
        point.x -= this.origin.x;
        point.y -= this.origin.y;
        return point;
    }

    revertCoord( coord ) {
        return {
            col: coord.col + Math.floor( this.origin.x / TILESIZE ),
            row: coord.row + Math.floor( this.origin.y / TILESIZE )
        }
    }

    stamp( coord, color ) {
        this.ctx.fillStyle = color;
        const converted = this.revertCoord( coord );
        this.ctx.clearRect(
            converted.col * TILESIZE, converted.row * TILESIZE, TILESIZE, TILESIZE
        );
        if( !color ) return;
        this.ctx.fillRect( 
            converted.col * TILESIZE, converted.row * TILESIZE, TILESIZE, TILESIZE
        );
    }

}