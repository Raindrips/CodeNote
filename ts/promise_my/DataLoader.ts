namespace Preload {
    class DataLoader {
        private loadingMap: Map<string, Promise<any>> = new Map();
        private dataMap: Map<string, any> = new Map();

        // 模拟网络请求，随机延迟
        private async fetchData(url: string): Promise<any> {
            const delay = Math.floor(Math.random() * 3000) + 1000; // 随机延迟1到3秒
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(`Data for ${url} (loaded in ${delay}ms)`);
                }, delay);
            });
        }

        // 预加载单条数据，不返回数据
        public preload(url: string): void {
            if (this.dataMap.has(url)) {
                return; // 如果已经加载过，直接返回
            }

            const loadingPromise = this.fetchData(url).then((data) => {
                this.dataMap.set(url, data);
                this.loadingMap.delete(url); // 清理
                return data;
            })

            this.loadingMap.set(url, loadingPromise); // 存储加载中的 Promise
        }

        // 加载单条数据，返回数据或返回正在加载的 Promise
        public async load(url: string): Promise<any> {
            if (this.dataMap.has(url)) {
                return this.dataMap.get(url); // 如果数据已加载，直接返回
            }

            if (this.loadingMap.has(url)) {
                return this.loadingMap.get(url); // 如果正在加载中，返回加载中的 Promise
            }

            const loadingPromise = this.fetchData(url).then((data) => {
                this.dataMap.set(url, data); // 保存加载的结果
                this.loadingMap.delete(url); // 清理
                return data;
            });

            this.loadingMap.set(url, loadingPromise); // 存储加载中的 Promise
            return loadingPromise; // 返回正在加载的 Promise
        }
    }

    // 测试代码
    const dataLoader = new DataLoader();

    // 预加载数据
    dataLoader.preload('asset1');
    dataLoader.preload('asset2');

    // 加载数据（如果数据正在加载，则返回 Promise）
    dataLoader.load('asset1').then((data) => {
        console.log('Loaded asset1:', data);
    });

    dataLoader.load('asset2').then((data) => {
        console.log('Loaded asset2:', data);
    });

    // 直接加载已经加载好的数据
    setTimeout(() => {
        dataLoader.load('asset1').then((data) => {
            console.log('Loaded asset1 again:', data); // 应该直接返回之前的结果
        });
    }, 5000);
}
/**
   * 需求分析：
预加载单条数据：预加载数据时，不需要返回任何内容，数据将在后台加载。
直接加载数据：直接加载时，返回一个异步的数据。如果数据已经加载成功，则直接返回已加载的结果；如果正在加载，则返回一个正在加载的 Promise，确保加载完成后能够清理。
设计思路：
使用一个 Map 来记录每个数据的加载状态和加载结果。
对于每个数据，维护三种状态：
已加载：数据已经加载完成。
正在加载：数据正在加载中。
未加载：数据尚未加载。
对于预加载数据，不返回结果，仅仅触发加载。
对于直接加载数据，如果数据已经加载，直接返回结果；如果正在加载，返回正在加载的 Promise。
   */
