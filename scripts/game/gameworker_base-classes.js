class GameObject extends EventObject {

    static #ENNUMERATOR = function*( ) {
        let index = 0;
        while(true) yield index++;
    }

    #id;

    constructor(name) {
        super( );
        this.#id = `gameobject:${GameObject.#ENNUMERATOR.next( ).value}:${name}`;
    }

    get id( ) {return this.#id}

}
