export class URLParams {
    private url: string;
    private urlParams: URLSearchParams;

    constructor(url: string) {
        this.url = url;
        const urlObject = new URL(url);
        this.urlParams = urlObject.searchParams;
    }

    // 获取所有参数为对象形式
    getParams(): { [key: string]: string } {
        const paramsObj: { [key: string]: string } = {};
        this.urlParams.forEach((value, key) => {
            paramsObj[key] = value;
        });
        return paramsObj;
    }

    // 添加新的查询参数
    addParam(key: string, value: string): void {
        this.urlParams.append(key, value); // 使用 append 保证多个相同 key 时能够添加
    }

    // 获取某个参数
    getParam(key: string): string | null {
        return this.urlParams.get(key);
    }

    // 修改某个参数
    setParam(key: string, value: string): void {
        this.urlParams.set(key, value);
    }

    // 删除某个参数
    deleteParam(key: string): void {
        this.urlParams.delete(key);
    }

    // 将当前修改后的参数转换回查询字符串
    getUpdatedUrl(): string {
        const updatedUrl = new URL(this.url);
        updatedUrl.search = this.urlParams.toString();
        this.url=updatedUrl.toString();
        return this.url;
    }
}

function test() {
    // 示例
    const url = 'https://example.com:8080/?name=John&age=30&city=NewYork';
    console.log(url);
    const urlParams = new URLParams(url);

    // 获取所有参数
    console.log(urlParams.getParams());
    // { name: 'John', age: '30', city: 'NewYork' }

    // 获取单个参数
    console.log(urlParams.getParam('age')); // 30

    // 修改参数
    urlParams.setParam('age', '25');
    urlParams.setParam('name', 'Bob');
    console.log(urlParams.getUpdatedUrl());
    // https://example.com/?name=John&age=31&city=NewYork

    // 删除某个参数
    urlParams.deleteParam('city');
    console.log(urlParams.getUpdatedUrl());
    // https://example.com/?name=John&age=31

    // 添加参数
    urlParams.addParam('country', 'USA');
    console.log(urlParams.getUpdatedUrl());
    // https://example.com:8080/?name=John&age=31&country=USA
}

test();
