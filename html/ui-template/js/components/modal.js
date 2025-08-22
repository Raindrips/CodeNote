/**
 * 模态框组件JavaScript
 * 处理模态框的显示、隐藏和交互功能
 */

let currentModal = null;

/**
 * 初始化模态框
 */
function initModal() {
    console.log('初始化模态框组件...');
    
    // 初始化模态框触发器
    initModalTriggers();
    
    // 初始化模态框关闭
    initModalClose();
    
    // 初始化键盘事件
    initModalKeyboard();
    
    // 初始化焦点管理
    initModalFocus();
}

/**
 * 初始化模态框触发器
 */
function initModalTriggers() {
    // 通过data-target属性触发
    document.querySelectorAll('[data-modal-target]').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = trigger.getAttribute('data-modal-target');
            const modal = document.getElementById(targetId);
            if (modal) {
                openModal(modal);
            }
        });
    });
    
    // 示例模态框按钮
    const openModalBtn = document.getElementById('openModal');
    const exampleModal = document.getElementById('exampleModal');
    
    if (openModalBtn && exampleModal) {
        openModalBtn.addEventListener('click', () => {
            openModal(exampleModal);
        });
    }
}

/**
 * 初始化模态框关闭
 */
function initModalClose() {
    // 关闭按钮
    document.querySelectorAll('.modal-close, [data-modal-close]').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const modal = closeBtn.closest('.modal');
            if (modal) {
                closeModal(modal);
            }
        });
    });
    
    // 点击遮罩层关闭
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', () => {
            const modal = overlay.closest('.modal');
            if (modal) {
                closeModal(modal);
            }
        });
    });
    
    // 示例模态框的关闭和取消按钮
    const closeModalBtn = document.getElementById('closeModal');
    const modalCancel = document.getElementById('modalCancel');
    const modalConfirm = document.getElementById('modalConfirm');
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            closeModal();
        });
    }
    
    if (modalCancel) {
        modalCancel.addEventListener('click', () => {
            closeModal();
        });
    }
    
    if (modalConfirm) {
        modalConfirm.addEventListener('click', () => {
            // 处理确认逻辑
            const input = document.getElementById('modalInput');
            if (input && input.value.trim()) {
                console.log('用户输入:', input.value);
                // 这里可以添加具体的确认处理逻辑
            }
            closeModal();
        });
    }
}

/**
 * 初始化键盘事件
 */
function initModalKeyboard() {
    document.addEventListener('keydown', (e) => {
        if (currentModal && e.key === 'Escape') {
            closeModal(currentModal);
        }
    });
}

/**
 * 初始化焦点管理
 */
function initModalFocus() {
    // 焦点陷阱将在openModal和closeModal函数中处理
}

/**
 * 打开模态框
 * @param {HTMLElement|string} modal - 模态框元素或ID
 */
function openModal(modal) {
    const modalElement = typeof modal === 'string' ? document.getElementById(modal) : modal;
    if (!modalElement) return;
    
    // 如果已有模态框打开，先关闭
    if (currentModal && currentModal !== modalElement) {
        closeModal(currentModal);
    }
    
    currentModal = modalElement;
    
    // 保存当前焦点元素
    modalElement._previousFocus = document.activeElement;
    
    // 显示模态框
    modalElement.classList.add('show');
    modalElement.style.display = 'flex';
    
    // 防止背景滚动
    document.body.style.overflow = 'hidden';
    
    // 设置焦点到模态框
    setTimeout(() => {
        const firstFocusable = modalElement.querySelector(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (firstFocusable) {
            firstFocusable.focus();
        }
    }, 100);
    
    // 添加动画类
    setTimeout(() => {
        modalElement.classList.add('animate-fadeIn');
        const container = modalElement.querySelector('.modal-container');
        if (container) {
            container.classList.add('animate-zoomIn');
        }
    }, 10);
    
    // 触发打开事件
    modalElement.dispatchEvent(new CustomEvent('modalOpen', {
        detail: { modal: modalElement }
    }));
    
    // 设置焦点陷阱
    setupFocusTrap(modalElement);
}

/**
 * 关闭模态框
 * @param {HTMLElement} modal - 模态框元素，如果不提供则关闭当前模态框
 */
function closeModal(modal = currentModal) {
    if (!modal) return;
    
    // 移除动画类并添加关闭动画
    modal.classList.remove('animate-fadeIn');
    modal.classList.add('animate-fadeOut');
    
    const container = modal.querySelector('.modal-container');
    if (container) {
        container.classList.remove('animate-zoomIn');
        container.classList.add('animate-zoomOut');
    }
    
    // 延迟隐藏模态框
    setTimeout(() => {
        modal.classList.remove('show', 'animate-fadeOut');
        modal.style.display = 'none';
        
        if (container) {
            container.classList.remove('animate-zoomOut');
        }
        
        // 恢复背景滚动
        document.body.style.overflow = '';
        
        // 恢复焦点
        if (modal._previousFocus) {
            modal._previousFocus.focus();
            modal._previousFocus = null;
        }
        
        // 清除当前模态框引用
        if (currentModal === modal) {
            currentModal = null;
        }
        
        // 触发关闭事件
        modal.dispatchEvent(new CustomEvent('modalClose', {
            detail: { modal }
        }));
        
        // 移除焦点陷阱
        removeFocusTrap(modal);
    }, 300);
}

/**
 * 设置焦点陷阱
 * @param {HTMLElement} modal - 模态框元素
 */
function setupFocusTrap(modal) {
    const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    function handleTabKey(e) {
        if (e.key !== 'Tab') return;
        
        if (e.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            // Tab
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }
    
    modal._focusTrapHandler = handleTabKey;
    modal.addEventListener('keydown', handleTabKey);
}

/**
 * 移除焦点陷阱
 * @param {HTMLElement} modal - 模态框元素
 */
function removeFocusTrap(modal) {
    if (modal._focusTrapHandler) {
        modal.removeEventListener('keydown', modal._focusTrapHandler);
        modal._focusTrapHandler = null;
    }
}

/**
 * 模态框工具类
 */
class ModalUtils {
    /**
     * 创建模态框
     * @param {Object} options - 模态框配置
     * @returns {HTMLElement} 模态框元素
     */
    static create(options = {}) {
        const {
            id = 'modal-' + Date.now(),
            title = '模态框标题',
            content = '模态框内容',
            showHeader = true,
            showFooter = true,
            closable = true,
            size = 'medium', // small, medium, large, fullscreen
            className = '',
            buttons = [
                { text: '取消', variant: 'secondary', action: 'close' },
                { text: '确认', variant: 'primary', action: 'confirm' }
            ]
        } = options;
        
        // 创建模态框结构
        const modal = document.createElement('div');
        modal.className = `modal ${className}`.trim();
        modal.id = id;
        
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        
        const container = document.createElement('div');
        container.className = `modal-container modal-${size}`;
        
        // 创建头部
        if (showHeader) {
            const header = document.createElement('div');
            header.className = 'modal-header';
            
            const titleElement = document.createElement('h3');
            titleElement.textContent = title;
            header.appendChild(titleElement);
            
            if (closable) {
                const closeBtn = document.createElement('button');
                closeBtn.className = 'modal-close';
                closeBtn.innerHTML = '<i class="fas fa-times"></i>';
                closeBtn.addEventListener('click', () => closeModal(modal));
                header.appendChild(closeBtn);
            }
            
            container.appendChild(header);
        }
        
        // 创建内容
        const body = document.createElement('div');
        body.className = 'modal-body';
        if (typeof content === 'string') {
            body.innerHTML = content;
        } else if (content instanceof HTMLElement) {
            body.appendChild(content);
        }
        container.appendChild(body);
        
        // 创建底部
        if (showFooter && buttons.length > 0) {
            const footer = document.createElement('div');
            footer.className = 'modal-footer';
            
            buttons.forEach(buttonConfig => {
                const button = document.createElement('button');
                button.className = `btn btn-${buttonConfig.variant || 'primary'}`;
                button.textContent = buttonConfig.text;
                
                button.addEventListener('click', () => {
                    if (buttonConfig.action === 'close') {
                        closeModal(modal);
                    } else if (buttonConfig.action === 'confirm') {
                        // 触发确认事件
                        modal.dispatchEvent(new CustomEvent('modalConfirm', {
                            detail: { modal, button }
                        }));
                        closeModal(modal);
                    } else if (typeof buttonConfig.onClick === 'function') {
                        buttonConfig.onClick(modal, button);
                    }
                });
                
                footer.appendChild(button);
            });
            
            container.appendChild(footer);
        }
        
        modal.appendChild(overlay);
        modal.appendChild(container);
        
        // 添加到页面
        document.body.appendChild(modal);
        
        return modal;
    }
    
    /**
     * 显示确认对话框
     * @param {Object} options - 配置选项
     * @returns {Promise<boolean>}
     */
    static confirm(options = {}) {
        return new Promise((resolve) => {
            const {
                title = '确认',
                message = '确定要执行此操作吗？',
                confirmText = '确认',
                cancelText = '取消'
            } = options;
            
            const modal = this.create({
                title,
                content: `<p>${message}</p>`,
                buttons: [
                    {
                        text: cancelText,
                        variant: 'secondary',
                        onClick: () => {
                            closeModal(modal);
                            resolve(false);
                        }
                    },
                    {
                        text: confirmText,
                        variant: 'primary',
                        onClick: () => {
                            closeModal(modal);
                            resolve(true);
                        }
                    }
                ]
            });
            
            openModal(modal);
            
            // 模态框关闭时清理
            modal.addEventListener('modalClose', () => {
                setTimeout(() => modal.remove(), 100);
            });
        });
    }
    
    /**
     * 显示警告对话框
     * @param {Object} options - 配置选项
     * @returns {Promise<void>}
     */
    static alert(options = {}) {
        return new Promise((resolve) => {
            const {
                title = '提示',
                message = '这是一个提示信息',
                buttonText = '确定'
            } = options;
            
            const modal = this.create({
                title,
                content: `<p>${message}</p>`,
                buttons: [
                    {
                        text: buttonText,
                        variant: 'primary',
                        onClick: () => {
                            closeModal(modal);
                            resolve();
                        }
                    }
                ]
            });
            
            openModal(modal);
            
            // 模态框关闭时清理
            modal.addEventListener('modalClose', () => {
                setTimeout(() => modal.remove(), 100);
            });
        });
    }
    
    /**
     * 显示输入对话框
     * @param {Object} options - 配置选项
     * @returns {Promise<string|null>}
     */
    static prompt(options = {}) {
        return new Promise((resolve) => {
            const {
                title = '输入',
                message = '请输入内容：',
                placeholder = '',
                defaultValue = '',
                confirmText = '确认',
                cancelText = '取消'
            } = options;
            
            const inputId = 'prompt-input-' + Date.now();
            const content = `
                <p>${message}</p>
                <div class="form-group">
                    <input type="text" id="${inputId}" class="form-input" 
                           placeholder="${placeholder}" value="${defaultValue}">
                </div>
            `;
            
            const modal = this.create({
                title,
                content,
                buttons: [
                    {
                        text: cancelText,
                        variant: 'secondary',
                        onClick: () => {
                            closeModal(modal);
                            resolve(null);
                        }
                    },
                    {
                        text: confirmText,
                        variant: 'primary',
                        onClick: () => {
                            const input = document.getElementById(inputId);
                            const value = input ? input.value : '';
                            closeModal(modal);
                            resolve(value);
                        }
                    }
                ]
            });
            
            openModal(modal);
            
            // 聚焦到输入框
            setTimeout(() => {
                const input = document.getElementById(inputId);
                if (input) {
                    input.focus();
                    input.select();
                }
            }, 100);
            
            // 模态框关闭时清理
            modal.addEventListener('modalClose', () => {
                setTimeout(() => modal.remove(), 100);
            });
        });
    }
}

// 导出到全局
window.ModalUtils = ModalUtils;
window.openModal = openModal;
window.closeModal = closeModal;

// 添加模态框尺寸样式（如果不存在）
if (!document.querySelector('#modal-styles')) {
    const style = document.createElement('style');
    style.id = 'modal-styles';
    style.textContent = `
        .modal-small .modal-container { max-width: 300px; }
        .modal-medium .modal-container { max-width: 500px; }
        .modal-large .modal-container { max-width: 800px; }
        .modal-fullscreen .modal-container { 
            max-width: 95vw; 
            max-height: 95vh; 
            width: 95vw; 
            height: 95vh; 
        }
        
        .modal-fullscreen .modal-body {
            flex: 1;
            overflow-y: auto;
        }
    `;
    document.head.appendChild(style);
}

