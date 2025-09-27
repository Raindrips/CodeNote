
export default class DateUtils {
  /**
   * 判断是否是新的一天
   * @param {Object|Number} dateValue 时间对象 todo MessageCenter 与 pve 相关的时间存储建议改为 Date 类型
   * @returns {boolean}
   */
  public static isNewDay(dateValue: any) {
    // todo：是否需要判断时区？
    var oldDate: any = new Date(dateValue);
    var curDate: any = new Date();

    //@ts-ignore
    var oldYear = oldDate.getYear();
    var oldMonth = oldDate.getMonth();
    var oldDay = oldDate.getDate();
    //@ts-ignore
    var curYear = curDate.getYear();
    var curMonth = curDate.getMonth();
    var curDay = curDate.getDate();

    if (curYear > oldYear) {
      return true;
    } else {
      if (curMonth > oldMonth) {
        return true;
      } else {
        if (curDay > oldDay) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * 判断当前时间是否在有效时间内
   * @param {String|Number} start 起始时间。带有时区信息
   * @param {String|Number} end 结束时间。带有时区信息
   */
  public static isNowValid(start: any, end: any) {
    var startTime = new Date(start);
    var endTime = new Date(end);
    var result = false;

    if (
      startTime.getDate() + '' !== 'NaN' &&
      endTime.getDate() + '' !== 'NaN'
    ) {
      var curDate = new Date();
      result = curDate < endTime && curDate > startTime;
    }

    return result;
  }

  /**
   * 返回相隔天数
   * @param start
   * @param end
   * @returns
   */
  public static getDeltaDays(start: any, end: any) {
    start = new Date(start);
    end = new Date(end);

    let startYear: number = start.getFullYear();
    let startMonth: number = start.getMonth() + 1;
    let startDate: number = start.getDate();
    let endYear: number = end.getFullYear();
    let endMonth: number = end.getMonth() + 1;
    let endDate: number = end.getDate();

    start = new Date(
      startYear + '/' + startMonth + '/' + startDate + ' GMT+0800'
    ).getTime();
    end = new Date(
      endYear + '/' + endMonth + '/' + endDate + ' GMT+0800'
    ).getTime();

    let deltaTime = end - start;
    return Math.floor(deltaTime / (24 * 60 * 60 * 1000));
  }

  /**
   * 根据剩余秒数格式化剩余时间 返回 HH:MM:SS
   * @param {Number} leftSec
   */
  public static formatTimeForSecond(
    leftSec: number,
    withoutSeconds: boolean = false
  ) {
    let timeStr: string = '';
    let sec: number = leftSec % 60;

    let leftMin: number = Math.floor(leftSec / 60);
    leftMin = leftMin < 0 ? 0 : leftMin;

    let hour: number = Math.floor(leftMin / 60);
    let min: number = leftMin % 60;

    if (hour > 0) {
      timeStr += hour > 9 ? hour.toString() : '0' + hour;
      timeStr += ':';
    } else {
      timeStr += '00:';
    }

    timeStr += min > 9 ? min.toString() : '0' + min;

    if (!withoutSeconds) {
      timeStr += ':';
      timeStr += sec > 9 ? sec.toString() : '0' + sec;
    }

    return timeStr;
  }

  /**
   *  根据剩余毫秒数格式化剩余时间 返回 HH:MM:SS
   *
   * @param {Number} ms
   */
  public static formatTimeForMillisecond(ms: number): Object {
    let second: number = Math.floor((ms / 1000) % 60);
    let minute: number = Math.floor((ms / 1000 / 60) % 60);
    let hour: number = Math.floor(ms / 1000 / 60 / 60);
    return { hour: hour, minute: minute, second: second };
  }

  /**
   * 获得开始和结束两者之间相隔分钟数
   *
   * @static
   * @param {number} start
   * @param {number} end
   * @memberof Util
   */
  public static getOffsetMimutes(start: number, end: number) {
    let offSetTime: number = end - start;
    let minute: number = Math.floor(
      (offSetTime % (1000 * 60 * 60)) / (1000 * 60)
    );
    return minute;
  }
}
