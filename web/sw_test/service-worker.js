// /* eslint-disable  */
let isDebug = false;
const urlList = [
  'index.html',
  'favicon.ico',
]

const versionDefault = "000001";
const cacheDefault = 'web_cache';

self.version = versionDefault;
self.cacheName = cacheDefault;

// 初始化缓存
async function initCacheData()
{
  await clearAllCaches();
  const cache = await caches.open(self.cacheName);
  await cache.addAll(urlList);
}

async function clearAllCaches()
{
  // 获取所有缓存的名称
  const cacheList = await caches.keys();

  // 删除所有缓存
  await Promise.all(
    cacheList.map(async cache =>
    {
      console.log(`Deleting cache: ${cache}`);
      await caches.delete(cache);
    })
  );
  console.log("All caches deleted.");
}

// 将第一次请求的内容进行缓存检测
async function fetchAndCache(event)
{
  try {
    // 从缓存中获取响应
    const responseFromCache = await caches.match(event.request, { cacheName: self.cacheName });
    if (responseFromCache) {
      log('using cache response', getFileName(responseFromCache.url));
      return responseFromCache;
    }

    // 如果缓存中没有响应，则从网络请求
    const responseFromNetwork = await fetch(event.request);
    putInCache(event.request, responseFromNetwork.clone());

    return responseFromNetwork;

  } catch (error) {
    console.error('Network error happened', error);

    return new Response('Network error happened', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}

async function putInCache(request, response)
{
  if (request.method !== "GET" || response.status !== 200) {
    return;
  }
  console.log(request, response);
  const cache = await caches.open(self.cacheName);
  await cache.put(request, response);
}

self.addEventListener('install', (event) =>
{
  log('install', urlList);
  // 跳过等待,立即激活新的sw
  self.skipWaiting();
  event.waitUntil(initCacheData());
});

self.addEventListener('activate', (event) =>
{
  log('activate:', event.url)
  // 新的 Service Worker 激活后立即接管页面
  self.clients.claim()
});

self.addEventListener('fetch', (event) =>
{
  event.respondWith(
    fetchAndCache(event)
  );
});

self.addEventListener('error', (ev) =>
{
  console.error(ev.message);
})

self.addEventListener('message', async (event) =>
{
  log("sw.message:", event.data);

  const message = event.data;
  switch (message.type) {
    case 'update':
      // if (self.version === versionDefault) {
      //   self.version = message.version;
      // }
      // else if (message.version !== self.version) {
      //   console.log('update before', self.cacheName);
      //   await clearAllCaches(self.cacheName);
      //   self.version = message.version;
      //   self.cacheName = cacheDefault + message.version;
      //   await initCacheData(self.cacheName)
      // }
      console.log('update', self.cacheName);
      break;

    case 'debug':
      isDebug = message.debug;
      break;
  }
})

/**
 * 获取文件名称
 * @param {string} str 
 * @returns 
 */
function getFileName(str)
{
  return str.substring(str.lastIndexOf('/'));
}

function log(...args)
{
  if (isDebug) {
    console.log(...args);
  }
}
