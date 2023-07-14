import { readFile, writeFile, appendFile } from 'node:fs/promises';

export default function ErrorCodeDatabse( ) {

    let db;
    let log;

    const init = async ( ) => {
        db = await readFile('./error_codes.js', 'utf-8').then(JSON.parse);
    }
    
    const code = (error_code, detail) => {
        const error = queryCode(error_code);
        return logError( error, detail );
    }

    const logError = ( error, detail ) => {
        const error_string = `${error.code} - ${detail}`;
        appendFile('./error_log.txt', `${Date.now( )}: ${error_string}`);
        return error_string;
    }

    const queryCode = ( error_code ) => {
        const parts = error_code.split('_');
        const source  = db[parts[0]];
        const message = source ? source.sub_codes[parts[1]] : undefined;
        return { code: error_code, message: message }
    }

}