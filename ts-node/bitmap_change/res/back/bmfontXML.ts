import * as fs from 'fs';
import * as path from 'path';
import { parseString } from 'xml2js';

const filePath = path.join(__dirname, 'path/to/your/font.fnt');

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    parseString(data, (parseErr, result) => {
        if (parseErr) {
            console.error('Error parsing XML:', parseErr);
            return;
        }

        const bmFontData = formatBMFont(result);
        console.log(bmFontData);
    });
});

function formatBMFont(bmFontData: any) {
    // 根据XML解析结果结构化和格式化数据
    const chars = bmFontData.font.chars[0].char.map((char: any) => {
        return {
            id: char.$.id,
            x: char.$.x,
            y: char.$.y,
            width: char.$.width,
            height: char.$.height,
            xoffset: char.$.xoffset,
            yoffset: char.$.yoffset,
            xadvance: char.$.xadvance
        };
    });

    return chars.map((char: any) => {
        return `Character ID: ${char.id}, Position: (${char.x}, ${char.y}), Size: (${char.width}x${char.height}), Offset: (${char.xoffset}, ${char.yoffset}), Advance: ${char.xadvance}`;
    }).join('\n');
}