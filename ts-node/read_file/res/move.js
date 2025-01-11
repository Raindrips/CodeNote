const fs = require('fs');
const path = require('path');

// 复制文件或文件夹的函数
function copyFileOrFolder(source, destination)
{
    // 检查源路径的状态（是文件还是文件夹）
    const stat = fs.statSync(source);

    // 如果是文件夹，则递归复制文件夹
    if (stat.isDirectory()) {
        // 如果目标文件夹不存在，则创建
        if (!fs.existsSync(destination)) {
            fs.mkdirSync(destination, { recursive: true });
        }

        // 获取文件夹内的所有文件和子文件夹
        const items = fs.readdirSync(source);

        // 遍历文件夹中的每一项，递归调用复制
        items.forEach(item =>
        {
            const sourcePath = path.join(source, item);
            const destPath = path.join(destination, item);
            copyFileOrFolder(sourcePath, destPath);  // 递归复制
        });
    } else if (stat.isFile()) {
        // 如果是文件，直接复制文件
        fs.copyFileSync(source, destination);
    }
}


async function getCacheFileName()
{
    const path = '../../assets/resources/config.json';
    const json = fs.readFileSync(path, 'utf8');
    const data = JSON.parse(json);
    const name = data.config.version
    console.log('version name:', name);
    return name;
}
/**
 * 
 * @param {string} source 
 * @param {string} dir 
 */
async function copyFile(source, dir)
{
    let fileName = path.basename(source);
    let file = dir + fileName;
    // 使用 fs.copyFile 复制文件
    fs.copyFile(source, file, (err) =>
    {
        if (err) {
            console.error(`复制文件时出错: ${err.message}`);
            process.exit(1);
        }
        console.log(`文件已成功复制到: ${file}`);
    });
}

function main()
{
    // 获取命令行参数
    const args = process.argv.slice(2); // 去除前两个默认参数

    if (args.length < 2) {
        console.error('用法: node copyFile.js <source> <destination>');
        process.exit(1);
    }

    const sourcePath = args[0];
    const destinationPath = args[1];

    // 调用复制文件函数
    copyFileOrFolder(sourcePath, destinationPath);
}

main();
