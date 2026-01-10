using System;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using FrameSyncGameFramework.Demo.Console;

namespace FrameSyncGameFramework
{
    /// <summary>
    /// 主程序入口
    /// </summary>
    class Program
    {
        static async Task Main(string[] args)
        {
            // 配置依赖注入
            var services = ConfigureServices();
            var serviceProvider = services.BuildServiceProvider();
            
            // 创建并运行演示程序
            var demo = serviceProvider.GetRequiredService<FrameSyncDemo>();
            await demo.RunDemoAsync();
        }

        /// <summary>
        /// 配置服务
        /// </summary>
        private static IServiceCollection ConfigureServices()
        {
            var services = new ServiceCollection();
            
            // 配置日志
            services.AddLogging(builder =>
            {
                builder.AddConsole()
                       .SetMinimumLevel(LogLevel.Information);
            });
            
            // 注册演示程序
            services.AddSingleton<FrameSyncDemo>();
            
            return services;
        }
    }
}