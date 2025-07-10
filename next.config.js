/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true, // 启用 React 严格模式，帮助发现潜在问题
  
    experimental: {
      appDir: true, // 启用 Next.js 14 的 app/ 路由结构
    },
  
    images: {
      domains: [
        'media.licdn.com',
        'cdn.linkedin.com',
        'static.licdn.com'
      ], // 允许从 LinkedIn 加载头像图片
    },
  };
  
  module.exports = nextConfig;