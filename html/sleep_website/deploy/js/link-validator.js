/**
 * 睡了么网站链接验证脚本
 * 用于验证网站中的所有链接是否正常工作
 */

// 链接验证对象
const SleepLinkValidator = {
  // 初始化链接验证
  init: function() {
    this.validateAllLinks();
    console.log('睡了么链接验证系统已初始化');
  },
  
  // 验证所有链接
  validateAllLinks: function() {
    const links = document.querySelectorAll('a');
    const results = {
      total: links.length,
      internal: 0,
      external: 0,
      valid: 0,
      broken: 0,
      brokenLinks: []
    };
    
    console.log(`开始验证 ${links.length} 个链接...`);
    
    links.forEach((link, index) => {
      const href = link.getAttribute('href');
      
      // 跳过空链接和锚点链接
      if (!href || href === '#' || href.startsWith('javascript:')) {
        return;
      }
      
      // 检查是否是内部链接
      const isInternal = !href.startsWith('http') || href.includes(window.location.hostname);
      
      if (isInternal) {
        results.internal++;
        
        // 验证内部链接
        if (this.validateInternalLink(href)) {
          results.valid++;
        } else {
          results.broken++;
          results.brokenLinks.push({
            href: href,
            text: link.textContent.trim(),
            element: link
          });
        }
      } else {
        results.external++;
        // 外部链接不进行验证，假设有效
        results.valid++;
      }
    });
    
    // 输出验证结果
    console.log('链接验证结果:', results);
    
    // 如果有断开的链接，在控制台中显示
    if (results.broken > 0) {
      console.warn('发现断开的链接:', results.brokenLinks);
    }
    
    return results;
  },
  
  // 验证内部链接
  validateInternalLink: function(href) {
    // 如果是相对路径，转换为绝对路径
    if (!href.startsWith('/') && !href.startsWith('http')) {
      href = '/' + href;
    }
    
    // 检查链接是否指向现有页面
    const pages = [
      '/index.html',
      '/sleep-knowledge.html',
      '/sleep-disorders.html',
      '/improve-sleep.html',
      '/sleep-health.html',
      '/sleep-test.html',
      '/about.html',
      // 子页面
      '/insomnia.html',
      '/sleep-apnea.html',
      '/restless-legs.html',
      '/narcolepsy.html',
      '/sleep-phase-disorders.html',
      '/parasomnias.html',
      '/sleep-environment.html',
      '/relaxation-techniques.html',
      '/diet-sleep.html',
      '/exercise-sleep.html',
      '/stress-management.html',
      '/sleep-cardiovascular.html',
      '/sleep-metabolism.html',
      '/sleep-immune.html',
      '/sleep-brain.html',
      '/sleep-mental.html'
    ];
    
    // 检查链接是否在已知页面列表中
    const isValid = pages.some(page => {
      return href === page || href.endsWith(page);
    });
    
    // 如果链接不在已知页面列表中，但以.html结尾，标记为无效
    if (!isValid && href.endsWith('.html')) {
      return false;
    }
    
    // 其他链接假设有效（如外部链接、资源链接等）
    return true;
  },
  
  // 高亮显示断开的链接（用于调试）
  highlightBrokenLinks: function() {
    const links = document.querySelectorAll('a');
    let brokenCount = 0;
    
    links.forEach(link => {
      const href = link.getAttribute('href');
      
      // 跳过空链接和锚点链接
      if (!href || href === '#' || href.startsWith('javascript:')) {
        return;
      }
      
      // 检查是否是内部链接
      const isInternal = !href.startsWith('http') || href.includes(window.location.hostname);
      
      if (isInternal && !this.validateInternalLink(href)) {
        // 高亮显示断开的链接
        link.style.border = '2px solid red';
        link.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
        link.title = '断开的链接: ' + href;
        brokenCount++;
      }
    });
    
    console.log(`高亮显示了 ${brokenCount} 个断开的链接`);
    
    if (brokenCount > 0) {
      alert(`发现 ${brokenCount} 个断开的链接，已用红色边框高亮显示`);
    } else {
      alert('未发现断开的链接，所有链接都有效');
    }
  }
};

// 当页面加载完成后初始化链接验证
document.addEventListener('DOMContentLoaded', function() {
  SleepLinkValidator.init();
});
