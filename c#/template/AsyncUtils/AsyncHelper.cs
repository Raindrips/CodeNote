using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace AsyncDemo
{
    public static class AsyncHelper
    {
        /// <summary>
        /// 异步下载指定 URL 的网页内容
        /// </summary>
        /// <param name="url">要下载的网页 URL</param>
        /// <returns>网页内容的字符串</returns>
        /// <exception cref="HttpRequestException">当网络请求失败时抛出</exception>
        public static async Task<string> DownloadWebContentAsync(string url)
        {
            // 确保 URL 不为空
            if (string.IsNullOrEmpty(url))
            {
                throw new ArgumentNullException(nameof(url), "URL 不能为空");
            }

            // 使用 HttpClient 发起异步请求
            using var client = new HttpClient();
            try
            {
                // 异步获取网页内容
                string content = await client.GetStringAsync(url);
                return content;
            }
            catch (HttpRequestException ex)
            {
                // 捕获网络请求异常并抛出
                throw new HttpRequestException($"下载网页内容失败: {ex.Message}", ex);
            }
        }
    }
}