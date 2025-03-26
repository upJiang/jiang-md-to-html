# 使用 Node.js 官方镜像作为基础镜像
FROM node:18

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 yarn.lock
COPY package.json yarn.lock ./

# 安装依赖
RUN yarn install

# 复制源代码
COPY . .

# 创建必要的目录并设置权限
RUN mkdir -p docs/.vitepress/dist && \
    chmod -R 777 docs && \
    chown -R node:node /app

# 切换到非 root 用户
USER node

# 暴露端口
EXPOSE 5555

# 启动命令 - 使用 start 命令启动服务
CMD ["yarn", "start"] 