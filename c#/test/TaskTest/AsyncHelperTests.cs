using System;
using System.Threading.Tasks;

namespace AsyncDemo
{
    public class DownloadTest
    {
        /// <summary>
        /// 测试异步下载网页内容的函数
        /// </summary>
        public static async Task Main()
        {
            try
            {
                // 测试用例 1: 下载有效 URL 的内容
                string url = "https://httpbin.org/get";
                Console.WriteLine($"正在下载: {url}");
                string content = await AsyncHelper.DownloadWebContentAsync(url);
                Console.WriteLine($"下载内容长度: {content.Length} 字符");
                Console.WriteLine($"前 100 字符: {content.Substring(0, Math.Min(100, content.Length))}");

                // 测试用例 2: 无效 URL
                Console.WriteLine("\n测试无效 URL...");
                await AsyncHelper.DownloadWebContentAsync("https://invalid-url");
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine($"网络错误: {ex.Message}");
            }
            catch (ArgumentNullException ex)
            {
                Console.WriteLine($"参数错误: {ex.Message}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"未知错误: {ex.Message}");
            }

            Console.WriteLine("\n按任意键退出...");
            Console.ReadKey();
        }
    }
}