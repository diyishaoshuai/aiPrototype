# AI Prototype Hub

基于 Vue 3 + Vite + MongoDB 的原型页面管理系统

## ✨ 特性

- 🎨 **Vue 化原型** - 使用 Vue 3 + Vant 4 构建移动端原型
- 📱 **手机预览** - iPhone 样式的预览框架
- 🔄 **热更新** - 开发时实时预览原型变化
- 📦 **多入口构建** - Vite 支持多个原型应用独立构建
- 🗂️ **原型管理** - 完整的 CRUD 操作和分类管理

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

### 短视频应用

仿抖音/快手的短视频应用原型，包含以下页面：

- **首页（直播）** - 视频滑动浏览
- **广场** - 热门内容
- **推荐** - 个性化推荐
- **交友** - 社交功能
- **短剧列表** - 短剧网格展示
- **短剧详情** - 剧集信息和选集
- **短剧播放** - 视频播放和评论

## 如何添加新原型

1. 在 `src/prototypes/` 下创建新文件夹
2. 创建 Vue 应用结构（main.js, App.vue, router.js）
3. 在 `prototypes/` 下创建入口 HTML 文件
4. 在 `vite.config.js` 中添加新入口
5. 在后端 `mockData.js` 中添加原型信息

## License

MIT
