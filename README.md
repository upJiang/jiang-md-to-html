# Markdown to HTML Converter

这是一个简单的 Markdown 转 HTML 服务，使用 VitePress 和 Koa 构建。用户可以上传 Markdown 文件，系统会自动将其转换为可访问的 HTML 页面。

## 功能特点

- 支持拖拽上传 Markdown 文件
- 自动生成唯一的访问链接
- 使用 VitePress 生成美观的 HTML 页面
- 支持实时预览

## 安装

```bash
# 克隆项目
git clone [your-repository-url]

# 安装依赖
yarn install
```

## 使用方法

1. 开发模式运行：
```bash
yarn dev
```

2. 生产环境运行：
```bash
yarn start
```

3. 访问服务：
- 打开浏览器访问 `http://localhost:3000`
- 拖拽或选择 Markdown 文件上传
- 系统会生成一个唯一的访问链接

## 部署到腾讯云轻量服务器

1. 在服务器上安装 Node.js 和 yarn
2. 克隆项目到服务器
3. 安装依赖：`yarn install`
4. 构建项目：`yarn build`
5. 使用 PM2 启动服务：
```bash
pm2 start src/server/index.js
```

## 注意事项

- 确保服务器有足够的存储空间
- 建议配置 Nginx 反向代理
- 可以根据需要调整上传文件大小限制 