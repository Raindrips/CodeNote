const fs = require('fs');




/**
 * 
 * @param {string} filePath 
 * @param {string} tag 
 * @param {string} append 
 */
function appendFileText(filePath, tag, append)
{
    // 读取文件
    fs.readFile(filePath, 'utf8', (err, data) =>
    {

        if (err) {
            console.error('读取文件时出错:', err);
            return;
        }

        // 查找 <body> 出现的位置
        const bodyTagIndex = data.indexOf(tag);

        if (bodyTagIndex === -1) {
            console.error('<body> 标签未找到');
            return;
        }

        // 插入字符串 <h1>hello</h1> 在 <body> 之后
        const insertPosition = bodyTagIndex + tag.length;
        const newData = data.slice(0, insertPosition) + append + data.slice(insertPosition);

        // 将修改后的内容写回到文件
        fs.writeFile(filePath, newData, 'utf8', (err) =>
        {
            if (err) {
                console.error('写入文件时出错:', err);
                return;
            }
            console.log('文件更新成功');
        });
    });
}


function main()
{
    appendFileText('./index.html', '<body>', '<h1>Hello world</h1>')
}
main();
