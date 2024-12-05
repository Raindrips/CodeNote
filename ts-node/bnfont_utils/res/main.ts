import { parseFntData } from './bmfontParse';
import { generateFntContent } from './bmfontSave';
import { FntData } from './FntData';
import { readFile, writeFile } from './FileUtils';

async function main() {
    const path = process.argv[2];
    let data = await readFile(path);
    console.log(path, '\n', data);
    let fntData = parseFntData(data);
    formatData(fntData);
    let bmFont = generateFntContent(fntData);
    console.log(bmFont);
    await writeFile(path, bmFont);
    console.log('done');
}

function formatData(fntData: FntData) {
    let maxWidth = 0;
    for (const char of fntData.chars) {
        maxWidth = Math.max(char.width, maxWidth);
    }
    console.log('maxWidth', maxWidth);
    for (const char of fntData.chars) {
        if (char.id == '.'.charCodeAt(0) || char.id == ','.charCodeAt(0)) {
            continue;
        }
        char.xadvance = maxWidth;
        char.xoffset = maxWidth - char.width;
    }
}

main();
