
export const enum IHttpMethod {
    GET = 'get',
    POST = 'post',
}

export class HttpUtils {
    /**
     * 请求
     * @param url 链接
     * @param param 参数
     * @param callback 回调
     * @param method 方案
     * @param https 是否使用 https协议
     */
    public static request(
        url: string,
        param: Record<string,number>,
        callback: (data: any) => void,
        method: IHttpMethod = IHttpMethod.GET,
        https?: boolean,
    ): void {
        switch (method) {
            case IHttpMethod.GET:
                this.getRequest(url, param, callback);
                break;
            case IHttpMethod.POST:
                this.postRequest(url, param, callback);
                break;
        }
    }

    /**
     * GET
     * @param url 链接
     * @param param 参数
     * @param callback 回调
     * @param https 是否使用 https协议
     */
    private static getRequest(
        url: string,
        param: Record<string,number>,
        callback: (data: any) => void,
        https: boolean=false,
    ): void {
        let paramStr = HttpUtils.obj2String(param);
        url += paramStr;
        url = this.getUrl(url, https);
        console.log(`http send:${url}`);
        const request = new XMLHttpRequest();
        request.open(IHttpMethod.GET, url, true);
        this.setRequestHeader(request);
        request.onreadystatechange = () => {
            if (request.readyState == 4) {
                if (request.status >= 200 && request.status < 400) {
                    callback(request.responseText);
                } else {
                    console.log(
                        `url:(${url}) request error. status:(${request.status})`,
                    );
                    callback(null);
                }
            }
        };
        request.send();
    }

    /**
     * POST
     * @param url 链接
     * @param param 参数
     * @param callback 回调
     * @param https 是否使用 https协议
     */
    private static postRequest(
        url: string,
        param: Record<string,number>,
        callback: (data: any) => void,
        https: boolean=false,
    ): void {
        let paramStr = HttpUtils.obj2String(param);

        url = this.getUrl(url, https);
        console.log(`http send:${url}`);
        let request = new XMLHttpRequest();
        request.open(IHttpMethod.POST, url);
        this.setRequestHeader(request);
        request.onreadystatechange = () => {
            if (request.readyState == 4) {
                if (request.status >= 200 && request.status < 400) {
                    callback(request.responseText);
                } else {
                    console.log(`${url}请求失败:${request.status}`);
                    callback(null);
                }
            }
        };
        request.send(paramStr);
    }

    public static obj2String(param: Record<string,number>): string {
        let paramStr = '';
        if (param) {
            let s = '?';
            for (let key in param) {
                paramStr += `${s}${key}=${param[key]}`;
                s = '&';
            }
        }
        return paramStr;
    }

    /**
     * 设置http头
     * @param request XMLHttpRequest
     */
    private static setRequestHeader(request: XMLHttpRequest): void {
        request.setRequestHeader(
            'Content-Type',
            'text/plain;charset=UTF-8;application/x-www-form-urlencoded;application/json;charset=UTF-8',
        );
        request.setRequestHeader('Cache-Control', 'no-store');
    }

    /**
     * 获取请求链接
     * @param url 链接
     * @param https 是否使用 https协议
     * @returns {string}
     */
    private static getUrl(url: string, https: boolean): string {
        if (https) {
            if (url.indexOf('https') == -1) {
                url = url.replace('http', 'https');
            }
        }
        return url;
    }
}
