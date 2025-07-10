LinkPilot – AI-Powered LinkedIn Assistant (JavaScript Edition)

目标：三天内完成一个最简可用的网站：粘贴 LinkedIn 个人页 → 一次性抓取公开资料 → AI 生成 Connect Message → 保存并管理历史记录。

全项目使用 纯 JavaScript（无 TypeScript），配合 Cursor/GPT 辅助编程。

⸻

1 技术栈 & 依赖

层级	依赖	作用
前端 + API	Next.js 14 — --js 模板	同仓库管理路由与后端接口，一键部署 Vercel
数据库	MongoDB Atlas (Free Tier)	存联系人与消息历史
AI	OpenAI GPT-4o API	生成 Connect / Follow-up 文本
一次爬取	Puppeteer Core	Headless Chrome 抓取目标公开信息
开发	Cursor IDE + GitHub	AI 补全、版本控制


⸻

2 目录结构（纯 JS）

linkpilot/
├─ app/
│   ├─ layout.jsx          // 公共布局
│   ├─ page.jsx            // /  Dashboard
│   └─ add-contact/
│        └─ page.jsx       // /add-contact  表单页
├─ components/
│   ├─ AddContactForm.jsx
│   ├─ ContactCard.jsx
│   └─ MessageModal.jsx
├─ lib/
│   ├─ db.js               // Mongo 连接单例
│   ├─ openai.js           // GPT 调用封装
│   └─ scrape.js           // Puppeteer 一次抓取
├─ pages/api/
│   ├─ contact/
│   │     ├─ fetch.js      // POST: 抓取资料
│   │     └─ add.js        // POST: 保存联系人
│   └─ message/
│         └─ generate.js   // POST: 生成 Message
├─ utils/generatePrompt.js // 拼 Prompt
├─ public/                 // 静态资源
├─ .env.local              // 私钥：MONGODB_URI, OPENAI_API_KEY
└─ README.md


⸻

3 数据库 Schema

contacts {
  _id,
  ownerId,
  name,
  title,
  company,
  education,
  avatarUrl,
  linkedinUrl,
  status: "none" | "sent" | "accepted" | "replied",
  createdAt,
  updatedAt
}
messages {
  _id,
  contactId,
  type: "connect" | "followup",
  content,
  tone,
  sentAt,
  success: boolean
}


⸻

4 Prompt 模板

You are an expert LinkedIn networking assistant.

User background:
{user_summary}

Target:
{name}, {title} at {company}
Shared context: {shared}

Generate a {tone} LinkedIn connection request (<300 chars).


⸻

5 一次爬取核心 (lib/scrape.js)

import puppeteer from 'puppeteer-core';
export async function scrapeLinkedIn(url) {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto(url, { timeout: 10000 });
  await page.waitForSelector('main');
  const data = await page.evaluate(() => ({
    name: document.querySelector('h1')?.innerText.trim(),
    title: document.querySelector('.text-body-medium')?.innerText.trim(),
    company: document.querySelector('[data-field="experience_company"] span')?.innerText.trim(),
    education: document.querySelector('[data-field="education_school"] span')?.innerText.trim(),
    avatar: document.querySelector('img[alt="Avatar"]')?.src
  }));
  await browser.close();
  return data;
}


⸻

6 三天开发计划

Day	任务	关键操作
D0	初始化	create-next-app --js、配置 .env.local
D1	页面骨架	Dashboard 列表、Add Contact 表单、导航条
D2	API + AI	/api/contact/fetch, /api/message/generate, Modal 显示结果
D3	部署	Vercel 上线、README、演示 GIF

完成标志： 粘贴 URL → 生成消息弹窗 → 复制并跳转 LinkedIn。

⸻

7 安全 & 配置
	•	.env.local 存私钥并被 .gitignore 排除
	•	Vercel → Environment Variables 注入
	•	所有浏览器可见变量需 NEXT_PUBLIC_ 前缀

⸻

End of JS Plan – iterate freely 🚀