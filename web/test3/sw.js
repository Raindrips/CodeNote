
//添加缓存
const addResourcesToCache = async (resources) =>
{
    const cache = await caches.open(CacheName);
    console.log('open cache');
    await cache.addAll(resources);
};

//删除缓存 TODO TEST
deleteKey = async () =>
{
    const keyList = await caches.keys()
    let promise = [];
    for (let key of keyList) {
        if (key !== CacheName) {
            console.log('delete', key);
            promise.push(caches.delete(key));
        }
    }
    return Promise.all(promise);
}

// 添加进缓存
const putInCache = async (request, response) =>
{
    // const cache = await caches.open(CacheName);
    // await cache.put(request, response);
};

async function fetchAndCache(event)
{
    try {
        // 尝试从缓存中获取响应
        const cachedResponse = await caches.match(event.request);

        if (cachedResponse) {
            console.log('has cached response', cachedResponse);
            return cachedResponse;
        }

        // 如果缓存中没有响应，则从网络请求
        const networkResponse = await fetch(event.request);
        console.log('networkResponse', networkResponse);

        // 打开缓存并将新资源缓存起来
        putInCache(event.request, networkResponse.clone())

        return networkResponse;
    } catch (error) {
        // 如果发生错误，返回离线页面
        return await caches.match("/offline.html");
    }
}

const CacheName = 'my-cache-v1';
const OfflineUrl = [
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
]

self.addEventListener("install", (event) =>
{
    console.log("installing.", event);
    event.waitUntil(addResourcesToCache(OfflineUrl));
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

    console.log("fetching:", event.request.url);

    event.respondWith(
        fetchAndCache(event)
    );
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
