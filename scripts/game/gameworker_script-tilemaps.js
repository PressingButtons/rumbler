{
    const tilemaps = { };

    // =========================================================
    // Tilemap
    // =========================================================
    class Tilemap {

        #tiles = { };

        constructor(bitmap) {
            this.#parseTiles(bitmap);
        }

        #bitmapData(bitmap) {
            const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
            const ctx = canvas.getContext('2d');
            return ctx.getImageData(0, 0, bitmap.width, bitmap.height).data;
        }

        #parseTiles(bitmap) {
            const data = this.#bitmapData(bitmap);
            this.#setTiles(bitmap.height, bitmap.width, data);
        }

        #setTile(row, column, value) {
            if(!this.#tiles[row]) this.#tiles[row] = { };
            this.#tiles[row][column] = value;
        }

        #setTiles(rows, columns, data) {
            for(let i = 0; i < data.length; i += 4) {
                if(data[i] == 0) continue;
                const row = (i/4) % columns, col = Math.floor(i/columns);
                this.#setTile(row, column, [data[i], data[i + 1]]);
            }
        }

        getTile(row, column) {
            if(this.#tiles[row]) return this.#tiles[row][column];
            return null;
        }

    }

    self.Tilemaps = {
        get tilemap_keys( ) {
            return Object.keys(tilemaps)
        },

        getMap:function(key) {
            return tilemaps[key];
        }
    }

    messenger.setRoute('bitmaps', function(message) {
        for(const key in message) tilemaps[key] = new Tilemap(message[key]);
    })

}
