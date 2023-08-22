export function createScheme( source, up, down, left, right, jump, light, strong, special, guard ) {
    const scheme = { source: source, buttons: { } };
    assignKey( 'up',      up,      scheme.buttons);
    assignKey( 'down',    down,    scheme.buttons);
    assignKey( 'left',    left,    scheme.buttons);
    assignKey( 'right',   right,   scheme.buttons);
    assignKey( 'jump',    jump,    scheme.buttons);
    assignKey( 'light',   light,   scheme.buttons);
    assignKey( 'strong',  strong,  scheme.buttons);
    assignKey( 'special', special, scheme.buttons);
    assignKey( 'guard',   guard,   scheme.buttons);
    return scheme;
}

const assignKey = ( key, group, buttons ) => {
    for( const index of group ) {
        if( !buttons[index] ) buttons[index] = [ ];
        buttons[index].push( key );
    }
}

export function defaultKeyboard( ) {
    return createScheme('keyboard', 
        ['w'], ['s'], ['a'], ['d'],
        [' '], ['u', 'k'], ['j', 'k'], ['i'], ['o', 'j']
    )
}

export function defaultGamepad( i ) {
    return createScheme( 'gp' + i, 
        [12], [13], [14], [15],
        [1], [0], [2], [3], [5]
    )
}