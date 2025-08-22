/**
 * 主JavaScript文件
 * 负责初始化所有组件和全局功能
 */

// 全局配置
const UIConfig = {
    animationDuration: 300,
    debounceDelay: 250,
    scrollOffset: 100,
    breakpoints: {
        xs: 576,
        sm: 768,
        md: 992,
        lg: 1200
    }
};

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('UI组件库初始化开始...');
    
    // 初始化所有组件
    initializeComponents();
    
    // 初始化全局功能
    initializeGlobalFeatures();
    
    console.log('UI组件库初始化完成');
});

/**
 * 初始化所有组件
 */
function initializeComponents() {
    // 初始化导航栏
    if (typeof initNavbar === 'function') {
        initNavbar();
    }
    
    // 初始化按钮组件
    if (typeof initButtons === 'function') {
        initButtons();
    }
    
    // 初始化模态框
    if (typeof initModal === 'function') {
        initModal();
    }
    
    // 初始化选项卡
    if (typeof initTabs === 'function') {
        initTabs();
    }
    
    // 初始化手风琴
    if (typeof initAccordion === 'function') {
        initAccordion();
    }
    
    // 初始化通知系统
    if (typeof initNotification === 'function') {
        initNotification();
    }
}

/**
 * 初始化全局功能
 */
function initializeGlobalFeatures() {
    // 平滑滚动
    initSmoothScroll();
    
    // 返回顶部按钮
    initBackToTop();
    
    // 响应式处理
    initResponsiveHandlers();
    
    // 键盘导航
    initKeyboardNavigation();
}

/**
 * 平滑滚动功能
 */
function initSmoothScroll() {
    // 为所有锚点链接添加平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - UIConfig.scrollOffset;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * 返回顶部按钮功能
 */
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;
    
    // 监听滚动事件
    window.addEventListener('scroll', debounce(() => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    }, UIConfig.debounceDelay));
    
    // 点击返回顶部
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * 响应式处理
 */
function initResponsiveHandlers() {
    let currentBreakpoint = getCurrentBreakpoint();
    
    window.addEventListener('resize', debounce(() => {
        const newBreakpoint = getCurrentBreakpoint();
        if (newBreakpoint !== currentBreakpoint) {
            currentBreakpoint = newBreakpoint;
            handleBreakpointChange(newBreakpoint);
        }
    }, UIConfig.debounceDelay));
}

/**
 * 获取当前断点
 */
function getCurrentBreakpoint() {
    const width = window.innerWidth;
    if (width < UIConfig.breakpoints.xs) return 'xs';
    if (width < UIConfig.breakpoints.sm) return 'sm';
    if (width < UIConfig.breakpoints.md) return 'md';
    if (width < UIConfig.breakpoints.lg) return 'lg';
    return 'xl';
}

/**
 * 处理断点变化
 */
function handleBreakpointChange(breakpoint) {
    console.log('断点变化:', breakpoint);
    
    // 触发自定义事件
    window.dispatchEvent(new CustomEvent('breakpointChange', {
        detail: { breakpoint }
    }));
}

/**
 * 键盘导航支持
 */
function initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // ESC键关闭模态框
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal.show');
            if (openModal && typeof closeModal === 'function') {
                closeModal();
            }
        }
        
        // Tab键焦点管理
        if (e.key === 'Tab') {
            handleTabNavigation(e);
        }
    });
}

/**
 * Tab键导航处理
 */
function handleTabNavigation(e) {
    const focusableElements = document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    // 在模态框中时，限制焦点在模态框内
    const openModal = document.querySelector('.modal.show');
    if (openModal) {
        const modalFocusable = openModal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (modalFocusable.length > 0) {
            const modalFirst = modalFocusable[0];
            const modalLast = modalFocusable[modalFocusable.length - 1];
            
            if (e.shiftKey) {
                if (document.activeElement === modalFirst) {
                    e.preventDefault();
                    modalLast.focus();
                }
            } else {
                if (document.activeElement === modalLast) {
                    e.preventDefault();
                    modalFirst.focus();
                }
            }
        }
    }
}

/**
 * 工具函数：防抖
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * 工具函数：节流
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * 工具函数：获取元素相对于文档的位置
 */
function getElementOffset(element) {
    const rect = element.getBoundingClientRect();
    return {
        top: rect.top + window.pageYOffset,
        left: rect.left + window.pageXOffset
    };
}

/**
 * 工具函数：检查元素是否在视口中
 */
function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * 工具函数：添加CSS类
 */
function addClass(element, className) {
    if (element && className) {
        element.classList.add(className);
    }
}

/**
 * 工具函数：移除CSS类
 */
function removeClass(element, className) {
    if (element && className) {
        element.classList.remove(className);
    }
}

/**
 * 工具函数：切换CSS类
 */
function toggleClass(element, className) {
    if (element && className) {
        element.classList.toggle(className);
    }
}

/**
 * 工具函数：检查是否有CSS类
 */
function hasClass(element, className) {
    return element && className && element.classList.contains(className);
}

// 导出全局配置和工具函数
window.UIConfig = UIConfig;
window.UIUtils = {
    debounce,
    throttle,
    getElementOffset,
    isElementInViewport,
    addClass,
    removeClass,
    toggleClass,
    hasClass,
    getCurrentBreakpoint
};

