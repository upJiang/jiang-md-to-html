#!/bin/bash

# 拉取最新代码
git pull origin main

# 安装依赖
yarn install

# 构建应用
yarn build

# 重启服务
pm2 restart md-to-html || pm2 start src/server/index.js --name md-to-html 