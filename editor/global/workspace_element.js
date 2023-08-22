export default class WorkspaceElement extends EventTarget {


    constructor( class_name ) {
        super( );
        this.body = document.createElement('div');
        this.body.className = 'workspace-element ' + class_name;
        this.#build_base( );
        this.#initListeners( );
        this.contact = 0;
    }

    #build_base( ) {
        this.body.innerHTML =  `
            <div class='content'></div>
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="grid"  patternUnits="userSpaceOnUse">
                        <path fill="none" stroke="rgba(255, 255, 255, 0.5)" stroke-width="0.5"/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                <rect class='workspace-cursor'  width="16" height="16" fill="rgba(255, 255, 255, 0.2)"/>
                <rect class='workspace-listener' width="100%" height="100%" fill="rgba(0, 0, 0, 0)"/>
            </svg>
        `;
    }

    #initListeners( ) {
        const listener = this.query('.workspace-listener');
        const cursor   = this.query('.workspace-cursor');
        // cursor -----------------------------
        listener.addEventListener('mouseenter', event => {
            cursor.setAttribute('opacity', '1');
        });

        listener.addEventListener('mouseout', event => {
            cursor.setAttribute('opacity', 0);
            this.contact = 0;
        });

        listener.addEventListener('mousedown', event => {
            this.contact = 1;
        })

        listener.addEventListener('mouseup', event => {
            this.contact = 0;
        })
    }

    getCoord( event ) {
        const {x, y} = event.target.getBoundingClientRect( );
        return {
            x: event.clientX - x,
            y: event.clientY - y
        }
    }

    query( n ) {
        return this.body.querySelector( n );
    }

    tilesize( n ) {
        this.query('pattern').setAttribute('width', n );
        this.query('pattern').setAttribute('height', n );
        this.query('path').setAttribute('d', `M ${n} 0 L 0 0 0 ${n}`);  
        this.query('path').setAttribute('stroke-width', '0.5');  
    }

    anchor( element ) {
        this.body = element.appendChild(this.body);
    }

}