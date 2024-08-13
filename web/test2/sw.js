
const addResourcesToCache = async (resources) =>
{
    const cache = await caches.open(CacheName);
    await cache.addAll(resources);
};

const putInCache = async (request, response) =>
{
    const cache = await caches.open("v1");
    await cache.put(request, response);
};

const CacheName = 'my-cache-v1';

const cacheFirst = async ({ request, preloadResponsePromise, fallbackUrl }) =>
{
    // 尝试获取缓存资源
    const responseFromCache = await caches.match(request);
    if (responseFromCache) {
        console.log('responseFromCache'.responseFromCache);
        return responseFromCache;
    }
    // 尝试使用预加载请求
    // const preloadResponse = await preloadResponsePromise;
    // if (preloadResponse) {
    //     console.info('using preload response', preloadResponse);
    //     putInCache(request, preloadResponse.clone());
    //     return preloadResponse;
    // }
    // 尝试从网络获取资源
    // try {
    //     const responseFromNetwork = await fetch(request);
    //     putInCache(request, responseFromNetwork.clone());
    //     return responseFromNetwork;
    // } catch (error) {
    //     const fallbackResponse = await caches.match(fallbackUrl);
    //     if (fallbackResponse) {
    //         return fallbackResponse;
    //     }
    //     // 当回落的响应也不可用时，返回错误
    //     return new Response("Network error happened", {
    //         status: 408,
    //         headers: { "Content-Type": "text/plain" },
    //     });
    // }
}

// self.serviceWorkerContainer.register();
self.addEventListener("install", (event) =>
{
    console.log("installing.", event);
    event.waitUntil(
        addResourcesToCache([
            "/",
            "/index.html",
            "/app.js",
            "/image-list.js",
            "/create.js",
            "/res/test.png",
            "/res/1.png",
            "/res/2.png",
            "/res/3.png",
            "/res/4.png",
            "/res/5.png",
        ])
    );
});

self.addEventListener("activate", (event) =>
{
    console.log('activate', event);
    // 清理旧缓存等操作
    event.waitUntil(
        caches.keys().then((keyList) =>
        {
            return Promise.all(
                keyList.map((key) =>
                {
                    if (key !== CacheName) {
                        console.log('delete', key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );
});

self.addEventListener("fetch", (event) =>
{
    console.log("fetching:", event);
    // event.respondWith(cacheFirst(event.request));
    // event.respondWith(cacheFirst({
    //     request: event.request,
    //     fallbackUrl: "/res/myLittleVader.jpg",
    // }));

    // event.respondWith(caches.match(event.request));

    // event.respondWith(

    //     caches
    //         .match(event.request)
    //         .then((response) =>
    //         {
    //             return response || fetch(event.request.url);
    //         })
    //         .catch(() =>
    //         {
    //             return caches.match("/offline.html");
    //         })
    // );
    // event.respondWith("/offline.html");
});

self.addEventListener("push", (event) =>
{
    console.log('push', event);
    console.log(
        "Push message received:",
        event.data.text()
    );
    // const options = {
    //     body: event.data.text(),
    //     icon: "/icon.png",
    //     badge: "/badge.png",
    // };
    // event.waitUntil(
    //     self.registration.showNotification(
    //         "Push Notification",
    //         options
    //     )
    // );
});

self.addEventListener("sync", (event) =>
{
    console.log('sync', event);
    if (event.tag === "sync-posts") {
        console.log("Syncing posts.");
        // event.waitUntil(syncPosts());
    }
});

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
