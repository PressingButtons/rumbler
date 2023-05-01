export default function (system) {

    system.setHook('scene:main', async x => {
        await system.signalAsync('close-game');
        loadMainScene();
    });

    system.setHook('scene:game', async x => {
        await system.signalAsync('close-game');
        loadGameScene( );
    });

    async function setHTML(url) {
        const container = document.querySelector('.game-overlay');
        container.innerHTML = await system.utils.fetchText(url);
        return container.firstChild;
    }

    async function loadMainScene( ) {
        const html = await setHTML('./html/scene-main.html');
    }

    async function loadGameScene( ) {
        const html = await setHTML('./html/scene-game.html');
    }
}
