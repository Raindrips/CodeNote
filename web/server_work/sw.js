const cacheList = [
  "/",
  "/index.html",
  "res/1.png",
  "res/3.png",
]

const PreLoadCacheName = "preload_100";
const CacheName = "load_100";

const cacheMap = {}

async function getCacheList(cacheName)
{
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  for (let request of keys) {
    cacheMap[request.url] = request;
  }
  console.log(cacheMap);
}

//添加缓存列表
async function addResourcesToCache(cacheName, resources)
{
  const cache = await caches.open(cacheName);
  //将url内容直接添加进缓存
  await cache.addAll(resources);
}

// 删除缓存列表
async function deleteKey()
{
  const keyList = await caches.keys();
  let promise = [];
  console.log('delete', keyList);
  for (let key of keyList) {
    if (key !== CacheName) {
      promise.push(caches.delete(key));
    }
  }
  return Promise.all(promise);
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
  const cache = await caches.open(CacheName);
  if (request.method == "GET") {
    await cache.put(request, response);
  }

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
      console.info('using preload response', preloadResponse);
      putInCache(event.request, preloadResponse.clone());
      return preloadResponse;
    }

    // 从缓存中获取响应
    const responseFromCache = await caches.match(event.request);
    if (responseFromCache) {
      console.info('using cache response', responseFromCache);
      return responseFromCache;
    }

    // 如果缓存中没有响应，则从网络请求
    const responseFromNetwork = await fetch(event.request);
    putInCache(event.request, responseFromNetwork.clone());

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

  return
};

self.addEventListener('install', (event) =>
{
  console.log('install');

  event.waitUntil(addResourcesToCache(PreLoadCacheName, cacheList));
});

self.addEventListener('fetch', (event) =>
{
  console.log('fetch', event.request.url)
  event.respondWith(
    fetchAndCache(event)
  );
});

self.addEventListener('activate', (event) =>
{
  console.log('activate:')
  getCacheList(CacheName);
  // event.waitUntil(deleteKey());
  event.waitUntil(enableNavigationPreload());
  event.waitUntil(self.clients.claim());
});

self.addEventListener("sync", (event) =>
{
  console.log('sync:');
  if (event.tag === "sync-posts") {
    console.log("Syncing posts.");
    event.waitUntil(syncPosts());
  }
});