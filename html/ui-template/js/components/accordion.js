/**
 * 手风琴组件JavaScript
 * 处理手风琴的展开、折叠和交互功能
 */

/**
 * 初始化手风琴
 */
function initAccordion() {
    console.log('初始化手风琴组件...');
    
    // 初始化所有手风琴组
    document.querySelectorAll('.accordion').forEach(accordion => {
        initAccordionGroup(accordion);
    });
}

/**
 * 初始化单个手风琴组
 * @param {HTMLElement} accordion - 手风琴组元素
 */
function initAccordionGroup(accordion) {
    const items = accordion.querySelectorAll('.accordion-item');
    const allowMultiple = accordion.hasAttribute('data-allow-multiple');
    
    items.forEach((item, index) => {
        const button = item.querySelector('.accordion-btn');
        const content = item.querySelector('.accordion-content');
        
        if (!button || !content) return;
        
        // 设置初始状态
        const isOpen = item.classList.contains('active');
        button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        content.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
        
        // 设置唯一ID
        const itemId = item.id || `accordion-item-${Date.now()}-${index}`;
        const contentId = content.id || `${itemId}-content`;
        const buttonId = button.id || `${itemId}-button`;
        
        item.id = itemId;
        content.id = contentId;
        button.id = buttonId;
        
        button.setAttribute('aria-controls', contentId);
        content.setAttribute('aria-labelledby', buttonId);
        
        // 添加点击事件
        button.addEventListener('click', () => {
            toggleAccordionItem(accordion, item, allowMultiple);
        });
        
        // 添加键盘导航支持
        button.addEventListener('keydown', (e) => {
            handleAccordionKeyboard(e, accordion, index);
        });
        
        // 设置初始高度
        if (isOpen) {
            content.style.maxHeight = content.scrollHeight + 'px';
        } else {
            content.style.maxHeight = '0';
        }
    });
}

/**
 * 切换手风琴项目
 * @param {HTMLElement} accordion - 手风琴组元素
 * @param {HTMLElement} item - 手风琴项目元素
 * @param {boolean} allowMultiple - 是否允许多个项目同时展开
 */
function toggleAccordionItem(accordion, item, allowMultiple = false) {
    const button = item.querySelector('.accordion-btn');
    const content = item.querySelector('.accordion-content');
    const icon = button.querySelector('i');
    
    if (!button || !content) return;
    
    const isOpen = item.classList.contains('active');
    
    // 如果不允许多个展开，先关闭其他项目
    if (!allowMultiple && !isOpen) {
        accordion.querySelectorAll('.accordion-item.active').forEach(activeItem => {
            if (activeItem !== item) {
                collapseAccordionItem(activeItem);
            }
        });
    }
    
    if (isOpen) {
        collapseAccordionItem(item);
    } else {
        expandAccordionItem(item);
    }
    
    // 触发切换事件
    accordion.dispatchEvent(new CustomEvent('accordionToggle', {
        detail: {
            item,
            isOpen: !isOpen,
            button,
            content
        }
    }));
}

/**
 * 展开手风琴项目
 * @param {HTMLElement} item - 手风琴项目元素
 */
function expandAccordionItem(item) {
    const button = item.querySelector('.accordion-btn');
    const content = item.querySelector('.accordion-content');
    const icon = button.querySelector('i');
    
    item.classList.add('active');
    button.classList.add('active');
    content.classList.add('active');
    
    button.setAttribute('aria-expanded', 'true');
    content.setAttribute('aria-hidden', 'false');
    
    // 设置高度动画
    content.style.maxHeight = content.scrollHeight + 'px';
    
    // 旋转图标
    if (icon) {
        icon.style.transform = 'rotate(180deg)';
    }
    
    // 触发展开事件
    item.dispatchEvent(new CustomEvent('accordionExpand', {
        detail: { item, button, content }
    }));
}

/**
 * 折叠手风琴项目
 * @param {HTMLElement} item - 手风琴项目元素
 */
function collapseAccordionItem(item) {
    const button = item.querySelector('.accordion-btn');
    const content = item.querySelector('.accordion-content');
    const icon = button.querySelector('i');
    
    item.classList.remove('active');
    button.classList.remove('active');
    content.classList.remove('active');
    
    button.setAttribute('aria-expanded', 'false');
    content.setAttribute('aria-hidden', 'true');
    
    // 设置高度动画
    content.style.maxHeight = '0';
    
    // 旋转图标
    if (icon) {
        icon.style.transform = 'rotate(0deg)';
    }
    
    // 触发折叠事件
    item.dispatchEvent(new CustomEvent('accordionCollapse', {
        detail: { item, button, content }
    }));
}

/**
 * 处理手风琴键盘导航
 * @param {KeyboardEvent} e - 键盘事件
 * @param {HTMLElement} accordion - 手风琴组元素
 * @param {number} currentIndex - 当前项目索引
 */
function handleAccordionKeyboard(e, accordion, currentIndex) {
    const buttons = accordion.querySelectorAll('.accordion-btn');
    let newIndex = currentIndex;
    
    switch (e.key) {
        case 'ArrowDown':
            e.preventDefault();
            newIndex = currentIndex < buttons.length - 1 ? currentIndex + 1 : 0;
            break;
            
        case 'ArrowUp':
            e.preventDefault();
            newIndex = currentIndex > 0 ? currentIndex - 1 : buttons.length - 1;
            break;
            
        case 'Home':
            e.preventDefault();
            newIndex = 0;
            break;
            
        case 'End':
            e.preventDefault();
            newIndex = buttons.length - 1;
            break;
            
        case 'Enter':
        case ' ':
            e.preventDefault();
            const item = buttons[currentIndex].closest('.accordion-item');
            const allowMultiple = accordion.hasAttribute('data-allow-multiple');
            toggleAccordionItem(accordion, item, allowMultiple);
            return;
            
        default:
            return;
    }
    
    // 聚焦到新按钮
    buttons[newIndex].focus();
}

/**
 * 手风琴工具类
 */
class AccordionUtils {
    /**
     * 创建手风琴组
     * @param {Object} options - 手风琴配置
     * @returns {HTMLElement} 手风琴组元素
     */
    static create(options = {}) {
        const {
            id = 'accordion-' + Date.now(),
            className = '',
            items = [],
            allowMultiple = false,
            defaultOpen = []
        } = options;
        
        if (items.length === 0) {
            console.warn('手风琴配置为空');
            return null;
        }
        
        // 创建手风琴容器
        const accordion = document.createElement('div');
        accordion.className = `accordion ${className}`.trim();
        accordion.id = id;
        
        if (allowMultiple) {
            accordion.setAttribute('data-allow-multiple', 'true');
        }
        
        // 创建手风琴项目
        items.forEach((itemConfig, index) => {
            const {
                id: itemId = `accordion-item-${Date.now()}-${index}`,
                title = `项目 ${index + 1}`,
                content = '',
                disabled = false,
                icon = 'fas fa-chevron-down'
            } = itemConfig;
            
            const isOpen = defaultOpen.includes(index);
            
            // 创建项目容器
            const item = document.createElement('div');
            item.className = `accordion-item ${isOpen ? 'active' : ''}`;
            item.id = itemId;
            
            // 创建头部
            const header = document.createElement('div');
            header.className = 'accordion-header';
            
            const button = document.createElement('button');
            button.className = `accordion-btn ${isOpen ? 'active' : ''}`;
            button.disabled = disabled;
            button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            button.setAttribute('aria-controls', `${itemId}-content`);
            
            const titleSpan = document.createElement('span');
            titleSpan.textContent = title;
            button.appendChild(titleSpan);
            
            if (icon) {
                const iconElement = document.createElement('i');
                iconElement.className = icon;
                if (isOpen) {
                    iconElement.style.transform = 'rotate(180deg)';
                }
                button.appendChild(iconElement);
            }
            
            header.appendChild(button);
            item.appendChild(header);
            
            // 创建内容
            const contentWrapper = document.createElement('div');
            contentWrapper.className = `accordion-content ${isOpen ? 'active' : ''}`;
            contentWrapper.id = `${itemId}-content`;
            contentWrapper.setAttribute('aria-labelledby', button.id || `${itemId}-button`);
            contentWrapper.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
            
            const contentBody = document.createElement('div');
            contentBody.className = 'accordion-body';
            
            if (typeof content === 'string') {
                contentBody.innerHTML = content;
            } else if (content instanceof HTMLElement) {
                contentBody.appendChild(content);
            }
            
            contentWrapper.appendChild(contentBody);
            item.appendChild(contentWrapper);
            
            accordion.appendChild(item);
        });
        
        // 初始化手风琴组
        initAccordionGroup(accordion);
        
        return accordion;
    }
    
    /**
     * 展开指定项目
     * @param {HTMLElement|string} accordion - 手风琴组元素或ID
     * @param {number|string} target - 项目索引或ID
     */
    static expand(accordion, target) {
        const group = typeof accordion === 'string' ? document.getElementById(accordion) : accordion;
        if (!group) return;
        
        const item = this._getItem(group, target);
        if (item && !item.classList.contains('active')) {
            const allowMultiple = group.hasAttribute('data-allow-multiple');
            toggleAccordionItem(group, item, allowMultiple);
        }
    }
    
    /**
     * 折叠指定项目
     * @param {HTMLElement|string} accordion - 手风琴组元素或ID
     * @param {number|string} target - 项目索引或ID
     */
    static collapse(accordion, target) {
        const group = typeof accordion === 'string' ? document.getElementById(accordion) : accordion;
        if (!group) return;
        
        const item = this._getItem(group, target);
        if (item && item.classList.contains('active')) {
            collapseAccordionItem(item);
        }
    }
    
    /**
     * 切换指定项目
     * @param {HTMLElement|string} accordion - 手风琴组元素或ID
     * @param {number|string} target - 项目索引或ID
     */
    static toggle(accordion, target) {
        const group = typeof accordion === 'string' ? document.getElementById(accordion) : accordion;
        if (!group) return;
        
        const item = this._getItem(group, target);
        if (item) {
            const allowMultiple = group.hasAttribute('data-allow-multiple');
            toggleAccordionItem(group, item, allowMultiple);
        }
    }
    
    /**
     * 展开所有项目
     * @param {HTMLElement|string} accordion - 手风琴组元素或ID
     */
    static expandAll(accordion) {
        const group = typeof accordion === 'string' ? document.getElementById(accordion) : accordion;
        if (!group || !group.hasAttribute('data-allow-multiple')) return;
        
        group.querySelectorAll('.accordion-item').forEach(item => {
            if (!item.classList.contains('active')) {
                expandAccordionItem(item);
            }
        });
    }
    
    /**
     * 折叠所有项目
     * @param {HTMLElement|string} accordion - 手风琴组元素或ID
     */
    static collapseAll(accordion) {
        const group = typeof accordion === 'string' ? document.getElementById(accordion) : accordion;
        if (!group) return;
        
        group.querySelectorAll('.accordion-item.active').forEach(item => {
            collapseAccordionItem(item);
        });
    }
    
    /**
     * 获取活动项目
     * @param {HTMLElement|string} accordion - 手风琴组元素或ID
     * @returns {Array} 活动项目数组
     */
    static getActiveItems(accordion) {
        const group = typeof accordion === 'string' ? document.getElementById(accordion) : accordion;
        if (!group) return [];
        
        const activeItems = group.querySelectorAll('.accordion-item.active');
        return Array.from(activeItems).map((item, index) => ({
            index: Array.from(group.querySelectorAll('.accordion-item')).indexOf(item),
            id: item.id,
            element: item
        }));
    }
    
    /**
     * 添加项目
     * @param {HTMLElement|string} accordion - 手风琴组元素或ID
     * @param {Object} itemConfig - 项目配置
     * @param {number} index - 插入位置，默认为末尾
     */
    static addItem(accordion, itemConfig, index = -1) {
        const group = typeof accordion === 'string' ? document.getElementById(accordion) : accordion;
        if (!group) return;
        
        const items = group.querySelectorAll('.accordion-item');
        const newAccordion = this.create({
            items: [itemConfig]
        });
        
        const newItem = newAccordion.querySelector('.accordion-item');
        
        if (index >= 0 && index < items.length) {
            group.insertBefore(newItem, items[index]);
        } else {
            group.appendChild(newItem);
        }
        
        // 重新初始化
        initAccordionGroup(group);
        
        return newItem;
    }
    
    /**
     * 移除项目
     * @param {HTMLElement|string} accordion - 手风琴组元素或ID
     * @param {number|string} target - 项目索引或ID
     */
    static removeItem(accordion, target) {
        const group = typeof accordion === 'string' ? document.getElementById(accordion) : accordion;
        if (!group) return;
        
        const item = this._getItem(group, target);
        if (item) {
            item.remove();
        }
    }
    
    /**
     * 获取项目元素
     * @private
     */
    static _getItem(accordion, target) {
        if (typeof target === 'number') {
            const items = accordion.querySelectorAll('.accordion-item');
            return items[target];
        } else {
            return accordion.querySelector(`#${target}`);
        }
    }
}

// 导出到全局
window.AccordionUtils = AccordionUtils;
window.toggleAccordionItem = toggleAccordionItem;
window.expandAccordionItem = expandAccordionItem;
window.collapseAccordionItem = collapseAccordionItem;

