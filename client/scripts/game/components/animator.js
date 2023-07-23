GameLib.Components.Animator = class {

    constructor( object, animations = { }) {
        this.object = object;
        this.animations = animations;
        this.current = {animation: null, index: 0, time: 0}
    }

    get currentAnimation( ) {
        return this.animations[this.current.animation];
    }

    get currentFrame( ) {
        return this.currentAnimation.frames[this.current.index];
    }

    #nextFrame( ) {
        this.current.index ++;
        this.current.time = 0;
        if(this.current.index > this.currentAnimation.frames.length) {
            this.object.signal(this.currentAnimation.onEnd);
            this.current.index = 0;
        }
        this.object.signal(this.currentFrame.signal);
    }

    #selectAnimation(name) {
        if(!this.animations[name]) throw `Animator Error - no such animation [${name}]`;
        this.current.animation = {animation: name, index: -1, time: 0};
        this.object.signal( this.currentAnimation.onStart);
        this.#nextFrame( );
    }

    animate( name, interval ) {
        if( this.current.animation != name ) this.#selectAnimation(name);
        this.current.time += interval;
        if(this.current.time > this.currentFrame.duration ) this.#nextFrame();
    }

    setAnimations( animations ) {
        Object.assign( this.animations, animations );
    }
}