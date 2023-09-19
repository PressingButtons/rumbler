export function buildScenario( database, player1, player2, stage = null ) {
    return {
        player1: createPlayerObject( database, player1),
        player2: createPlayerObject( database, player2)
    }
}

function createPlayerObject( database, player ) {

}