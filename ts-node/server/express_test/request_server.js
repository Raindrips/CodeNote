const express = require('express');
// const cors = require('cors'); 

const app = express();

// app.use(cors()); // 允许所有跨域请求
app.use(express.json());

// 登录接口
app.post('/api/login', (req, res) =>
{
    const { id, password } = req.body;
    // 假设正确账号为 admin，密码为 123456
    if (id === 'admin' && password === '123456') {
        res.json({ info: '登录成功' });
    } else {
        res.json({ info: '登录失败' });
    }

});

// 字符串转 base64 接口
app.get('/api/base64', (req, res) =>
{
    const { str } = req.query;
    if (typeof str === 'string') {
        const base64 = Buffer.from(str).toString('base64');
        res.json({ base64 });
    } else {
        res.json({ error: '请传入参数 str' });
    }
});

// GET 请求
app.get('/api/get', (req, res) =>
{
    console.log('收到 get请求', req.query);
    //返回数据
    res.json({ message: '这是 GET 请求返回的 JSON 数据', params: req.query });
});

// POST 请求
app.post('/api/post', (req, res) =>
{
    console.log('收到 post请求', req.body);
    //返回数据
    res.json({ message: '这是 POST 请求返回的 JSON 数据', body: req.body, });
});

// 接口说明
app.get('/api/help', (req, res) =>
{
    res.json({
        info: '接口使用说明',
        get: {
            url: '/api/get?name=xxx&age=xxx',
            method: 'GET',
            params: 'name, age 等任意参数'
        },
        post: {
            url: '/api/post',
            method: 'POST',
            body: '{ "name": "xxx", "age": xxx }'
        },
        login: {
            url: '/api/login',
            method: 'POST',
            body: '{ "id": "admin", "password": "123456" }'
        },
        base64: {
            url: '/api/base64?str=要转换的字符串',
            method: 'GET',
            params: 'str: 需要转换的字符串'
        }
    });
});

app.listen(12000, () =>
{
    console.log('服务器运行于 http://127.0.0.1:12000/');
});