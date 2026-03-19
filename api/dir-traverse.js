const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const hljs = require('highlight.js');

// 配置：仅允许遍历的根目录（对应你项目中的 wxvl/doc/）
const SAFE_ROOT_DIR = path.join(process.cwd(), 'wxvl', 'doc');
// 配置：允许访问的文件后缀（仅放开 md，避免敏感文件泄露）
const ALLOWED_EXT = ['.md'];

// 初始化 marked 语法高亮
marked.setOptions({
  highlight: (code, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value;
    }
    return hljs.highlightAuto(code).value;
  }
});

module.exports = async (req, res) => {
  try {
    // 1. 解析请求路径（兼容两种访问方式：path参数 / URL路径）
    let reqPath = req.query.path || req.url.replace(/^\//, '');
    // 过滤非法字符，防止路径穿越（核心安全限制）
    reqPath = reqPath.replace(/(\.\.\/|\.\.\\|\/\\|\\\/)/g, '');
    // 拼接绝对路径
    const targetPath = path.join(SAFE_ROOT_DIR, reqPath);

    // 2. 检查路径是否在安全目录内（防止绕过）
    if (!targetPath.startsWith(SAFE_ROOT_DIR)) {
      return res.status(403).json({
        code: 403,
        message: '禁止访问：路径超出允许范围'
      });
    }

    // 3. 判断目标是目录还是文件
    const stat = fs.existsSync(targetPath) ? fs.statSync(targetPath) : null;
    if (!stat) {
      return res.status(404).json({
        code: 404,
        message: '文件/目录不存在'
      });
    }

    // 4. 若是目录：返回目录下的文件列表（实现遍历功能）
    if (stat.isDirectory()) {
      const files = fs.readdirSync(targetPath).map(file => {
        const fileStat = fs.statSync(path.join(targetPath, file));
        return {
          name: file,
          type: fileStat.isDirectory() ? 'dir' : 'file',
          size: fileStat.size,
          mtime: fileStat.mtime.toISOString()
        };
      });
      return res.status(200).json({
        code: 200,
        message: '目录遍历成功',
        path: reqPath,
        data: files
      });
    }

    // 5. 若是文件：仅允许读取 md 文件，返回内容（渲染为 HTML 或原生 MD）
    if (stat.isFile()) {
      const ext = path.extname(targetPath).toLowerCase();
      if (!ALLOWED_EXT.includes(ext)) {
        return res.status(403).json({
          code: 403,
          message: '仅允许访问 .md 格式文件'
        });
      }
      const content = fs.readFileSync(targetPath, 'utf8');
      // 可选：返回渲染后的 HTML（带语法高亮），或直接返回原生 MD
      const htmlContent = marked.parse(content);
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(200).send(htmlContent);
      // 若要返回原生 MD：
      // res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
      // return res.status(200).send(content);
    }

  } catch (err) {
    console.error('遍历失败：', err);
    return res.status(500).json({
      code: 500,
      message: '服务器内部错误',
      error: err.message
    });
  }
};
