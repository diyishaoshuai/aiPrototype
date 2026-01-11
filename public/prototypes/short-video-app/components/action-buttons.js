// 操作按钮组件
class ActionButtons {
  constructor() {
    this.liked = false;
    this.likeCount = '12.5w';
  }

  toggleLike() {
    this.liked = !this.liked;
    this.likeCount = this.liked ? '12.6w' : '12.5w';
    this.update();
  }

  update() {
    const likeBtn = document.getElementById('likeBtn');
    if (likeBtn) {
      likeBtn.className = this.liked ? 'action-btn liked' : 'action-btn';
      document.getElementById('likeCount').textContent = this.likeCount;
    }
  }

  render() {
    return `
      <div class="action-buttons">
        <div class="action-btn" id="likeBtn" onclick="actionButtons.toggleLike()">
          <div class="action-icon">❤️</div>
          <div class="action-text" id="likeCount">${this.likeCount}</div>
        </div>
        <div class="action-btn" onclick="showComments()">
          <div class="action-icon">💬</div>
          <div class="action-text">8234</div>
        </div>
        <div class="action-btn" onclick="showShare()">
          <div class="action-icon">📤</div>
          <div class="action-text">分享</div>
        </div>
      </div>
    `;
  }
}

function showComments() {
  alert('评论功能');
}

function showShare() {
  alert('分享功能');
}
