/**
 * 拖拽工具模块
 * 处理物品拖拽相关的功能
 */

/**
 * 拖拽管理器
 */
export class DragDropManager {
    constructor() {
        this.draggedElement = null;      // 被拖拽的元素
        this.draggedData = null;         // 被拖拽的数据
        this.dragSource = null;          // 拖拽源
        this.isDragging = false;        // 是否正在拖拽
        
        this.init();
    }

    /**
     * 初始化拖拽功能
     */
    init() {
        // 创建拖拽时的视觉反馈元素
        this.createDragGhost();
        
        // 添加全局拖拽事件监听
        document.addEventListener('dragstart', this.handleDragStart.bind(this), true);
        document.addEventListener('dragover', this.handleDragOver.bind(this), true);
        document.addEventListener('drop', this.handleDrop.bind(this), true);
        document.addEventListener('dragend', this.handleDragEnd.bind(this), true);
        document.addEventListener('dragenter', this.handleDragEnter.bind(this), true);
        document.addEventListener('dragleave', this.handleDragLeave.bind(this), true);
    }

    /**
     * 创建拖拽时的幽灵元素
     */
    createDragGhost() {
        this.dragGhost = document.createElement('div');
        this.dragGhost.id = 'drag-ghost';
        this.dragGhost.style.cssText = `
            position: fixed;
            pointer-events: none;
            z-index: 10000;
            opacity: 0.8;
            transform: rotate(-5deg);
            transition: none;
            display: none;
        `;
        document.body.appendChild(this.dragGhost);
    }

    /**
     * 处理拖拽开始
     */
    handleDragStart(event) {
        const dragElement = event.target.closest('[draggable="true"]');
        if (!dragElement) return;

        // 保存拖拽信息
        this.draggedElement = dragElement;
        this.draggedData = {
            type: dragElement.dataset.dragType,
            data: JSON.parse(dragElement.dataset.dragData || '{}'),
            element: dragElement
        };
        this.dragSource = event.target;
        this.isDragging = true;

        // 设置拖拽效果
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', '');

        // 创建拖拽幽灵
        this.updateDragGhost(event);
        event.dataTransfer.setDragImage(this.dragGhost, 0, 0);

        // 添加拖拽样式
        dragElement.classList.add('dragging');
        document.body.classList.add('dragging-active');

        // 触发自定义事件
        this.triggerCustomEvent('dragstart', {
            element: dragElement,
            data: this.draggedData,
            originalEvent: event
        });
    }

    /**
     * 处理拖拽经过
     */
    handleDragOver(event) {
        if (!this.isDragging) return;

        const dropTarget = event.target.closest('[data-drop-zone]');
        if (dropTarget) {
            event.preventDefault();
            event.dataTransfer.dropEffect = 'move';
            
            // 更新拖拽幽灵位置
            this.updateDragGhost(event);
            
            // 添加悬停效果
            this.highlightDropTarget(dropTarget);
        }
    }

    /**
     * 处理放置
     */
    handleDrop(event) {
        if (!this.isDragging) return;

        event.preventDefault();
        
        const dropTarget = event.target.closest('[data-drop-zone]');
        if (dropTarget) {
            const dropData = {
                zone: dropTarget.dataset.dropZone,
                index: parseInt(dropTarget.dataset.dropIndex) || 0,
                target: dropTarget
            };

            // 触发自定义事件
            this.triggerCustomEvent('item-drop', {
                draggedData: this.draggedData,
                dropData: dropData,
                originalEvent: event
            });
            
            // 执行放置逻辑
            this.executeDrop(dropData);
        }

        this.clearDragState();
    }

    /**
     * 处理拖拽结束
     */
    handleDragEnd(event) {
        if (!this.isDragging) return;

        // 触发自定义事件
        this.triggerCustomEvent('dragend', {
            element: this.draggedElement,
            data: this.draggedData,
            cancelled: event.dataTransfer.dropEffect === 'none'
        });

        this.clearDragState();
    }

    /**
     * 处理拖拽进入
     */
    handleDragEnter(event) {
        if (!this.isDragging) return;
        
        const dropTarget = event.target.closest('[data-drop-zone]');
        if (dropTarget) {
            dropTarget.classList.add('drop-target-hover');
        }
    }

    /**
     * 处理拖拽离开
     */
    handleDragLeave(event) {
        if (!this.isDragging) return;
        
        const dropTarget = event.target.closest('[data-drop-zone]');
        if (dropTarget) {
            // 检查是否真的离开了目标元素
            const rect = dropTarget.getBoundingClientRect();
            const x = event.clientX;
            const y = event.clientY;
            
            if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
                dropTarget.classList.remove('drop-target-hover');
            }
        }
    }

    /**
     * 更新拖拽幽灵
     */
    updateDragGhost(event) {
        if (!this.draggedElement) return;

        // 克隆拖拽元素
        const clone = this.draggedElement.cloneNode(true);
        clone.style.cssText = `
            width: ${this.draggedElement.offsetWidth}px;
            height: ${this.draggedElement.offsetHeight}px;
            background: rgba(99, 99, 230, 0.9);
            border: 2px solid #6363e6;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            box-shadow: 0 8px 32px rgba(99, 99, 230, 0.3);
        `;

        this.dragGhost.innerHTML = '';
        this.dragGhost.appendChild(clone);
        this.dragGhost.style.display = 'block';
        this.dragGhost.style.left = event.clientX - this.draggedElement.offsetWidth / 2 + 'px';
        this.dragGhost.style.top = event.clientY - this.draggedElement.offsetHeight / 2 + 'px';
    }

    /**
     * 高亮放置目标
     */
    highlightDropTarget(target) {
        // 清除之前的高亮
        document.querySelectorAll('.drop-target-valid').forEach(el => {
            el.classList.remove('drop-target-valid');
        });
        
        // 高亮当前目标
        target.classList.add('drop-target-valid');
    }

    /**
     * 执行放置逻辑
     */
    executeDrop(dropData) {
        if (!this.draggedData) return;

        // 这里可以添加具体的业务逻辑
        // 例如：移动物品、合并堆叠等
        
        const event = new CustomEvent('item-drop', {
            detail: {
                draggedData: this.draggedData,
                dropData: dropData
            }
        });
        
        document.dispatchEvent(event);
    }

    /**
     * 清除拖拽状态
     */
    clearDragState() {
        // 清除样式
        if (this.draggedElement) {
            this.draggedElement.classList.remove('dragging');
        }
        
        document.querySelectorAll('.drop-target-hover, .drop-target-valid').forEach(el => {
            el.classList.remove('drop-target-hover', 'drop-target-valid');
        });
        
        document.body.classList.remove('dragging-active');
        
        // 隐藏拖拽幽灵
        if (this.dragGhost) {
            this.dragGhost.style.display = 'none';
        }
        
        // 重置状态
        this.draggedElement = null;
        this.draggedData = null;
        this.dragSource = null;
        this.isDragging = false;
    }

    /**
     * 触发自定义事件
     */
    triggerCustomEvent(eventName, detail) {
        const event = new CustomEvent(`dragdrop:${eventName}`, {
            detail: detail
        });
        document.dispatchEvent(event);
    }

    /**
     * 使元素可拖拽
     */
    makeDraggable(element, dragType, dragData) {
        if (!element) return;
        
        element.draggable = true;
        element.dataset.dragType = dragType;
        element.dataset.dragData = JSON.stringify(dragData);
        element.classList.add('draggable-item');
    }

    /**
     * 使元素可放置
     */
    makeDroppable(element, zone, index = 0) {
        if (!element) return;
        
        element.dataset.dropZone = zone;
        element.dataset.dropIndex = index;
        element.classList.add('drop-zone');
    }

    /**
     * 销毁拖拽管理器
     */
    destroy() {
        // 移除事件监听
        document.removeEventListener('dragstart', this.handleDragStart, true);
        document.removeEventListener('dragover', this.handleDragOver, true);
        document.removeEventListener('drop', this.handleDrop, true);
        document.removeEventListener('dragend', this.handleDragEnd, true);
        document.removeEventListener('dragenter', this.handleDragEnter, true);
        document.removeEventListener('dragleave', this.handleDragLeave, true);
        
        // 移除拖拽幽灵
        if (this.dragGhost && this.dragGhost.parentNode) {
            this.dragGhost.parentNode.removeChild(this.dragGhost);
        }
        
        this.clearDragState();
    }
}

/**
 * 拖拽工具函数
 */
export const DragDropUtils = {
    /**
     * 检查两个物品是否可以交换位置
     */
    canSwapItems(fromItem, toItem) {
        if (!fromItem || !toItem) return true;
        
        // 检查是否同类物品且可堆叠
        if (fromItem.item.id === toItem.item.id && 
            fromItem.item.maxStack > 1 && 
            toItem.item.maxStack > 1) {
            
            const totalQuantity = fromItem.quantity + toItem.quantity;
            return totalQuantity > fromItem.item.maxStack;
        }
        
        return true; // 默认可交换
    },

    /**
     * 计算拖拽时的视觉反馈
     */
    calculateDragFeedback(draggedElement, dropTarget) {
        const rect = dropTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        return {
            position: 'center',
            coordinates: { x: centerX, y: centerY },
            valid: true
        };
    }
};