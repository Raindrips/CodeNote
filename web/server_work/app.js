
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
