# 使用 Node.js Alpine 镜像作为基础镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 创建 yarn 缓存目录并设置权限
RUN mkdir -p /home/node/.cache/yarn && \
    chown -R node:node /home/node/.cache

# 复制 package.json 和 yarn.lock
COPY package.json yarn.lock ./

# 安装依赖并清理缓存
RUN yarn install && \
    yarn cache clean

# 复制源代码
COPY . .

# 创建必要的目录并设置权限
RUN mkdir -p docs/.vitepress/dist && \
    chmod -R 777 docs && \
    chown -R node:node /app

# 切换到非 root 用户
USER node

# 设置 yarn 缓存目录
ENV YARN_CACHE_FOLDER=/home/node/.cache/yarn

# 暴露端口
EXPOSE 5555

# 启动命令 - 使用 start 命令启动服务
CMD ["yarn", "start"] 