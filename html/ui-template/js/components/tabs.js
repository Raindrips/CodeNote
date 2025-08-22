/**
 * 选项卡组件JavaScript
 * 处理选项卡的切换和内容显示
 */

/**
 * 初始化选项卡
 */
function initTabs() {
    console.log('初始化选项卡组件...');
    
    // 初始化所有选项卡组
    document.querySelectorAll('.tabs').forEach(tabGroup => {
        initTabGroup(tabGroup);
    });
}

/**
 * 初始化单个选项卡组
 * @param {HTMLElement} tabGroup - 选项卡组元素
 */
function initTabGroup(tabGroup) {
    const tabButtons = tabGroup.querySelectorAll('.tab-btn');
    const tabPanes = tabGroup.querySelectorAll('.tab-pane');
    
    if (tabButtons.length === 0 || tabPanes.length === 0) return;
    
    // 为每个选项卡按钮添加点击事件
    tabButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            switchTab(tabGroup, index);
        });
        
        // 添加键盘导航支持
        button.addEventListener('keydown', (e) => {
            handleTabKeyboard(e, tabGroup, index);
        });
    });
    
    // 确保有一个活动的选项卡
    const activeButton = tabGroup.querySelector('.tab-btn.active');
    if (!activeButton && tabButtons.length > 0) {
        switchTab(tabGroup, 0);
    }
}

/**
 * 切换选项卡
 * @param {HTMLElement} tabGroup - 选项卡组元素
 * @param {number} index - 要激活的选项卡索引
 */
function switchTab(tabGroup, index) {
    const tabButtons = tabGroup.querySelectorAll('.tab-btn');
    const tabPanes = tabGroup.querySelectorAll('.tab-pane');
    
    if (index < 0 || index >= tabButtons.length) return;
    
    const targetButton = tabButtons[index];
    const targetTab = targetButton.getAttribute('data-tab');
    const targetPane = tabGroup.querySelector(`#${targetTab}`) || tabPanes[index];
    
    if (!targetPane) return;
    
    // 移除所有活动状态
    tabButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
        btn.setAttribute('tabindex', '-1');
    });
    
    tabPanes.forEach(pane => {
        pane.classList.remove('active');
        pane.setAttribute('aria-hidden', 'true');
    });
    
    // 设置新的活动状态
    targetButton.classList.add('active');
    targetButton.setAttribute('aria-selected', 'true');
    targetButton.setAttribute('tabindex', '0');
    
    targetPane.classList.add('active');
    targetPane.setAttribute('aria-hidden', 'false');
    
    // 触发切换事件
    tabGroup.dispatchEvent(new CustomEvent('tabSwitch', {
        detail: {
            activeIndex: index,
            activeButton: targetButton,
            activePane: targetPane,
            previousIndex: Array.from(tabButtons).findIndex(btn => 
                btn.classList.contains('active') && btn !== targetButton
            )
        }
    }));
    
    // 添加切换动画
    targetPane.style.opacity = '0';
    targetPane.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
        targetPane.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        targetPane.style.opacity = '1';
        targetPane.style.transform = 'translateY(0)';
    }, 10);
    
    // 清理动画样式
    setTimeout(() => {
        targetPane.style.transition = '';
        targetPane.style.opacity = '';
        targetPane.style.transform = '';
    }, 350);
}

/**
 * 处理选项卡键盘导航
 * @param {KeyboardEvent} e - 键盘事件
 * @param {HTMLElement} tabGroup - 选项卡组元素
 * @param {number} currentIndex - 当前选项卡索引
 */
function handleTabKeyboard(e, tabGroup, currentIndex) {
    const tabButtons = tabGroup.querySelectorAll('.tab-btn');
    let newIndex = currentIndex;
    
    switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
            e.preventDefault();
            newIndex = currentIndex > 0 ? currentIndex - 1 : tabButtons.length - 1;
            break;
            
        case 'ArrowRight':
        case 'ArrowDown':
            e.preventDefault();
            newIndex = currentIndex < tabButtons.length - 1 ? currentIndex + 1 : 0;
            break;
            
        case 'Home':
            e.preventDefault();
            newIndex = 0;
            break;
            
        case 'End':
            e.preventDefault();
            newIndex = tabButtons.length - 1;
            break;
            
        case 'Enter':
        case ' ':
            e.preventDefault();
            switchTab(tabGroup, currentIndex);
            return;
            
        default:
            return;
    }
    
    // 切换到新选项卡并聚焦
    switchTab(tabGroup, newIndex);
    tabButtons[newIndex].focus();
}

/**
 * 选项卡工具类
 */
class TabUtils {
    /**
     * 创建选项卡组
     * @param {Object} options - 选项卡配置
     * @returns {HTMLElement} 选项卡组元素
     */
    static create(options = {}) {
        const {
            id = 'tabs-' + Date.now(),
            className = '',
            tabs = [],
            activeIndex = 0,
            orientation = 'horizontal' // horizontal, vertical
        } = options;
        
        if (tabs.length === 0) {
            console.warn('选项卡配置为空');
            return null;
        }
        
        // 创建选项卡组容器
        const tabGroup = document.createElement('div');
        tabGroup.className = `tabs tabs-${orientation} ${className}`.trim();
        tabGroup.id = id;
        
        // 创建选项卡导航
        const tabNav = document.createElement('div');
        tabNav.className = 'tab-nav';
        tabNav.setAttribute('role', 'tablist');
        
        // 创建选项卡内容容器
        const tabContent = document.createElement('div');
        tabContent.className = 'tab-content';
        
        // 创建选项卡按钮和内容面板
        tabs.forEach((tab, index) => {
            const {
                id: tabId = `tab-${Date.now()}-${index}`,
                title = `选项卡 ${index + 1}`,
                content = '',
                disabled = false,
                icon = ''
            } = tab;
            
            // 创建选项卡按钮
            const button = document.createElement('button');
            button.className = `tab-btn ${index === activeIndex ? 'active' : ''}`;
            button.setAttribute('data-tab', tabId);
            button.setAttribute('role', 'tab');
            button.setAttribute('aria-selected', index === activeIndex ? 'true' : 'false');
            button.setAttribute('aria-controls', tabId);
            button.setAttribute('tabindex', index === activeIndex ? '0' : '-1');
            button.disabled = disabled;
            
            if (icon) {
                const iconElement = document.createElement('i');
                iconElement.className = icon;
                button.appendChild(iconElement);
                button.appendChild(document.createTextNode(' '));
            }
            
            button.appendChild(document.createTextNode(title));
            tabNav.appendChild(button);
            
            // 创建选项卡内容面板
            const pane = document.createElement('div');
            pane.className = `tab-pane ${index === activeIndex ? 'active' : ''}`;
            pane.id = tabId;
            pane.setAttribute('role', 'tabpanel');
            pane.setAttribute('aria-labelledby', button.id || `btn-${tabId}`);
            pane.setAttribute('aria-hidden', index === activeIndex ? 'false' : 'true');
            
            if (typeof content === 'string') {
                pane.innerHTML = content;
            } else if (content instanceof HTMLElement) {
                pane.appendChild(content);
            }
            
            tabContent.appendChild(pane);
        });
        
        tabGroup.appendChild(tabNav);
        tabGroup.appendChild(tabContent);
        
        // 初始化选项卡组
        initTabGroup(tabGroup);
        
        return tabGroup;
    }
    
    /**
     * 添加选项卡
     * @param {HTMLElement|string} tabGroup - 选项卡组元素或ID
     * @param {Object} tabConfig - 选项卡配置
     * @param {number} index - 插入位置，默认为末尾
     */
    static addTab(tabGroup, tabConfig, index = -1) {
        const group = typeof tabGroup === 'string' ? document.getElementById(tabGroup) : tabGroup;
        if (!group) return;
        
        const {
            id: tabId = `tab-${Date.now()}`,
            title = '新选项卡',
            content = '',
            icon = ''
        } = tabConfig;
        
        const tabNav = group.querySelector('.tab-nav');
        const tabContent = group.querySelector('.tab-content');
        const existingButtons = tabNav.querySelectorAll('.tab-btn');
        
        // 创建选项卡按钮
        const button = document.createElement('button');
        button.className = 'tab-btn';
        button.setAttribute('data-tab', tabId);
        button.setAttribute('role', 'tab');
        button.setAttribute('aria-selected', 'false');
        button.setAttribute('aria-controls', tabId);
        button.setAttribute('tabindex', '-1');
        
        if (icon) {
            const iconElement = document.createElement('i');
            iconElement.className = icon;
            button.appendChild(iconElement);
            button.appendChild(document.createTextNode(' '));
        }
        
        button.appendChild(document.createTextNode(title));
        
        // 创建选项卡内容面板
        const pane = document.createElement('div');
        pane.className = 'tab-pane';
        pane.id = tabId;
        pane.setAttribute('role', 'tabpanel');
        pane.setAttribute('aria-labelledby', button.id || `btn-${tabId}`);
        pane.setAttribute('aria-hidden', 'true');
        
        if (typeof content === 'string') {
            pane.innerHTML = content;
        } else if (content instanceof HTMLElement) {
            pane.appendChild(content);
        }
        
        // 插入到指定位置
        if (index >= 0 && index < existingButtons.length) {
            tabNav.insertBefore(button, existingButtons[index]);
            tabContent.insertBefore(pane, tabContent.children[index]);
        } else {
            tabNav.appendChild(button);
            tabContent.appendChild(pane);
        }
        
        // 重新初始化选项卡组
        initTabGroup(group);
        
        return { button, pane };
    }
    
    /**
     * 移除选项卡
     * @param {HTMLElement|string} tabGroup - 选项卡组元素或ID
     * @param {number|string} target - 选项卡索引或ID
     */
    static removeTab(tabGroup, target) {
        const group = typeof tabGroup === 'string' ? document.getElementById(tabGroup) : tabGroup;
        if (!group) return;
        
        let button, pane;
        
        if (typeof target === 'number') {
            // 按索引移除
            const buttons = group.querySelectorAll('.tab-btn');
            const panes = group.querySelectorAll('.tab-pane');
            button = buttons[target];
            pane = panes[target];
        } else {
            // 按ID移除
            button = group.querySelector(`[data-tab="${target}"]`);
            pane = group.querySelector(`#${target}`);
        }
        
        if (!button || !pane) return;
        
        const wasActive = button.classList.contains('active');
        
        // 移除元素
        button.remove();
        pane.remove();
        
        // 如果移除的是活动选项卡，激活下一个
        if (wasActive) {
            const remainingButtons = group.querySelectorAll('.tab-btn');
            if (remainingButtons.length > 0) {
                switchTab(group, 0);
            }
        }
    }
    
    /**
     * 激活指定选项卡
     * @param {HTMLElement|string} tabGroup - 选项卡组元素或ID
     * @param {number|string} target - 选项卡索引或ID
     */
    static activateTab(tabGroup, target) {
        const group = typeof tabGroup === 'string' ? document.getElementById(tabGroup) : tabGroup;
        if (!group) return;
        
        let index;
        
        if (typeof target === 'number') {
            index = target;
        } else {
            const buttons = group.querySelectorAll('.tab-btn');
            index = Array.from(buttons).findIndex(btn => 
                btn.getAttribute('data-tab') === target
            );
        }
        
        if (index >= 0) {
            switchTab(group, index);
        }
    }
    
    /**
     * 获取活动选项卡信息
     * @param {HTMLElement|string} tabGroup - 选项卡组元素或ID
     * @returns {Object|null}
     */
    static getActiveTab(tabGroup) {
        const group = typeof tabGroup === 'string' ? document.getElementById(tabGroup) : tabGroup;
        if (!group) return null;
        
        const activeButton = group.querySelector('.tab-btn.active');
        const activePane = group.querySelector('.tab-pane.active');
        
        if (!activeButton || !activePane) return null;
        
        const buttons = group.querySelectorAll('.tab-btn');
        const index = Array.from(buttons).indexOf(activeButton);
        
        return {
            index,
            id: activePane.id,
            title: activeButton.textContent.trim(),
            button: activeButton,
            pane: activePane
        };
    }
}

// 导出到全局
window.TabUtils = TabUtils;
window.switchTab = switchTab;

// 添加垂直选项卡样式（如果不存在）
if (!document.querySelector('#tabs-styles')) {
    const style = document.createElement('style');
    style.id = 'tabs-styles';
    style.textContent = `
        .tabs-vertical {
            display: flex;
            gap: 1rem;
        }
        
        .tabs-vertical .tab-nav {
            flex-direction: column;
            border-right: 1px solid #dee2e6;
            border-bottom: none;
            padding-right: 1rem;
            min-width: 200px;
        }
        
        .tabs-vertical .tab-btn {
            text-align: left;
            border-bottom: none;
            border-right: 2px solid transparent;
            padding: 0.75rem 1rem;
        }
        
        .tabs-vertical .tab-btn.active {
            border-right-color: var(--primary-color);
            background-color: rgba(0, 123, 255, 0.1);
        }
        
        .tabs-vertical .tab-content {
            flex: 1;
        }
        
        .tab-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        
        .tab-btn:disabled:hover {
            color: var(--secondary-color);
            border-bottom-color: transparent;
        }
        
        .tabs-vertical .tab-btn:disabled:hover {
            border-right-color: transparent;
            background-color: transparent;
        }
    `;
    document.head.appendChild(style);
}

