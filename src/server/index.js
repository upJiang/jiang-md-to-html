const Koa = require('koa');
const Router = require('koa-router');
const multer = require('@koa/multer');
const path = require('path');
const fs = require('fs');
const serve = require('koa-static');
const { execSync } = require('child_process');

const app = new Koa();
const router = new Router();

// 错误处理中间件
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        console.error('服务器错误:', err);
        console.error('错误堆栈:', err.stack);
        ctx.status = err.status || 500;
        ctx.body = {
            success: false,
            error: err.message || '服务器内部错误',
            details: process.env.NODE_ENV === 'development' ? err.stack : undefined
        };
    }
});

// 日志中间件
app.use(async (ctx, next) => {
    const start = Date.now();
    console.log('=== 新请求开始 ===');
    console.log(`收到请求: ${ctx.method} ${ctx.url}`);
    console.log('请求头:', JSON.stringify(ctx.request.headers, null, 2));
    console.log('请求体:', JSON.stringify(ctx.request.body, null, 2));
    console.log('Content-Type:', ctx.request.headers['content-type']);
    
    await next();
    
    const ms = Date.now() - start;
    console.log(`请求完成: ${ctx.method} ${ctx.url} - ${ms}ms`);
    console.log('响应状态:', ctx.status);
    console.log('响应体:', JSON.stringify(ctx.body, null, 2));
    console.log('=== 请求结束 ===\n');
});

// 配置 multer 存储
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../../docs');
        console.log('上传目录路径:', uploadDir);
        console.log('目录是否存在:', fs.existsSync(uploadDir));
        console.log('目录权限:', fs.statSync(uploadDir).mode);
        
        if (!fs.existsSync(uploadDir)) {
            console.log('创建上传目录');
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // 生成唯一的文件名
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = uniqueSuffix + path.extname(file.originalname);
        console.log('生成的文件名:', filename);
        cb(null, filename);
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'text/markdown' || file.originalname.endsWith('.md')) {
            cb(null, true);
        } else {
            cb(new Error('只允许上传 Markdown 文件'), false);
        }
    }
});

// 处理文件上传的中间件
const handleUpload = async (ctx) => {
    try {
        console.log('=== 文件上传处理开始 ===');
        console.log('Content-Type:', ctx.request.headers['content-type']);
        console.log('请求头:', JSON.stringify(ctx.request.headers, null, 2));
        console.log('请求体:', JSON.stringify(ctx.request.body, null, 2));
        console.log('文件:', ctx.request.file);
        
        if (!ctx.request.file) {
            console.log('没有文件被上传');
            ctx.status = 400;
            ctx.body = { 
                success: false, 
                error: '没有上传文件',
                details: '请确保使用 POST 方法，Content-Type 为 multipart/form-data，并且文件字段名为 "file"'
            };
            return;
        }

        console.log('文件信息:', {
            originalname: ctx.request.file.originalname,
            filename: ctx.request.file.filename,
            path: ctx.request.file.path,
            mimetype: ctx.request.file.mimetype,
            size: ctx.request.file.size
        });

        // 检查文件是否成功保存
        if (!fs.existsSync(ctx.request.file.path)) {
            console.error('文件保存失败:', ctx.request.file.path);
            throw new Error('文件保存失败');
        }

        // 检查文件权限
        try {
            const stats = fs.statSync(ctx.request.file.path);
            console.log('文件权限:', stats.mode);
            console.log('文件所有者:', stats.uid);
            console.log('文件组:', stats.gid);
        } catch (error) {
            console.error('获取文件权限失败:', error);
        }

        // 构建相对路径
        const relativePath = path.relative(path.join(__dirname, '../../docs'), ctx.request.file.path);
        const url = `/${relativePath.replace(/\\/g, '/')}`;
        
        // 构建完整URL
        const fullUrl = `${ctx.protocol}://${ctx.host}${url}`;

        console.log('文件路径信息:', {
            relativePath,
            url,
            fullUrl
        });

        // 构建 HTML 文件路径
        const htmlFileName = path.basename(ctx.request.file.path, '.md') + '.html';
        const htmlPath = path.join(__dirname, '../../docs/.vitepress/dist', htmlFileName);
        
        console.log('HTML 文件路径:', htmlPath);
        console.log('开始构建 HTML');
        // 使用 VitePress 构建
        try {
            // 检查 docs 目录是否存在
            const docsDir = path.join(__dirname, '../../docs');
            if (!fs.existsSync(docsDir)) {
                throw new Error('docs 目录不存在');
            }

            // 检查 .vitepress 目录是否存在
            const vitepressDir = path.join(docsDir, '.vitepress');
            if (!fs.existsSync(vitepressDir)) {
                throw new Error('.vitepress 目录不存在');
            }

            // 检查 config.js 是否存在
            const configPath = path.join(vitepressDir, 'config.js');
            if (!fs.existsSync(configPath)) {
                throw new Error('VitePress 配置文件不存在');
            }

            // 读取并修改配置文件
            let configContent = fs.readFileSync(configPath, 'utf8');
            const title = path.basename(ctx.request.file.originalname, '.md');
            // 修改标题的正则表达式需要更精确
            configContent = configContent.replace(
                /title:\s*['"]([^'"]*)['"]/,
                `title: '${title}'`
            );
            fs.writeFileSync(configPath, configContent);

            console.log('修改后的配置:', configContent);

            console.log('开始执行构建命令...');
            const buildOutput = execSync('yarn build', { 
                stdio: 'pipe',
                encoding: 'utf8'
            });
            console.log('构建输出:', buildOutput);
            
            // 恢复原始配置
            configContent = fs.readFileSync(configPath, 'utf8');
            configContent = configContent.replace(
                /title:\s*['"]([^'"]*)['"]/,
                "title: 'Markdown to HTML'"
            );
            fs.writeFileSync(configPath, configContent);

            // 检查 HTML 文件是否生成
            if (fs.existsSync(htmlPath)) {
                console.log('HTML 文件生成成功');
                ctx.body = {
                    success: true,
                    message: '文件上传并转换成功',
                    data: {
                        fileName: ctx.request.file.originalname,
                        url: url,
                        fullUrl: fullUrl,
                        htmlUrl: `${ctx.protocol}://${ctx.host}/md/${htmlFileName}`
                    }
                };
            } else {
                console.log('HTML 文件生成失败，检查路径:', htmlPath);
                throw new Error('HTML 文件生成失败');
            }
        } catch (error) {
            console.error('构建错误:', error);
            console.error('错误堆栈:', error.stack);
            ctx.status = 500;
            ctx.body = {
                success: false,
                error: '文件转换失败: ' + error.message,
                details: error.stack
            };
        }
    } catch (error) {
        console.error('上传错误:', error);
        ctx.status = 500;
        ctx.body = {
            success: false,
            error: error.message
        };
    }
};

// API 路由
router.post('/api/upload', upload.single('file'), handleUpload);

// 测试路由
router.get('/api/test', (ctx) => {
    console.log('收到测试请求');
    ctx.body = { success: true, message: 'API 服务器正常运行' };
});

// 添加一个简单的测试路由
router.get('/test', (ctx) => {
    console.log('收到简单测试请求');
    ctx.body = { success: true, message: '简单测试路由正常工作' };
});

// 添加一个 POST 测试路由
router.post('/test', (ctx) => {
    console.log('收到 POST 测试请求');
    console.log('请求体:', ctx.request.body);
    ctx.body = { success: true, message: 'POST 测试路由正常工作' };
});

// 静态文件服务 - 确保 VitePress 构建的文件可以被访问
const distPath = path.join(__dirname, '../../docs/.vitepress/dist');
if (!fs.existsSync(distPath)) {
    console.warn('警告: VitePress 构建目录不存在，请先运行 yarn docs:build');
} else {
    app.use(serve(distPath, {
        prefix: '/md/'
    }));
}

// 使用路由
app.use(router.routes()).use(router.allowedMethods());

const PORT = process.env.PORT || 5555;
app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
    console.log(`API 端点: http://localhost:${PORT}/api/upload`);
    console.log(`测试端点: http://localhost:${PORT}/api/test`);
    console.log(`静态文件目录: ${distPath}`);
}); 