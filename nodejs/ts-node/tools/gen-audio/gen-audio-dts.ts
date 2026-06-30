import fs from 'fs';
import path from 'path';

function safeReadJSON(filePath: string) {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
}

function genDTS(json: { spritemap: {} }) {
    const map: Record<string, any> = json.spritemap || {};

    const keys = Object.keys(map);

    let spritemapStr = '';

    for (const key of keys) {
        const obj = map[key];
        spritemapStr += `        ${key}: {\n`;
        spritemapStr += `            start: ${obj.start},\n`;
        spritemapStr += `            end: ${obj.end},\n`;
        spritemapStr += `        },\n`;
    }

    return `
 export const data= {
    spritemap: {
${spritemapStr}    }
}
`;
}

function generate(filePath: string) {
    const json = safeReadJSON(filePath);
    const dts = genDTS(json);

    const outPath = filePath.replace('.json', '.ts');
    fs.writeFileSync(outPath, dts);

    console.log('[gen-dts] done:', outPath);
}

// ===== CLI =====
const target = process.argv[2];

if (!target) {
    console.error('Usage: node gen-audio-dts.js xxx.json');
    process.exit(1);
}

generate(path.resolve(target));
