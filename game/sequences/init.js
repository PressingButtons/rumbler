import Updater from "../../system/classes/updater.js";
import { loadDatabase, loadImageBitmap } from "../../utils/methods.js";
import GraphicsGL from "../../webgl/gl_main.js";
import ScenarioBuilder from "../classes/scenario-builder.js";
import * as Input from '../input/input.js'

export default function initializeSequence( sequence ) {
    //on enter 
    sequence.enter = async function( config ) {
        // check if preload already completed 
        if( this.host.initialized ) return;
        // preload assets 
        this.host.database = await loadDatabase( );
        this.host.graphics = await initializeGraphics( this.host.database.textures );
        // set modules 
        this.host.updater = new Updater( );
        Input.init( );
        this.host.updater.run('poll-input', Input.query);
        this.host.virtual_pads = { pad1: Input.vc1, pad2: Input.vc2 }
        this.host.scenario_builder = new ScenarioBuilder( this.host.database );
        // set sequences 
        
        // end
        this.host.initialized = true;
    }
    //on exit 
    sequence.exit = async function( config ) {

    }
}

const initializeGraphics = async textures => {
    await GraphicsGL.init(document.getElementById('game'));
    for( const key in textures ) await loadTexture( key, textures[key]);
    return GraphicsGL;
}

const loadTexture = async (key, url) => {
    const bitmap = await loadImageBitmap( new URL( '/images/' + url, import.meta.url));
    return GraphicsGL.createTexture( key, bitmap );
}
