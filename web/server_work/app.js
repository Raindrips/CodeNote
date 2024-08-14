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
          console.log("正在安装 Service worker ...");
        } else if (registration.waiting) {
          console.log("已安装 Service worker installed");
        } else if (registration.active) {
          console.log("激活 Service worker");
        }
      } catch (error) {
        console.error(`注册失败：${error}`);
      }
    }
  };

  async function addEvent()
  {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration =>
      {
        // 接收 Service Worker 的消息
        navigator.serviceWorker.addEventListener('message', event =>
        {
          console.log('Received message from Service Worker:', event.data);
        });
      });
    }
  }

  // unregister();
  registerServiceWorker();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controllerchange', () =>
    {
      console.log('reload');
      window.location.reload(); // Service Worker 切换时刷新页面
    });
  }

  // navigator.serviceWorker.getRegistrations().then(registrations => {
  //   registrations.forEach(registration => {
  //       registration.unregister(); // 注销所有旧的 Service Worker
  //   });
  // });

  setTimeout(() =>
  {
    navigator.serviceWorker.controller.postMessage({ a: '123', b: 100 })
  }, 5000)
})()
