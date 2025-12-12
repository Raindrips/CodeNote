/**
     * 应用主类 - 协调各个组件
     */
class App
{
    constructor(canvasId, squareSize = 32)
    {
        this.renderer = new CanvasRenderer(canvasId);
        this.merger = new PolygonMerger();
        this.squareSize = squareSize;
        this.polygons = [];

        this.xLen = Math.floor(this.renderer.canvas.width / squareSize);
        this.yLen = Math.floor(this.renderer.canvas.height / squareSize)

        this.gridMap = new Array(this.yLen);
        for (let i = 0; i < this.gridMap.length; i++) {
            this.gridMap[i] = new Array(this.XLen).fill(0);
        }

        this.setupEventListeners();
        this.render();
    }

    setupEventListeners()
    {
        this.renderer.canvas.addEventListener('click', (e) =>
        {
            const rect = this.renderer.canvas.getBoundingClientRect();
            const cx = e.clientX - rect.left;
            const cy = e.clientY - rect.top;

            const x = Math.floor(cx / this.squareSize)
            const y = Math.floor(cy / this.squareSize)

            // 对齐到网格
            const gridX = x * this.squareSize;
            const gridY = y * this.squareSize;


            this.addSquare(gridX, gridY);
        });
    }

    addSquare(x, y)
    {
        const ix = Math.floor(x / this.squareSize)
        const iy = Math.floor(y / this.squareSize)
        if (this.gridMap[iy][ix] == 1) {
            return;
        }
        this.gridMap[iy][ix] = 1;
        const square = new Square(x, y, this.squareSize);
        this.merger.addSquare(square);
        this.polygons = []; // 清空之前的多边形
        this.render();
        this.updateInfo();
    }

    addRandomSquares()
    {
        const count = 5 + Math.floor(Math.random() * 5);
        for (let i = 0; i < count; i++) {
            const x = Math.floor(Math.random() * (this.renderer.canvas.width / this.squareSize)) * this.squareSize;
            const y = Math.floor(Math.random() * (this.renderer.canvas.height / this.squareSize)) * this.squareSize;
            const square = new Square(x, y, this.squareSize);
            this.merger.addSquare(square);
        }
        this.polygons = [];
        this.render();
        this.updateInfo();
    }

    mergeSquares()
    {
        this.polygons = this.merger.mergeAll();
        this.render();
        this.updateInfo();
    }

    render()
    {
        this.renderer.clear();
        this.renderer.drawGrid(this.squareSize);

        // 绘制正方形
        for (const square of this.merger.squares) {
            this.renderer.drawSquare(square);
        }

        // 绘制多边形轮廓
        for (const polygon of this.polygons) {
            this.renderer.drawPolygon(polygon);
        }
    }

    clear()
    {
        this.merger.clear();
        this.polygons = [];
        this.render();
        this.updateInfo();
        this.gridMap.forEach(g => g.fill(0))
    }

    updateInfo()
    {

        document.getElementById('squareCount').textContent = this.merger.squares.length;
        document.getElementById('polygonCount').textContent = this.polygons.length;
    }
}
