# 第一少帅的原型中心

基于 Vue 3 + Vite 的纯静态原型页面展示系统，用于快速预览各类应用原型。

## ✨ 特性

- 🎨 **Vue 化原型** - 使用 Vue 3 + Vant 4 构建移动端原型
- 📱 **手机预览** - iPhone 样式的预览框架，真实模拟移动端体验
- 🖥️ **网页预览** - 支持网页端原型的全屏预览
- 💻 **客户端原型** - 支持桌面客户端应用原型，可拖拽窗口设计
- 🔄 **热更新** - 开发时实时预览原型变化
- 📦 **多入口构建** - Vite 支持多个原型应用独立构建
- 🗂️ **原型管理** - 完整的 CRUD 操作和分类管理
- 🎬 **短剧模块** - 完整的短剧播放功能，支持竖屏/横屏/全屏模式
- 💬 **交互功能** - 双击点赞、评论系统、分享功能
- 🎯 **页面结构导航** - 树形结构展示，快速定位页面

## 🖼️ 预览

### 管理后台
- 原型列表展示
- 页面结构树形导航
- iPhone 样式预览框架

### 短视频应用
- 抖音风格的视频播放器
- 短剧列表和排行榜
- 完整的播放控制（竖屏/横屏/全屏）
- 双击点赞动画效果
- 评论和分享功能

## 技术栈

- **前端框架**: Vue 3 (Composition API)
- **构建工具**: Vite
- **UI 组件**: Element Plus + Vant 4
- **状态管理**: Pinia
- **路由**: Vue Router
- **样式**: Tailwind CSS v4
- **部署**: Vercel (纯静态)

## 快速开始

### 环境要求

- Node.js >= 16
- pnpm >= 8

### 1. 克隆项目

```bash
git clone https://github.com/diyishaonian/aiPrototype.git
cd aiPrototype
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:3000

### 4. 构建生产版本

```bash
pnpm build
```

构建产物在 `dist` 目录。

## 在线预览

访问：https://ai-prototype-hub.vercel.app

## 项目结构

```
aiPrototype/
├── src/                          # 主应用前端代码
│   ├── views/                   # 页面组件
│   │   ├── Dashboard.vue        # 首页
│   │   └── Preview.vue         # 预览页面
│   ├── stores/                  # Pinia 状态管理
│   ├── data/                    # Mock 数据
│   ├── router/                  # 路由配置
│   ├── prototypes/              # 原型应用目录
│   │   ├── short-video-app/    # 短视频原型
│   │   ├── xingqu_web/         # 星趣官网（电脑端）
│   │   ├── xingqu_h5/          # 星趣官网（手机端）
│   │   └── xingqu-client/      # 星趣PC客户端
│   └── main.js                 # 主应用入口
├── prototypes/                  # 原型入口 HTML
│   ├── short-video-app.html
│   ├── xingqu_web.html
│   ├── xingqu_h5.html
│   └── xingqu-client.html
├── public/                      # 静态资源
└── vite.config.js              # Vite 多入口配置
```

## 示例原型

### 短视频应用 (short-video-app)

仿抖音/快手的短视频应用原型，包含以下功能：

**核心页面：**
- 首页（直播） - 视频滑动浏览
- 广场 - 热门内容展示
- 推荐 - 个性化推荐
- 交友 - 社交功能
- 个人中心 - 用户信息管理

**短剧模块：**
- 短剧列表 - 网格展示、分类筛选
- 短剧排行榜 - 热门排行
- 短剧播放器 - 竖屏播放、滑动切集、双击点赞
- 横屏播放器 - 独立横屏页面、倍速/画质/弹幕控制
- 全屏模式 - 沉浸式播放体验、长按加速
- 选集面板 - 快速切换剧集
- 评论系统 - 评论列表和互动
- 分享功能 - 分享给好友、微信、朋友圈

**交互特性：**
- 双击点赞动画（仿抖音爱心特效）
- 滑动切换视频/剧集
- 长按加速播放
- Toast 提示反馈
- 平滑过渡动画

### 星趣官网 (xingqu_web / xingqu_h5)

企业官网原型，包含：
- 电脑端版本 (xingqu_web) - 产品介绍、下载引导
- 移动端版本 (xingqu_h5) - 移动端适配设计

### 星趣PC客户端 (xingqu-client)

桌面客户端应用原型，模拟真实的直播推流工具体验：

**界面布局：**
- 左中右三栏布局（20%:60%:20%）
- 窗口尺寸：最小 1280×720，最大填满画布
- 响应式设计，适配不同窗口大小

**左侧面板：**
- 场景管理 - 新增/删除/切换多个直播场景
- 互动玩法 - PK模式、语音连麦、视频连麦
- 直播工具 - 麦克风开关、直播管理、美颜设置、画面镜像

**中间面板：**
- 顶部栏 - 封面上传、标题输入、分类选择、横竖屏切换
- 直播画布 - 16:9横屏或9:16竖屏，支持添加摄像头
- 底部栏 - 麦克风音量调节、开始/停止直播按钮

**右侧面板：**
- 在线观众榜 - 显示前20名观众，头像、昵称、在线时长
- 互动消息 - 文字消息、表情、系统提示，支持主播回复

**美颜面板：**
- 美颜效果 - 磨皮、美白、锐化调节（0-100级）
- 美型效果 - 瘦脸、大眼、小脸、窄脸调节（0-100级）
- 滤镜效果 - 6种滤镜选择（无、自然、粉嫩、清新、暖阳、冷色）
- 实时预览 - 滑块调节，实时显示参数值
- 快速操作 - 重置/应用按钮，一键恢复默认设置
- 小窗适配 - 自动适应1280×720小窗口状态

**窗口特性：**
- 流畅拖拽 - 使用 transform + RAF 优化，拖动跟手
- 窗口控制 - 最小化、最大化、关闭按钮
- 全屏画布 - 白色背景的全屏工作区
- 边界检测 - 窗口不会拖出画布范围
- 状态保存 - 记住窗口位置和大小

## 核心功能详解

### 1. 原型管理

- 支持移动端和网页端原型
- 原型分类和标签管理
- 页面结构树形展示
- 快速预览和导航

### 2. 预览框架

**移动端预览：**
- iPhone 样式外壳
- 状态栏模拟
- 圆角屏幕效果
- 真实设备尺寸

**网页端预览：**
- 全屏展示
- 响应式适配

### 3. 短剧播放器

**播放模式：**
- 竖屏模式：默认播放模式，支持上下滑动切集
- 横屏模式：独立页面，完整控制栏
- 全屏模式：沉浸式体验，隐藏所有控件

**播放控制：**
- 播放/暂停
- 进度条拖动
- 倍速播放（0.75x - 3x）
- 画质切换
- 弹幕开关
- 长按加速（2x）

**交互功能：**
- 双击点赞（爱心动画）
- 评论列表
- 分享功能
- 关注作者

### 4. 分享系统

- 分享给好友（单个/批量）
- 分享到微信
- 分享到朋友圈
- 复制链接
- Toast 提示反馈

## 如何添加新原型

### 步骤 1: 创建原型目录

在 `src/prototypes/` 下创建新文件夹：

```bash
mkdir src/prototypes/your-prototype
```

### 步骤 2: 创建 Vue 应用结构

```
your-prototype/
├── main.js          # 入口文件
├── App.vue          # 根组件
├── router.js        # 路由配置
├── components/      # 共享组件
└── views/          # 页面组件
```

### 步骤 3: 创建入口 HTML

在 `prototypes/` 下创建 `your-prototype.html`：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Prototype</title>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/prototypes/your-prototype/main.js"></script>
</body>
</html>
```

### 步骤 4: 配置 Vite 入口

在 `vite.config.js` 中添加新入口：

```javascript
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        'your-prototype': resolve(__dirname, 'prototypes/your-prototype.html'),
        // ... 其他入口
      }
    }
  }
})
```

### 步骤 5: 添加原型信息

在 `src/data/mockPrototypes.js` 中添加原型信息：

```javascript
{
  _id: 'your-prototype',
  title: 'Your Prototype',
  description: '原型描述',
  category: '移动端', // 或 '网页端' / '客户端'
  tags: ['标签1', '标签2'],
  filePath: '/prototypes/your-prototype.html',
  status: 'PUBLISHED',
  pageStructure: []
}
```

## 开发指南

### 代码规范

- 使用 Vue 3 Composition API
- 组件命名使用 PascalCase
- 文件命名使用 kebab-case

### 样式规范

- 使用 scoped CSS
- 移动端使用 vw/vh 单位
- 使用 Tailwind CSS 工具类
- 动画使用 CSS Transitions

### 提交规范

```
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式调整
refactor: 重构
perf: 性能优化
```

## 浏览器支持

- Chrome >= 90
- Firefox >= 88
- Safari >= 14
- Edge >= 90

## License

MIT

---

**作者**: 第一少帅
**项目**: 原型展示中心
**用途**: 原型展示和学习交流
