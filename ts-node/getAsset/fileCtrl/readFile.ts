import fs from 'fs';


export function readJsonFile(url: string, call: (err: NodeJS.ErrnoException | null, data: string) => void) {
    fs.readFile(url, 'utf8', call);
}