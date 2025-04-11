const draggableWindow = document.getElementById("draggableWindow");
const windowHeader = document.getElementById("windowHeader");

let isDragging = false;
let offsetX, offsetY;

// 鼠标按下时触发
windowHeader.addEventListener("mousedown", (e) => {
    isDragging = true;

    // 计算鼠标相对于窗口左上角的偏移量
    offsetX = e.clientX - draggableWindow.getBoundingClientRect().left;
    offsetY = e.clientY - draggableWindow.getBoundingClientRect().top;

    // 防止鼠标选中文本
    e.preventDefault();
});

// 鼠标移动时触发
document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    // 计算窗口的新位置
    const newX = e.clientX - offsetX;
    const newY = e.clientY - offsetY;

    // 更新窗口位置
    draggableWindow.style.left = `${newX}px`;
    draggableWindow.style.top = `${newY}px`;
});

// 鼠标松开时停止拖拽
document.addEventListener("mouseup", () => {
    isDragging = false;
});