"use strict";
/**
 * @version 0.1
 * @abstract 循环数据算法
 */
Object.defineProperty(exports, "__esModule", { value: true });
var CircleData = /** @class */ (function () {
    /**
     * @param size      元素大小
     * @param count     数组长度
     */
    function CircleData(size, count) {
        this.size = size;
        this.count = count;
        this._out = function (id, index) { };
        this.listSize = 0;
        this.distance = 0;
        this.offsetIndex = 0;
        this.listSize = this.size * (this.count - 1);
    }
    CircleData.prototype.init = function () {
        for (var i = 0; i < this.count; i++) {
            this._out(i, i);
        }
    };
    CircleData.prototype.in = function (distance) {
        this.distance = distance;
        var index = divideAdjust(distance, this.size);
        while (index != this.offsetIndex) {
            var moveCount = index - this.offsetIndex;
            if (moveCount > 0) {
                this.offsetIndex++;
                this.forward(this.offsetIndex);
            }
            else {
                this.offsetIndex--;
                this.backward(this.offsetIndex);
            }
        }
    };
    CircleData.prototype.out = function (fn, target) {
        this._out = fn.bind(target);
    };
    CircleData.prototype.forward = function (index) {
        var right = index + this.count - 1;
        var rIndex = right;
        var id = this.getId(rIndex);
        this._out(id, rIndex);
    };
    CircleData.prototype.backward = function (index) {
        var left = index - 1;
        var id = this.getId(left);
        this._out(id, left);
    };
    CircleData.prototype.getId = function (i) {
        return loopNumber(i, 0, this.count);
    };
    return CircleData;
}());
exports.default = CircleData;
// 计算循环范围
function loopNumber(val, min, max) {
    var range = max - min + 1;
    val = ((val - min) % range + range) % range + min;
    return val;
}
function divideAdjust(dividend, divisor) {
    if (divisor === 0) {
        return 0;
    }
    var quotient = (dividend / divisor) | 0;
    var remainder = dividend % divisor;
    if (remainder !== 0) {
        if ((dividend > 0 && divisor > 0) || (dividend < 0 && divisor < 0)) {
            return quotient + 1;
        }
        else {
            return quotient;
        }
    }
    return quotient;
}
