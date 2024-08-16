(function ()
{
  //注册ServiceWorker
  async function registerServiceWorker()
  {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register(
          'sw.js', { scope: './', }
        );
        if (registration.installing) {
          console.log("安装 Service worker");
        } else if (registration.waiting) {
          console.log("已安装 Service worker installed");
        } else if (registration.active) {
          console.log("激活 Service worker");
          sendMessage();
        }
        console.log("注册 Service worker 成功");
      } catch (error) {
        console.error(`注册失败：${error}`);
      }
    }
  };

  async function addEvent()
  {
    if ('serviceWorker' in navigator) {
      // 接收 Service Worker 的消息
      navigator.serviceWorker.addEventListener('message', event =>
      {
        console.log('message:', event);
      });
    }
  }

  // 注销 Service Worker
  function unregister()
  {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations =>
      {
        registrations.forEach(registration =>
        {
          registration.unregister(); // 注销所有旧的 Service Worker
        });
      });
    }
  }

  // 刷新页面
  function controllerChangeEvent()
  {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () =>
      {
        console.log('reload');
        // window.location.reload(); // Service Worker 切换时刷新页面
        sendMessage();
      });
    }
  }

  function sendMessage()
  {
    if ('serviceWorker' in navigator) {
      if (!navigator.serviceWorker.controller) {
        console.log('no controller');
        return;
      }
      navigator.serviceWorker.controller.postMessage({
        type: 'cacheData', data: {
          cacheList: CacheList,
          cacheName: CacheName
        }
      })
    }
  }

  registerServiceWorker();
  controllerChangeEvent();
  // setTimeout(() =>
  // {
  //   navigator.serviceWorker.controller.postMessage({ type: 'test', data: {} })
  // }, 5000);
})()
