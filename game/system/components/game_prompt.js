export default class GamePrompt extends EventTarget {

    constructor( ) {
        super( );
        this.#build( );
    }

    #build( ) {
        this.wrapper = document.createElement('div');
        this.wrapper.setAttribute('class', 'game-prompt');
        this.wrapper.innerHTML = GamePromptHTML;  
    }

    #dispatchOption( event ) {
        this.dispatchEvent(new CustomEvent('game-prompt-selection', {detail: event.target.value }));
    }

    anchor( element ) {
        this.wrapper = element.appendChild(this.wrapper);
    }

    setDescription( desciption ) {
        const container = this.wrapper.querySelector('.game-prompt_description');
        container.innerHTML = '';
        for( const desc of desciption ) {
            const p = container.appendChild(document.createElement('p'));
            p.innerHTML = desc;
        }
    }

    addOption( option ) {
        const container = this.wrapper.querySelector('.game-prompt_options');
        const input = container.appendChild(document.createElement('input'));
        input.value = option, 
        input.type = 'button';
        input.onclick = this.#dispatchOption.bind(this);
    }

    

}

const GamePromptHTML = `
    <div class="game-prompt_wrapper">
        <div class="game-prompt_description"></div>
        <form class="game-prompt_options"></form>
    </div>
`;

