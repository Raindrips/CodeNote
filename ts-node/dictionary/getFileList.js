const fs = require('fs');
const path = require('path');

/**
 * 遍历指定路径下的所有文件，并根据文件名后缀进行筛选
 * @param {string} dir - 要遍历的目录路径
 * @param {string[]} extensions - 要筛选的文件后缀（如 ['.js', '.txt']）
 * @param {string[]} [fileList] - 文件列表（递归时使用）
 * @returns {string[]} - 筛选后的文件路径数组
 */
function getFilesByExtension(dir, extensions, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            // 如果是目录，递归遍历
            getFilesByExtension(filePath, extensions, fileList);
        } else {
            // 如果是文件，检查文件后缀是否符合条件
            if (extensions.includes(path.extname(file))) {
                fileList.push(file);
            }
        }
    });

    return fileList;
}

// 示例用法
const dirPath = 'D:/code/CCC/ServiceWork/build/web-mobile';  // 替换为你要遍历的目录路径
const extensions = ['.js', '.png'];  // 你要筛选的文件后缀

const result = getFilesByExtension(dirPath, extensions);
console.log('筛选后的文件列表:', result);