import BattleInstance from './class/battle_instance.js';

let current;

export function create( options ) {
    if( current ) current.close( );
    current = new BattleInstance( options );
}

