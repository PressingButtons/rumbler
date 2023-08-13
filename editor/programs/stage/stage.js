import Editor from "./editor.js";

window.onload = event => {
    setTimeout( main, 1 );
}

const main = async ( ) => {
    const editor = new Editor( project );
    await editor.init(  );
}
