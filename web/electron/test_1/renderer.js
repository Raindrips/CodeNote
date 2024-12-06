

const information = document.getElementById('info')
information.innerText = `Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), 和 Electron (v${versions.electron()})`


const func = async () =>
{
    const information = document.getElementById('info')

    const response = await window.versions.ping()
    console.log(response) // 打印 'pong'
    information.innerText += response + '\n';
}

func()