// 底部导航组件
class BottomNav {
  constructor(activeTab = 'home') {
    this.activeTab = activeTab;
  }

  render() {
    const tabs = [
      { id: 'home', icon: '🏠', label: '首页', page: 'home.html' },
      { id: 'hot', icon: '🔥', label: '热门', page: 'hot.html' },
      { id: 'publish', icon: '➕', label: '发布', page: 'publish.html' },
      { id: 'message', icon: '💬', label: '消息', page: 'message.html' },
      { id: 'profile', icon: '👤', label: '我', page: 'profile.html' }
    ];

    return `
      <div class="bottom-nav">
        ${tabs.map(tab => `
          <div class="nav-item ${tab.id === this.activeTab ? 'active' : ''}"
               onclick="navigateTo('${tab.page}')">
            <div class="nav-icon">${tab.icon}</div>
            <div class="nav-text">${tab.label}</div>
          </div>
        `).join('')}
      </div>
    `;
  }
}

// 导航函数
function navigateTo(page) {
  window.location.href = page;
}
