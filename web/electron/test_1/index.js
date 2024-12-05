const { app, BrowserWindow,ipcMain  } = require('electron')

const path = require('node:path')


// 创建窗口实例
const createWindow = () =>
{
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        // 添加预加载脚本
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    win.loadFile('index.html')
}

// 监听事件并打开窗口
app.whenReady().then(() =>
{
    // 注册一个名为 'ping' 的 IPC 通道，用于在渲染进程和主进程之间进行通信
    ipcMain.handle('ping', () => 'pong')
    createWindow()

    //关闭所有窗口时退出应用 与事件
    app.on('window-all-closed', () =>
    {
        if (process.platform !== 'darwin') app.quit()
    })

    // 如果没有窗口打开则打开一个窗口
    app.on('activate', () =>
    {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    });
});