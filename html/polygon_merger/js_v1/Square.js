/**
 * 正方形类
 */
class Square
{
    constructor(x, y, size)
    {
        this.x = x;
        this.y = y;
        this.size = size;
    }

    // 检查与另一个正方形是否相邻（有重叠边）
    isAdjacent(other)
    {
        const tolerance = 0.1; // 浮点数容差
        // 检查是否在同一行（y相同）且x方向相邻
        if (Math.abs(this.y - other.y) < tolerance) {
            if (Math.abs(this.x + this.size - other.x) < tolerance ||
                Math.abs(other.x + other.size - this.x) < tolerance) {
                return true;
            }
        }

        // 检查是否在同一列（x相同）且y方向相邻
        if (Math.abs(this.x - other.x) < tolerance) {
            if (Math.abs(this.y + this.size - other.y) < tolerance ||
                Math.abs(other.y + other.size - this.y) < tolerance) {
                return true;
            }
        }

        return false;
    }

    // 获取正方形的四个顶点
    getVertices()
    {
        return [
            { x: this.x, y: this.y },   //左上
            { x: this.x + this.size, y: this.y }, //右上
            { x: this.x + this.size, y: this.y + this.size }, //右下
            { x: this.x, y: this.y + this.size } //左下
        ];
    }
}
