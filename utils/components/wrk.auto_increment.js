{

    if(!self.Utils) self.Utils = { };

    self.Utils.AutoIncrement = class {

        #counter;

        constructor( ) {
            this.reset( );
            console.log( this.#counter)
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

}