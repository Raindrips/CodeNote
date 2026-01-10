// 聊天室应用主脚本
class ChatApp {
  constructor() {
    this.currentUser = null;
    this.messages = [];
    this.onlineUsers = [];
    this.theme = 'dark';
    this.isTyping = false;
    this.typingTimer = null;
    
    this.init();
  }

  init() {
    this.bindEvents();
    this.loadTheme();
    this.loadMessages();
    this.updateOnlineUsers();
    this.startSimulation();
  }

  bindEvents() {
    // 登录表单
    document.getElementById('login-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleLogin();
    });

    // 消息发送
    document.getElementById('send-btn').addEventListener('click', () => {
      this.sendMessage();
    });

    // 回车发送消息
    document.getElementById('message-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
      this.handleTyping();
    });

    // Emoji按钮
    document.getElementById('emoji-btn').addEventListener('click', () => {
      this.toggleEmojiPicker();
    });

    // 主题切换
    document.getElementById('theme-toggle').addEventListener('click', () => {
      this.toggleTheme();
    });

    // Emoji选择
    document.getElementById('emoji-picker').addEventListener('click', (e) => {
      if (e.target.textContent) {
        this.insertEmoji(e.target.textContent);
      }
    });

    // 点击外部关闭emoji选择器
    document.addEventListener('click', (e) => {
      if (!e.target.closest('#emoji-btn') && !e.target.closest('#emoji-picker')) {
        document.getElementById('emoji-picker').classList.add('hidden');
      }
    });

    // 滚动加载更多消息
    document.getElementById('chat-messages').addEventListener('scroll', () => {
      this.handleScroll();
    });
  }

  handleLogin() {
    const username = document.getElementById('username').value.trim();
    const selectedTheme = document.querySelector('input[name="theme"]:checked').value;
    
    if (username.length < 2) {
      alert('昵称至少需要2个字符');
      return;
    }

    this.currentUser = {
      name: username,
      avatar: this.generateAvatar(username),
      id: 'user_' + Date.now()
    };

    this.theme = selectedTheme;
    this.applyTheme();
    
    // 显示聊天界面
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('chat-screen').classList.remove('hidden');
    
    // 更新用户信息
    document.getElementById('current-user').textContent = username;
    document.getElementById('user-avatar-text').textContent = username.charAt(0).toUpperCase();
    
    // 添加欢迎消息
    this.addWelcomeMessage();
    
    // 保存用户会话
    this.saveSession();
    
    // 聚焦输入框
    document.getElementById('message-input').focus();
  }

  generateAvatar(username) {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=E0AD63&color=fff&size=32`;
  }

  applyTheme() {
    const body = document.body;
    body.className = this.theme === 'dark' ? 'theme-dark transition-all duration-300' : 'theme-light transition-all duration-300';
    
    const themeIcon = document.querySelector('#theme-toggle i');
    themeIcon.className = this.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    
    localStorage.setItem('chat-theme', this.theme);
  }

  loadTheme() {
    const savedTheme = localStorage.getItem('chat-theme') || 'dark';
    this.theme = savedTheme;
    
    // 设置初始主题选择
    document.querySelector(`input[name="theme"][value="${savedTheme}"]`).checked = true;
  }

  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    this.applyTheme();
  }

  sendMessage() {
    const input = document.getElementById('message-input');
    const content = input.value.trim();
    
    if (!content) return;
    
    const message = {
      id: 'msg_' + Date.now(),
      user: this.currentUser,
      content: content,
      timestamp: new Date(),
      type: 'user'
    };
    
    this.addMessage(message);
    input.value = '';
    this.adjustInputHeight();
    
    // 模拟回复
    this.simulateReply(content);
  }

  addMessage(message) {
    this.messages.push(message);
    this.renderMessage(message);
    this.saveMessages();
    this.scrollToBottom();
  }

  renderMessage(message) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageElement = this.createMessageElement(message);
    messagesContainer.appendChild(messageElement);
  }

  createMessageElement(message) {
    const div = document.createElement('div');
    div.className = `message-bubble flex items-start space-x-3 ${message.type === 'user' && message.user.id === this.currentUser?.id ? 'flex-row-reverse space-x-reverse' : ''}`;
    
    const isOwnMessage = message.type === 'user' && message.user.id === this.currentUser?.id;
    
    div.innerHTML = `
      <div class="w-8 h-8 rounded-full flex-shrink-0 user-avatar flex items-center justify-center">
        ${message.type === 'user' ? 
          `<img src="${message.user.avatar}" alt="${message.user.name}" class="w-full h-full rounded-full">` :
          '<i class="fas fa-robot text-white text-sm"></i>'
        }
      </div>
      <div class="flex-1 max-w-md">
        <div class="flex items-center space-x-2 mb-1 ${isOwnMessage ? 'justify-end' : ''}">
          <span class="text-sm font-medium text-gray-300">${message.user.name}</span>
          <span class="text-xs text-gray-500">${this.formatTime(message.timestamp)}</span>
        </div>
        <div class="inline-block px-4 py-2 rounded-2xl ${isOwnMessage 
          ? 'bg-gradient-to-r from-primary to-accent text-white rounded-br-none' 
          : 'bg-dark-700 text-gray-200 rounded-bl-none'
        }">
          ${this.escapeHtml(message.content)}
        </div>
      </div>
    `;
    
    return div;
  }

  formatTime(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    
    return date.toLocaleString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  scrollToBottom() {
    const messagesContainer = document.getElementById('chat-messages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  adjustInputHeight() {
    const input = document.getElementById('message-input');
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 120) + 'px';
  }

  handleTyping() {
    if (!this.isTyping) {
      this.isTyping = true;
      this.showTypingIndicator();
    }
    
    clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(() => {
      this.isTyping = false;
      this.hideTypingIndicator();
    }, 1000);
  }

  showTypingIndicator() {
    // 这里可以添加显示"正在输入"指示器的逻辑
  }

  hideTypingIndicator() {
    // 这里可以添加隐藏"正在输入"指示器的逻辑
  }

  toggleEmojiPicker() {
    const picker = document.getElementById('emoji-picker');
    picker.classList.toggle('hidden');
  }

  insertEmoji(emoji) {
    const input = document.getElementById('message-input');
    const cursorPos = input.selectionStart;
    const textBefore = input.value.substring(0, cursorPos);
    const textAfter = input.value.substring(cursorPos);
    
    input.value = textBefore + emoji + textAfter;
    input.focus();
    input.setSelectionRange(cursorPos + emoji.length, cursorPos + emoji.length);
    
    document.getElementById('emoji-picker').classList.add('hidden');
  }

  // 模拟功能
  simulateReply(userMessage) {
    const replies = [
      '很有趣的观点！',
      '我同意你的看法',
      '这个讨论很有意义',
      '能详细说说吗？',
      '我也有类似的想法',
      '说得好！',
      '👍 很棒',
      '很有道理',
      '继续分享你的想法',
      '这个角度很独特'
    ];
    
    // 随机延迟回复
    const delay = Math.random() * 3000 + 2000; // 2-5秒
    
    setTimeout(() => {
      const botUser = {
        name: '智能助手',
        avatar: 'https://ui-avatars.com/api/?name=AI&background=0F7606&color=fff&size=32',
        id: 'bot_user'
      };
      
      const reply = {
        id: 'msg_' + Date.now(),
        user: botUser,
        content: replies[Math.floor(Math.random() * replies.length)],
        timestamp: new Date(),
        type: 'bot'
      };
      
      this.addMessage(reply);
    }, delay);
  }

  addWelcomeMessage() {
    const welcomeUser = {
      name: '系统消息',
      avatar: 'https://ui-avatars.com/api/?name=SYS&background=6366f1&color=fff&size=32',
      id: 'system_user'
    };
    
    const welcomeMessage = {
      id: 'msg_' + Date.now(),
      user: welcomeUser,
      content: `欢迎 ${this.currentUser.name} 加入聊天室！开始畅所欲言吧～`,
      timestamp: new Date(),
      type: 'system'
    };
    
    this.addMessage(welcomeMessage);
  }

  updateOnlineUsers() {
    const onlineUsers = [
      { name: '小明', avatar: 'https://ui-avatars.com/api/?name=小明&background=E0AD63&color=fff&size=32' },
      { name: '小红', avatar: 'https://ui-avatars.com/api/?name=小红&background=0F7606&color=fff&size=32' },
      { name: '小李', avatar: 'https://ui-avatars.com/api/?name=小李&background=6366f1&color=fff&size=32' }
    ];
    
    if (this.currentUser) {
      onlineUsers.push({ name: this.currentUser.name, avatar: this.currentUser.avatar });
    }
    
    const onlineUsersContainer = document.getElementById('online-users');
    const onlineCount = document.getElementById('online-count');
    
    onlineUsersContainer.innerHTML = '';
    onlineCount.textContent = onlineUsers.length;
    
    onlineUsers.forEach(user => {
      const userElement = document.createElement('div');
      userElement.className = 'flex items-center space-x-2 p-2 rounded-lg hover:bg-dark-700 transition-colors';
      
      userElement.innerHTML = `
        <div class="w-6 h-6 rounded-full flex-shrink-0">
          <img src="${user.avatar}" alt="${user.name}" class="w-full h-full rounded-full">
        </div>
        <span class="text-sm text-gray-300 truncate">${user.name}</span>
        <div class="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 online-indicator"></div>
      `;
      
      onlineUsersContainer.appendChild(userElement);
    });
  }

  handleScroll() {
    const messagesContainer = document.getElementById('chat-messages');
    if (messagesContainer.scrollTop === 0 && this.messages.length > 20) {
      this.loadMoreMessages();
    }
  }

  loadMoreMessages() {
    // 这里可以实现加载更多历史消息的逻辑
    // 为了演示，我们添加一些模拟的历史消息
    const historicalMessages = [
      {
        id: 'hist_1',
        user: { name: '历史用户1', avatar: 'https://ui-avatars.com/api/?name=H1&background=808080&color=fff&size=32' },
        content: '这是一条历史消息',
        timestamp: new Date(Date.now() - 3600000),
        type: 'user'
      },
      {
        id: 'hist_2',
        user: { name: '历史用户2', avatar: 'https://ui-avatars.com/api/?name=H2&background=606060&color=fff&size=32' },
        content: '这也是一条历史消息',
        timestamp: new Date(Date.now() - 7200000),
        type: 'user'
      }
    ];
    
    // 将历史消息插入到消息列表的前面
    const messagesContainer = document.getElementById('chat-messages');
    const firstMessage = messagesContainer.firstChild;
    
    historicalMessages.forEach(message => {
      this.messages.unshift(message);
      const messageElement = this.createMessageElement(message);
      messagesContainer.insertBefore(messageElement, firstMessage);
    });
  }

  // 存储功能
  saveMessages() {
    try {
      localStorage.setItem('chat-messages', JSON.stringify(this.messages));
    } catch (error) {
      console.warn('无法保存消息到localStorage:', error);
    }
  }

  loadMessages() {
    try {
      const saved = localStorage.getItem('chat-messages');
      if (saved) {
        this.messages = JSON.parse(saved).map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        this.messages.forEach(message => this.renderMessage(message));
        this.scrollToBottom();
      }
    } catch (error) {
      console.warn('无法从localStorage加载消息:', error);
    }
  }

  saveSession() {
    try {
      localStorage.setItem('chat-session', JSON.stringify({
        user: this.currentUser,
        theme: this.theme,
        loginTime: new Date().toISOString()
      }));
    } catch (error) {
      console.warn('无法保存会话信息:', error);
    }
  }

  loadSession() {
    try {
      const saved = localStorage.getItem('chat-session');
      if (saved) {
        const session = JSON.parse(saved);
        // 这里可以实现自动登录逻辑
        // 为了安全起见，我们要求用户重新登录
      }
    } catch (error) {
      console.warn('无法加载会话信息:', error);
    }
  }

  // 模拟功能
  startSimulation() {
    // 定期更新在线用户状态
    setInterval(() => {
      this.updateOnlineUsers();
    }, 30000); // 每30秒更新一次
    
    // 定期添加系统消息
    setInterval(() => {
      if (this.currentUser && Math.random() < 0.1) { // 10%概率
        this.addSystemMessage();
      }
    }, 60000); // 每分钟检查一次
  }

  addSystemMessage() {
    const systemMessages = [
      '💡 提示：使用@可以提到其他用户',
      '🌟 聊天室使用技巧：点击用户头像可以查看详细信息',
      '🔔 新功能：支持emoji表情和主题切换',
      '⚡ 快捷键：Ctrl+Enter 快速发送消息',
      '🎯 建议：保持友善的交流氛围'
    ];
    
    const systemUser = {
      name: '系统助手',
      avatar: 'https://ui-avatars.com/api/?name=SYS&background=6366f1&color=fff&size=32',
      id: 'system_bot'
    };
    
    const message = {
      id: 'sys_' + Date.now(),
      user: systemUser,
      content: systemMessages[Math.floor(Math.random() * systemMessages.length)],
      timestamp: new Date(),
      type: 'system'
    };
    
    this.addMessage(message);
  }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
  new ChatApp();
});

// 全局函数供HTML调用
window.ChatApp = ChatApp;