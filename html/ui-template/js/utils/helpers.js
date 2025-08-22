/**
 * 工具函数集合
 * 提供常用的辅助函数
 */

/**
 * DOM操作工具
 */
const DOMUtils = {
    /**
     * 查询单个元素
     * @param {string} selector - CSS选择器
     * @param {Element} context - 查询上下文，默认为document
     * @returns {Element|null}
     */
    query(selector, context = document) {
        return context.querySelector(selector);
    },
    
    /**
     * 查询多个元素
     * @param {string} selector - CSS选择器
     * @param {Element} context - 查询上下文，默认为document
     * @returns {NodeList}
     */
    queryAll(selector, context = document) {
        return context.querySelectorAll(selector);
    },
    
    /**
     * 创建元素
     * @param {string} tagName - 标签名
     * @param {Object} attributes - 属性对象
     * @param {string} textContent - 文本内容
     * @returns {Element}
     */
    create(tagName, attributes = {}, textContent = '') {
        const element = document.createElement(tagName);
        
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'dataset') {
                Object.entries(value).forEach(([dataKey, dataValue]) => {
                    element.dataset[dataKey] = dataValue;
                });
            } else {
                element.setAttribute(key, value);
            }
        });
        
        if (textContent) {
            element.textContent = textContent;
        }
        
        return element;
    },
    
    /**
     * 添加事件监听器
     * @param {Element|string} element - 元素或选择器
     * @param {string} event - 事件类型
     * @param {Function} handler - 事件处理函数
     * @param {Object} options - 事件选项
     */
    on(element, event, handler, options = {}) {
        const el = typeof element === 'string' ? this.query(element) : element;
        if (el) {
            el.addEventListener(event, handler, options);
        }
    },
    
    /**
     * 移除事件监听器
     * @param {Element|string} element - 元素或选择器
     * @param {string} event - 事件类型
     * @param {Function} handler - 事件处理函数
     */
    off(element, event, handler) {
        const el = typeof element === 'string' ? this.query(element) : element;
        if (el) {
            el.removeEventListener(event, handler);
        }
    },
    
    /**
     * 事件委托
     * @param {Element|string} container - 容器元素或选择器
     * @param {string} selector - 目标元素选择器
     * @param {string} event - 事件类型
     * @param {Function} handler - 事件处理函数
     */
    delegate(container, selector, event, handler) {
        const containerEl = typeof container === 'string' ? this.query(container) : container;
        if (!containerEl) return;
        
        containerEl.addEventListener(event, (e) => {
            const target = e.target.closest(selector);
            if (target && containerEl.contains(target)) {
                handler.call(target, e);
            }
        });
    }
};

/**
 * 字符串工具
 */
const StringUtils = {
    /**
     * 首字母大写
     * @param {string} str - 输入字符串
     * @returns {string}
     */
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },
    
    /**
     * 驼峰命名转换
     * @param {string} str - 输入字符串
     * @returns {string}
     */
    camelCase(str) {
        return str.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
    },
    
    /**
     * 短横线命名转换
     * @param {string} str - 输入字符串
     * @returns {string}
     */
    kebabCase(str) {
        return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    },
    
    /**
     * 截断字符串
     * @param {string} str - 输入字符串
     * @param {number} length - 最大长度
     * @param {string} suffix - 后缀
     * @returns {string}
     */
    truncate(str, length = 100, suffix = '...') {
        if (str.length <= length) return str;
        return str.substring(0, length) + suffix;
    },
    
    /**
     * 移除HTML标签
     * @param {string} html - HTML字符串
     * @returns {string}
     */
    stripHtml(html) {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent || div.innerText || '';
    },
    
    /**
     * 转义HTML
     * @param {string} str - 输入字符串
     * @returns {string}
     */
    escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
};

/**
 * 数组工具
 */
const ArrayUtils = {
    /**
     * 数组去重
     * @param {Array} arr - 输入数组
     * @returns {Array}
     */
    unique(arr) {
        return [...new Set(arr)];
    },
    
    /**
     * 数组分块
     * @param {Array} arr - 输入数组
     * @param {number} size - 块大小
     * @returns {Array}
     */
    chunk(arr, size) {
        const chunks = [];
        for (let i = 0; i < arr.length; i += size) {
            chunks.push(arr.slice(i, i + size));
        }
        return chunks;
    },
    
    /**
     * 数组随机排序
     * @param {Array} arr - 输入数组
     * @returns {Array}
     */
    shuffle(arr) {
        const result = [...arr];
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    },
    
    /**
     * 数组求和
     * @param {Array} arr - 数字数组
     * @returns {number}
     */
    sum(arr) {
        return arr.reduce((sum, num) => sum + num, 0);
    },
    
    /**
     * 数组平均值
     * @param {Array} arr - 数字数组
     * @returns {number}
     */
    average(arr) {
        return arr.length > 0 ? this.sum(arr) / arr.length : 0;
    }
};

/**
 * 对象工具
 */
const ObjectUtils = {
    /**
     * 深拷贝
     * @param {*} obj - 要拷贝的对象
     * @returns {*}
     */
    deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => this.deepClone(item));
        if (typeof obj === 'object') {
            const cloned = {};
            Object.keys(obj).forEach(key => {
                cloned[key] = this.deepClone(obj[key]);
            });
            return cloned;
        }
    },
    
    /**
     * 对象合并
     * @param {Object} target - 目标对象
     * @param {...Object} sources - 源对象
     * @returns {Object}
     */
    merge(target, ...sources) {
        if (!sources.length) return target;
        const source = sources.shift();
        
        if (this.isObject(target) && this.isObject(source)) {
            for (const key in source) {
                if (this.isObject(source[key])) {
                    if (!target[key]) Object.assign(target, { [key]: {} });
                    this.merge(target[key], source[key]);
                } else {
                    Object.assign(target, { [key]: source[key] });
                }
            }
        }
        
        return this.merge(target, ...sources);
    },
    
    /**
     * 检查是否为对象
     * @param {*} item - 要检查的项
     * @returns {boolean}
     */
    isObject(item) {
        return item && typeof item === 'object' && !Array.isArray(item);
    },
    
    /**
     * 获取嵌套属性值
     * @param {Object} obj - 对象
     * @param {string} path - 属性路径，如 'a.b.c'
     * @param {*} defaultValue - 默认值
     * @returns {*}
     */
    get(obj, path, defaultValue = undefined) {
        const keys = path.split('.');
        let result = obj;
        
        for (const key of keys) {
            if (result == null || typeof result !== 'object') {
                return defaultValue;
            }
            result = result[key];
        }
        
        return result !== undefined ? result : defaultValue;
    },
    
    /**
     * 设置嵌套属性值
     * @param {Object} obj - 对象
     * @param {string} path - 属性路径
     * @param {*} value - 值
     */
    set(obj, path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        let current = obj;
        
        for (const key of keys) {
            if (!(key in current) || typeof current[key] !== 'object') {
                current[key] = {};
            }
            current = current[key];
        }
        
        current[lastKey] = value;
    }
};

/**
 * 数字工具
 */
const NumberUtils = {
    /**
     * 格式化数字
     * @param {number} num - 数字
     * @param {number} decimals - 小数位数
     * @returns {string}
     */
    format(num, decimals = 2) {
        return num.toLocaleString('zh-CN', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    },
    
    /**
     * 数字转百分比
     * @param {number} num - 数字
     * @param {number} decimals - 小数位数
     * @returns {string}
     */
    toPercent(num, decimals = 1) {
        return (num * 100).toFixed(decimals) + '%';
    },
    
    /**
     * 限制数字范围
     * @param {number} num - 数字
     * @param {number} min - 最小值
     * @param {number} max - 最大值
     * @returns {number}
     */
    clamp(num, min, max) {
        return Math.min(Math.max(num, min), max);
    },
    
    /**
     * 生成随机数
     * @param {number} min - 最小值
     * @param {number} max - 最大值
     * @returns {number}
     */
    random(min = 0, max = 1) {
        return Math.random() * (max - min) + min;
    },
    
    /**
     * 生成随机整数
     * @param {number} min - 最小值
     * @param {number} max - 最大值
     * @returns {number}
     */
    randomInt(min = 0, max = 100) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
};

/**
 * 日期工具
 */
const DateUtils = {
    /**
     * 格式化日期
     * @param {Date|string|number} date - 日期
     * @param {string} format - 格式字符串
     * @returns {string}
     */
    format(date, format = 'YYYY-MM-DD HH:mm:ss') {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        const seconds = String(d.getSeconds()).padStart(2, '0');
        
        return format
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day)
            .replace('HH', hours)
            .replace('mm', minutes)
            .replace('ss', seconds);
    },
    
    /**
     * 相对时间
     * @param {Date|string|number} date - 日期
     * @returns {string}
     */
    relative(date) {
        const now = new Date();
        const target = new Date(date);
        const diff = now - target;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (days > 0) return `${days}天前`;
        if (hours > 0) return `${hours}小时前`;
        if (minutes > 0) return `${minutes}分钟前`;
        return '刚刚';
    },
    
    /**
     * 添加时间
     * @param {Date|string|number} date - 日期
     * @param {number} amount - 数量
     * @param {string} unit - 单位 (days, hours, minutes, seconds)
     * @returns {Date}
     */
    add(date, amount, unit = 'days') {
        const d = new Date(date);
        const multipliers = {
            seconds: 1000,
            minutes: 60 * 1000,
            hours: 60 * 60 * 1000,
            days: 24 * 60 * 60 * 1000
        };
        
        return new Date(d.getTime() + amount * multipliers[unit]);
    }
};

/**
 * URL工具
 */
const URLUtils = {
    /**
     * 获取URL参数
     * @param {string} name - 参数名
     * @param {string} url - URL，默认为当前页面URL
     * @returns {string|null}
     */
    getParam(name, url = window.location.href) {
        const urlObj = new URL(url);
        return urlObj.searchParams.get(name);
    },
    
    /**
     * 获取所有URL参数
     * @param {string} url - URL，默认为当前页面URL
     * @returns {Object}
     */
    getParams(url = window.location.href) {
        const urlObj = new URL(url);
        const params = {};
        urlObj.searchParams.forEach((value, key) => {
            params[key] = value;
        });
        return params;
    },
    
    /**
     * 设置URL参数
     * @param {string} name - 参数名
     * @param {string} value - 参数值
     * @param {boolean} pushState - 是否更新浏览器历史
     */
    setParam(name, value, pushState = true) {
        const url = new URL(window.location.href);
        url.searchParams.set(name, value);
        
        if (pushState) {
            window.history.pushState({}, '', url.toString());
        }
    },
    
    /**
     * 移除URL参数
     * @param {string} name - 参数名
     * @param {boolean} pushState - 是否更新浏览器历史
     */
    removeParam(name, pushState = true) {
        const url = new URL(window.location.href);
        url.searchParams.delete(name);
        
        if (pushState) {
            window.history.pushState({}, '', url.toString());
        }
    }
};

/**
 * 存储工具
 */
const StorageUtils = {
    /**
     * 设置localStorage
     * @param {string} key - 键
     * @param {*} value - 值
     */
    setLocal(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.warn('localStorage设置失败:', e);
        }
    },
    
    /**
     * 获取localStorage
     * @param {string} key - 键
     * @param {*} defaultValue - 默认值
     * @returns {*}
     */
    getLocal(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.warn('localStorage获取失败:', e);
            return defaultValue;
        }
    },
    
    /**
     * 移除localStorage
     * @param {string} key - 键
     */
    removeLocal(key) {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.warn('localStorage移除失败:', e);
        }
    },
    
    /**
     * 设置sessionStorage
     * @param {string} key - 键
     * @param {*} value - 值
     */
    setSession(key, value) {
        try {
            sessionStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.warn('sessionStorage设置失败:', e);
        }
    },
    
    /**
     * 获取sessionStorage
     * @param {string} key - 键
     * @param {*} defaultValue - 默认值
     * @returns {*}
     */
    getSession(key, defaultValue = null) {
        try {
            const item = sessionStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.warn('sessionStorage获取失败:', e);
            return defaultValue;
        }
    },
    
    /**
     * 移除sessionStorage
     * @param {string} key - 键
     */
    removeSession(key) {
        try {
            sessionStorage.removeItem(key);
        } catch (e) {
            console.warn('sessionStorage移除失败:', e);
        }
    }
};

// 导出到全局
window.DOMUtils = DOMUtils;
window.StringUtils = StringUtils;
window.ArrayUtils = ArrayUtils;
window.ObjectUtils = ObjectUtils;
window.NumberUtils = NumberUtils;
window.DateUtils = DateUtils;
window.URLUtils = URLUtils;
window.StorageUtils = StorageUtils;

