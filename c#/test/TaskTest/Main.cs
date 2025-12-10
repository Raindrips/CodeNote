using AsyncDemo;
using System.Threading.Tasks;
using TaskStatusDemo;
//await DownloadTest.Main();

var task = TaskStatusHelper.DoTestAsync();
TaskStatusHelper.MonitorTaskStatus(task);
//task.Wait();
await task;