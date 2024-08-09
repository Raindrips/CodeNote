const http = require('http');
const fs = require('fs');
const path = require('path');

// 定义服务器的根目录
const rootDir = path.join(__dirname, 'public');

// 创建 HTTP 服务器
const server = http.createServer((req, res) =>
{
    console.log(req.url);
    // 解析请求的 URL 来确定要访问的文件
    let filePath = path.join(rootDir, req.url || '/');

    // 如果路径是目录，则默认返回 index.html
    if (fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html');
    }

    // 检查文件是否存在
    fs.exists(filePath, (exists) =>
    {
        if (exists) {
            // 读取文件内容并返回给客户端
            fs.readFile(filePath, (err, data) =>
            {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('500 Internal Server Error');
                    return;
                }

                // 设置正确的 MIME 类型（可以根据文件扩展名设置更多类型）
                let contentType = 'text/html';
                if (filePath.endsWith('.js')) contentType = 'application/javascript';
                if (filePath.endsWith('.css')) contentType = 'text/css';

                res.writeHead(200, { 'Content-Type': contentType });
                res.end(data);
            });
        } else {
            // 如果文件不存在，返回 404 错误
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
        }
    });
});

const port = 8800;
// 监听端口
server.listen(port, () =>
{
    console.log(`Server is running on http://localhost:${port}`);
});
