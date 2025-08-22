# UI组件模板库

一个包含各种常用UI组件的纯HTML+CSS+JS模板库，每个组件都有独特的样式和脚本示例，脚本分成多个文件进行编写。

## 项目特点

- 🎨 **现代化设计** - 采用现代化的UI设计风格，支持多种主题色彩
- 📱 **响应式布局** - 完全响应式设计，适配桌面、平板和手机设备
- 🧩 **模块化架构** - 每个组件独立开发，可单独使用或组合使用
- 🚀 **零依赖** - 纯原生HTML、CSS、JavaScript实现，无需任何第三方库
- 📝 **详细文档** - 每个组件都有完整的使用示例和说明
- 🎯 **易于定制** - 通过CSS变量轻松自定义主题和样式

## 项目结构

```
ui-template/
├── index.html              # 主页面，展示所有组件
├── css/                     # 样式文件目录
│   ├── style.css           # 主样式文件
│   ├── components.css      # 组件样式文件
│   ├── animations.css      # 动画样式文件
│   └── responsive.css      # 响应式样式文件
├── js/                      # JavaScript文件目录
│   ├── main.js             # 主JavaScript文件
│   ├── utils/              # 工具函数目录
│   │   └── helpers.js      # 辅助工具函数
│   └── components/         # 组件JavaScript目录
│       ├── button.js       # 按钮组件
│       ├── navbar.js       # 导航栏组件
│       ├── modal.js        # 模态框组件
│       ├── tabs.js         # 选项卡组件
│       ├── accordion.js    # 手风琴组件
│       ├── carousel.js     # 轮播图组件
│       ├── table.js        # 表格组件
│       ├── chart.js        # 图表组件
│       └── notification.js # 通知组件
└── README.md               # 项目说明文档
```

## 包含的组件

### 基础组件
- **按钮 (Button)** - 多种样式和尺寸的按钮组件
- **表单 (Form)** - 完整的表单控件集合
- **导航栏 (Navbar)** - 响应式导航栏组件

### 交互组件
- **模态框 (Modal)** - 支持多种类型的对话框
- **选项卡 (Tabs)** - 水平选项卡组件
- **手风琴 (Accordion)** - 可折叠的内容面板
- **轮播图 (Carousel)** - 自动播放的图片轮播组件

### 高级组件
- **表格 (Table)** - 支持排序的数据表格
- **图表 (Chart)** - 多种类型的数据可视化图表
- **通知 (Notification)** - 多种类型的消息通知系统

## 快速开始

1. **下载项目文件**
   ```bash
   # 将整个ui-template文件夹复制到你的项目中
   ```

2. **在HTML中引入样式文件**
   ```html
   <link rel="stylesheet" href="css/style.css">
   <link rel="stylesheet" href="css/components.css">
   <link rel="stylesheet" href="css/animations.css">
   <link rel="stylesheet" href="css/responsive.css">
   ```

3. **在HTML中引入JavaScript文件**
   ```html
   <!-- 工具函数 -->
   <script src="js/utils/helpers.js"></script>
   
   <!-- 组件脚本 -->
   <script src="js/components/button.js"></script>
   <script src="js/components/navbar.js"></script>
   <script src="js/components/modal.js"></script>
   <script src="js/components/tabs.js"></script>
   <script src="js/components/accordion.js"></script>
   <script src="js/components/carousel.js"></script>
   <script src="js/components/table.js"></script>
   <script src="js/components/chart.js"></script>
   <script src="js/components/notification.js"></script>
   
   <!-- 主脚本 -->
   <script src="js/main.js"></script>
   ```

4. **使用组件**
   ```html
   <!-- 按钮示例 -->
   <button class="btn btn-primary">主要按钮</button>
   
   <!-- 通知示例 -->
   <script>
   NotificationUtils.success('操作成功！');
   </script>
   ```

## 组件使用指南

### 按钮组件

```html
<!-- 基础按钮 -->
<button class="btn btn-primary">主要按钮</button>
<button class="btn btn-secondary">次要按钮</button>
<button class="btn btn-success">成功按钮</button>

<!-- 轮廓按钮 -->
<button class="btn btn-outline-primary">主要轮廓</button>

<!-- 不同尺寸 -->
<button class="btn btn-primary btn-sm">小按钮</button>
<button class="btn btn-primary">默认按钮</button>
<button class="btn btn-primary btn-lg">大按钮</button>

<!-- 图标按钮 -->
<button class="btn btn-primary">
    <i class="fas fa-download"></i> 下载
</button>
```

### 模态框组件

```html
<!-- HTML结构 -->
<div id="myModal" class="modal">
    <div class="modal-overlay"></div>
    <div class="modal-container">
        <div class="modal-header">
            <h3>标题</h3>
            <button class="modal-close">×</button>
        </div>
        <div class="modal-body">
            <p>内容</p>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary">取消</button>
            <button class="btn btn-primary">确认</button>
        </div>
    </div>
</div>

<!-- JavaScript调用 -->
<script>
// 打开模态框
openModal('myModal');

// 关闭模态框
closeModal('myModal');

// 确认对话框
ModalUtils.confirm({
    title: '确认操作',
    message: '您确定要执行此操作吗？',
    confirmText: '确认',
    cancelText: '取消'
}).then(result => {
    if (result) {
        console.log('用户确认');
    }
});
</script>
```

### 选项卡组件

```html
<div class="tabs">
    <div class="tab-nav">
        <button class="tab-btn active" data-tab="tab1">选项卡1</button>
        <button class="tab-btn" data-tab="tab2">选项卡2</button>
        <button class="tab-btn" data-tab="tab3">选项卡3</button>
    </div>
    <div class="tab-content">
        <div id="tab1" class="tab-pane active">
            <h3>选项卡1内容</h3>
            <p>这是第一个选项卡的内容。</p>
        </div>
        <div id="tab2" class="tab-pane">
            <h3>选项卡2内容</h3>
            <p>这是第二个选项卡的内容。</p>
        </div>
        <div id="tab3" class="tab-pane">
            <h3>选项卡3内容</h3>
            <p>这是第三个选项卡的内容。</p>
        </div>
    </div>
</div>
```

### 通知组件

```javascript
// 成功通知
NotificationUtils.success('操作成功！', {
    title: '成功',
    duration: 3000
});

// 警告通知
NotificationUtils.warning('请注意检查输入内容！', {
    title: '警告',
    duration: 4000
});

// 错误通知
NotificationUtils.error('操作失败，请重试！', {
    title: '错误',
    duration: 5000
});

// 信息通知
NotificationUtils.info('这是一条信息提示。', {
    title: '信息',
    duration: 3000
});

// 进度通知
const progress = NotificationUtils.progress('正在处理...', {
    title: '进度',
    initialProgress: 0
});

// 更新进度
progress.update(50, '处理中... 50%');

// 完成进度
progress.complete('处理完成！');

// 清除所有通知
NotificationUtils.clearAll();
```

### 图表组件

```javascript
// 折线图
const lineChart = ChartUtils.createLineChart(
    document.getElementById('lineChart'),
    {
        labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
        datasets: [{
            label: '销售额',
            data: [120, 190, 300, 500, 200, 300],
            borderColor: '#007bff'
        }]
    }
);

// 柱状图
const barChart = ChartUtils.createBarChart(
    document.getElementById('barChart'),
    {
        labels: ['产品A', '产品B', '产品C', '产品D'],
        datasets: [{
            label: '销量',
            data: [65, 59, 80, 81],
            backgroundColor: '#28a745'
        }]
    }
);

// 饼图
const pieChart = ChartUtils.createPieChart(
    document.getElementById('pieChart'),
    {
        labels: ['Chrome', 'Firefox', 'Safari', 'Edge'],
        datasets: [{
            data: [45, 25, 20, 10]
        }]
    }
);
```

## 自定义主题

通过修改CSS变量来自定义主题色彩：

```css
:root {
    /* 主色调 */
    --primary-color: #007bff;
    --secondary-color: #6c757d;
    --success-color: #28a745;
    --warning-color: #ffc107;
    --danger-color: #dc3545;
    --info-color: #17a2b8;
    
    /* 文字颜色 */
    --text-color: #333;
    --text-muted: #6c757d;
    
    /* 背景颜色 */
    --bg-color: #ffffff;
    --bg-light: #f8f9fa;
    --bg-dark: #343a40;
    
    /* 边框颜色 */
    --border-color: #dee2e6;
    --border-radius: 0.375rem;
    
    /* 阴影 */
    --box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
    --box-shadow-lg: 0 1rem 3rem rgba(0, 0, 0, 0.175);
}
```

## 浏览器支持

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request来改进这个项目。

## 更新日志

### v1.0.0 (2025-08-21)
- 初始版本发布
- 包含9个主要UI组件
- 支持响应式设计
- 完整的JavaScript API
- 详细的使用文档

---

如有任何问题或建议，请随时联系我们！

