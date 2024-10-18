// 实例化 XMLHttpRequest
let xhr = new XMLHttpRequest()
// 定义加载完成回调函数，打印结果
xhr.onload = function (e)
{
    console.log('请求成功', e)
}
// 定义加载出错时的回调函数，打印错误
xhr.onerror = function (err)
{
    console.error('请求失败')
}
// 设置请求目标
xhr.open('GET', '/img/icon_1', true)
// 开始发起请求
xhr.send()
