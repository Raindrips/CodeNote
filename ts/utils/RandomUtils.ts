export default class RandomUtil {
  /**
   * 获取随机整数
   * @param {Number} min 最小值
   * @param {Number} max 最大值
   * @returns
   */
  public static getRandomInt(min: number, max: number) {
    let r: number = Math.random();
    let rr: number = r * (max - min + 1) + min;
    return Math.floor(rr);
  }

  /**
   * 根据权重,计算随机内容
   * @param {arrany} weightArr
   * @param {number} totalWeight 权重
   * @returns
   */
  public static getWeightRandIndex(weightArr: [], totalWeight: number) {
    let randWeight: number = Math.floor(Math.random() * totalWeight);
    let sum: number = 0;
    for (
      var weightIndex: number = 0;
      weightIndex < weightArr.length;
      weightIndex++
    ) {
      sum += weightArr[weightIndex];
      if (randWeight < sum) {
        break;
      }
    }

    return weightIndex;
  }
  /**
   * 从n个数中获取m个随机数
   * @param {Number} n   总数
   * @param {Number} m    获取数
   * @returns {Array} array   获取数列
   */
  public static getRandomNFromM(n: number, m: number) {
    let array: any[] = [];
    let intRd: number = 0;
    let count: number = 0;

    while (count < m) {
      if (count >= n + 1) {
        break;
      }

      intRd = this.getRandomInt(0, n);
      var flag = 0;
      for (var i = 0; i < count; i++) {
        if (array[i] === intRd) {
          flag = 1;
          break;
        }
      }

      if (flag === 0) {
        array[count] = intRd;
        count++;
      }
    }

    return array;
  }

  /**
   * 获取随机数
   * @param {Number} min 最小值
   * @param {Number} max 最大值
   * @returns
   */
  public static getRandom(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  /**
   * 获取数组中随机一个元素
   * @param arr
   * @returns
   */
  public static getRandomItemFromArray(arr: any[]) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /**
   * 将数组内容进行随机排列
   * @param {Array}arr 需要被随机的数组
   * @returns
   */
  public static randArr(arr: number[]): number[] {
    let arrClone = arr.slice();
    // 首先从最大的数开始遍历，之后递减
    for (let i: number = arrClone.length - 1; i >= 0; i--) {
      // 随机索引值randomIndex是从0-arrClone.length中随机抽取的
      const randomIndex: number = Math.floor(Math.random() * (i + 1));
      // 下面三句相当于把从数组中随机抽取到的值与当前遍历的值互换位置
      const itemIndex: number = arrClone[randomIndex];
      arrClone[randomIndex] = arrClone[i];
      arrClone[i] = itemIndex;
    }
    // 每一次的遍历都相当于把从数组中随机抽取（不重复）的一个元素放到数组的最后面（索引顺序为：len-1,len-2,len-3......0）
    return arrClone;
  }

  /***
   * 返回随机方向
   */
  public static getRandomDirector() {
    let v = Math.random();
    return v > 0.5 ? 1 : -1;
  }
}
