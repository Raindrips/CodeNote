/**
 * 物品组件模块
 * 负责渲染和管理物品的视觉表现
 */

/**
 * 物品组件类
 */
export class ItemComponent {
    constructor(itemInstance, options = {}) {
        this.itemInstance = itemInstance;
        this.options = {
            showQuantity: true,
            showRarity: true,
            draggable: true,
            size: 'medium', // small, medium, large
            ...options
        };
        
        this.element = null;
        this.tooltip = null;
        this.isHovered = false;
    }

    /**
     * 创建物品元素
     */
    createElement() {
        if (!this.itemInstance || !this.itemInstance.item) {
            return this.createEmptyElement();
        }

        const item = this.itemInstance.item;
        
        // 创建主容器
        this.element = document.createElement('div');
        this.element.className = `item-component item-${this.options.size}`;
        this.element.dataset.itemId = item.id;
        this.element.dataset.quantity = this.itemInstance.quantity;
        
        // 设置稀有度边框
        if (this.options.showRarity) {
            this.element.style.borderColor = item.rarity.color;
            this.element.style.boxShadow = `0 0 10px ${item.rarity.color}20`;
        }

        // 创建物品图标
        const iconContainer = document.createElement('div');
        iconContainer.className = 'item-icon';
        
        const icon = document.createElement('div');
        icon.className = 'item-icon-inner';
        
        // 使用纯色背景模拟图标
        const colors = this.generateItemColor(item.type);
        icon.style.background = `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`;
        
        // 添加类型标识
        const typeIndicator = document.createElement('div');
        typeIndicator.className = 'item-type-indicator';
        typeIndicator.textContent = this.getItemTypeIcon(item.type);
        typeIndicator.style.color = colors.text;
        
        icon.appendChild(typeIndicator);
        iconContainer.appendChild(icon);
        
        // 创建数量显示
        if (this.options.showQuantity && item.maxStack > 1 && this.itemInstance.quantity > 1) {
            const quantityBadge = document.createElement('div');
            quantityBadge.className = 'item-quantity';
            quantityBadge.textContent = this.formatQuantity(this.itemInstance.quantity);
            iconContainer.appendChild(quantityBadge);
        }

        // 创建物品名称
        const nameElement = document.createElement('div');
        nameElement.className = 'item-name';
        nameElement.textContent = item.name;
        nameElement.style.color = item.rarity.color;

        // 组装元素
        this.element.appendChild(iconContainer);
        this.element.appendChild(nameElement);

        // 添加交互功能
        this.setupInteractions();

        return this.element;
    }

    /**
     * 创建空物品元素
     */
    createEmptyElement() {
        this.element = document.createElement('div');
        this.element.className = 'item-component item-empty';
        return this.element;
    }

    /**
     * 设置交互功能
     */
    setupInteractions() {
        if (!this.element) return;

        // 鼠标悬停显示详情
        this.element.addEventListener('mouseenter', () => {
            this.isHovered = true;
            this.showTooltip();
        });

        this.element.addEventListener('mouseleave', () => {
            this.isHovered = false;
            this.hideTooltip();
        });

        // 右键菜单
        this.element.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.showContextMenu(e);
        });

        // 拖拽功能
        if (this.options.draggable) {
            this.element.draggable = true;
            this.element.addEventListener('dragstart', (e) => {
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', '');
                
                // 设置拖拽数据
                const dragData = {
                    type: 'item',
                    itemId: this.itemInstance.item.id,
                    quantity: this.itemInstance.quantity,
                    sourceSlot: this.itemInstance.position,
                    source: 'inventory'
                };
                
                e.dataTransfer.setData('itemData', JSON.stringify(dragData));
                
                // 添加拖拽样式
                this.element.classList.add('dragging');
            });

            this.element.addEventListener('dragend', () => {
                this.element.classList.remove('dragging');
            });
        }
    }

    /**
     * 显示物品详情提示
     */
    showTooltip() {
        if (this.tooltip) return;

        const item = this.itemInstance.item;
        
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'item-tooltip';
        
        // 创建提示内容
        const content = document.createElement('div');
        content.className = 'tooltip-content';
        
        // 头部信息
        const header = document.createElement('div');
        header.className = 'tooltip-header';
        header.innerHTML = `
            <h3 style="color: ${item.rarity.color}">${item.name}</h3>
            <span class="rarity-label">${item.rarity.name}</span>
        `;
        
        // 类型信息
        const typeInfo = document.createElement('div');
        typeInfo.className = 'tooltip-type';
        typeInfo.textContent = this.getItemTypeName(item.type);
        
        // 描述
        const description = document.createElement('div');
        description.className = 'tooltip-description';
        description.textContent = item.description;
        
        // 数量信息
        if (item.maxStack > 1) {
            const quantity = document.createElement('div');
            quantity.className = 'tooltip-quantity';
            quantity.innerHTML = `
                <span>数量: ${this.itemInstance.quantity} / ${item.maxStack}</span>
            `;
            content.appendChild(quantity);
        }
        
        content.appendChild(header);
        content.appendChild(typeInfo);
        content.appendChild(description);
        
        this.tooltip.appendChild(content);
        document.body.appendChild(this.tooltip);
        
        // 定位提示框
        this.positionTooltip();
        
        // 添加显示动画
        requestAnimationFrame(() => {
            this.tooltip.classList.add('show');
        });
    }

    /**
     * 隐藏物品详情提示
     */
    hideTooltip() {
        if (!this.tooltip) return;
        
        this.tooltip.classList.remove('show');
        setTimeout(() => {
            if (this.tooltip && this.tooltip.parentNode) {
                this.tooltip.parentNode.removeChild(this.tooltip);
            }
            this.tooltip = null;
        }, 200);
    }

    /**
     * 定位提示框
     */
    positionTooltip() {
        if (!this.tooltip || !this.element) return;
        
        const rect = this.element.getBoundingClientRect();
        const tooltipRect = this.tooltip.getBoundingClientRect();
        
        // 默认位置：在物品右侧
        let left = rect.right + 10;
        let top = rect.top;
        
        // 检查是否超出屏幕右边界
        if (left + tooltipRect.width > window.innerWidth) {
            left = rect.left - tooltipRect.width - 10;
        }
        
        // 检查是否超出屏幕下边界
        if (top + tooltipRect.height > window.innerHeight) {
            top = window.innerHeight - tooltipRect.height - 10;
        }
        
        this.tooltip.style.left = left + 'px';
        this.tooltip.style.top = top + 'px';
    }

    /**
     * 显示右键菜单
     */
    showContextMenu(event) {
        const menu = document.createElement('div');
        menu.className = 'item-context-menu';
        menu.style.left = event.pageX + 'px';
        menu.style.top = event.pageY + 'px';
        
        const item = this.itemInstance.item;
        const canUse = this.itemLogic && this.itemLogic.itemEffects.has(item.id);
        
        menu.innerHTML = `
            <div class="menu-item ${canUse ? '' : 'disabled'}" data-action="use">
                <span class="menu-icon">⚡</span>
                使用
            </div>
            <div class="menu-item" data-action="drop">
                <span class="menu-icon">🗑️</span>
                丢弃
            </div>
            <div class="menu-item" data-action="info">
                <span class="menu-icon">ℹ️</span>
                详情
            </div>
        `;
        
        // 添加菜单事件
        menu.addEventListener('click', (e) => {
            const action = e.target.closest('[data-action]');
            if (action) {
                this.handleContextMenuAction(action.dataset.action);
                menu.remove();
            }
        });
        
        document.body.appendChild(menu);
        
        // 点击其他地方关闭菜单
        const closeMenu = (e) => {
            if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        };
        
        setTimeout(() => {
            document.addEventListener('click', closeMenu);
        }, 100);
    }

    /**
     * 处理右键菜单操作
     */
    handleContextMenuAction(action) {
        const event = new CustomEvent('item-action', {
            detail: {
                action: action,
                itemInstance: this.itemInstance,
                component: this
            }
        });
        
        document.dispatchEvent(event);
    }

    /**
     * 生成物品颜色
     */
    generateItemColor(type) {
        const colorMap = {
            'weapon': { primary: '#ff6b6b', secondary: '#ee5a24', text: '#fff' },
            'armor': { primary: '#4ecdc4', secondary: '#44a3aa', text: '#fff' },
            'consumable': { primary: '#95e1d3', secondary: '#3fc1c9', text: '#2d3436' },
            'material': { primary: '#f9ca24', secondary: '#f0932b', text: '#2d3436' },
            'quest': { primary: '#a29bfe', secondary: '#6c5ce7', text: '#fff' },
            'misc': { primary: '#fd79a8', secondary: '#e84393', text: '#fff' }
        };
        
        return colorMap[type] || { primary: '#ddd', secondary: '#bbb', text: '#2d3436' };
    }

    /**
     * 获取物品类型图标
     */
    getItemTypeIcon(type) {
        const iconMap = {
            'weapon': '⚔️',
            'armor': '🛡️',
            'consumable': '🧪',
            'material': '💎',
            'quest': '📜',
            'misc': '📦'
        };
        
        return iconMap[type] || '❓';
    }

    /**
     * 获取物品类型名称
     */
    getItemTypeName(type) {
        const nameMap = {
            'weapon': '武器',
            'armor': '护甲',
            'consumable': '消耗品',
            'material': '材料',
            'quest': '任务物品',
            'misc': '杂物'
        };
        
        return nameMap[type] || '未知';
    }

    /**
     * 格式化数量显示
     */
    formatQuantity(quantity) {
        if (quantity >= 1000) {
            return Math.floor(quantity / 1000) + 'k';
        }
        return quantity.toString();
    }

    /**
     * 更新物品显示
     */
    update() {
        if (!this.element) return;
        
        const newElement = this.createElement();
        this.element.parentNode.replaceChild(newElement, this.element);
        this.element = newElement;
    }

    /**
     * 销毁组件
     */
    destroy() {
        this.hideTooltip();
        
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        
        this.element = null;
        this.tooltip = null;
    }
}