/**
 * 导航栏组件JavaScript
 * 处理导航栏的响应式菜单和滚动效果
 */

/**
 * 初始化导航栏
 */
function initNavbar() {
    console.log('初始化导航栏组件...');
    
    // 初始化移动端菜单
    initMobileMenu();
    
    // 初始化滚动效果
    initScrollEffect();
    
    // 初始化活动链接高亮
    initActiveLinks();
    
    // 初始化下拉菜单
    initDropdownMenus();
}

/**
 * 初始化移动端菜单
 */
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!hamburger || !navMenu) return;
    
    // 切换菜单显示
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // 更新aria属性
        const isExpanded = this.classList.contains('active');
        this.setAttribute('aria-expanded', isExpanded);
        
        // 防止背景滚动
        if (isExpanded) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        
        // 触发菜单切换事件
        navMenu.dispatchEvent(new CustomEvent('menuToggle', {
            detail: { isOpen: isExpanded }
        }));
    });
    
    // 点击菜单项时关闭菜单
    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    });
    
    // 点击外部区域关闭菜单
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
    
    // 窗口大小改变时重置菜单状态
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
}

/**
 * 初始化滚动效果
 */
function initScrollEffect() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    let lastScrollTop = 0;
    let isScrolling = false;
    
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                handleScroll();
                isScrolling = false;
            });
            isScrolling = true;
        }
    });
    
    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // 添加/移除滚动类
        if (scrollTop > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
        
        // 自动隐藏/显示导航栏
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // 向下滚动，隐藏导航栏
            navbar.classList.add('navbar-hidden');
        } else {
            // 向上滚动，显示导航栏
            navbar.classList.remove('navbar-hidden');
        }
        
        lastScrollTop = scrollTop;
        
        // 触发滚动事件
        navbar.dispatchEvent(new CustomEvent('navbarScroll', {
            detail: { scrollTop, direction: scrollTop > lastScrollTop ? 'down' : 'up' }
        }));
    }
}

/**
 * 初始化活动链接高亮
 */
function initActiveLinks() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    const sections = document.querySelectorAll('section[id]');
    
    if (navLinks.length === 0 || sections.length === 0) return;
    
    // 监听滚动事件，高亮当前区域对应的导航链接
    window.addEventListener('scroll', throttle(() => {
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;
            
            if (window.pageYOffset >= sectionTop && 
                window.pageYOffset < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        // 更新活动链接
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }, 100));
}

/**
 * 初始化下拉菜单
 */
function initDropdownMenus() {
    const dropdowns = document.querySelectorAll('.nav-dropdown');
    
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        if (!toggle || !menu) return;
        
        // 点击切换下拉菜单
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // 关闭其他下拉菜单
            dropdowns.forEach(otherDropdown => {
                if (otherDropdown !== dropdown) {
                    otherDropdown.classList.remove('active');
                }
            });
            
            // 切换当前下拉菜单
            dropdown.classList.toggle('active');
            
            // 更新aria属性
            const isOpen = dropdown.classList.contains('active');
            toggle.setAttribute('aria-expanded', isOpen);
        });
        
        // 鼠标悬停效果（桌面端）
        if (window.innerWidth > 768) {
            dropdown.addEventListener('mouseenter', () => {
                dropdown.classList.add('active');
                toggle.setAttribute('aria-expanded', 'true');
            });
            
            dropdown.addEventListener('mouseleave', () => {
                dropdown.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
            });
        }
    });
    
    // 点击外部区域关闭下拉菜单
    document.addEventListener('click', () => {
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
            const toggle = dropdown.querySelector('.dropdown-toggle');
            if (toggle) {
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
    });
}

/**
 * 导航栏工具类
 */
class NavbarUtils {
    /**
     * 设置活动链接
     * @param {string} href - 链接地址
     */
    static setActiveLink(href) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === href) {
                link.classList.add('active');
            }
        });
    }
    
    /**
     * 显示/隐藏导航栏
     * @param {boolean} show - 是否显示
     */
    static toggle(show = true) {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;
        
        if (show) {
            navbar.classList.remove('navbar-hidden');
        } else {
            navbar.classList.add('navbar-hidden');
        }
    }
    
    /**
     * 添加导航项
     * @param {Object} options - 导航项配置
     */
    static addNavItem(options = {}) {
        const {
            text = '导航项',
            href = '#',
            position = 'end',
            className = ''
        } = options;
        
        const navMenu = document.querySelector('.nav-menu');
        if (!navMenu) return;
        
        const navItem = document.createElement('li');
        navItem.className = `nav-item ${className}`.trim();
        
        const navLink = document.createElement('a');
        navLink.className = 'nav-link';
        navLink.href = href;
        navLink.textContent = text;
        
        navItem.appendChild(navLink);
        
        if (position === 'start') {
            navMenu.insertBefore(navItem, navMenu.firstChild);
        } else {
            navMenu.appendChild(navItem);
        }
        
        return navItem;
    }
    
    /**
     * 移除导航项
     * @param {string} href - 要移除的导航项链接
     */
    static removeNavItem(href) {
        const navLink = document.querySelector(`.nav-link[href="${href}"]`);
        if (navLink && navLink.parentElement) {
            navLink.parentElement.remove();
        }
    }
    
    /**
     * 更新导航项文本
     * @param {string} href - 导航项链接
     * @param {string} text - 新文本
     */
    static updateNavItemText(href, text) {
        const navLink = document.querySelector(`.nav-link[href="${href}"]`);
        if (navLink) {
            navLink.textContent = text;
        }
    }
}

/**
 * 节流函数
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

// 导出到全局
window.NavbarUtils = NavbarUtils;

// 添加导航栏滚动效果的CSS（如果不存在）
if (!document.querySelector('#navbar-styles')) {
    const style = document.createElement('style');
    style.id = 'navbar-styles';
    style.textContent = `
        .navbar {
            transition: transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease;
        }
        
        .navbar-scrolled {
            background-color: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
        }
        
        .navbar-hidden {
            transform: translateY(-100%);
        }
        
        .nav-dropdown {
            position: relative;
        }
        
        .dropdown-menu {
            position: absolute;
            top: 100%;
            left: 0;
            background: white;
            border: 1px solid #dee2e6;
            border-radius: 0.375rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            opacity: 0;
            visibility: hidden;
            transform: translateY(-10px);
            transition: all 0.3s ease;
            z-index: 1000;
        }
        
        .nav-dropdown.active .dropdown-menu {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }
        
        .dropdown-item {
            display: block;
            padding: 0.5rem 1rem;
            color: #212529;
            text-decoration: none;
            transition: background-color 0.15s ease;
        }
        
        .dropdown-item:hover {
            background-color: #f8f9fa;
        }
    `;
    document.head.appendChild(style);
}

