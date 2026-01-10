/**
 * 背包组件模块
 * 负责渲染和管理整个背包界面
 */

import { ItemComponent } from './itemComponent.js';
import { DragDropManager } from '../utils/dragDrop.js';
import { SortType } from '../data/backpack.js';

/**
 * 背包组件类
 */
export class BackpackComponent {
    constructor(backpackLogic, options = {}) {
        this.backpackLogic = backpackLogic;
        this.options = {
            columns: 5,           // 每行显示的格子数
            showStats: true,      // 显示统计信息
            showToolbar: true,  // 显示工具栏
            draggable: true,      // 启用拖拽
            ...options
        };
        
        this.element = null;
        this.gridElement = null;
        this.statsElement = null;
        this.toolbarElement = null;
        this.slotElements = [];
        this.dragDropManager = null;
        this.itemComponents = new Map();
    }

    /**
     * 创建背包界面
     */
    createElement() {
        this.element = document.createElement('div');
        this.element.className = 'backpack-component';
        
        // 创建标题
        const header = this.createHeader();
        this.element.appendChild(header);
        
        // 创建工具栏
        if (this.options.showToolbar) {
            this.toolbarElement = this.createToolbar();
            this.element.appendChild(this.toolbarElement);
        }
        
        // 创建背包格子网格
        this.gridElement = this.createGrid();
        this.element.appendChild(this.gridElement);
        
        // 创建统计信息
        if (this.options.showStats) {
            this.statsElement = this.createStats();
            this.element.appendChild(this.statsElement);
        }
        
        // 初始化拖拽功能
        if (this.options.draggable) {
            this.initDragDrop();
        }
        
        // 更新显示
        this.updateDisplay();
        
        return this.element;
    }

    /**
     * 创建标题
     */
    createHeader() {
        const header = document.createElement('div');
        header.className = 'backpack-header';
        
        const title = document.createElement('h2');
        title.textContent = '背包';
        title.className = 'backpack-title';
        
        const subtitle = document.createElement('div');
        subtitle.className = 'backpack-subtitle';
        subtitle.textContent = '冒险者的行囊';
        
        header.appendChild(title);
        header.appendChild(subtitle);
        
        return header;
    }

    /**
     * 创建工具栏
     */
    createToolbar() {
        const toolbar = document.createElement('div');
        toolbar.className = 'backpack-toolbar';
        
        // 排序选项
        const sortGroup = document.createElement('div');
        sortGroup.className = 'toolbar-group';
        
        const sortLabel = document.createElement('span');
        sortLabel.textContent = '排序:';
        sortLabel.className = 'toolbar-label';
        
        const sortSelect = document.createElement('select');
        sortSelect.className = 'toolbar-select';
        
        const sortOptions = [
            { value: SortType.DEFAULT, text: '默认' },
            { value: SortType.NAME, text: '名称' },
            { value: SortType.TYPE, text: '类型' },
            { value: SortType.QUANTITY, text: '数量' },
            { value: SortType.RARITY, text: '稀有度' }
        ];
        
        sortOptions.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.text;
            sortSelect.appendChild(optionElement);
        });
        
        sortSelect.addEventListener('change', (e) => {
            this.backpackLogic.sortBackpack(e.target.value);
            this.updateDisplay();
        });
        
        sortGroup.appendChild(sortLabel);
        sortGroup.appendChild(sortSelect);
        
        // 扩展背包按钮
        const expandGroup = document.createElement('div');
        expandGroup.className = 'toolbar-group';
        
        const expandButton = document.createElement('button');
        expandButton.className = 'toolbar-button';
        expandButton.innerHTML = '📦 扩展背包';
        expandButton.addEventListener('click', () => {
            const result = this.backpackLogic.expandBackpack();
            if (result.success) {
                this.updateDisplay();
                this.showNotification(result.message, 'success');
            } else {
                this.showNotification(result.message, 'error');
            }
        });
        
        expandGroup.appendChild(expandButton);
        
        // 整理背包按钮
        const organizeGroup = document.createElement('div');
        organizeGroup.className = 'toolbar-group';
        
        const organizeButton = document.createElement('button');
        organizeButton.className = 'toolbar-button';
        organizeButton.innerHTML = '🔄 整理';
        organizeButton.addEventListener('click', () => {
            this.backpackLogic.sortBackpack(SortType.TYPE);
            sortSelect.value = SortType.TYPE;
            this.updateDisplay();
            this.showNotification('背包已整理', 'success');
        });
        
        organizeGroup.appendChild(organizeButton);
        
        toolbar.appendChild(sortGroup);
        toolbar.appendChild(organizeGroup);
        toolbar.appendChild(expandGroup);
        
        return toolbar;
    }

    /**
     * 创建背包格子网格
     */
    createGrid() {
        const grid = document.createElement('div');
        grid.className = 'backpack-grid';
        grid.style.gridTemplateColumns = `repeat(${this.options.columns}, 1fr)`;
        
        // 创建格子
        for (let i = 0; i < this.backpackLogic.backpack.size; i++) {
            const slotElement = this.createSlot(i);
            grid.appendChild(slotElement);
            this.slotElements[i] = slotElement;
        }
        
        return grid;
    }

    /**
     * 创建单个格子
     */
    createSlot(index) {
        const slot = this.backpackLogic.backpack.getSlot(index);
        const slotElement = document.createElement('div');
        slotElement.className = 'backpack-slot';
        slotElement.dataset.slotIndex = index;
        slotElement.dataset.dropZone = 'backpack';
        slotElement.dataset.dropIndex = index;
        
        // 格子编号（调试用）
        const slotNumber = document.createElement('div');
        slotNumber.className = 'slot-number';
        slotNumber.textContent = index + 1;
        
        slotElement.appendChild(slotNumber);
        
        // 设置拖拽放置
        if (this.options.draggable) {
            slotElement.addEventListener('dragover', (e) => {
                e.preventDefault();
                slotElement.classList.add('slot-hover');
            });
            
            slotElement.addEventListener('dragleave', () => {
                slotElement.classList.remove('slot-hover');
            });
            
            slotElement.addEventListener('drop', (e) => {
                e.preventDefault();
                slotElement.classList.remove('slot-hover');
                this.handleItemDrop(index);
            });
        }
        
        return slotElement;
    }

    /**
     * 创建统计信息
     */
    createStats() {
        const stats = document.createElement('div');
        stats.className = 'backpack-stats';
        
        const statsData = this.backpackLogic.getBackpackStats();
        
        stats.innerHTML = `
            <div class="stat-item">
                <span class="stat-label">已用格子:</span>
                <span class="stat-value">${statsData.usedSlots} / ${statsData.totalSlots}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">物品总数:</span>
                <span class="stat-value">${statsData.totalItems}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">金币:</span>
                <span class="stat-value">${statsData.gold.toLocaleString()}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">使用率:</span>
                <span class="stat-value">${statsData.usageRate}%</span>
            </div>
        `;
        
        return stats;
    }

    /**
     * 初始化拖拽功能
     */
    initDragDrop() {
        this.dragDropManager = new DragDropManager();
        
        // 监听拖拽事件
        document.addEventListener('item-drop', (e) => {
            this.handleItemDrop(e.detail.dropData.index);
        });
        
        // 监听物品操作事件
        document.addEventListener('item-action', (e) => {
            if (e.detail.component instanceof ItemComponent) {
                this.handleItemAction(e.detail.action, e.detail.itemInstance);
            }
        });
    }

    /**
     * 处理物品放置
     */
    handleItemDrop(targetSlotIndex) {
        // 这里需要实现具体的拖拽逻辑
        // 暂时显示提示信息，然后更新显示
        this.showNotification(`物品放置到格子 ${targetSlotIndex + 1}`, 'info');
        this.updateDisplay();
    }

    /**
     * 处理物品操作
     */
    handleItemAction(action, itemInstance) {
        switch (action) {
            case 'use':
                const useResult = this.backpackLogic.useItem(itemInstance.position);
                this.showNotification(useResult.message, useResult.success ? 'success' : 'error');
                if (useResult.success) {
                    this.updateDisplay();
                }
                break;
                
            case 'drop':
                const dropResult = this.backpackLogic.dropItem(itemInstance.position);
                this.showNotification(dropResult.message, dropResult.success ? 'success' : 'error');
                if (dropResult.success) {
                    this.updateDisplay();
                }
                break;
                
            case 'info':
                // 显示详细信息（已经在tooltip中显示）
                break;
        }
    }

    /**
     * 更新显示
     */
    updateDisplay() {
        // 更新格子内容
        for (let i = 0; i < this.backpackLogic.backpack.size; i++) {
            const slot = this.backpackLogic.backpack.getSlot(i);
            const slotElement = this.slotElements[i];
            
            if (slot && slotElement) {
                this.updateSlotDisplay(slotElement, slot);
            }
        }
        
        // 更新统计信息
        if (this.statsElement) {
            const newStats = this.createStats();
            this.statsElement.innerHTML = newStats.innerHTML;
        }
    }

    /**
     * 更新格子显示
     */
    updateSlotDisplay(slotElement, slot) {
        // 清空现有内容（除了格子编号）
        const slotNumber = slotElement.querySelector('.slot-number');
        slotElement.innerHTML = '';
        slotElement.appendChild(slotNumber);
        
        if (!slot.isEmpty()) {
            const itemInstance = slot.getItem();
            const itemComponent = new ItemComponent(itemInstance, {
                showQuantity: true,
                showRarity: true,
                draggable: this.options.draggable,
                size: 'medium'
            });
            
            const itemElement = itemComponent.createElement();
            slotElement.appendChild(itemElement);
            
            // 保存组件引用
            this.itemComponents.set(slot.index, itemComponent);
        }
        
        // 更新格子状态
        slotElement.classList.toggle('slot-empty', slot.isEmpty());
        slotElement.classList.toggle('slot-locked', slot.isLocked());
    }

    /**
     * 显示通知
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // 设置样式
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        // 根据类型设置颜色
        const colors = {
            success: '#22c55e',
            error: '#ef4444',
            info: '#3b82f6',
            warning: '#f59e0b'
        };
        
        notification.style.backgroundColor = colors[type] || colors.info;
        
        document.body.appendChild(notification);
        
        // 显示动画
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });
        
        // 自动隐藏
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    /**
     * 销毁组件
     */
    destroy() {
        // 销毁拖拽管理器
        if (this.dragDropManager) {
            this.dragDropManager.destroy();
        }
        
        // 销毁物品组件
        this.itemComponents.forEach(component => {
            component.destroy();
        });
        
        // 清空引用
        this.itemComponents.clear();
        this.slotElements = [];
        
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        
        this.element = null;
        this.gridElement = null;
        this.statsElement = null;
        this.toolbarElement = null;
    }
}