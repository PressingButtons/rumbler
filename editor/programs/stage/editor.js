import StageWorkspace from "./workspace.stages.js";

export default class Editor {

    constructor( project ) {
        this.project = project;
        this.stamp_colors = [
            'rgba(0, 0, 0, 0.5)', 
            'rgba(200, 200, 200, 0.5)', 
            'rgba(255, 0, 0, 0.5)', 
            'rgba(0, 255, 0, 0.5)', 
            'rgba(0, 0, 255, 0.5)',
            'rgba(255, 255, 0, 0.5)',
            'rgba(0, 255, 255, 0.5)'
        ];
        this.stamper = { value: -1, active: false }
    }

    async init( ) {
        this.workspace = new StageWorkspace( );
        this.workspace.anchor( document.getElementById('main-workspace'));
        await this.workspace.init( this.project );
        this.setListeners( );
        this.initTiles( );
    }

    
    initTiles( ) {
        for(const key in this.project.tiles.map) {
            const tile = this.project.tiles.map[key];
            this.workspace.stamp( tile.meta.coord, this.stamp_colors[tile.value] )
        }
    }

    converToMapPosition( position ) {
        return {
            col: Math.floor( position.x / StageWorkspace.TILESIZE ),
            row: Math.round( position.y / StageWorkspace.TILESIZE )
        }
    }

    createTile( coord ) {
        const tile = { value: this.stamper.value, meta: { } };
        tile.meta.coord = coord;
        const index = `${coord.row}:${coord.col}`;
        this.project.tiles.map[index] = tile;
        return tile;
    }

    linkTile( tile ) {
        tile.meta.linked = true;
        this.project.tiles.linked.push(tile.value);
        this.project.tiles.linked = [...new Set( this.project.tiles.linked)];
    }

    createSpawnTile( coord ) {
        if( this.stamper.value == 5 ) {
            this.deleteTile( this.project.spawns[1] );
            this.project.spawns[1] = tile;
        }
        else {
            this.deleteTile( this.project.tiles.spawns[2])
            this.project.spawns[2] = coord;
        }
    }
    
    deleteLink( value, coord ) {
        const links = this.project.tiles.linked[value];
        links.splice(links.indexOf(`${coord.row}:${coord.col}`), 1);
    }

    deleteTile( coord ) {
        const tiledata = this.getTile(coord);
        if( !tiledata.tile ) return;
        if( tiledata.tile.meta.linked ) this.deleteLink( tiledata.index );
        delete project.tiles.map[tiledata.index];
    }

    getTile( coord ) {
        const index = `${coord.row}:${coord.col}`;
        return { index: index, tile: this.project.tiles.map[ index ] };
    }

    refresh( ) {
        this.workspace.clear( );
        this.initTiles( );
    }

    stamp( position ) {
        const mapPosition = this.converToMapPosition( position );
        if( this.stamper .value == -1 ) this.deleteTile( mapPosition );
        else if (this.stamper.value < 2 ) this.createTile( mapPosition );
        else if (this.stamper.value < 5 ) this.createLinkedTile( mapPosition );
        else this.createSpawnTile( mapPosition );
        this.workspace.stamp( mapPosition , this.stamp_colors[this.stamp.value]);
    }

    setListeners( ) {
        document.getElementById('tool-selector').addEventListener('change', event => { 
            this.stamper.value = event.target.value;
        });

        document.getElementById("save-project").addEventListener('click', event => {
            document.dispatchEvent(new CustomEvent('update', { detail: this.project })); 
        });

        document.getElementById('clear-tiles').addEventListener('click', event => {
            this.project.tiles.spawns = { 1: [0, 0], 2: [0, 0]}
            this.project.tiles.map = { };
            this.project.linked = {2: [], 3: [], 4: []}
            this.refresh( );
        })

        this.workspace.addEventListener('stamp', event => this.stamp(event.detail));

        this.workspace.query('.workspace-listener').addEventListener('mousemove', event => {
            const coord = this.converToMapPosition( this.workspace.mapPoint(event));
            document.getElementById('cursor-position').textContent = `row: ${coord.row}, col: ${coord.col}`;
        })
    }
}