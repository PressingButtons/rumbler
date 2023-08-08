export default class AutoIncrement {

    #counter;

    constructor( ) {
        this.reset( );
    }

    next( ) {
        return this.#counter.next( ).value;
    }

    reset( ) {
        this.#counter = generator( );
    }


}

function*  generator( ) {
    let index = 0;
    while(true) yield index ++;
}