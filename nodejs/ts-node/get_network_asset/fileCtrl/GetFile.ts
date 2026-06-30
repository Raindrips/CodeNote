import * as fs from 'fs';
import * as path from 'path';

export function getFilesInDirectory(dirPath: string): string[] {
    return fs.readdirSync(dirPath).map(file => path.join(dirPath, file));
}
