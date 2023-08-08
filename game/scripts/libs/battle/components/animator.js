Component.Animator = class {

    constructor( gameobject ) {
        this.gameobject = gameobject;
        this.animation = null;
        this.index = 0;
        this.time = 0;
    }

    get current_animation( ) {
        return this.gameobject.build.animations[ this.animation ];
    }

    get current_frame( ) {
        if( !this.current_animation || !this.current_animation.frames[this.index] ) return { };
        return this.current_animation.frames[this.index];

    }

    get current_cell( ) {
        if(isNaN(this.current_frame.cell)) return { };
        return this.gameobject.build.cells[ this.current_frame.cell ];
    }

    //===========================================================
    // Private Utility Methods 
    //===========================================================
    #callSignal( ar ) {
        for( const signal of ar ) this.gameobject.signal( signal );
    }

    #hasAnimation( name ) {
        return this.gameobject.build.animations[name] != null;
    }

    #selectAnimation( name ) {
        if( this.animation == name ) return;
        if( !this.#hasAnimation(name)) throw `Animation Errro, invalid animation[${name}].`;
        this.animation = name;
        this.#startAnimation( );
    }

    //===========================================================
    // Private Animation Methods 
    //===========================================================
    #startAnimation( ) {
        this.index = 0;
        this.time  = 0;
        this.#callSignal( this.current_animation.on_start );
        this.#callSignal( this.current_frame.on_frame );
    }

    #endAnimation( ) {
        this.#callSignal( this.current_animation.on_end );
        //this.#startAnimation( );
    }

    #progressAnimation( interval ) {
        if( this.animation == 'ground_light_1')
        this.time += interval;
        if( this.time >= this.current_frame.duration ) this.#nextFrame( );
    }

    #nextFrame( ) {
        this.time = 0;
        if( this.index + 1 >= this.current_animation.frames.length ) return this.#endAnimation( );
        this.index ++;
        this.#callSignal( this.current_frame.on_frame );
    }

    //===========================================================
    //  Public Methods 
    //===========================================================

    animate( name ) {
        if( !this.#hasAnimation(name) ) return;
        this.#selectAnimation( name );
    }

    update(interval) {
        if( isNaN(interval) && interval.interval) interval = interval.interval;
        else throw 'Animator Error, invalid update value!'
        this.#progressAnimation( interval * 1000 ); 
    }

}