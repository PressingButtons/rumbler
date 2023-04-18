const sysout = (( ) => {

    let current;

    const setGroup = n => {
        if(current != n) {
            console.groupEnd( );
            console.group(n);
            current = n;
        }
    }

    return {
        log: function(name, ...entries) {
            setGroup(name);
            console.log(performance.now( ), ...entries);
        },

        error: function(name, ...entries) {
            setGroup(name);
            console.error(performance.now( ), ...entries);
        }
    }

})( );

window.sysout = sysout;