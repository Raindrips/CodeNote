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

        // 查找是否已经有LOADING了
        if (data.indexOf("LOADING") !== -1) {
            console.warn('LOADING 已存在')
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
        newData.replace('Cocos Creator | ', '');

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

const data = `
<!-- LOADING -->
<div id="loading" class="loading"
    style="position: absolute;z-index: 1;top: 0;left: 0; width: 100vw;height: 100vh;overflow: hidden;">
    <iframe src="loading.html" style="border: none;width: 100vw;height: 100vh;"></iframe>
  </div>
  <script>
    window.addEventListener('loadComplete', function (event) {
      deleteElement('loading');
    });
    function deleteElement(id) {
      var element = document.getElementById(id);
      if (element)
      {
        element.parentNode.removeChild(element);
      }
    }
  </script>
`

function main()
{
    const argv = process.argv.slice(2);
    if (argv.length < 1) {
        console.error('用法: node file_append.js <source>');
        process.exit(1);
    }
    appendFileText(argv[0], '<body>', data);
}

main();
