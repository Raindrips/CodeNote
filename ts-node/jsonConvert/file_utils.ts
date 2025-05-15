import fs from 'fs';

export function readJsonFile(path: string) {
    let buf = fs.readFileSync(path);
    return buf;
}

export function saveJsonFile(text: string, path: string) {
    fs.writeFile(path, text, (err) => {
        if (err) {
            console.log('write error ' + err);
        }
        console.log(path);
    });
}
