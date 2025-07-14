# MongoDB 集成教程 - LinkPilot

## 概述

LinkPilot 使用 MongoDB 作为数据库来存储用户资料、联系人和消息。本教程将指导你如何设置和使用 MongoDB。

## 1. MongoDB 设置

### 1.1 创建 MongoDB Atlas 账户

1. 访问 [MongoDB Atlas](https://www.mongodb.com/atlas)
2. 注册免费账户
3. 创建一个新集群（选择 M0 免费层）
4. 设置数据库用户和密码
5. 配置网络访问（允许所有IP：0.0.0.0/0）

### 1.2 获取连接字符串

1. 在 Atlas 控制台中，点击 "Connect"
2. 选择 "Connect your application"
3. 复制连接字符串，格式如下：
   ```
   mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
   ```

### 1.3 环境变量配置

在 `.env.local` 文件中添加：

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=linkpilot
```

## 2. 数据库结构

### 2.1 集合（Collections）

LinkPilot 使用以下集合：

#### user_profiles
存储用户的 LinkedIn 资料信息

```javascript
{
  _id: ObjectId,
  ownerId: String,        // NextAuth user ID
  linkedin_id: String,    // LinkedIn profile ID
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

#### contacts
存储用户添加的联系人

```javascript
{
  _id: ObjectId,
  ownerId: String,        // NextAuth user ID
  linkedin_id: String,    // LinkedIn profile ID
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

#### messages
存储与联系人的对话消息

```javascript
{
  _id: ObjectId,
  contactId: String,      // Contact's linkedin_id
  ownerId: String,        // NextAuth user ID
  role: String,           // 'ai' or 'user'
  content: String,
  createdAt: Date
}
```

## 3. 数据库操作

### 3.1 连接数据库

```javascript
// lib/db.js
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
let client;
let clientPromise;

if (!uri) {
  throw new Error("Please add your MongoDB URI to .env.local");
}

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export default clientPromise;

export async function connectToDatabase() {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB || 'linkpilot');
  return { client, db };
}
```

### 3.2 用户资料操作

#### 保存用户资料
```javascript
// pages/api/user/scrape.js
export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  const { url } = req.body;
  
  // 1. 爬取 LinkedIn 资料
  const profileData = await scrapeLinkedIn(url);
  
  // 2. 保存到数据库
  const { db } = await connectToDatabase();
  
  const userProfile = {
    ownerId: session.user.id,
    linkedin_id: profileData.linkedin_id,
    name: profileData.name,
    headline: profileData.headline,
    education: profileData.education,
    experience: profileData.experience,
    avatarUrl: profileData.avatarUrl,
    linkedinUrl: url,
    updatedAt: new Date()
  };
  
  // 使用 upsert 操作（如果存在则更新，不存在则插入）
  await db.collection('user_profiles').updateOne(
    { ownerId: session.user.id },
    { $set: userProfile },
    { upsert: true }
  );
  
  res.status(200).json(userProfile);
}
```

#### 获取用户资料
```javascript
// pages/api/user/profile.js
export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  
  const { db } = await connectToDatabase();
  
  const userProfile = await db.collection('user_profiles').findOne({
    ownerId: session.user.id
  });
  
  if (!userProfile) {
    return res.status(404).json({ message: 'Profile not found' });
  }
  
  res.status(200).json(userProfile);
}
```

### 3.3 联系人操作

#### 添加联系人
```javascript
// pages/api/contact/scrape.js
export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  const { url } = req.body;
  
  // 1. 爬取联系人资料
  const contactData = await scrapeLinkedIn(url);
  
  // 2. 保存到数据库
  const { db } = await connectToDatabase();
  
  const contact = {
    ownerId: session.user.id,
    linkedin_id: contactData.linkedin_id,
    name: contactData.name,
    headline: contactData.headline,
    education: contactData.education,
    experience: contactData.experience,
    avatarUrl: contactData.avatarUrl,
    linkedinUrl: url,
    createdAt: new Date()
  };
  
  // 检查是否已存在
  const existingContact = await db.collection('contacts').findOne({
    ownerId: session.user.id,
    linkedin_id: contactData.linkedin_id
  });
  
  if (existingContact) {
    return res.status(400).json({ message: 'Contact already exists' });
  }
  
  await db.collection('contacts').insertOne(contact);
  res.status(200).json(contact);
}
```

#### 获取用户的所有联系人
```javascript
// pages/api/contact/fetch.js
export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  
  const { db } = await connectToDatabase();
  
  const contacts = await db.collection('contacts')
    .find({ ownerId: session.user.id })
    .sort({ createdAt: -1 })
    .toArray();
  
  res.status(200).json(contacts);
}
```

### 3.4 消息操作

#### 保存消息
```javascript
// pages/api/message/save.js
export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  const { contactId, role, content } = req.body;
  
  const { db } = await connectToDatabase();
  
  const message = {
    contactId,
    ownerId: session.user.id,
    role,
    content,
    createdAt: new Date()
  };
  
  await db.collection('messages').insertOne(message);
  res.status(200).json(message);
}
```

#### 获取与联系人的对话
```javascript
// pages/api/message/fetch.js
export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  const { contactId } = req.query;
  
  const { db } = await connectToDatabase();
  
  const messages = await db.collection('messages')
    .find({ 
      ownerId: session.user.id,
      contactId: contactId 
    })
    .sort({ createdAt: 1 })
    .toArray();
  
  res.status(200).json(messages);
}
```

## 4. 索引优化

为了提高查询性能，建议创建以下索引：

```javascript
// 在 MongoDB Atlas 控制台或使用 MongoDB Compass 创建索引

// user_profiles 集合
db.user_profiles.createIndex({ "ownerId": 1 })

// contacts 集合
db.contacts.createIndex({ "ownerId": 1 })
db.contacts.createIndex({ "ownerId": 1, "linkedin_id": 1 })

// messages 集合
db.messages.createIndex({ "ownerId": 1, "contactId": 1 })
db.messages.createIndex({ "createdAt": 1 })
```

## 5. 错误处理

### 5.1 连接错误处理
```javascript
export async function connectToDatabase() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || 'linkpilot');
    return { client, db };
  } catch (error) {
    console.error('Database connection error:', error);
    throw new Error('Failed to connect to database');
  }
}
```

### 5.2 查询错误处理
```javascript
try {
  const result = await db.collection('user_profiles').findOne({
    ownerId: session.user.id
  });
  
  if (!result) {
    return res.status(404).json({ message: 'Profile not found' });
  }
  
  res.status(200).json(result);
} catch (error) {
  console.error('Database query error:', error);
  res.status(500).json({ message: 'Internal server error' });
}
```

## 6. 数据验证

### 6.1 输入验证
```javascript
// 验证 LinkedIn URL
function validateLinkedInUrl(url) {
  const linkedinRegex = /^https:\/\/www\.linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/;
  return linkedinRegex.test(url);
}

// 验证用户资料数据
function validateUserProfile(profile) {
  return profile.name && 
         profile.headline && 
         profile.linkedin_id;
}
```

### 6.2 数据清理
```javascript
function sanitizeProfileData(data) {
  return {
    name: data.name?.trim(),
    headline: data.headline?.trim(),
    education: {
      positions: data.education?.positions?.filter(p => p?.trim()) || [],
      institutions: data.education?.institutions?.filter(i => i?.trim()) || [],
      dates: data.education?.dates?.filter(d => d?.trim()) || []
    },
    experience: {
      positions: data.experience?.positions?.filter(p => p?.trim()) || [],
      institutions: data.experience?.institutions?.filter(i => i?.trim()) || [],
      dates: data.experience?.dates?.filter(d => d?.trim()) || []
    }
  };
}
```

## 7. 监控和维护

### 7.1 数据库监控
- 使用 MongoDB Atlas 的监控功能
- 监控连接数、查询性能、存储使用情况
- 设置告警通知

### 7.2 数据备份
- MongoDB Atlas 自动提供备份
- 定期测试恢复流程
- 考虑数据导出策略

### 7.3 性能优化
- 定期分析慢查询
- 优化索引策略
- 监控内存使用情况

## 8. 安全考虑

### 8.1 访问控制
- 使用强密码
- 定期轮换数据库密码
- 限制网络访问

### 8.2 数据保护
- 加密敏感数据
- 实施数据保留策略
- 遵守隐私法规

## 9. 测试

### 9.1 单元测试
```javascript
// tests/db.test.js
import { connectToDatabase } from '../lib/db';

describe('Database Operations', () => {
  test('should connect to database', async () => {
    const { db } = await connectToDatabase();
    expect(db).toBeDefined();
  });
  
  test('should insert and retrieve user profile', async () => {
    const { db } = await connectToDatabase();
    
    const testProfile = {
      ownerId: 'test-user',
      name: 'Test User',
      headline: 'Test Headline'
    };
    
    await db.collection('user_profiles').insertOne(testProfile);
    
    const retrieved = await db.collection('user_profiles').findOne({
      ownerId: 'test-user'
    });
    
    expect(retrieved.name).toBe('Test User');
  });
});
```

### 9.2 集成测试
- 测试完整的 API 流程
- 验证数据一致性
- 测试错误处理

## 10. 部署注意事项

### 10.1 生产环境
- 使用生产级 MongoDB 集群
- 配置适当的网络访问控制
- 设置监控和告警

### 10.2 环境变量
- 确保所有环境变量正确设置
- 使用不同的数据库名称区分环境
- 保护敏感信息

这个教程涵盖了 LinkPilot 项目中 MongoDB 的所有主要使用场景。按照这个指南，你可以有效地管理和操作数据库。 