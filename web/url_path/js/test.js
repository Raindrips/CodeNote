(function ()
{
    'use strict';
    // 创建 URL 对象
    const url = new URL(window.location.href);

    // 获取各部分信息
    console.log('Protocol:', url.protocol); // "https:"
    console.log('Host:', url.host);         // "www.example.com:8080"
    console.log('Pathname:', url.pathname); // "/path/to/page"
    console.log('Search:', url.search);     // "?query=string"
    console.log('Hash:', url.hash);         // "#hash"

    // 获取查询参数的值
    const searchParams = url.searchParams;
    const paramValue = searchParams.get('paramName');
    console.log('Query Parameter "paramName":', paramValue);
}())

