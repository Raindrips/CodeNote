const puppeteer = require('puppeteer');

(async () => {
    // 启动浏览器
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // 加载 HTML
    await page.setContent(`
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: lightblue;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                }
                .box {
                    width: 200px;
                    height: 200px;
                    background-color: coral;
                    border-radius: 15px;
                    text-align: center;
                    line-height: 200px;
                    color: white;
                }
            </style>
        </head>
        <body>
            <div class="box">Hello, World!</div>
        </body>
        </html>
    `);

    // 截图
    await page.screenshot({ path: 'output.png', fullPage: true });

    // 关闭浏览器
    await browser.close();
})();
