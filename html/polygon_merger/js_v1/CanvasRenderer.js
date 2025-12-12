    /**
         * Canvas渲染器 - 负责可视化
         */
        class CanvasRenderer {
            constructor(canvasId) {
                this.canvas = document.getElementById(canvasId);
                this.ctx = this.canvas.getContext('2d');
            }

            clear() {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }

            drawSquare(square, color = '#e0e0e0', strokeColor = '#999') {
                this.ctx.fillStyle = color;
                this.ctx.fillRect(square.x, square.y, square.size, square.size);
                this.ctx.strokeStyle = strokeColor;
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(square.x, square.y, square.size, square.size);
            }

            drawPolygon(points, strokeColor = '#ff0000', lineWidth = 3) {
                if (points.length < 2) return;

                this.ctx.beginPath();
                this.ctx.moveTo(points[0].x, points[0].y);
                
                for (let i = 1; i < points.length; i++) {
                    this.ctx.lineTo(points[i].x, points[i].y);
                }
                
                this.ctx.closePath();
                this.ctx.strokeStyle = strokeColor;
                this.ctx.lineWidth = lineWidth;
                this.ctx.stroke();
            }

            drawGrid(size, color = '#f5f5f5') {
                this.ctx.strokeStyle = color;
                this.ctx.lineWidth = 1;

                for (let x = 0; x < this.canvas.width; x += size) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(x, 0);
                    this.ctx.lineTo(x, this.canvas.height);
                    this.ctx.stroke();
                }

                for (let y = 0; y < this.canvas.height; y += size) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(0, y);
                    this.ctx.lineTo(this.canvas.width, y);
                    this.ctx.stroke();
                }
            }
        }
