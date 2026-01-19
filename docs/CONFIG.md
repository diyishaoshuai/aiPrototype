# 配置说明文档

## 📋 目录

1. [环境配置](#环境配置)
2. [前端配置](#前端配置)
3. [后端配置](#后端配置)
4. [开发指南](#开发指南)
5. [生产部署](#生产部署)

---

## 🔧 环境配置

### 环境变量文件

项目使用 `.env` 文件管理环境变量，支持多环境配置：

- `.env.example` - 开发环境配置模板
- `.env.production.example` - 生产环境配置模板
- `.env` - 实际使用的配置文件（不提交到 Git）

### 配置步骤

1. **复制配置模板**

```bash
# 开发环境
cp .env.example .env

# 生产环境
cp .env.production.example .env.production
```

2. **修改配置参数**

打开 `.env` 文件，根据实际情况修改以下参数：

```env
# 应用环境
NODE_ENV=development

# 服务器端口
VITE_PORT=3000
API_PORT=8080

# 数据库连接
DATABASE_URL=mongodb://localhost:27017/ai-prototype-hub

# 安全配置
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:3000
```

---

## 🎨 前端配置

### Vite 配置文件

位置：`vite.config.js`

**主要功能：**

1. **环境变量加载**
   - 自动加载 `.env` 文件
   - 支持多环境配置

2. **路径别名**
   ```javascript
   alias: {
     '@': './src'
   }
   ```

3. **代码分割**
   - Vue 核心库单独打包
   - UI 组件库单独打包
   - 优化加载性能

4. **API 代理**
   ```javascript
   proxy: {
     '/api': {
       target: 'http://localhost:8080',
       changeOrigin: true
     }
   }
   ```

### 前端 API 配置

位置：`src/config/api.js`

**使用方法：**

```javascript
import http from '@/utils/http'
import { API_ENDPOINTS } from '@/config/api'

// 获取原型列表
const prototypes = await http.get(API_ENDPOINTS.prototypes.list)

// 获取单个原型
const prototype = await http.get(API_ENDPOINTS.prototypes.detail(id))

// 创建原型
const newPrototype = await http.post(API_ENDPOINTS.prototypes.create, data)
```

---

## ⚙️ 后端配置

### Express 配置文件

位置：`server/config.js`

**配置项说明：**

```javascript
{
  env: 'development',           // 环境类型
  port: { frontend: 3000, api: 8080 },  // 端口配置
  database: {
    url: 'mongodb://...',       // 数据库连接
    name: 'ai-prototype-hub'    // 数据库名称
  },
  security: {
    jwtSecret: 'xxx',           // JWT 密钥
    corsOrigin: ['http://...']  // CORS 白名单
  }
}
```

### 中间件配置

位置：`server/middleware.js`

**包含功能：**

1. **错误处理** - 统一错误响应格式
2. **404 处理** - 资源不存在处理
3. **请求限流** - 防止 API 滥用

---

## 🚀 开发指南

### 启动开发环境

1. **安装依赖**
```bash
npm install
# 或
pnpm install
```

2. **配置环境变量**
```bash
cp .env.example .env
# 修改 .env 文件中的配置
```

3. **启动服务**
```bash
# 启动前端开发服务器
npm run dev

# 启动后端 API 服务器（新终端）
npm run server
```

4. **访问应用**
- 前端：http://localhost:3000
- API：http://localhost:8080
- 健康检查：http://localhost:8080/health

### 开发建议

1. **使用环境变量**
   - 不要硬编码配置信息
   - 敏感信息使用环境变量

2. **API 请求**
   - 使用 `src/utils/http.js` 统一请求
   - 使用 `src/config/api.js` 管理端点

3. **错误处理**
   - 前端使用 try-catch 捕获错误
   - 后端错误会自动被中间件处理

---
