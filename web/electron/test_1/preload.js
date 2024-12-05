const { contextBridge, ipcRenderer } = require('electron')

// 预加载脚本

const { contextBridge } = require('electron')

//通过versions全局对象暴露nodejs和chrome的版本信息
contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,

    // 我们可以通过ipcRenderer向主进程发送异步消息
    // 这里我们暴露一个ping函数，主进程可以通过window.versions.ping()调用它
    ping: () => ipcRenderer.invoke('ping')
    // 除函数之外，我们也可以暴露变量
})