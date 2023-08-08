class Gameobject {

    #signals = { };

    constructor( width, height  ) {
        this.position = { x: 0, y: 0 };
        this.rotation = { x: 0, y: 0, z: 0};
        this.height = height;
        this.width = width;
        this.textures = [ ];
    }

    get left( ) {
        return this.position.x - this.width * 0.5;
    }

    get right( ) {
        return this.position.x + this.width * 0.5;
    }

    get top( ) {
        return this.position.y - this.height * 0.5;
    }

    get bottom ( ) {
        return this.position.y + this.height * 0.5;
    }

    #createSignalChannel( signal ) {
        if( this.#signals[signal] ) return;
        else this.#signals[signal] = [ ];
    }

    setSignal( signal, func, priority) {
        this.#createSignalChannel( signal );
        if( !priority ) priority = this.#signals[signal].length;
        this.#signals.push({ method: func, priority: priority });
        this.#signals.sort((a, b) => {
            return a.priority - b.priority;
        })
    }

    signal( key, options ) {
        const channel = this.#signals[key];
        if( !channel ) return;
        for( const group of channel ) {
            group.method( options ).bind( this );
        }
    }

    
    rightward( ) {
        this.rotation.y = 0;
    }

    leftward( ) {
        this.rotation.y = Math.PI;
    }

}

class GameActor extends GameObject {

    constructor( width, height, body ) {
        super(width, height)
        this.body = body ? body : {x: 0, y: 0, width: width, height: height }
        this.velocity = { x: 0, y: 0 };
        this.acceleration = { x: 0, y: 0 };
        this.setSignal('update', this.accelerate);
        this.setSignal('update', this.move, 99);
    }

    accelerate( interval ) {
        this.velocity.x += this.acceleration.x * interval;
        this.velocity.y += this.acceleration.y * interval;
    }

    applyGravity( interval ) {
        this.acceleration.y += this.world.gravity * interval;
    }

    move( interval ) {
        this.position.x += this.velocity.x * interval;
        this.world.resolveTileCollision( this );
        this.position.y += this.velocity.y * interval;
        this.world.resolveTileCollision( this );
    }

}