import GamePrompt from "../components/game_prompt.js";

export class TestPrompt extends GamePrompt {

    constructor( ) {
        super( );
        this.setDescription('This is a Test');
        this.addOption('option a'); 
        this.addOption('option b'); 
        this.addOption('option c'); 
    }
}

export class GamepadPrompt extends GamePrompt {

    constructor( ) {
        super( );
        this.setDescription(["New Gamepad Detected.", "Assign to which player?"]);
        this.addOption('Player 1');
        this.addOption('Player 2');
        this.addOption('Cancel');
    }

}