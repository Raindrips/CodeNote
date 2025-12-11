const fs = require('fs');
const path = require('path');

// Mapping: Chinese -> English (target basename, without extension)
const map = {
    '领取': 'collect',
    '奖金游戏-1': 'feature buy',
    '奖金游戏': 'feature buy_s',
    '最后的免费旋转': 'freespin_last',
    '免费旋转': 'free spins',
    '剩余免费旋转': 'freespin_tip',
    '开始': 'start',
    '总赢-1': 'total_win',
    '赢': 'win',
    '总赢': 'win_2',
    '小赢': 'win_big',
    '中赢': 'win_mega',
    '大赢': 'win_super'
};

const langRoot = path.join(__dirname, '..', 'assets', 'game', 'language');

function walk(dir)
{
    try {
        return fs.readdirSync(dir, { withFileTypes: true });
    } catch (e) {
        return [];
    }
}

function replaceChinese2(name)
{
    // For each mapping key, replace occurrences in the filename (not touching extension)
    let newName = name;
    Object.keys(map).forEach(ch =>
    {
        if (newName.includes(ch)) {
            newName = newName.split(ch).join(map[ch]);
        }
    });
    return newName;
}

function replaceChinese(name)
{
    // Exact match only: if name exactly matches a key, return its mapped value
    // Otherwise, return the original name unchanged
    return map[name] || name;
}

function renameFile(oldPath, newPath)
{
    if (oldPath === newPath) return;
    if (fs.existsSync(newPath)) {
        console.warn(`Skipping rename because target exists: ${newPath}`);
        return;
    }
    try {
        fs.renameSync(oldPath, newPath);
        console.log(`Renamed: ${oldPath} -> ${newPath}`);
    } catch (e) {
        console.error(`Failed to rename ${oldPath} -> ${newPath}: ${e.message}`);
    }
}

function processTextureDir(textureDir)
{
    const entries = walk(textureDir);
    for (const e of entries) {
        if (!e.isFile()) continue;
        const oldName = e.name; // includes extension
        const ext = path.extname(oldName);
        const base = path.basename(oldName, ext);
        const replacedBase = replaceChinese(base);
        if (replacedBase !== base) {
            const newName = replacedBase + ext;
            const oldPath = path.join(textureDir, oldName);
            const newPath = path.join(textureDir, newName);
            renameFile(oldPath, newPath);
        }
    }
}

function main()
{
    if (!fs.existsSync(langRoot)) {
        console.error(`Language directory not found: ${langRoot}`);
        process.exit(1);
    }

    const langs = walk(langRoot).filter(d => d.isDirectory()).map(d => d.name);
    for (const lang of langs) {
        const textureDir = path.join(langRoot, lang, 'texture');
        if (!fs.existsSync(textureDir)) continue;
        console.log(`Processing ${textureDir}`);
        processTextureDir(textureDir);
    }
    console.log('Done.');
}

if (require.main === module) main();
