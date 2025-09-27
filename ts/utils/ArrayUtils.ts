export default class ArrayUtils {
  /**
   * 洗牌函数
   *
   * @static
   * @param {*} arr
   * @returns
   * @memberof util
   */
  public static shuffle(arr: any) {
    if (Array.isArray(arr)) {
      let newArr: any = arr.concat();
      newArr.sort(() => {
        return 0.5 - Math.random();
      });
      return newArr;
    }
  }

  /**
   * 两个数值数组取相同的值，返回一个新数组
   *
   * @static
   * @param {number[]} arr1
   * @param {number[]} arr2
   * @returns
   * @memberof util
   */
  public static filterDifferentValue(arr1: number[], arr2: number[]) {
    let arr: number[] = [];
    arr = arr1.filter((item: number) => {
      return arr2.indexOf(item) !== -1;
    });

    return arr;
  }
}
