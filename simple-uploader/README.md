# Markdown 文件上传器

这是一个简单的 Vue 3 应用程序，用于上传 Markdown 文件并将其转换为 HTML。

## 功能

- 支持拖放上传 Markdown 文件
- 显示上传进度
- 上传成功后显示生成的 HTML 文件链接
- 支持复制链接到剪贴板
- 响应式设计，适用于移动设备和桌面设备

## 使用方法

1. 只需在浏览器中打开 `index.html` 文件即可
2. 通过拖放或点击选择按钮选择 Markdown 文件
3. 点击上传按钮
4. 上传成功后，会显示生成的 HTML 文件链接

## 部署

可以将 `index.html` 文件部署到任何静态网站托管服务上，如 GitHub Pages、Netlify、Vercel 等。

## 技术栈

- Vue 3 (使用 CDN 引入)
- Axios (用于 HTTP 请求)
- 纯 CSS (无框架)

## API 端点

默认使用的 API 端点为：`https://junfeng530.xyz/md/api/upload`

如果需要修改 API 端点，请编辑 `index.html` 文件中的 `uploadFile` 函数中的 URL。 