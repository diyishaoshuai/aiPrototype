// 视频项组件
class VideoItem {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.bg = data.bg;
  }

  render() {
    return `
      <div class="video-item">
        <div class="video-placeholder" style="background: ${this.bg}">
          <div class="video-number">#${this.id}</div>
          <div class="video-title">${this.title}</div>
        </div>
      </div>
    `;
  }
}
