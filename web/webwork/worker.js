self.onmessage = function(event) {
  const data = event.data;
  // 执行一些耗时操作
  let result = 0;
  for (let i = 0; i < data; i++) {
      result += i;
  }
  // 将结果发送回主线程
  self.postMessage(result);
};