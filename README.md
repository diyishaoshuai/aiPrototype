# AI Prototype Hub

基于 Vue 3 + Vite + MongoDB 的原型页面管理系统，用于快速创建、管理和预览各类应用原型。

## ✨ 特性

- 🎨 **Vue 化原型** - 使用 Vue 3 + Vant 4 构建移动端原型
- 📱 **手机预览** - iPhone 样式的预览框架，真实模拟移动端体验
- 🖥️ **网页预览** - 支持网页端原型的全屏预览
- 🔄 **热更新** - 开发时实时预览原型变化
- 📦 **多入口构建** - Vite 支持多个原型应用独立构建
- 🗂️ **原型管理** - 完整的 CRUD 操作和分类管理
- 🎬 **短剧模块** - 完整的短剧播放功能，支持竖屏/横屏模式

## 技术栈

### 主应用
- **前端**: Vue 3 + Vite + Element Plus + Pinia
- **后端**: Node.js + Express + MongoDB
- **路由**: Vue Router

### 原型应用
- **框架**: Vue 3 (Composition API)
- **UI 组件**: Vant 4
- **路由**: Vue Router (Hash 模式)
- **构建**: Vite 多入口

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 启动后端服务

```bash
node server/start.js
```

后端运行在：http://localhost:8080

### 3. 启动前端服务

```bash
pnpm dev
```

前端运行在：http://localhost:3000

### 4. 访问应用

- **管理后台**: http://localhost:3000/
- **原型预览**: 点击原型卡片的"预览"按钮

## 项目结构

```
aiPrototype/
├── src/                          # 主应用前端代码
│   ├── views/                   # 页面组件
│   ├── stores/                  # Pinia 状态管理
│   ├── router/                  # 路由配置
│   ├── prototypes/              # 原型应用目录
│   │   └── short-video-app/    # 短视频原型
│   │       ├── main.js         # 原型入口
│   │       ├── App.vue         # 根组件
│   │       ├── router.js       # 原型路由
│   │       ├── components/     # 共享组件
│   │       └── views/          # 原型页面
│   └── main.js                 # 主应用入口
├── server/                      # Node.js 后端
│   ├── index.js                # 服务器配置
│   ├── start.js                # 启动文件
│   ├── routes.js               # API 路由
│   └── mockData.js             # 模拟数据
├── prototypes/                  # 原型入口 HTML
│   └── short-video-app.html    # 短视频应用入口
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
- 短剧播放器 - 竖屏播放、滑动切集
- 横屏播放器 - 独立横屏页面、倍速/画质/弹幕控制
- 选集面板 - 快速切换剧集
- 评论系统 - 评论列表和互动

### 星趣官网 (xingqu)

企业官网原型，包含：
- 首页 - 产品介绍、下载引导
- 移动端适配版本 (xingqu_h5)

## 如何添加新原型

1. 在 `src/prototypes/` 下创建新文件夹
2. 创建 Vue 应用结构（main.js, App.vue, router.js）
3. 在 `prototypes/` 下创建入口 HTML 文件
4. 在 `vite.config.js` 中添加新入口
5. 在后端 `mockData.js` 中添加原型信息

## License

MIT
