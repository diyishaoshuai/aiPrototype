
## 📦 生产部署

### 构建生产版本

```bash
# 构建前端
npm run build

# 构建产物在 dist 目录
```

### 环境变量配置

生产环境需要修改以下关键配置：

```env
NODE_ENV=production
APP_URL=https://your-domain.com
API_BASE_URL=https://api.your-domain.com
DATABASE_URL=mongodb://username:password@host:27017/database
JWT_SECRET=STRONG-SECRET-KEY-HERE
CORS_ORIGIN=https://your-domain.com
LOG_LEVEL=warn
```

### 部署检查清单

- [ ] 修改所有生产环境配置
- [ ] 更新 JWT_SECRET 为强密码
- [ ] 配置正确的数据库连接
- [ ] 设置 CORS 白名单
- [ ] 配置 HTTPS 证书
- [ ] 测试健康检查接口
- [ ] 配置日志存储路径
- [ ] 设置进程守护（PM2）

---

## 🔍 配置验证

### 检查配置是否正确

1. **前端配置验证**
```bash
npm run build
# 检查是否有错误
```

2. **后端配置验证**
```bash
npm run server
# 访问 http://localhost:8080/health
# 应该返回 {"status":"ok",...}
```

3. **数据库连接验证**
- 查看控制台是否显示 "✅ MongoDB 连接成功"
- 如果失败，检查 DATABASE_URL 配置

---

## ❓ 常见问题

### Q: 前端无法连接后端 API

**解决方案：**
1. 检查 `.env` 文件中的 `API_PORT` 配置
2. 确认后端服务已启动
3. 检查防火墙是否阻止端口

### Q: CORS 错误

**解决方案：**
1. 检查 `CORS_ORIGIN` 配置
2. 确保前端地址在白名单中
3. 生产环境需要配置完整域名

### Q: MongoDB 连接失败

**解决方案：**
1. 检查 `DATABASE_URL` 格式是否正确
2. 确认 MongoDB 服务已启动
3. 检查网络连接和防火墙

---

## 📚 相关文档

- [部署指南](./DEPLOYMENT.md)
- [API 文档](./API.md)
- [项目改进计划](../PROJECT_IMPROVEMENTS.md)

---

**最后更新：** 2026-01-19
