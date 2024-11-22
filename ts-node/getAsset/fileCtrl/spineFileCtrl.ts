export function checkSpineFile(arr: any[]): boolean { 
    for (let i = 0; i < arr.length; i++) {
        if (Array.isArray(arr[i])) {
            if (checkSpineFile(arr[i])) {
                return true;
            }
        }else {
            if (arr[i] == "sp.SkeletonData") {
                return true;
            }
        }
    }

    return false;
}

export function getSpineData(arr: any[]): any[] {

    for (let i = 0; i < arr.length; i++) {
        let item: any = arr[i];
        if (Array.isArray(item)) {
            if (checkSpineData(item)) {
                return item;
            }else {
                let data: any[] = getSpineData(item);
                if (data.length > 0) {
                    return data;
                }
            }
        }
    }
    return []

}

export function checkSpineData(arr: any[]): boolean {

    for (let i = 0; i < arr.length; i++) {
        let item: any = arr[i];
        if (!Array.isArray(item) && typeof item == "object") {
            for (let key in item) {
                if (key == "skeleton") {
                    return true;
                }
            }
        }
    }
    return false
}

export function getSpineJsonData(arr: any[]): string {
    for (let i = 0; i < arr.length; i++) {
        let item: any = arr[i];
        if (!Array.isArray(item) && typeof item == "object") {
            for (let key in item) {
                if (key == "skeleton") {
                    return item;
                }
            }
        }
    }
    return ""
}

export function getSpineAtlasData(arr: any[]): string {

    for(let i = 0; i < arr.length; i++) {
        let item: any = arr[i];
        if (typeof item == "string") {
            if (item.includes("size") && item.includes("format") && item.includes("filter") && item.includes("repeat")) {
                let arr = item.split('"');
                // item = arr.join("");
                return arr[0];
            }
        
        }
    }
    return ""
}