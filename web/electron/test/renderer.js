

const information = document.getElementById('info')
information.innerText = `Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), 和 Electron (v${versions.electron()})`


const func = async () =>
{
    const information = document.getElementById('info')

    const response = await window.versions.ping()
    information.innerText += response + '\n';
}

func()

// 获取按钮元素
const button = document.getElementById('btn-path');
// 添加点击事件
button.addEventListener('click', btnPath);

async function btnPath()
{
    const path = document.getElementById('dir-path');
    const path_value = path.value;
    information.innerText += path_value + '\n';
    await window.versions.openFilePathDialog();
}