export default class GameController {

    #buttons = {
        up:      { keys: { }, timestamp: 0 },
        down:    { keys: { }, timestamp: 0 },
        left:    { keys: { }, timestamp: 0 },
        right:   { keys: { }, timestamp: 0 },
        jump:    { keys: { }, timestamp: 0 },
        light:   { keys: { }, timestamp: 0 },
        strong:  { keys: { }, timestamp: 0 },
        special: { keys: { }, timestamp: 0 },
        guard:   { keys: { }, timestamp: 0 },
        menu:    { keys: { }, timestamp: 0 },
        confirm: { keys: { }, timestamp: 0 },
        cancel:  { keys: { }, timestamp: 0 },
    }

    #active = new Set( );

    #source;

    constructor( source ) {
        this.setSource( source );
    }

    get pressed( ) {
        return [...this.#active];
    }

    #createListener( button, index ) {
        this.#buttons[button].keys[index] = function( event ) {
            if(!event) return;
            if(!( event.detail.source == this.#source && event.detail.index == index)) return;
            if( event.type == 'input_pressed') this.#press( button, event.timestamp );
            else this.#release( button );
        }

        return this.#buttons[button].keys[index];
    }

    #press( button, timestamp ) {
        this.#active.add( button );
        this.#buttons[button].timestamp = timestamp;
    }

    #release( button ) {
        this.#active.delete( button );
    }

    #reset( ) {
        for( const button in this.#buttons ) {
            for( const key in this.#buttons[button].keys )
                this.unassignButton( button, key );
        }
    }

    // ==================================================
    // Public Methods 
    // ==================================================

    isPressed( key ) {
        return this.#active.has( key );
    }

    assignButton( button, ...indices ) {
        indices = indices.flat( );
        for(const index of indices ) {
            const listener = this.#createListener( button,index );
            document.addEventListener('input_pressed', listener.bind(this));
            document.addEventListener('input_released', listener.bind(this));
        } 
    }

    unassignButton( button, index ) {
        document.removeEventListener('input_pressed', this.#buttons[button].keys[index]);
        document.removeEventListener('input_released', this.#buttons[button].keys[index]);
    }

    setSource( source ) {
        this.#source = source;
        console.log( this.#source, 'connected' );
        this.#reset( );
    }

    configure( config ) {
        for(const button in config ) {
            this.assignButton( button, config[button ])
        }
    }

    configureDefaultKeyboard(  ) {
        this.configure({
            up:    ['w', 'arrowup'],
            down:  ['s', 'arrowdown'],
            left:  ['a', 'arrowleft'], 
            right: ['d', 'arrowright'],
            jump:  [' '],
            light: ['y']
        })
    }

    configureDefaultGamepad( ) {
        this.configure({
            up:    [12],
            down:  [13],
            left:  [14], 
            right: [15],
            jump:  [1],
            light: [0]
        })
    }
 
}

