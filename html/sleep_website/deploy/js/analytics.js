/**
 * 睡了么网站分析脚本
 * 用于跟踪用户行为和页面访问情况
 */

// 分析对象
const SleepAnalytics = {
  // 初始化分析
  init: function() {
    this.pageView();
    this.setupEventListeners();
    console.log('睡了么分析系统已初始化');
  },
  
  // 记录页面访问
  pageView: function() {
    const page = window.location.pathname;
    const referrer = document.referrer;
    const timestamp = new Date().toISOString();
    
    // 在实际环境中，这里会发送数据到服务器
    console.log(`页面访问: ${page}, 来源: ${referrer}, 时间: ${timestamp}`);
    
    // 本地存储访问历史（演示用途）
    this.storePageView(page, timestamp);
  },
  
  // 存储页面访问记录到本地存储
  storePageView: function(page, timestamp) {
    let pageViews = localStorage.getItem('sleepAnalytics_pageViews');
    pageViews = pageViews ? JSON.parse(pageViews) : [];
    
    pageViews.push({
      page: page,
      timestamp: timestamp
    });
    
    // 只保留最近的50条记录
    if (pageViews.length > 50) {
      pageViews = pageViews.slice(-50);
    }
    
    localStorage.setItem('sleepAnalytics_pageViews', JSON.stringify(pageViews));
  },
  
  // 设置事件监听器
  setupEventListeners: function() {
    // 监听所有链接点击
    document.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', (e) => {
        this.trackEvent('link_click', {
          href: link.href,
          text: link.textContent.trim()
        });
      });
    });
    
    // 监听表单提交
    document.querySelectorAll('form').forEach(form => {
      form.addEventListener('submit', (e) => {
        this.trackEvent('form_submit', {
          formId: form.id || '未知表单'
        });
      });
    });
    
    // 监听睡眠测试相关事件
    if (document.getElementById('start-test')) {
      document.getElementById('start-test').addEventListener('click', () => {
        this.trackEvent('test_start', {
          testType: '睡眠质量测试'
        });
      });
    }
    
    if (document.getElementById('submit-button')) {
      document.getElementById('submit-button').addEventListener('click', () => {
        this.trackEvent('test_complete', {
          testType: '睡眠质量测试'
        });
      });
    }
  },
  
  // 跟踪事件
  trackEvent: function(eventName, eventData) {
    const timestamp = new Date().toISOString();
    
    // 在实际环境中，这里会发送数据到服务器
    console.log(`事件: ${eventName}, 数据:`, eventData, `, 时间: ${timestamp}`);
    
    // 本地存储事件（演示用途）
    this.storeEvent(eventName, eventData, timestamp);
  },
  
  // 存储事件到本地存储
  storeEvent: function(eventName, eventData, timestamp) {
    let events = localStorage.getItem('sleepAnalytics_events');
    events = events ? JSON.parse(events) : [];
    
    events.push({
      name: eventName,
      data: eventData,
      timestamp: timestamp
    });
    
    // 只保留最近的100条事件
    if (events.length > 100) {
      events = events.slice(-100);
    }
    
    localStorage.setItem('sleepAnalytics_events', JSON.stringify(events));
  },
  
  // 获取分析数据（用于调试）
  getAnalyticsData: function() {
    return {
      pageViews: JSON.parse(localStorage.getItem('sleepAnalytics_pageViews') || '[]'),
      events: JSON.parse(localStorage.getItem('sleepAnalytics_events') || '[]')
    };
  },
  
  // 清除分析数据（用于调试）
  clearAnalyticsData: function() {
    localStorage.removeItem('sleepAnalytics_pageViews');
    localStorage.removeItem('sleepAnalytics_events');
    console.log('分析数据已清除');
  }
};

// 当页面加载完成后初始化分析
document.addEventListener('DOMContentLoaded', function() {
  SleepAnalytics.init();
});
