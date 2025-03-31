const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

// const cors = require('cors');

// app.use(cors());  // 允许所有跨域请求
app.get('/api/data', (req, res) =>
{
    res.json({ message: "跨域请求成功！" });
});

app.get('/child.html', (req, res) =>
{
    res.sendFile(path.join(__dirname, 'child.html'));
})

app.get('/dist/MessagePipe.js', (req, res) =>
{
    res.sendFile(path.join(__dirname, '/dist/MessagePipe.js'));
})

app.listen(5000, () => console.log('Server running on port 5000'));
