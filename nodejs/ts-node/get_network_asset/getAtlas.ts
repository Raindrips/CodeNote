import { writeTextFile } from "./fileCtrl/writeFile";


interface ImageInfo {
    rect: [number, number, number, number],
    name: string,
    offset: [number, number],
    originalSize: [number, number],
    capInsets: [number, number, number, number],
    rotated?: number
}

interface AtlasInfo {
    name: string,
    xy: [number, number],
    rotated: boolean,
    size: [number, number],
    orig: [number, number],
    offset: [number, number],
    index: number,
}

export function getAtlasList(url:string, arr: any[]) {
    let map: Map<string, AtlasInfo[]> = new Map();
    for (let i = 0; i < arr.length; i++) {
        // console.log(arr[i]);
        let [key, info] = getImageInfo(arr[i]);
        // console.log(key,info);
        if (map.has(key)) {
            let value: AtlasInfo[] = map.get(key) as AtlasInfo[];
            value.push(info);
            map.set(key, value);
        }else {
            map.set(key, [info]);
        }
    }

    for (let key of map.keys()) {
        let arr: AtlasInfo[] = map.get(key) as AtlasInfo[];
        // console.log(arr);
        console.log(key);
        let [x, y] = getMaxSize(arr);
        writeTextFile(url + key + ".atlas", getAtlasJson(arr, x, y));
    }
    
}

function getImageInfo(data: any[]): [string, AtlasInfo]  {
    for (let i = 0; i < data.length; i++) {
        let item: any = data[i];
        if (Array.isArray(item) && typeof item[0] == 'object') {
            // console.log(true);
            return analysisImageObj(item[0])
        }
    }
    return ['', null!];
}

function analysisImageObj(data: ImageInfo): [string, AtlasInfo] {
    let arr = data.name.split('_');
    let key: string = "";
    for (let i = 0; i < arr.length; i++) {
        if (isNaN(parseInt(arr[i]))) {
            key += arr[i];
        }
    }
    // console.log(data);
    let atlasInfo: AtlasInfo = {
        name: data.name,
        xy: [data.rect[0], data.rect[1]],
        rotated: data.rotated? true : false,
        size: [data.rect[2], data.rect[3]],
        orig: [data.originalSize[0], data.originalSize[1]],
        offset: [data.offset[0], data.offset[1]],
        index: -1
    }

    // let info: string =  
    // `${data.name}
    //     rotate: ${data.rotated ? true : false}
    //     xy: ${data.rect[0]}, ${data.rect[1]}
    //     size: ${data.rect[2]}, ${data.rect[3]}
    //     orig: ${data.originalSize[0]}, ${data.originalSize[1]}
    //     offset: ${data.offset[0]}, ${data.offset[1]}
    //     index: -1
    // `;

    return [key, atlasInfo];
    
}

function getAtlasJson(atlasList: AtlasInfo[], maxX: number, maxY: number) {
    let info: string =
`
size: ${maxX}, ${maxY}
format: RGBA8888
filter: Linear,Linear
repeat: none
`   

    for (let i = 0; i < atlasList.length; i++) {
        let item: AtlasInfo = atlasList[i];
        info += 
`${item.name}
  rotate: ${item.rotated}
  xy: ${item.xy[0]}, ${item.xy[1]}
  size: ${item.size[0]}, ${item.size[1]}
  orig: ${item.orig[0]}, ${item.orig[1]}
  offset: ${item.offset[0]}, ${item.offset[1]}
  index: -1
`;    
    }
    return info;
}


function getMaxSize(arr: AtlasInfo[]): [number, number] {
    let maxX: number = 0;
    let maxY: number = 0;
    
    for (let i = 0; i < arr.length; i++) {
        
        let item: AtlasInfo = arr[i];
        // console.log(item);
        let x: number = item.xy[0] + item.size[0];
        let y: number = item.xy[1] + item.size[1];
        // console.log(x, y);
        if (x > maxX) {
            maxX = x;
        }
        if (y > maxY) {
            maxY = y;
        }
    }
    return [maxX + 1, maxY + 1];
}

