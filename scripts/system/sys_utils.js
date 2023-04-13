function SystemUtilities( ) {

    const base_uri = new URL('../', import.meta.url);

    return {

        get base_uri( ) {return base_uri },

        fetchJSON: function(url) {
            return fetch(new URL(url, base_uri)).then(res => res.json( ));
        },

        fetchText: function(url) {
            return fetch(new URL(url, base_uri)).then(res => res.text( ));
        },

        fetchBlob: function(url){
            return fetch(new URL(url, base_uri)).then(res => res.blob( ));
        },

        loadImage: function(url) {
            return new Promise((resolve, reject) => {
                const image = new Image( );
                image.onload = event => resolve(image);
                image.onerror = event => reject(event);
                image.src = new URL(url, base_uri);
            }) ;
        }
    }
}

export default new SystemUtilities( );