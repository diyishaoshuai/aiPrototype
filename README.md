# AI Prototype Hub

基于 Vue 3 + Vite + MongoDB 的原型页面管理系统

## 技术栈

- **前端**: Vue 3 + Vite + Element Plus + Pinia
- **后端**: Node.js + Express + MongoDB
- **路由**: Vue Router

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置环境变量

`.env` 文件已配置：
```bash
DATABASE_URL="mongodb://localhost:27017/ai-prototype-hub"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. 启动后端服务

```bash
pnpm server
```

后端运行在：http://localhost:3001

### 4. 启动前端服务

```bash
pnpm dev
```

前端运行在：http://localhost:3000

## 项目结构

```
aiPrototype/
├── src/                    # Vue 前端代码
│   ├── views/             # 页面组件
│   ├── stores/            # Pinia 状态管理
│   ├── router/            # 路由配置
│   └── main.js            # 入口文件
├── server/                # Node.js 后端
│   ├── index.js          # 服务器配置
│   └── routes.js         # API 路由
└── public/               # 静态资源
    └── prototypes/       # 原型文件（3个示例）
```

## 示例原型

- 登录页面 - `/prototypes/login-page.html`
- 电商首页 - `/prototypes/ecommerce-home.html`
- 后台管理 - `/prototypes/admin-dashboard.html`

## License

MIT
