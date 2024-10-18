
console.log('scripts');

(function ()
{
    console.log('scripts')
    let isDragging = false; // 是否在拖动
    let scrollPosition = 0; // 滚动位置
    const scrollSpeed = 60; // 滚动速度
    const content = document.getElementById('content');

    window.addEventListener('mousedown', function(event) {
        isDragging = true; // 开始拖动
        startMouseY = event.clientY; // 记录鼠标按下的Y位置
    });

    window.addEventListener('mousemove', function(event) {
        if (isDragging) {
            lastMouseY = event.clientY; // 获取当前鼠标位置
            const deltaY = startMouseY - lastMouseY; // 计算鼠标滑动距离
            scrollPosition += deltaY;
            updateScrollPosition();
            startMouseY = lastMouseY; // 更新起始点为当前位置，以便继续拖动
        }
    });

    window.addEventListener('mouseup', function() {
        isDragging = false; // 停止拖动
    });

    // 禁用默认滚动行为并自定义鼠标滚轮滚动
    window.addEventListener('wheel', function (event)
    {
        console.log('wheel')
        event.preventDefault();
        scrollPosition += event.deltaY > 0 ? scrollSpeed : -scrollSpeed;
        updateScrollPosition();
    }, { passive: false });

    // 处理触摸事件
    let startY = 0; // 触摸开始的Y坐标
    let lastY = 0;  // 触摸移动的最后Y坐标

    window.addEventListener('touchstart', function (event)
    {
        console.log('touch start')
        startY = event.touches[0].clientY; // 记录初始触摸位置
    });

    window.addEventListener('touchmove', function (event)
    {
        console.log('touch move')
        event.preventDefault();
        lastY = event.touches[0].clientY; // 记录滑动中的Y坐标
        const deltaY = startY - lastY; // 计算滑动距离
        scrollPosition += deltaY;
        updateScrollPosition();
        startY = lastY; // 更新起始点为当前位置，以便继续滑动
    }, { passive: false });

    // 更新滚动位置的函数
    function updateScrollPosition()
    {
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        if (scrollPosition < 0) scrollPosition = 0;
        if (scrollPosition > maxScroll) scrollPosition = maxScroll;

        // 使用 translateY 实现页面滚动效果
        content.style.transform = `translateY(-${scrollPosition}px)`;
    }
})()
