# Markdown to HTML Converter

一个快速简便的 Markdown 转 HTML 服务，基于 VitePress 和 Koa 构建。用户可以上传 Markdown 文件，系统会自动将其转换为美观的 HTML 页面并生成唯一访问链接。

## 功能特点

- 支持拖拽上传或选择 Markdown 文件
- 自动生成唯一的访问链接
- 使用 VitePress 生成干净、美观的 HTML 页面
- 移除了 VitePress 默认的导航栏和侧边栏
- 响应式设计，适配移动设备和桌面设备
- 支持通过 Docker 容器化部署
- GitHub Actions 自动化部署流程

## 项目结构

```
├── src/
│   ├── server/         # 服务器代码
│   │   ├── index.js    # Koa 服务器主文件
│   │   └── public/     # 静态资源文件
│   └── content/        # 内容相关资源
├── docs/               # VitePress 文档目录
│   ├── .vitepress/     # VitePress 配置
│   │   ├── config.js   # 主配置文件
│   │   └── theme/      # 自定义主题
│   └── *.md            # Markdown 文件
├── simple-uploader/    # 简单的上传界面
│   └── mdUpload.html   # 独立的上传页面
├── Dockerfile          # Docker 构建文件
├── nginx.conf          # Nginx 配置示例
├── package.json        # 项目依赖
└── README.md           # 项目说明
```

## 安装与运行

### 本地开发

```bash
# 克隆项目
git clone https://github.com/yourusername/mdToHtml.git
cd mdToHtml

# 安装依赖
yarn install

# 开发模式运行
yarn dev

# 生产模式构建并启动
yarn start
```

### Docker 部署

```bash
# 构建 Docker 镜像
docker build -t md-to-html .

# 运行容器
docker run -d -p 5555:5555 --name md-to-html md-to-html
```

## 配置

### VitePress 配置

VitePress 配置位于 `docs/.vitepress/config.js`，已进行自定义以去除导航栏和侧边栏。

### Nginx 配置

提供了 `nginx.conf` 示例配置文件，用于在生产环境中设置反向代理。主要配置点：

- 将 `/md/` 路径代理到应用服务
- 配置 CORS 支持跨域请求
- 设置上传大小限制和超时时间
- 配置 SSL 证书（如果需要）

### GitHub Actions

项目包含 GitHub Actions 工作流配置（`.github/workflows/deploy.yml`），实现代码推送到 main 分支时自动构建 Docker 镜像并部署到服务器。

## 使用方法

### 上传 Markdown 文件

1. 访问上传页面（如 `https://yourdomain.com/md/` 或直接使用 `simple-uploader/mdUpload.html`）
2. 拖拽 Markdown 文件到上传区域或点击选择文件
3. 点击上传按钮
4. 上传成功后，系统会返回生成的 HTML 文件链接

### API 接口

- **上传端点**: `/api/upload`
- **方法**: POST
- **内容类型**: `multipart/form-data`
- **参数**: `file` (Markdown 文件)
- **响应**: 
  ```json
  {
    "success": true,
    "url": "/path/to/html",
    "fullUrl": "https://yourdomain.com/path/to/html"
  }
  ```

## 故障排除

- **文件上传失败**: 检查 Nginx 配置中的 `client_max_body_size` 设置
- **跨域问题**: 确保 Nginx 配置包含正确的 CORS 头
- **服务无响应**: 检查 Docker 容器日志 `docker logs md-to-html`
- **硬盘空间不足**: 运行 `docker system prune` 清理未使用的 Docker 资源

## 许可证

MIT 