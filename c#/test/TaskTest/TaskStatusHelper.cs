using System;
using System.Threading;
using System.Threading.Tasks;

namespace TaskStatusDemo
{
    /// <summary>
    /// 封装异步操作并提供状态监控的工具类
    /// </summary>
    public static class TaskStatusHelper
    {
        /// <summary>
        /// 模拟一个可以成功、失败或取消的异步操作
        /// </summary>
        /// <param name="durationMs">模拟执行时间（毫秒）</param>
        /// <param name="shouldThrow">是否抛出异常</param>
        /// <param name="cancellationToken">取消令牌</param>
        /// <returns>返回执行结果</returns>
        public static async Task DoTestAsync(
            int durationMs = 3000,
            bool shouldThrow = false,
            CancellationToken cancellationToken = default)
        {
            Console.WriteLine($"[开始] 任务开始执行，预计耗时 {durationMs}ms");

            // 模拟耗时操作
            for (int i = 0; i < durationMs; i += 200)
            {
                cancellationToken.ThrowIfCancellationRequested(); // 检查是否取消
                await Task.Delay(200, cancellationToken);
            }

            if (shouldThrow)
                throw new InvalidOperationException("故意抛出的异常，模拟错误");

            //"任务成功完成！";
        }

        /// <summary>
        /// 实时监控 Task 的状态（轮询方式）
        /// </summary>
        public static void MonitorTaskStatus(Task task, string taskName = "任务")
        {
            if (task == null) throw new ArgumentNullException(nameof(task));

            Task.Run(async () =>
            {
                while (!task.IsCompleted) // IsCompleted 包括成功、失败、取消
                {
                    Console.WriteLine($"[{taskName}] 当前状态: {task.Status}");
                    await Task.Delay(500);
                }

                // 最终状态
                Console.WriteLine($"[{taskName}] 最终状态: {task.Status}");

                // 详细结果判断
                if (task.IsFaulted)
                    Console.WriteLine($"错误原因: {task.Exception?.GetBaseException().Message}");
                else if (task.IsCanceled)
                    Console.WriteLine("任务被取消");
                else if (task.IsCompletedSuccessfully) // .NET 6+ 推荐写法
                    Console.WriteLine("任务成功完成");
            });
        }
    }
}