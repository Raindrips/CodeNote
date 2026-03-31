export default class ObjectUtils {
  /**
   * !#zh 拷贝object。
   */
  /**
   * 深度拷贝
   * @param {any} sObj 拷贝的对象
   * @returns
   */
  public static clone(sObj: any) {
    if (sObj === null || typeof sObj !== 'object') {
      return sObj;
    }

    let s: { [key: string]: any } = {};
    if (sObj.constructor === Array) {
      s = [];
    }

    for (let i in sObj) {
      if (sObj.hasOwnProperty(i)) {
        s[i] = this.clone(sObj[i]);
      }
    }

    return s;
  }

  /**
   * 将object转化为数组
   * @param { any} srcObj
   * @returns
   */
  public static objectToArray(srcObj: { [key: string]: any }) {
    let resultArr: any[] = [];

    // to array
    for (let key in srcObj) {
      if (!srcObj.hasOwnProperty(key)) {
        continue;
      }

      resultArr.push(srcObj[key]);
    }

    return resultArr;
  }

  /**
   * !#zh 将数组转化为object。
   */
  /**
   * 将数组转化为object。
   * @param { any} srcObj
   * @param { string} objectKey
   * @returns
   */
  public static arrayToObject(srcObj: any, objectKey: string) {
    let resultObj: { [key: string]: any } = {};

    // to object
    for (var key in srcObj) {
      if (!srcObj.hasOwnProperty(key) || !srcObj[key][objectKey]) {
        continue;
      }

      resultObj[srcObj[key][objectKey]] = srcObj[key];
    }

    return resultObj;
  }

  /**
   * 判断传入的参数是否为空的Object。数组或undefined会返回false
   * @param obj
   */
  public static isEmptyObject(obj: any) {
    let result: boolean = true;
    if (obj && obj.constructor === Object) {
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          result = false;
          break;
        }
      }
    } else {
      result = false;
    }

    return result;
  }

  /**
   * 获取对象属性数量
   * @param {object}o 对象
   * @returns
   */
  public static getPropertyCount(o: Object) {
    var n,
      count = 0;
    for (n in o) {
      if (o.hasOwnProperty(n)) {
        count++;
      }
    }
    return count;
  }
}
