export default class VirtualController extends EventTarget {

    static BIT_MASK = {
        up:     1,
        down:   2,
        left:   4,
        right:  8,
        light:  16,
        strong: 32,
        energy: 64,
        charge: 128
    }

    static DEFAULT_KEYBOARD_MASK = {
        w: ['up'],
        s: ['down'],
        a: ['left'],
        d: ['right'],
        u: ['light'],
        i: ['strong'],
        j: ['energy'],
        k: ['charge']
    }

    static DEFAULT_GAMEPAD_MASK = {
        12: ['up'],
        13: ['down'],
        14: ['left'],
        15: ['right'],
        2: ['light'],
        3: ['strong'],
        1: ['energy'],
        0: ['charge']
    }

    constructor( ) {
        super( );
        this.num = 0;
        this.source = null;
        document.addEventListener('input-pressed', this.#onpressed.bind(this));
        document.addEventListener('input-released', this.#onreleased.bind(this));
    }

    #onpressed( event ) {
        if(event.detail.source != this.source || !this.mask[event.detail.index]) return;
        for( const key of this.mask[event.detail.index]) this.num |= VirtualController.BIT_MASK[key];
        this.dispatchEvent(new CustomEvent('button-pressed', {detail: this.mask[event.detail.index]}));
    }

    #onreleased( event ) {
        if(event.detail.source != this.source || !this.mask[event.detail.index]) return;
        for( const key of this.mask[event.detail.index]) this.num &= ~VirtualController.BIT_MASK[key];
        this.dispatchEvent(new CustomEvent('button-released', {detail: this.mask[event.detail.index]}));
    }

    assignMask( mask ) {
        Object.assign( this.mask, mask );
        //just provide the right data 
    }

    defaultKeyboard( ) {
        this.mask = Object.assign({ }, VirtualController.DEFAULT_KEYBOARD_MASK );
    }

    defaultGamepad( ) {
        this.mask = Object.assign({ }, VirtualController.DEFAULT_GAMEPAD_MASK );
    }

    controls( ) {
        return {
            direction: this.num & 0xf,
            light:  (this.num & VirtualController.BIT_MASK.light)  != 0,
            strong: (this.num & VirtualController.BIT_MASK.strong) != 0,
            energy: (this.num & VirtualController.BIT_MASK.energy) != 0,
            charge: (this.num & VirtualController.BIT_MASK.charge) != 0,
        }
    }

    assignKeyboard( mask ) {
        this.source = 'keyboard';
        if( mask ) this.assignMask( mask );
        else this.defaultKeyboard( );
    }

    assignGamepad( index, mask ) {
        this.source = 'gamepad' + index
        if( mask ) this.assignMask( mask );
        else this.defaultGamepad( );
    }

}