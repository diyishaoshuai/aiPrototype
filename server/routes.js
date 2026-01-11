import { app, Prototype, PORT, isMongoConnected } from './index.js'
import mockData from './mockData.js'

// API 路由

// 获取所有原型
app.get('/api/prototypes', async (req, res) => {
  try {
    // 如果 MongoDB 未连接，使用模拟数据
    if (!isMongoConnected) {
      const { search, category } = req.query
      let filtered = [...mockData]

      if (category) {
        filtered = filtered.filter(p => p.category === category)
      }
      if (search) {
        filtered = filtered.filter(p =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.description?.toLowerCase().includes(search.toLowerCase())
        )
      }

      return res.json(filtered)
    }

    // 使用 MongoDB
    const { search, category } = req.query
    const query = {}

    if (category) query.category = category
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }

    const prototypes = await Prototype.find(query).sort({ createdAt: -1 })
    res.json(prototypes)
  } catch (error) {
    res.status(500).json({ error: '获取原型列表失败' })
  }
})

// 获取单个原型
app.get('/api/prototypes/:id', async (req, res) => {
  try {
    // 如果 MongoDB 未连接，使用模拟数据
    if (!isMongoConnected) {
      const prototype = mockData.find(p => p._id === req.params.id)
      if (!prototype) {
        return res.status(404).json({ error: '原型不存在' })
      }
      return res.json(prototype)
    }

    // 使用 MongoDB
    const prototype = await Prototype.findById(req.params.id)
    if (!prototype) {
      return res.status(404).json({ error: '原型不存在' })
    }
    res.json(prototype)
  } catch (error) {
    res.status(500).json({ error: '获取原型失败' })
  }
})

// 创建原型
app.post('/api/prototypes', async (req, res) => {
  try {
    const prototype = new Prototype(req.body)
    await prototype.save()
    res.status(201).json(prototype)
  } catch (error) {
    res.status(400).json({ error: '创建原型失败' })
  }
})

// 更新原型
app.put('/api/prototypes/:id', async (req, res) => {
  try {
    const prototype = await Prototype.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    )
    if (!prototype) {
      return res.status(404).json({ error: '原型不存在' })
    }
    res.json(prototype)
  } catch (error) {
    res.status(400).json({ error: '更新原型失败' })
  }
})

// 删除原型
app.delete('/api/prototypes/:id', async (req, res) => {
  try {
    const prototype = await Prototype.findByIdAndDelete(req.params.id)
    if (!prototype) {
      return res.status(404).json({ error: '原型不存在' })
    }
    res.json({ message: '删除成功' })
  } catch (error) {
    res.status(500).json({ error: '删除原型失败' })
  }
})

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 服务器运行在 http://localhost:${PORT}`)
})

