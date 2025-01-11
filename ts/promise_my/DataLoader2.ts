namespace Preload {
    class DataLoader {
        loadingPromise: Promise<any> | null = null;

        // 模拟网络请求，随机延迟
        private async fetchData(url: string, delay: number): Promise<any> {
            console.log(`Loading ${url}...`);
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(`Data for ${url} (loaded in ${delay}ms)`);
                }, delay * 1000);
            });
        }

        // 预加载单条数据，不返回数据
        public preload(url: string, delay: number): void {
            this.loadingPromise = this.fetchData(url, delay).then(
                (data) => {
                    this.loadingPromise = null;
                    return data;
                },
            );
        }

        // 加载单条数据，返回数据或返回正在加载的 Promise
        public async load(url: string): Promise<any> {
            let req;
            if (this.loadingPromise) {
                console.log('使用预加载');
                req = this.loadingPromise;
                this.loadingPromise = null;
            } else {
                console.log('直接请求');
                req = this.fetchData(url, 1);
            }
            return req;
        }
    }

    // 测试代码
    const dataLoader = new DataLoader();

    // 预加载数据
    dataLoader.preload('asset1', 3);
    // // 加载数据（如果数据正在加载，则返回 Promise）
    dataLoader.load('asset1').then((data) => {
        console.log('Loaded asset1:', data);
    });

    // 延时加载数据
    setTimeout(() => {
        dataLoader.load('asset2').then((data) => {
            console.log('Loaded asset2:', data); // 应该直接返回之前的结果
        });
    }, 2000);
    setTimeout(() => {
        dataLoader.load('asset3').then((data) => {
            console.log('Loaded asset3:', data); // 应该直接返回之前的结果
        });
    }, 2200);

    // dataLoader.preload('asset2', 2);

    // dataLoader.load('asset2', 1).then((data) => {
    //     console.log('Loaded asset2:', data);
    // });
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
