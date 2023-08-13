export default class WorkCanvas {

    constructor( ) {
        this.#build( );
    }

    #build( ) {
        this.body = document.createElement('div');
        this.body.setAttribute('class', 'work-canvas_container');
        this.#createBody( );
        this.resize( 816, 464 );
    }

    #createBody( ) {
        this.body.innerHTML = `
            <canvas></canvas>
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="grid"  patternUnits="userSpaceOnUse">
                        <path fill="none" stroke="rgba(0, 0, 0, 0.2)" stroke-width="0.5"/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
        `
        this.tilesize(16);
    }

    query( n ) {
        return this.body.querySelector( n );
    }

    tilesize( n ) {
        this.query('pattern').setAttribute('width', n );
        this.query('pattern').setAttribute('height', n );
        this.query('path').setAttribute('d', `M ${n} 0 L 0 0 0 ${n}`);  
        this.query('path').setAttribute('stroke', 'rgba(0, 0, 0, 0.5');  
        this.query('path').setAttribute('stroke-width', '0.5');  
    }

    resize( width, height ) {
        this.query('canvas').setAttribute('width', width);
        this.query('canvas').setAttribute('height', height);
    }

    anchor( element ) {
        this.body = element.appendChild(this.body);
    }

}