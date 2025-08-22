/**
 * 图表组件JavaScript
 * 使用Canvas API创建简单的图表组件
 */

/**
 * 初始化图表
 */
function initChart() {
    console.log('初始化图表组件...');
    
    // 初始化所有图表
    document.querySelectorAll('.chart').forEach(chartElement => {
        const type = chartElement.getAttribute('data-chart-type');
        const dataAttr = chartElement.getAttribute('data-chart-data');
        
        if (type && dataAttr) {
            try {
                const data = JSON.parse(dataAttr);
                new Chart(chartElement, { type, data });
            } catch (e) {
                console.error('图表数据解析失败:', e);
            }
        }
    });
}

/**
 * 图表基类
 */
class Chart {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            type: 'line',
            data: {
                labels: [],
                datasets: []
            },
            width: 400,
            height: 300,
            responsive: true,
            colors: ['#007bff', '#28a745', '#ffc107', '#dc3545', '#6f42c1', '#fd7e14'],
            ...options
        };
        
        this.canvas = null;
        this.ctx = null;
        this.chartArea = { x: 60, y: 20, width: 0, height: 0 };
        
        this.init();
    }
    
    init() {
        this.createCanvas();
        this.setupResponsive();
        this.render();
    }
    
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.options.width;
        this.canvas.height = this.options.height;
        this.canvas.style.maxWidth = '100%';
        this.canvas.style.height = 'auto';
        
        this.container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        // 计算图表区域
        this.chartArea.width = this.canvas.width - this.chartArea.x - 20;
        this.chartArea.height = this.canvas.height - this.chartArea.y - 60;
    }
    
    setupResponsive() {
        if (!this.options.responsive) return;
        
        const resizeObserver = new ResizeObserver(() => {
            this.resize();
        });
        
        resizeObserver.observe(this.container);
    }
    
    resize() {
        const containerWidth = this.container.clientWidth;
        const aspectRatio = this.options.height / this.options.width;
        
        this.canvas.width = containerWidth;
        this.canvas.height = containerWidth * aspectRatio;
        
        this.chartArea.width = this.canvas.width - this.chartArea.x - 20;
        this.chartArea.height = this.canvas.height - this.chartArea.y - 60;
        
        this.render();
    }
    
    render() {
        this.clear();
        
        switch (this.options.type) {
            case 'line':
                this.renderLineChart();
                break;
            case 'bar':
                this.renderBarChart();
                break;
            case 'pie':
                this.renderPieChart();
                break;
            case 'doughnut':
                this.renderDoughnutChart();
                break;
            default:
                console.warn('不支持的图表类型:', this.options.type);
        }
    }
    
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    renderLineChart() {
        const { data } = this.options;
        if (!data.labels || !data.datasets) return;
        
        this.drawAxes();
        this.drawLabels();
        
        data.datasets.forEach((dataset, datasetIndex) => {
            const color = dataset.borderColor || this.options.colors[datasetIndex % this.options.colors.length];
            this.drawLine(dataset.data, color, dataset.label);
        });
        
        this.drawLegend();
    }
    
    renderBarChart() {
        const { data } = this.options;
        if (!data.labels || !data.datasets) return;
        
        this.drawAxes();
        this.drawLabels();
        
        const barWidth = this.chartArea.width / data.labels.length * 0.8;
        const barSpacing = this.chartArea.width / data.labels.length * 0.2;
        
        data.datasets.forEach((dataset, datasetIndex) => {
            const color = dataset.backgroundColor || this.options.colors[datasetIndex % this.options.colors.length];
            this.drawBars(dataset.data, color, barWidth, barSpacing, datasetIndex, data.datasets.length);
        });
        
        this.drawLegend();
    }
    
    renderPieChart() {
        const { data } = this.options;
        if (!data.labels || !data.datasets || !data.datasets[0]) return;
        
        const dataset = data.datasets[0];
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = Math.min(this.canvas.width, this.canvas.height) / 3;
        
        this.drawPie(dataset.data, data.labels, centerX, centerY, radius);
        this.drawLegend();
    }
    
    renderDoughnutChart() {
        const { data } = this.options;
        if (!data.labels || !data.datasets || !data.datasets[0]) return;
        
        const dataset = data.datasets[0];
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const outerRadius = Math.min(this.canvas.width, this.canvas.height) / 3;
        const innerRadius = outerRadius * 0.6;
        
        this.drawDoughnut(dataset.data, data.labels, centerX, centerY, outerRadius, innerRadius);
        this.drawLegend();
    }
    
    drawAxes() {
        this.ctx.strokeStyle = '#dee2e6';
        this.ctx.lineWidth = 1;
        
        // Y轴
        this.ctx.beginPath();
        this.ctx.moveTo(this.chartArea.x, this.chartArea.y);
        this.ctx.lineTo(this.chartArea.x, this.chartArea.y + this.chartArea.height);
        this.ctx.stroke();
        
        // X轴
        this.ctx.beginPath();
        this.ctx.moveTo(this.chartArea.x, this.chartArea.y + this.chartArea.height);
        this.ctx.lineTo(this.chartArea.x + this.chartArea.width, this.chartArea.y + this.chartArea.height);
        this.ctx.stroke();
    }
    
    drawLabels() {
        const { data } = this.options;
        this.ctx.fillStyle = '#6c757d';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        
        // X轴标签
        data.labels.forEach((label, index) => {
            const x = this.chartArea.x + (index + 0.5) * (this.chartArea.width / data.labels.length);
            const y = this.chartArea.y + this.chartArea.height + 20;
            this.ctx.fillText(label, x, y);
        });
        
        // Y轴标签
        const maxValue = this.getMaxValue();
        const steps = 5;
        this.ctx.textAlign = 'right';
        
        for (let i = 0; i <= steps; i++) {
            const value = (maxValue / steps) * i;
            const y = this.chartArea.y + this.chartArea.height - (i / steps) * this.chartArea.height;
            this.ctx.fillText(Math.round(value), this.chartArea.x - 10, y + 4);
        }
    }
    
    drawLine(data, color, label) {
        const maxValue = this.getMaxValue();
        
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        
        data.forEach((value, index) => {
            const x = this.chartArea.x + (index + 0.5) * (this.chartArea.width / data.length);
            const y = this.chartArea.y + this.chartArea.height - (value / maxValue) * this.chartArea.height;
            
            if (index === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        });
        
        this.ctx.stroke();
        
        // 绘制数据点
        this.ctx.fillStyle = color;
        data.forEach((value, index) => {
            const x = this.chartArea.x + (index + 0.5) * (this.chartArea.width / data.length);
            const y = this.chartArea.y + this.chartArea.height - (value / maxValue) * this.chartArea.height;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, 3, 0, 2 * Math.PI);
            this.ctx.fill();
        });
    }
    
    drawBars(data, color, barWidth, barSpacing, datasetIndex, totalDatasets) {
        const maxValue = this.getMaxValue();
        const actualBarWidth = barWidth / totalDatasets;
        
        this.ctx.fillStyle = color;
        
        data.forEach((value, index) => {
            const x = this.chartArea.x + index * (barWidth + barSpacing) + datasetIndex * actualBarWidth + barSpacing / 2;
            const height = (value / maxValue) * this.chartArea.height;
            const y = this.chartArea.y + this.chartArea.height - height;
            
            this.ctx.fillRect(x, y, actualBarWidth, height);
        });
    }
    
    drawPie(data, labels, centerX, centerY, radius) {
        const total = data.reduce((sum, value) => sum + value, 0);
        let currentAngle = -Math.PI / 2;
        
        data.forEach((value, index) => {
            const sliceAngle = (value / total) * 2 * Math.PI;
            const color = this.options.colors[index % this.options.colors.length];
            
            this.ctx.fillStyle = color;
            this.ctx.beginPath();
            this.ctx.moveTo(centerX, centerY);
            this.ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            this.ctx.closePath();
            this.ctx.fill();
            
            // 绘制边框
            this.ctx.strokeStyle = '#fff';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            
            currentAngle += sliceAngle;
        });
    }
    
    drawDoughnut(data, labels, centerX, centerY, outerRadius, innerRadius) {
        const total = data.reduce((sum, value) => sum + value, 0);
        let currentAngle = -Math.PI / 2;
        
        data.forEach((value, index) => {
            const sliceAngle = (value / total) * 2 * Math.PI;
            const color = this.options.colors[index % this.options.colors.length];
            
            this.ctx.fillStyle = color;
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, outerRadius, currentAngle, currentAngle + sliceAngle);
            this.ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
            this.ctx.closePath();
            this.ctx.fill();
            
            // 绘制边框
            this.ctx.strokeStyle = '#fff';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            
            currentAngle += sliceAngle;
        });
    }
    
    drawLegend() {
        const { data } = this.options;
        if (!data.datasets) return;
        
        const legendY = this.canvas.height - 40;
        let legendX = 20;
        
        data.datasets.forEach((dataset, index) => {
            const color = dataset.backgroundColor || dataset.borderColor || this.options.colors[index % this.options.colors.length];
            const label = dataset.label || `数据集 ${index + 1}`;
            
            // 绘制颜色块
            this.ctx.fillStyle = color;
            this.ctx.fillRect(legendX, legendY, 12, 12);
            
            // 绘制标签
            this.ctx.fillStyle = '#333';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'left';
            this.ctx.fillText(label, legendX + 20, legendY + 9);
            
            legendX += this.ctx.measureText(label).width + 40;
        });
    }
    
    getMaxValue() {
        const { data } = this.options;
        let max = 0;
        
        data.datasets.forEach(dataset => {
            const datasetMax = Math.max(...dataset.data);
            if (datasetMax > max) {
                max = datasetMax;
            }
        });
        
        return max || 100;
    }
    
    update(newData) {
        this.options.data = { ...this.options.data, ...newData };
        this.render();
    }
    
    destroy() {
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

/**
 * 图表工具类
 */
class ChartUtils {
    /**
     * 创建折线图
     * @param {HTMLElement} container - 容器元素
     * @param {Object} data - 图表数据
     * @param {Object} options - 配置选项
     * @returns {Chart} 图表实例
     */
    static createLineChart(container, data, options = {}) {
        return new Chart(container, {
            type: 'line',
            data,
            ...options
        });
    }
    
    /**
     * 创建柱状图
     * @param {HTMLElement} container - 容器元素
     * @param {Object} data - 图表数据
     * @param {Object} options - 配置选项
     * @returns {Chart} 图表实例
     */
    static createBarChart(container, data, options = {}) {
        return new Chart(container, {
            type: 'bar',
            data,
            ...options
        });
    }
    
    /**
     * 创建饼图
     * @param {HTMLElement} container - 容器元素
     * @param {Object} data - 图表数据
     * @param {Object} options - 配置选项
     * @returns {Chart} 图表实例
     */
    static createPieChart(container, data, options = {}) {
        return new Chart(container, {
            type: 'pie',
            data,
            ...options
        });
    }
    
    /**
     * 创建环形图
     * @param {HTMLElement} container - 容器元素
     * @param {Object} data - 图表数据
     * @param {Object} options - 配置选项
     * @returns {Chart} 图表实例
     */
    static createDoughnutChart(container, data, options = {}) {
        return new Chart(container, {
            type: 'doughnut',
            data,
            ...options
        });
    }
    
    /**
     * 生成随机数据
     * @param {number} count - 数据点数量
     * @param {number} min - 最小值
     * @param {number} max - 最大值
     * @returns {Array} 随机数据数组
     */
    static generateRandomData(count = 10, min = 0, max = 100) {
        return Array.from({ length: count }, () => 
            Math.floor(Math.random() * (max - min + 1)) + min
        );
    }
    
    /**
     * 生成月份标签
     * @param {number} count - 月份数量
     * @returns {Array} 月份标签数组
     */
    static generateMonthLabels(count = 12) {
        const months = ['1月', '2月', '3月', '4月', '5月', '6月', 
                       '7月', '8月', '9月', '10月', '11月', '12月'];
        return months.slice(0, count);
    }
    
    /**
     * 生成周标签
     * @returns {Array} 周标签数组
     */
    static generateWeekLabels() {
        return ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    }
    
    /**
     * 颜色调色板
     */
    static get colorPalettes() {
        return {
            default: ['#007bff', '#28a745', '#ffc107', '#dc3545', '#6f42c1', '#fd7e14'],
            pastel: ['#FFB3BA', '#BAFFC9', '#BAE1FF', '#FFFFBA', '#FFD1BA', '#E1BAFF'],
            vibrant: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'],
            monochrome: ['#2C3E50', '#34495E', '#7F8C8D', '#95A5A6', '#BDC3C7', '#ECF0F1']
        };
    }
}

// 导出到全局
window.Chart = Chart;
window.ChartUtils = ChartUtils;
window.initChart = initChart;

// 添加图表样式（如果不存在）
if (!document.querySelector('#chart-styles')) {
    const style = document.createElement('style');
    style.id = 'chart-styles';
    style.textContent = `
        .chart {
            position: relative;
            width: 100%;
            margin: 1rem 0;
        }
        
        .chart canvas {
            max-width: 100%;
            height: auto;
            border-radius: 0.5rem;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .chart-container {
            background: white;
            border-radius: 0.5rem;
            padding: 1rem;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .chart-title {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 1rem;
            text-align: center;
            color: #333;
        }
        
        .chart-description {
            font-size: 0.875rem;
            color: #6c757d;
            text-align: center;
            margin-bottom: 1rem;
        }
        
        .chart-controls {
            display: flex;
            justify-content: center;
            gap: 0.5rem;
            margin-top: 1rem;
        }
        
        .chart-controls button {
            padding: 0.25rem 0.75rem;
            font-size: 0.875rem;
            border: 1px solid #dee2e6;
            background: white;
            border-radius: 0.25rem;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .chart-controls button:hover {
            background: #f8f9fa;
            border-color: #adb5bd;
        }
        
        .chart-controls button.active {
            background: #007bff;
            color: white;
            border-color: #007bff;
        }
        
        @media (max-width: 768px) {
            .chart-container {
                padding: 0.75rem;
            }
            
            .chart-title {
                font-size: 1.125rem;
            }
            
            .chart-controls {
                flex-wrap: wrap;
            }
        }
    `;
    document.head.appendChild(style);
}

