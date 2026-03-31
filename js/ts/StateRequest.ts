import { StateData } from "./StateData";

const MaxRequestCount = 1;
enum HttpApi {
    idle = 'idle'
}

type MapData = Map<HttpApi, StateData>;
class StateRequest {
    private dateCount: MapData;
    private tempSet: Set<MapData>;
    constructor() {
        this.dateCount = new Map<HttpApi, StateData>();

        this.tempSet = new Set<MapData>
    }

    private getCount() {
        let countSum = 0;
        for (const data of this.dateCount) {
            countSum += data[1].count;
        }

        return countSum;
    }

    error(httpApi: HttpApi, request: any, result: any, force: boolean = true) {
        const resultType = typeof result;
        this.getAndSet(httpApi);
        const data = this.dateCount.get(httpApi);
        if (!data) { return; }
        switch (resultType) {
            case 'object':
                data.addErrorException();
                break;

            case 'string':
                data.addErrorCode();
                break;

            default:
                //断网 请求超时等
                data.addFail();
                break;
        }
        this.checkRequest(force);
    }

    success(httpApi: HttpApi) {
        this.getAndSet(httpApi);
        const data = this.dateCount.get(httpApi);
        if (!data) { return; }
        data.addSuccess();
        this.checkRequest();
    }

    successByForce(httpApi: HttpApi) {
        const stateData = new StateData();
        stateData.addSuccess();
        const objData: { [key: string]: any } = {}
        objData[httpApi] = stateData.parseVal();
        this.requestData(objData, null);
    }

    reset() {
        this.tempSet.clear();
        this.dateCount.clear();
    }

    private checkRequest(force: boolean = false) {
        if (!force && this.getCount() < MaxRequestCount) return;

        const objData = this.mapToObjectCount();
       
        this.requestData(objData, this.dateCount);
        this.tempSet.add(this.dateCount);
        this.dateCount = new Map<HttpApi, StateData>();
    }

    private requestData(objData: any, data: MapData | null) {
        if (!data) { return }
        setTimeout(() => {
            this.requestSuccess(data, {})
        })
    }

    private requestSuccess(data: MapData | null, res: any) {

        if (!data) { return }
        console.log(this.tempSet.has(data));
        this.tempSet.delete(data);
        this.log();
    }

    private requestError(data: MapData | null, request: any, result: any) {
        if (!data || !this.tempSet.has(data)) { return }
        mergeMap(this.dateCount, data);
        this.tempSet.delete(data);
        this.log();
    }

    private getAndSet(httpApi: HttpApi) {
        if (!this.dateCount.has(httpApi)) {
            this.dateCount.set(httpApi, new StateData());
        }
    }



    private mapToObjectCount() {
        const obj: { [key: string]: any } = {}
        for (const pair of this.dateCount) {
            const [key, val] = pair;
            obj[key] = val.parseVal();
        }
        return obj;
    }

    private log() {
        console.log(this.dateCount);
        console.log(this.tempSet)
    }

}

//合并两个统计表
function mergeMap(a: MapData, b: MapData) {
    for (const data of b) {
        const [key, value] = data;
        if (!a.has(key)) {
            a.set(key, new StateData());
        }
        const sumData = a.get(key)!.addOther(value);
        a.set(key, sumData)
    }
    return a;
}

function cloneMap(m: MapData) {
    let newMap = new Map<HttpApi, StateData>();
    for (const pair of m) {
        const [key, val] = pair;
        newMap.set(key, val.clone());
    }
    return newMap;
}


export const stateRequest = new StateRequest();

function main() {
    stateRequest.success(HttpApi.idle);
    stateRequest.success(HttpApi.idle);
    stateRequest.success(HttpApi.idle);
}

main();