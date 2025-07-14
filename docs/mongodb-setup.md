# MongoDB 设置指南 - LinkPilot

## 快速开始

### 1. 环境变量配置

确保你的 `.env.local` 文件包含以下配置：

```env
# MongoDB 配置
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=linkpilot

# Hugging Face API
HF_API_KEY=hf_your_api_key_here

# NextAuth 配置
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_here

# GitHub OAuth
GITHUB_ID=your_github_id
GITHUB_SECRET=your_github_secret
```

### 2. 安装依赖

```bash
npm install
```

### 3. 初始化数据库

```bash
# 基本初始化（创建集合和索引）
npm run db:init

# 初始化并插入示例数据
npm run db:init:sample
```

### 4. 测试数据库连接

```bash
npm run db:test
```

## 数据库操作

### 保存联系人

```javascript
// 前端调用
const response = await fetch('/api/contact/save', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    contact: {
      linkedin_id: 'john-doe-123',
      name: 'John Doe',
      headline: 'Software Engineer at Tech Corp',
      education: {
        positions: ['BSc Computer Science'],
        institutions: ['University of Technology'],
        dates: ['2018-2022']
      },
      experience: {
        positions: ['Software Engineer'],
        institutions: ['Tech Corp'],
        dates: ['2022-Present']
      },
      avatarUrl: 'https://example.com/avatar.jpg',
      linkedinUrl: 'https://linkedin.com/in/john-doe-123'
    }
  })
});

const result = await response.json();
console.log('Contact saved:', result);
```

### 获取所有联系人

```javascript
// 前端调用
const response = await fetch('/api/contact/fetch-all');
const { contacts, count } = await response.json();
console.log(`Found ${count} contacts:`, contacts);
```

### 保存消息

```javascript
// 前端调用
const response = await fetch('/api/message/save', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    contactId: 'john-doe-123',
    role: 'ai', // 'ai' 或 'user'
    content: 'Hi John! I noticed your impressive work at Tech Corp...'
  })
});

const result = await response.json();
console.log('Message saved:', result);
```

### 获取对话历史

```javascript
// 前端调用
const response = await fetch('/api/message/fetch?contactId=john-doe-123');
const { contact, messages, count } = await response.json();
console.log(`Found ${count} messages with ${contact.name}:`, messages);
```

## 数据库结构

### user_profiles 集合

存储用户的 LinkedIn 资料信息：

```javascript
{
  _id: ObjectId,
  ownerId: String,        // NextAuth 用户 ID
  linkedin_id: String,    // LinkedIn 资料 ID
  name: String,
  headline: String,
  education: {
    positions: [String],
    institutions: [String],
    dates: [String]
  },
  experience: {
    positions: [String],
    institutions: [String],
    dates: [String]
  },
  avatarUrl: String,
  linkedinUrl: String,
  updatedAt: Date
}
```

### contacts 集合

存储用户添加的联系人：

```javascript
{
  _id: ObjectId,
  ownerId: String,        // NextAuth 用户 ID
  linkedin_id: String,    // LinkedIn 资料 ID
  name: String,
  headline: String,
  education: {
    positions: [String],
    institutions: [String],
    dates: [String]
  },
  experience: {
    positions: [String],
    institutions: [String],
    dates: [String]
  },
  avatarUrl: String,
  linkedinUrl: String,
  createdAt: Date
}
```

### messages 集合

存储与联系人的对话消息：

```javascript
{
  _id: ObjectId,
  contactId: String,      // 联系人的 linkedin_id
  ownerId: String,        // NextAuth 用户 ID
  role: String,           // 'ai' 或 'user'
  content: String,
  createdAt: Date
}
```

## 索引优化

数据库初始化脚本会自动创建以下索引：

- `user_profiles.ownerId` - 快速查找用户资料
- `contacts.ownerId` - 快速查找用户的所有联系人
- `contacts.ownerId + linkedin_id` - 防止重复联系人
- `messages.ownerId + contactId` - 快速查找对话
- `messages.createdAt` - 按时间排序消息

## 错误处理

所有 API 都包含完整的错误处理：

- 401 Unauthorized - 用户未登录
- 400 Bad Request - 请求数据无效
- 404 Not Found - 资源不存在
- 500 Internal Server Error - 服务器错误

## 性能优化

### 查询优化

1. 使用索引字段进行查询
2. 限制返回的文档数量
3. 只选择需要的字段

```javascript
// 好的查询示例
const contacts = await db.collection('contacts')
  .find({ ownerId: session.user.id })
  .project({ name: 1, headline: 1, avatarUrl: 1 })
  .limit(10)
  .sort({ createdAt: -1 })
  .toArray();
```

### 连接池管理

MongoDB 客户端使用连接池，避免频繁创建连接：

```javascript
// lib/db.js 中的单例模式
if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}
```

## 监控和维护

### 数据库监控

使用 MongoDB Atlas 控制台监控：

- 连接数
- 查询性能
- 存储使用情况
- 慢查询分析

### 数据备份

MongoDB Atlas 提供自动备份：

- 每日备份
- 7天保留期
- 一键恢复

### 性能调优

1. 定期分析慢查询
2. 优化索引策略
3. 监控内存使用
4. 设置告警通知

## 安全考虑

### 访问控制

1. 使用强密码
2. 定期轮换数据库密码
3. 限制网络访问（IP 白名单）

### 数据保护

1. 加密敏感数据
2. 实施数据保留策略
3. 遵守隐私法规（GDPR等）

## 故障排除

### 常见问题

1. **连接失败**
   - 检查 MONGODB_URI 是否正确
   - 确认网络访问设置
   - 验证用户名和密码

2. **查询超时**
   - 检查索引是否正确创建
   - 优化查询语句
   - 增加查询超时时间

3. **数据不一致**
   - 检查事务处理
   - 验证数据验证逻辑
   - 查看错误日志

### 调试技巧

1. 启用详细日志
2. 使用 MongoDB Compass 查看数据
3. 运行数据库测试脚本
4. 检查 Atlas 监控面板

## 下一步

1. 阅读完整的 [MongoDB 教程](./mongodb-tutorial.md)
2. 查看 [API 文档](../README.md#api-endpoints)
3. 运行测试确保一切正常
4. 部署到生产环境 