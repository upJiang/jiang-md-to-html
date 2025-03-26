FROM node:18-alpine

WORKDIR /app

# 复制 package.json 和 yarn.lock
COPY package.json yarn.lock ./

# 安装依赖
RUN yarn install

# 复制源代码
COPY . .

# 构建应用
RUN yarn build

# 暴露端口
EXPOSE 5555

# 启动应用
CMD ["yarn", "dev"] 