/**
 * 睡了么网站表单处理脚本
 * 用于处理网站中的表单提交和验证
 */

// 表单处理对象
const SleepForms = {
  // 初始化表单处理
  init: function() {
    this.setupContactForm();
    this.setupNewsletterForm();
    console.log('睡了么表单处理系统已初始化');
  },
  
  // 设置联系表单
  setupContactForm: function() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // 获取表单数据
      const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
      };
      
      // 验证表单数据
      if (this.validateContactForm(formData)) {
        // 在实际环境中，这里会发送数据到服务器
        console.log('联系表单提交:', formData);
        
        // 显示成功消息
        this.showFormSuccess(contactForm, '感谢您的留言！我们会尽快回复您。');
        
        // 重置表单
        contactForm.reset();
      }
    });
  },
  
  // 验证联系表单
  validateContactForm: function(data) {
    let isValid = true;
    const errors = [];
    
    // 验证姓名
    if (!data.name || data.name.trim() === '') {
      isValid = false;
      errors.push('请输入您的姓名');
      this.highlightField('name');
    }
    
    // 验证邮箱
    if (!data.email || !this.isValidEmail(data.email)) {
      isValid = false;
      errors.push('请输入有效的电子邮箱地址');
      this.highlightField('email');
    }
    
    // 验证主题
    if (!data.subject || data.subject.trim() === '') {
      isValid = false;
      errors.push('请输入留言主题');
      this.highlightField('subject');
    }
    
    // 验证留言内容
    if (!data.message || data.message.trim() === '') {
      isValid = false;
      errors.push('请输入留言内容');
      this.highlightField('message');
    }
    
    // 如果有错误，显示错误消息
    if (!isValid) {
      this.showFormErrors(errors);
    }
    
    return isValid;
  },
  
  // 设置订阅表单
  setupNewsletterForm: function() {
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    if (newsletterForms.length === 0) return;
    
    newsletterForms.forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // 获取邮箱
        const emailInput = form.querySelector('input[type="email"]');
        if (!emailInput) return;
        
        const email = emailInput.value;
        
        // 验证邮箱
        if (this.isValidEmail(email)) {
          // 在实际环境中，这里会发送数据到服务器
          console.log('订阅表单提交:', { email: email });
          
          // 显示成功消息
          this.showFormSuccess(form, '感谢您的订阅！');
          
          // 重置表单
          form.reset();
        } else {
          // 显示错误消息
          this.showFormErrors(['请输入有效的电子邮箱地址']);
          this.highlightField(emailInput);
        }
      });
    });
  },
  
  // 验证邮箱格式
  isValidEmail: function(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  },
  
  // 高亮显示错误字段
  highlightField: function(field) {
    if (typeof field === 'string') {
      field = document.getElementById(field);
    }
    
    if (!field) return;
    
    // 添加错误样式
    field.classList.add('error-field');
    
    // 添加焦点事件，当用户开始输入时移除错误样式
    field.addEventListener('focus', function onFocus() {
      field.classList.remove('error-field');
      field.removeEventListener('focus', onFocus);
    });
  },
  
  // 显示表单错误
  showFormErrors: function(errors) {
    // 查找或创建错误消息容器
    let errorContainer = document.querySelector('.form-errors');
    if (!errorContainer) {
      errorContainer = document.createElement('div');
      errorContainer.className = 'form-errors';
      document.querySelector('form').prepend(errorContainer);
    }
    
    // 清空并添加错误消息
    errorContainer.innerHTML = '';
    errors.forEach(error => {
      const errorElement = document.createElement('p');
      errorElement.textContent = error;
      errorContainer.appendChild(errorElement);
    });
    
    // 显示错误容器
    errorContainer.style.display = 'block';
    
    // 5秒后隐藏错误消息
    setTimeout(() => {
      errorContainer.style.display = 'none';
    }, 5000);
  },
  
  // 显示表单成功消息
  showFormSuccess: function(form, message) {
    // 查找或创建成功消息容器
    let successContainer = form.querySelector('.form-success');
    if (!successContainer) {
      successContainer = document.createElement('div');
      successContainer.className = 'form-success';
      form.prepend(successContainer);
    }
    
    // 设置成功消息
    successContainer.textContent = message;
    
    // 显示成功容器
    successContainer.style.display = 'block';
    
    // 5秒后隐藏成功消息
    setTimeout(() => {
      successContainer.style.display = 'none';
    }, 5000);
  }
};

// 当页面加载完成后初始化表单处理
document.addEventListener('DOMContentLoaded', function() {
  SleepForms.init();
});
