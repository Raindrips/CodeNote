// 获取完整的 URL
const fullUrl = window.location.href;
console.log('Full URL:', fullUrl);

// 获取路径部分（不包括域名、查询参数和哈希）
const path = window.location.pathname;
console.log('Path:', path);

// 获取查询字符串（以 ? 开头的部分）
const queryString = window.location.search;
console.log('Query String:', queryString);

// 获取哈希（以 # 开头的部分）
const hash = window.location.hash;
console.log('Hash:', hash);

// 获取主机名（包括端口号）
const host = window.location.host;
console.log('Host:', host);

// 获取协议（如 http 或 https）
const protocol = window.location.protocol;
console.log('Protocol:', protocol);