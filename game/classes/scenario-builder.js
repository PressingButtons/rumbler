export default class ScenarioBuilder {

    constructor( db ) { 
        this.db = db;
        this.reset( );
    }

    reset( ) {
        this.detail = {
            data: { },
        };
    }

    mode( type ) {
        this.detail.mode = type;
        return this;
    }

    player1( name, input, color = 0, affiliation = 0 ) {
        this.detail.player1 = {
            name: name,  input: input, team: affiliation
        }
        this.detail.data[name]  = this.db.gameobjects[name];
        return this;
    }

    player2( name, input, color = 0, affiliation = 1 ) {
        this.detail.player2 = {
            name: name, input: input, team: affiliation
        }
        this.detail.data[name]  = this.db.gameobjects[name];
        return this;
    }

    mob( name, color = 0, affiliation = 2 ) {
        if( !this.detail.mobs ) this.detail.mobs = [ ];
        this.detail.mobs.push([{
            name: name, team: affiliation
        }]);
        this.detail.data[name]  = this.db.gameobjects[name];

        return this;
    }

    level( name ) {
        this.detail.level = { name: name }
        return this;
    }

    stringify( ) {
        return JSON.stringify( this.detail );
    }

}