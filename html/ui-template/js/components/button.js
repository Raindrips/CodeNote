/**
 * 按钮组件JavaScript
 * 处理各种按钮的交互功能
 */

/**
 * 初始化按钮组件
 */
function initButtons() {
    console.log('初始化按钮组件...');
    
    // 初始化加载按钮
    initLoadingButtons();
    
    // 初始化波纹效果
    initRippleEffect();
    
    // 初始化按钮组
    initButtonGroups();
    
    // 初始化切换按钮
    initToggleButtons();
}

/**
 * 初始化加载按钮
 */
function initLoadingButtons() {
    const loadingBtn = document.getElementById('loadingBtn');
    if (!loadingBtn) return;
    
    loadingBtn.addEventListener('click', function() {
        toggleLoadingState(this);
        
        // 模拟异步操作
        setTimeout(() => {
            toggleLoadingState(this);
        }, 3000);
    });
}

/**
 * 切换按钮加载状态
 * @param {HTMLElement} button - 按钮元素
 */
function toggleLoadingState(button) {
    if (!button) return;
    
    const isLoading = button.classList.contains('loading');
    
    if (isLoading) {
        // 停止加载
        button.classList.remove('loading');
        button.disabled = false;
        
        // 触发自定义事件
        button.dispatchEvent(new CustomEvent('loadingEnd', {
            detail: { button }
        }));
    } else {
        // 开始加载
        button.classList.add('loading');
        button.disabled = true;
        
        // 触发自定义事件
        button.dispatchEvent(new CustomEvent('loadingStart', {
            detail: { button }
        }));
    }
}

/**
 * 初始化波纹效果
 */
function initRippleEffect() {
    // 为所有按钮添加波纹效果
    document.querySelectorAll('.btn').forEach(button => {
        if (!button.classList.contains('no-ripple')) {
            addRippleEffect(button);
        }
    });
}

/**
 * 为按钮添加波纹效果
 * @param {HTMLElement} button - 按钮元素
 */
function addRippleEffect(button) {
    button.addEventListener('click', function(e) {
        // 创建波纹元素
        const ripple = document.createElement('span');
        ripple.classList.add('ripple-effect');
        
        // 计算波纹位置和大小
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        // 设置波纹样式
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        // 添加到按钮中
        this.appendChild(ripple);
        
        // 动画结束后移除波纹
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    });
}

/**
 * 初始化按钮组
 */
function initButtonGroups() {
    document.querySelectorAll('.btn-group').forEach(group => {
        const buttons = group.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                // 单选模式
                if (group.classList.contains('btn-group-radio')) {
                    buttons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                }
                
                // 多选模式
                if (group.classList.contains('btn-group-checkbox')) {
                    this.classList.toggle('active');
                }
                
                // 触发组变化事件
                group.dispatchEvent(new CustomEvent('buttonGroupChange', {
                    detail: {
                        activeButtons: Array.from(group.querySelectorAll('.btn.active')),
                        clickedButton: this
                    }
                }));
            });
        });
    });
}

/**
 * 初始化切换按钮
 */
function initToggleButtons() {
    document.querySelectorAll('.btn-toggle').forEach(button => {
        button.addEventListener('click', function() {
            const isPressed = this.getAttribute('aria-pressed') === 'true';
            this.setAttribute('aria-pressed', !isPressed);
            this.classList.toggle('active');
            
            // 触发切换事件
            this.dispatchEvent(new CustomEvent('toggle', {
                detail: {
                    pressed: !isPressed,
                    button: this
                }
            }));
        });
    });
}

/**
 * 按钮工具类
 */
class ButtonUtils {
    /**
     * 设置按钮加载状态
     * @param {HTMLElement|string} button - 按钮元素或选择器
     * @param {boolean} loading - 是否加载中
     */
    static setLoading(button, loading = true) {
        const btn = typeof button === 'string' ? document.querySelector(button) : button;
        if (!btn) return;
        
        if (loading) {
            btn.classList.add('loading');
            btn.disabled = true;
        } else {
            btn.classList.remove('loading');
            btn.disabled = false;
        }
    }
    
    /**
     * 禁用按钮
     * @param {HTMLElement|string} button - 按钮元素或选择器
     * @param {boolean} disabled - 是否禁用
     */
    static setDisabled(button, disabled = true) {
        const btn = typeof button === 'string' ? document.querySelector(button) : button;
        if (!btn) return;
        
        btn.disabled = disabled;
        if (disabled) {
            btn.classList.add('disabled');
        } else {
            btn.classList.remove('disabled');
        }
    }
    
    /**
     * 设置按钮文本
     * @param {HTMLElement|string} button - 按钮元素或选择器
     * @param {string} text - 新文本
     */
    static setText(button, text) {
        const btn = typeof button === 'string' ? document.querySelector(button) : button;
        if (!btn) return;
        
        const textElement = btn.querySelector('.btn-text') || btn;
        textElement.textContent = text;
    }
    
    /**
     * 添加按钮图标
     * @param {HTMLElement|string} button - 按钮元素或选择器
     * @param {string} iconClass - 图标类名
     * @param {string} position - 图标位置 ('before' | 'after')
     */
    static addIcon(button, iconClass, position = 'before') {
        const btn = typeof button === 'string' ? document.querySelector(button) : button;
        if (!btn) return;
        
        const icon = document.createElement('i');
        icon.className = iconClass;
        
        if (position === 'before') {
            btn.insertBefore(icon, btn.firstChild);
        } else {
            btn.appendChild(icon);
        }
    }
    
    /**
     * 创建按钮
     * @param {Object} options - 按钮配置
     * @returns {HTMLElement} 按钮元素
     */
    static create(options = {}) {
        const {
            text = '按钮',
            type = 'button',
            variant = 'primary',
            size = '',
            icon = '',
            iconPosition = 'before',
            disabled = false,
            loading = false,
            className = '',
            onClick = null
        } = options;
        
        const button = document.createElement('button');
        button.type = type;
        button.className = `btn btn-${variant} ${size ? `btn-${size}` : ''} ${className}`.trim();
        
        if (disabled) button.disabled = true;
        if (loading) button.classList.add('loading');
        
        // 添加图标
        if (icon) {
            const iconElement = document.createElement('i');
            iconElement.className = icon;
            
            if (iconPosition === 'before') {
                button.appendChild(iconElement);
            }
        }
        
        // 添加文本
        const textElement = document.createElement('span');
        textElement.className = 'btn-text';
        textElement.textContent = text;
        button.appendChild(textElement);
        
        // 添加图标（after）
        if (icon && iconPosition === 'after') {
            const iconElement = document.createElement('i');
            iconElement.className = icon;
            button.appendChild(iconElement);
        }
        
        // 添加加载动画
        if (loading) {
            const spinner = document.createElement('span');
            spinner.className = 'btn-spinner';
            button.appendChild(spinner);
        }
        
        // 添加点击事件
        if (onClick && typeof onClick === 'function') {
            button.addEventListener('click', onClick);
        }
        
        // 添加波纹效果
        addRippleEffect(button);
        
        return button;
    }
}

// 导出到全局
window.ButtonUtils = ButtonUtils;
window.toggleLoadingState = toggleLoadingState;

// 添加波纹效果的CSS（如果不存在）
if (!document.querySelector('#ripple-styles')) {
    const style = document.createElement('style');
    style.id = 'ripple-styles';
    style.textContent = `
        .btn {
            position: relative;
            overflow: hidden;
        }
        
        .ripple-effect {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

