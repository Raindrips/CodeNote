(function () {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;

    canvas.style.border = '1px solid black';

    const ctx = canvas.getContext('2d');

    function draw() {
        if (!ctx) {
            console.error('无法获取 Canvas 2D 上下文');
            return;
        }

        ctx.fillStyle = 'red'; // 正方形填充颜色
        ctx.fillRect(100, 100, 100, 100); // 在 (100, 100) 位置绘制 100x100 的正方形
    }

    draw();
});
