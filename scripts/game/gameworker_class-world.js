//encapsulate world definitions
{
    class World extends EventTarget {

        static #ENNUMERATOR = function*( ) {
            let index = 0;
            while(true) yield index++;
        }

        #id;
        #database;

        constructor( ) {
            this.#id = 'world_' + World.#ENUMMERATOR.next( ).value;
            this.#database = new WorldDatabase(this.#id);
        }

        get detabase( ) { return this.#database }

        #updateObjects(interval) {
            const detail = {world: this, dt: interval, ms: interval * 0.001}
            const instance = { };
            for(const entry in this.#database.entries) {
                entry.update(detail);
                instance[entry.world_id] = entry.packageState( );
            }
            return instance;
        }

        setInstance(instance) {
            for(const entry in instance.objects) {
                const current = this.#database.getObject(entry.world_id);
                if(current) current.setInstance(entry);
                //else //create object and add to database;
            }
        }

        update(interval) {
            const instance = this.#updateObjects(interval);
            return instance;
        }

    }

    //

    class WorldDatabase {

        static #ENNUMERATOR = function*( ) {
            let index = 0; 
            while(true) yield index++;
        }

        #db = {
            particle  : { },
            gameobject: { },
            entries: [],
        }

        #id;

        constructor(world_id) {
            this.#id = world_id;
        }

        get entries( ) {
            return this.#db.entries;
        }
        
        add(object) {
            if(!this.#db[object.root_type]) {
                console.error('Error - invalid object', object);
                throw 'Error - no valid root type';
            };
            const index = WorldDatabase.#ENNUMERATOR.next( ).value;
            object.world_id = `world:${this.id}:${index}:${object.root_type}`;
            this.#db[object.root_type][index] = object;
            this.#db.entries.push(object);
        }

        inject(object) {

        }

        getObject(world_id) {
            return this.#db[world_id[3]][world_id[2]];
        }

    }

    self.World = World;
}