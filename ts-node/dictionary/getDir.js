const fs = require('fs');
const path = require('path');

/**
 * 遍历指定路径下的所有文件，并根据文件名后缀进行筛选，返回相对路径的文件列表
 * @param {string} dir - 要遍历的目录路径
 * @param {string[]} extensions - 要筛选的文件后缀（如 ['.js', '.txt']）
 * @param {string} baseDir - 基准目录，用于计算相对路径
 * @param {string[]} [fileList] - 文件列表（递归时使用）
 * @returns {string[]} - 筛选后的相对路径文件数组
 */
function getFilesByExtension(dir, extensions, baseDir, fileList = [])
{
    const files = fs.readdirSync(dir);

    files.forEach((file) =>
    {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            // 如果是目录，递归遍历
            getFilesByExtension(filePath, extensions, baseDir, fileList);
        } else {
            // 如果是文件，检查文件后缀是否符合条件
            if (extensions.includes(path.extname(file))) {
                // 计算相对路径并加入列表
                const relativePath = path.relative(baseDir, filePath);
                let pathUnix = relativePath.replace(/\\/g, '/');
                fileList.push(pathUnix);
            }
        }
    });

    return fileList;
}

/**
 * 
 * @param {string} text 
 * @param {string} text 
 */
function fileWrite(path, text)
{
    console.log(path);
    fs.writeFileSync(path, text);
}
console.log(process.argv);
// 示例用法
let dirPath = process.argv[2];  // 通过命令传入路径
const extensions = ['.json', '.jpg', '.png','.mp3'];  // 你要筛选的文件后缀

const result = getFilesByExtension(dirPath, extensions, dirPath);
const data = JSON.stringify(result, undefined, " ");
const file = path.join(dirPath, 'cacheList.js');
fileWrite(file, `const CacheList=${data}`);