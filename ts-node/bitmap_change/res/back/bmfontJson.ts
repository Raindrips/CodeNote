import * as fs from 'fs';
import * as path from 'path';

const filepath='path/to/your/font.fnt'

// 定义BMFont的类型
interface BMFont {
    pages: string[];
    chars: Array<{
        id: number;
        x: number;
        y: number;
        width: number;
        height: number;
        xoffset: number;
        yoffset: number;
        xadvance: number;
        page: number;
        chnl: number;
    }>;
    kernings: Array<{
        first: number;
        second: number;
        amount: number;
    }>;
}

// 读取BMFont文件
const filePath = path.join(__dirname,filepath );

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    try {
        // 解析BMFont数据
        const bmFontData: BMFont = JSON.parse(data);

        // 格式化BMFont数据
        const formattedData = formatBMFont(bmFontData);

        console.log(formattedData);
    } catch (parseError) {
        console.error('Error parsing BMFont data:', parseError);
    }
});

// 格式化BMFont数据的函数
function formatBMFont(bmFontData: BMFont) {
    // 示例：将每个字符的信息格式化为一个字符串
    return bmFontData.chars.map(char => {
        return `Character ID: ${char.id}, Position: (${char.x}, ${char.y}), Size: (${char.width}x${char.height}), Offset: (${char.xoffset}, ${char.yoffset}), Advance: ${char.xadvance}`;
    }).join('\n');
}