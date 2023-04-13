{ 
    class GameStage {

        #tilemap;
        #background = null;

        constructor(background, tilemap) {
            this.#background = background;
            this.#tilemap = this.#tilemap
        }

        tile(row, col) {
            return this.#tilemap.getTile(row, col);
        }

        serialize( ) {
            return {
                background: this.#background,
                tilemap: this.#tilemap.tiles
            }
        }

    }


    self.GameStage = GameStage;

}