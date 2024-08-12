
const registerServiceWorker = async () =>
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

const unregister = function ()
{
  console.log('卸载service Worker')
  navigator.serviceWorker.getRegistrations().then(registrations =>
  {
    registrations.forEach(registration =>
    {
      registration.unregister().then(() =>
      {
        console.log('Service Worker unregistered:', registration.scope);
      });
    });
  });
}


// unregister();
console.log('注册serviceWorker开始');
registerServiceWorker();
