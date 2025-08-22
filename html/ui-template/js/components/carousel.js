/**
 * 轮播图组件JavaScript
 * 处理图片轮播、自动播放和导航功能
 */

/**
 * 初始化轮播图
 */
function initCarousel() {
    console.log('初始化轮播图组件...');
    
    // 初始化所有轮播图
    document.querySelectorAll('.carousel').forEach(carousel => {
        new CarouselComponent(carousel);
    });
}

/**
 * 轮播图组件类
 */
class CarouselComponent {
    constructor(element) {
        this.carousel = element;
        this.slides = this.carousel.querySelectorAll('.carousel-slide');
        this.indicators = this.carousel.querySelectorAll('.carousel-indicator');
        this.prevBtn = this.carousel.querySelector('.carousel-prev');
        this.nextBtn = this.carousel.querySelector('.carousel-next');
        this.playBtn = this.carousel.querySelector('.carousel-play');
        this.pauseBtn = this.carousel.querySelector('.carousel-pause');
        
        this.currentIndex = 0;
        this.isPlaying = false;
        this.autoplayInterval = null;
        this.touchStartX = 0;
        this.touchEndX = 0;
        
        // 配置选项
        this.options = {
            autoplay: this.carousel.hasAttribute('data-autoplay'),
            interval: parseInt(this.carousel.getAttribute('data-interval')) || 5000,
            loop: this.carousel.hasAttribute('data-loop') !== false,
            pauseOnHover: this.carousel.hasAttribute('data-pause-hover') !== false,
            swipe: this.carousel.hasAttribute('data-swipe') !== false,
            fade: this.carousel.hasAttribute('data-fade'),
            indicators: this.indicators.length > 0,
            controls: this.prevBtn && this.nextBtn
        };
        
        this.init();
    }
    
    /**
     * 初始化轮播图
     */
    init() {
        if (this.slides.length === 0) return;
        
        // 设置初始状态
        this.updateSlides();
        this.updateIndicators();
        
        // 绑定事件
        this.bindEvents();
        
        // 开始自动播放
        if (this.options.autoplay) {
            this.play();
        }
        
        // 设置可访问性属性
        this.setupAccessibility();
    }
    
    /**
     * 绑定事件
     */
    bindEvents() {
        // 导航按钮
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prev());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.next());
        }
        
        // 播放控制按钮
        if (this.playBtn) {
            this.playBtn.addEventListener('click', () => this.play());
        }
        
        if (this.pauseBtn) {
            this.pauseBtn.addEventListener('click', () => this.pause());
        }
        
        // 指示器
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goTo(index));
        });
        
        // 鼠标悬停暂停
        if (this.options.pauseOnHover) {
            this.carousel.addEventListener('mouseenter', () => {
                if (this.isPlaying) {
                    this.pause();
                    this._wasPlayingBeforeHover = true;
                }
            });
            
            this.carousel.addEventListener('mouseleave', () => {
                if (this._wasPlayingBeforeHover) {
                    this.play();
                    this._wasPlayingBeforeHover = false;
                }
            });
        }
        
        // 触摸滑动
        if (this.options.swipe) {
            this.carousel.addEventListener('touchstart', (e) => {
                this.touchStartX = e.touches[0].clientX;
            }, { passive: true });
            
            this.carousel.addEventListener('touchend', (e) => {
                this.touchEndX = e.changedTouches[0].clientX;
                this.handleSwipe();
            }, { passive: true });
        }
        
        // 键盘导航
        this.carousel.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });
        
        // 窗口大小改变时重新计算
        window.addEventListener('resize', () => {
            this.updateSlides();
        });
    }
    
    /**
     * 处理滑动手势
     */
    handleSwipe() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.next();
            } else {
                this.prev();
            }
        }
    }
    
    /**
     * 处理键盘导航
     */
    handleKeyboard(e) {
        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.prev();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.next();
                break;
            case ' ':
                e.preventDefault();
                this.isPlaying ? this.pause() : this.play();
                break;
            case 'Home':
                e.preventDefault();
                this.goTo(0);
                break;
            case 'End':
                e.preventDefault();
                this.goTo(this.slides.length - 1);
                break;
        }
    }
    
    /**
     * 设置可访问性属性
     */
    setupAccessibility() {
        this.carousel.setAttribute('role', 'region');
        this.carousel.setAttribute('aria-label', '图片轮播');
        this.carousel.setAttribute('tabindex', '0');
        
        this.slides.forEach((slide, index) => {
            slide.setAttribute('role', 'group');
            slide.setAttribute('aria-roledescription', 'slide');
            slide.setAttribute('aria-label', `第 ${index + 1} 张，共 ${this.slides.length} 张`);
        });
        
        if (this.prevBtn) {
            this.prevBtn.setAttribute('aria-label', '上一张');
        }
        
        if (this.nextBtn) {
            this.nextBtn.setAttribute('aria-label', '下一张');
        }
        
        this.indicators.forEach((indicator, index) => {
            indicator.setAttribute('aria-label', `转到第 ${index + 1} 张`);
        });
    }
    
    /**
     * 更新幻灯片显示
     */
    updateSlides() {
        this.slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentIndex);
            slide.setAttribute('aria-hidden', index !== this.currentIndex);
            
            if (this.options.fade) {
                slide.style.opacity = index === this.currentIndex ? '1' : '0';
            } else {
                slide.style.transform = `translateX(${(index - this.currentIndex) * 100}%)`;
            }
        });
        
        // 更新导航按钮状态
        if (!this.options.loop) {
            if (this.prevBtn) {
                this.prevBtn.disabled = this.currentIndex === 0;
            }
            if (this.nextBtn) {
                this.nextBtn.disabled = this.currentIndex === this.slides.length - 1;
            }
        }
    }
    
    /**
     * 更新指示器
     */
    updateIndicators() {
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentIndex);
            indicator.setAttribute('aria-current', index === this.currentIndex ? 'true' : 'false');
        });
    }
    
    /**
     * 下一张
     */
    next() {
        if (this.currentIndex < this.slides.length - 1) {
            this.currentIndex++;
        } else if (this.options.loop) {
            this.currentIndex = 0;
        } else {
            return;
        }
        
        this.updateSlides();
        this.updateIndicators();
        this.triggerChangeEvent();
    }
    
    /**
     * 上一张
     */
    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
        } else if (this.options.loop) {
            this.currentIndex = this.slides.length - 1;
        } else {
            return;
        }
        
        this.updateSlides();
        this.updateIndicators();
        this.triggerChangeEvent();
    }
    
    /**
     * 跳转到指定幻灯片
     * @param {number} index - 幻灯片索引
     */
    goTo(index) {
        if (index >= 0 && index < this.slides.length && index !== this.currentIndex) {
            this.currentIndex = index;
            this.updateSlides();
            this.updateIndicators();
            this.triggerChangeEvent();
        }
    }
    
    /**
     * 开始自动播放
     */
    play() {
        if (this.isPlaying) return;
        
        this.isPlaying = true;
        this.autoplayInterval = setInterval(() => {
            this.next();
        }, this.options.interval);
        
        // 更新播放控制按钮
        if (this.playBtn) this.playBtn.style.display = 'none';
        if (this.pauseBtn) this.pauseBtn.style.display = 'block';
        
        this.carousel.dispatchEvent(new CustomEvent('carouselPlay', {
            detail: { carousel: this }
        }));
    }
    
    /**
     * 暂停自动播放
     */
    pause() {
        if (!this.isPlaying) return;
        
        this.isPlaying = false;
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
        
        // 更新播放控制按钮
        if (this.playBtn) this.playBtn.style.display = 'block';
        if (this.pauseBtn) this.pauseBtn.style.display = 'none';
        
        this.carousel.dispatchEvent(new CustomEvent('carouselPause', {
            detail: { carousel: this }
        }));
    }
    
    /**
     * 触发变化事件
     */
    triggerChangeEvent() {
        this.carousel.dispatchEvent(new CustomEvent('carouselChange', {
            detail: {
                carousel: this,
                currentIndex: this.currentIndex,
                currentSlide: this.slides[this.currentIndex]
            }
        }));
    }
    
    /**
     * 销毁轮播图
     */
    destroy() {
        this.pause();
        
        // 移除事件监听器
        if (this.prevBtn) {
            this.prevBtn.removeEventListener('click', this.prev);
        }
        if (this.nextBtn) {
            this.nextBtn.removeEventListener('click', this.next);
        }
        
        // 重置样式
        this.slides.forEach(slide => {
            slide.style.transform = '';
            slide.style.opacity = '';
            slide.classList.remove('active');
        });
        
        this.indicators.forEach(indicator => {
            indicator.classList.remove('active');
        });
    }
}

/**
 * 轮播图工具类
 */
class CarouselUtils {
    /**
     * 创建轮播图
     * @param {Object} options - 轮播图配置
     * @returns {HTMLElement} 轮播图元素
     */
    static create(options = {}) {
        const {
            id = 'carousel-' + Date.now(),
            className = '',
            slides = [],
            autoplay = false,
            interval = 5000,
            loop = true,
            controls = true,
            indicators = true,
            fade = false,
            width = '100%',
            height = '400px'
        } = options;
        
        if (slides.length === 0) {
            console.warn('轮播图幻灯片为空');
            return null;
        }
        
        // 创建轮播图容器
        const carousel = document.createElement('div');
        carousel.className = `carousel ${className}`.trim();
        carousel.id = id;
        carousel.style.width = width;
        carousel.style.height = height;
        
        if (autoplay) carousel.setAttribute('data-autoplay', '');
        if (interval !== 5000) carousel.setAttribute('data-interval', interval);
        if (!loop) carousel.setAttribute('data-loop', 'false');
        if (fade) carousel.setAttribute('data-fade', '');
        
        // 创建幻灯片容器
        const slidesContainer = document.createElement('div');
        slidesContainer.className = 'carousel-slides';
        
        // 创建幻灯片
        slides.forEach((slideConfig, index) => {
            const slide = document.createElement('div');
            slide.className = `carousel-slide ${index === 0 ? 'active' : ''}`;
            
            if (typeof slideConfig === 'string') {
                // 图片URL
                const img = document.createElement('img');
                img.src = slideConfig;
                img.alt = `幻灯片 ${index + 1}`;
                slide.appendChild(img);
            } else if (slideConfig.image) {
                // 图片配置对象
                const img = document.createElement('img');
                img.src = slideConfig.image;
                img.alt = slideConfig.alt || `幻灯片 ${index + 1}`;
                slide.appendChild(img);
                
                // 添加标题和描述
                if (slideConfig.title || slideConfig.description) {
                    const caption = document.createElement('div');
                    caption.className = 'carousel-caption';
                    
                    if (slideConfig.title) {
                        const title = document.createElement('h3');
                        title.textContent = slideConfig.title;
                        caption.appendChild(title);
                    }
                    
                    if (slideConfig.description) {
                        const desc = document.createElement('p');
                        desc.textContent = slideConfig.description;
                        caption.appendChild(desc);
                    }
                    
                    slide.appendChild(caption);
                }
            } else if (slideConfig instanceof HTMLElement) {
                // HTML元素
                slide.appendChild(slideConfig);
            }
            
            slidesContainer.appendChild(slide);
        });
        
        carousel.appendChild(slidesContainer);
        
        // 创建导航控制
        if (controls) {
            const prevBtn = document.createElement('button');
            prevBtn.className = 'carousel-prev';
            prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
            
            const nextBtn = document.createElement('button');
            nextBtn.className = 'carousel-next';
            nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
            
            carousel.appendChild(prevBtn);
            carousel.appendChild(nextBtn);
        }
        
        // 创建指示器
        if (indicators) {
            const indicatorsContainer = document.createElement('div');
            indicatorsContainer.className = 'carousel-indicators';
            
            slides.forEach((_, index) => {
                const indicator = document.createElement('button');
                indicator.className = `carousel-indicator ${index === 0 ? 'active' : ''}`;
                indicator.setAttribute('data-slide', index);
                indicatorsContainer.appendChild(indicator);
            });
            
            carousel.appendChild(indicatorsContainer);
        }
        
        // 初始化轮播图
        new CarouselComponent(carousel);
        
        return carousel;
    }
    
    /**
     * 获取轮播图实例
     * @param {HTMLElement|string} carousel - 轮播图元素或ID
     * @returns {CarouselComponent|null}
     */
    static getInstance(carousel) {
        const element = typeof carousel === 'string' ? document.getElementById(carousel) : carousel;
        return element ? element._carouselInstance : null;
    }
}

// 导出到全局
window.CarouselComponent = CarouselComponent;
window.CarouselUtils = CarouselUtils;
window.initCarousel = initCarousel;

// 添加轮播图样式（如果不存在）
if (!document.querySelector('#carousel-styles')) {
    const style = document.createElement('style');
    style.id = 'carousel-styles';
    style.textContent = `
        .carousel {
            position: relative;
            overflow: hidden;
            border-radius: 0.5rem;
            background: #000;
        }
        
        .carousel-slides {
            position: relative;
            width: 100%;
            height: 100%;
        }
        
        .carousel-slide {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            transition: all 0.5s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .carousel-slide.active {
            opacity: 1;
        }
        
        .carousel-slide img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .carousel-caption {
            position: absolute;
            bottom: 2rem;
            left: 2rem;
            right: 2rem;
            color: white;
            text-align: center;
            background: rgba(0, 0, 0, 0.5);
            padding: 1rem;
            border-radius: 0.5rem;
        }
        
        .carousel-caption h3 {
            margin: 0 0 0.5rem 0;
            font-size: 1.5rem;
        }
        
        .carousel-caption p {
            margin: 0;
            opacity: 0.9;
        }
        
        .carousel-prev,
        .carousel-next {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(0, 0, 0, 0.5);
            color: white;
            border: none;
            width: 3rem;
            height: 3rem;
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.3s ease;
            z-index: 10;
        }
        
        .carousel-prev:hover,
        .carousel-next:hover {
            background: rgba(0, 0, 0, 0.8);
            transform: translateY(-50%) scale(1.1);
        }
        
        .carousel-prev {
            left: 1rem;
        }
        
        .carousel-next {
            right: 1rem;
        }
        
        .carousel-indicators {
            position: absolute;
            bottom: 1rem;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 0.5rem;
            z-index: 10;
        }
        
        .carousel-indicator {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            border: 2px solid white;
            background: transparent;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .carousel-indicator.active {
            background: white;
        }
        
        .carousel-play,
        .carousel-pause {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: rgba(0, 0, 0, 0.5);
            color: white;
            border: none;
            width: 2.5rem;
            height: 2.5rem;
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.3s ease;
            z-index: 10;
        }
        
        .carousel-pause {
            display: none;
        }
        
        /* 淡入淡出效果 */
        .carousel[data-fade] .carousel-slide {
            transform: none !important;
        }
        
        /* 响应式 */
        @media (max-width: 768px) {
            .carousel-prev,
            .carousel-next {
                width: 2.5rem;
                height: 2.5rem;
            }
            
            .carousel-caption {
                bottom: 1rem;
                left: 1rem;
                right: 1rem;
                padding: 0.75rem;
            }
            
            .carousel-caption h3 {
                font-size: 1.25rem;
            }
        }
    `;
    document.head.appendChild(style);
}

