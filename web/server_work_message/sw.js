
const SW_VERSION = "1.1.0";

const DEBUG = true;

let cacheList = ["/"];
let cacheName = "cache_test";

/**
 * @param {string} cacheName 
 */
async function getCacheMap(cacheName)
{
  let cacheMap = {}
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  for (let request of keys) {
    cacheMap[getFileName(request.url)] = request;
  }
  return cacheMap;
}

//将url列表内容直接添加进缓存
async function addResourcesToCache(cacheName, resources)
{
  const baseUrl = self.location.pathname; // 获取 Service Worker 作用域的根 URL
  const adjustedPaths = resources.map(file =>
  {
    return `${baseUrl}${file}`;
  });
  const cache = await caches.open(cacheName);
  await cache.addAll(resources);
}

/**
 * 向客户端发送事件
 * @param {string} msg 
 */
function postMessageToClient(msg)
{
  self.clients.matchAll().then((clients) =>
  {
    clients.forEach((client) =>
    {
      client.postMessage(msg);
    })
  })
}


// 删除缓存列表
async function deleteAllCache()
{
  const keyList = await caches.keys();
  let promise = [];

  for (let key of keyList) {
    if (key === CacheName) {
      return;
    }
    log('delete', key);
    promise.push(caches.delete(key));

  }
  return Promise.all(promise);
}

//对比旧缓存,删除缓存列表中无效的内容
async function deleteOldCacheByRequest(cacheName, cacheList)
{
  let catchListObj = {}
  for (let c of cacheList) {
    catchListObj[getFileName(c)] = c;
  }
  let cacheMap = await getCacheMap(cacheName);
  log(catchListObj, cacheMap);
  for (const url in cacheMap) {
    if (catchListObj[url]) {
      return
    }
    deleteRequest(cacheName, cacheMap[url]);
  }
}

// 删除缓存中的一个请求
async function deleteRequest(cacheName, request)
{
  const cache = await caches.open(cacheName);
  await cache.delete(request)
}

//将请求的数据添加进缓存
async function putInCache(request, response) 
{
  // const cache = await caches.open(cacheName);
  // if (request.method.toLocaleUpperCase() != "GET") {
  //   return
  // }
  // await cache.put(request, response);
};

function syncPosts()
{
  return idbKeyval.get("posts").then((posts) =>
  {
    return Promise.all(
      posts.map((post) =>
      {
        return fetch("/api/posts", {
          method: "POST",
          body: JSON.stringify(post),
          headers: {
            "Content-Type":
              "application/json",
          },
        }).then(() =>
        {
          // 移除已同步的 post
          idbKeyval.del("posts", post.id);
        });
      })
    );
  });
}

// 将第一次请求的内容进行缓存检测
async function fetchAndCache(event)
{
  try {
    //从预加载中获取响应
    const preloadResponse = await event.preloadResponse;
    if (preloadResponse) {
      console.info('using preload response', preloadResponse.url);
      putInCache(event.request, preloadResponse.clone());
      return preloadResponse;
    }

    // 从缓存中获取响应
    const responseFromCache = await caches.match(event.request);
    if (responseFromCache) {
      console.info('using cache response', responseFromCache.url);
      return responseFromCache;
    }

    // 如果缓存中没有响应，则从网络请求
    const responseFromNetwork = await fetch(event.request);
    // log('fetch', event.request.url);
    // putInCache(event.request, responseFromNetwork.clone());

    return responseFromNetwork;

  } catch (error) {
    console.error('Network error happened', error)
    return new Response('Network error happened', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}

async function enableNavigationPreload()
{
  if (self.registration.navigationPreload) {
    await self.registration.navigationPreload.enable();
  }
};

self.addEventListener('install', (event) =>
{
  log('install', SW_VERSION);
  // 跳过等待,立即激活新的sw
  self.skipWaiting();

});

self.addEventListener('activate', (event) =>
{
  log('activate:')
  //新的 Service Worker 激活后立即接管页面
  self.clients.claim()
  event.waitUntil(enableNavigationPreload());

});

self.addEventListener('fetch', (event) =>
{
  event.respondWith(
    fetchAndCache(event)
  );
});

self.addEventListener("sync", (event) =>
{
  log('sync:');
  if (event.tag === "sync-posts") {
    log("Syncing posts.");
    event.waitUntil(syncPosts());
  }
});

self.addEventListener('error', (ev) =>
{
  console.error(ev.message);
})

//navigator.serviceWorker.controller.postMessage()

self.addEventListener('message', (event) =>
{
  log("sw.message:", event.data);
  const message = event.data;
  switch (message.type) {
    case 'cacheData':
      cacheName = message.data.cacheName ?? "cache_test";
      cacheList = message.data.cacheList ?? ["/"];
      event.waitUntil(deleteOldCacheByRequest(cacheName, cacheList));
      event.waitUntil(addResourcesToCache(cacheName, cacheList));
      break;
    case 'test':
      postMessageToClient({ type: 'test', data: { test: 'test' } });
      break;
  }
});

/**
 * 判断是否有相等的子串
 * @param {string}  subStr1
 * @param {string}  subStr2
 * @returns {boolean} 
 */
function matchString(subStr1, subStr2)
{
  if (subStr1.length > subStr2.length) {
    return subStr1.endsWith(subStr2);
  }
  else {
    return subStr2.endsWith(subStr1);
  }
}

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
  if (DEBUG) {
    console.log(...args);
  }
}

const mh = /(.*\.png$)|(.*\.jpg$)|(.*\.json$)/g
