{
    // =========================================================
    // Game Environment Object
    // =========================================================
    class Game {

        #tilemap;
        #players = { };
        #database;

        constructor(config) {
            this.#database = new GameDatabase( );
            this.#tilemap = config.tilemap;
            this.#createPlayers(config.players)
        }

        #createPlayers(players) {
            for(let i = 0, player; player = players[i]; i++) {
                if(!players[i]) continue;
                else this.#createPlayer(i, players[i]);
            }
        }

        #createPlayer(index, config) {
            
        }

        #updatePlayers(config) {

        }

        #updateWorld(config) {
            return this.#database.update(config);
        }

        handleInput(input) {
            
        }

        update(interval) {
            const config = {interval: interval, seconds: interval * 0.001, game: this}
            const player_state = this.#updatePlayers(config);
            const world_state = this.#updateWorld(config);
            const instance = Object.assign({}, player_state, world_state);
            return instance;
        }

    }

    // =========================================================
    // Game Environment Object
    // =========================================================

    class GameDatabase {

        #enum = function *( ) {
            let index = 0;
            while(true) yield index ++;
        }

        #object_layer = { 0: { }, 1: { }, 2: { } }

        constructor( ) {

        }

        #updateLayer(layer_index, config) {
            let result = [ ];
            for(const index in this.#object_layer[layer_index]) {
                this.#object_layer[layer_index][index].update(config);
                const data = { id: `${layer_index}:${index}`, data: this.#object_layer[layer_index][index].dump( )}
                result.push(data);
            }
            return result;
        }

        add(object, layer) {
            const index = this.#enum.next( ).value;
            this.#object_layer[layer][index] = object;
        }

        destroy(layer_id, index) {
            delete[this.#object_layer[layer_id][index]];
        }

        get_object(layer_id, index) {
            return this.#object_layer[layer_id, index];
        }

        set_object(object, layer_id, index) {
            this.#object_layer[layer_id][index] = object;
        }

        get_layer(id) {
            return Object.values(this.#object_layer[id]);
        }

        update(config) {
            const list = [ ];
            for(const layer in this.#object_layer) 
                list.push(this.#updateLayer(layer, config));
            return list.flat( );
        }

    }

    self.Game = Game
}
