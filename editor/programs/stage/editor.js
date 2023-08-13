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
        this.stamp = { value: -1, active: false }
    }

    async init( ) {
        this.workspace = new StageWorkspace( );
        this.workspace.anchor( document.getElementById('main-workspace'));
        await this.workspace.init( this.project ); 
        this.setListeners( this.workspace );
        this.initTiles( );
    }

    initTiles( ) {
        for(const key in this.project.tiles.map) {
            this.drawTile( this.project.tiles.map[key] );
        }
    }

    convertToIndex( coord ) {
        if(!coord) return null;
        return `${coord.row}:${coord.col}`;
    }

    createTile( coord ) {
        const tile = { value: this.stamp.value, meta: { } };
        tile.meta.coord = coord;
        const index = this.convertToIndex( coord );
        this.project.tiles.map[index] = tile;
        return tile;
    }

    createLinkedTile( coord ) {
        const tile = this.createTile( coord );
        tile.meta.linked = true;
        this.linkTile( tile );
    }

    createSpawnTile( workspace, coord ) {
        const tile = this.createTile( coord );
        if( this.stamp.value == 5 ) {
            this.deleteTile( this.project.tiles.spawn.p1, workspace );
            this.project.tiles.spawn.p1 = coord;
        }
        else {
            this.deleteTile( this.project.tiles.spawn.p2, workspace)
            this.project.tiles.spawn.p2 = coord;
        }
    }
    
    deleteLink( value, coord ) {
        const links = this.project.tiles.linked[value];
        links.splice(links.indexOf(`${coord.row}:${coord.col}`), 1);
    }

    deleteTile( coord, workspace ) {
        const tile = this.getTile(coord);
        if( !tile ) return;
        if( tile.meta.linked ) this.deleteLink( tile.value, coord );
        delete project.tiles.map[this.convertToIndex(coord)];
        if( workspace ) workspace.stamp( coord );
    }

    drawTile( tile ) {
        this.workspace.stamp( tile.meta.coord, this.stamp_colors[tile.value ]);
    }

    getTile( coord ) {
        return this.project.tiles.map[this.convertToIndex(coord)];
    }

    linkTile( tile ) {
        const links = new Set( this.project.tiles.linked[tile.value] );
        for( const key in this.project.tiles.map ) {
            const current = this.project.tiles.map[key];
            if( current.value == tile.value ) links.add(key);
        }
        this.project.tiles.linked[tile.value] = [...links];
    }

    stampTile( workspace, coord ) {
        workspace.stamp( coord, this.stamp_colors[this.stamp.value]);
        if( this.stamp.value == -1 ) this.deleteTile( coord );
        else if (this.stamp.value < 2 ) this.createTile( coord );
        else if (this.stamp.value < 5 ) this.createLinkedTile( coord );
        else this.createSpawnTile( workspace, coord );
    }

    setListeners( workspace ) {
        this.workspaceListeners( workspace );
        document.getElementById('tool-selector').addEventListener('change', event => { 
            this.stamp.value = event.target.value;
        });

        document.getElementById("save-project").addEventListener('click', event => {
            document.dispatchEvent(new CustomEvent('update', { detail: this.project })); 
        });
    }

    workspaceListeners( workspace ) {
        workspace.addEventListener('stamp', event => this.stampTile(workspace, event.detail));
    }

}