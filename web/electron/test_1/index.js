const { app, BrowserWindow } = require('electron')

// 创建窗口实例
const createWindow = () =>
{
    const win = new BrowserWindow({
        width: 800,
        height: 600
    })

    win.loadFile('index.html')
}

// 监听事件并打开窗口
app.whenReady().then(() =>
{
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