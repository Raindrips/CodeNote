import fs from 'fs';
import path from 'path';

function walkMp3Files(dirPath: string): string[] {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    const result: string[] = [];

    for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        if (entry.isDirectory()) {
            result.push(...walkMp3Files(fullPath));
            continue;
        }

        // 只保留真正的 .mp3 文件，忽略 .mp3.meta 等文件
        if (entry.isFile() && entry.name.toLowerCase().endsWith('.mp3')) {
            result.push(fullPath);
        }
    }

    return result;
}

function isValidEnumMemberName(name: string): boolean {
    return /^[$A-Z_][0-9A-Z_$]*$/i.test(name);
}

function generate(dirPath: string) {
    if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
        throw new Error(`目录不存在或不是目录: ${dirPath}`);
    }

    const mp3Files = walkMp3Files(dirPath).sort((a, b) => a.localeCompare(b));
    const memberNames = mp3Files.map((filePath) => path.basename(filePath, '.mp3'));

    const validLines: string[] = [];
    const invalidLines: string[] = [];

    for (const name of memberNames) {
        if (isValidEnumMemberName(name)) {
            validLines.push(`  ${name},`);
        } else {
            invalidLines.push(`  // ${name},  //请修改名称`);
        }
    }

    const lines = [
        'export enum AudioList {',
        ...validLines,
        ...invalidLines,
        '}',
        ''
    ];

    const outPath = path.resolve(process.cwd(),'bin','AudioList.ts');
    fs.writeFileSync(outPath, lines.join('\n'), 'utf-8');
    console.log('[gen-audio-list] done:', outPath);
}

const target = process.argv[2];

if (!target) {
    console.error('Usage: node gen-audio-list.js <audio-directory>');
    process.exit(1);
}

generate(path.resolve(target));
