// api/dir-traverse.js
const path = require('path');
const fs = require('fs/promises');
const { Buffer } = require('buffer');

// 安全配置：仅允许访问的根目录、允许的文件扩展名
const SAFE_ROOT_DIR = path.join(process.cwd(), 'wxvl/doc');
const ALLOWED_EXTENSIONS = ['.md'];
const MAX_FILE_SIZE = 1024 * 1024; // 限制读取文件最大1MB

/**
 * 安全路径解析：防止路径遍历漏洞
 * @param {string} userPath 用户传入的路径
 * @returns {string} 解析后的安全路径
 * @throws {Error} 路径非法时抛出错误
 */
function resolveSafePath(userPath) {
  // 拼接用户路径到安全根目录
  const resolvedPath = path.resolve(SAFE_ROOT_DIR, userPath || '');
  
  // 检查路径是否在安全根目录内（防止../../遍历）
  if (!resolvedPath.startsWith(SAFE_ROOT_DIR)) {
    throw new Error('非法路径：禁止访问安全目录外的文件');
  }

  // 检查文件扩展名
  const ext = path.extname(resolvedPath).toLowerCase();
  if (ext && !ALLOWED_EXTENSIONS.includes(ext)) {
    throw new Error(`非法文件类型：仅允许 ${ALLOWED_EXTENSIONS.join(', ')}`);
  }

  return resolvedPath;
}

/**
 * 获取目录下的文件/目录列表（格式化输出）
 * @param {string} dirPath 目录路径
 * @returns {Promise<Array>} 列表数据
 */
async function getDirList(dirPath) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  return Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(dirPath, entry.name);
      const stats = await fs.stat(entryPath);
      return {
        name: entry.name,
        type: entry.isDirectory() ? 'directory' : 'file',
        size: stats.size,
        mtime: stats.mtime.toISOString(),
        ext: entry.isFile() ? path.extname(entry.name).toLowerCase() : ''
      };
    })
  );
}

/**
 * 读取文件内容（限制大小、编码）
 * @param {string} filePath 文件路径
 * @returns {Promise<string>} 文件内容
 */
async function readSafeFile(filePath) {
  const stats = await fs.stat(filePath);
  if (stats.size > MAX_FILE_SIZE) {
    throw new Error(`文件过大：超过 ${MAX_FILE_SIZE / 1024}KB 限制`);
  }
  const buffer = await fs.readFile(filePath);
  return buffer.toString('utf8');
}

/**
 * 主处理函数
 * @param {import('http').IncomingMessage} req HTTP请求对象
 * @param {import('http').ServerResponse} res HTTP响应对象
 */
module.exports = async function handler(req, res) {
  // 设置CORS头（允许前端跨域访问）
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理OPTIONS预检请求
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  // 仅允许GET请求
  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: '仅支持GET请求' }));
    return;
  }

  try {
    // 解析用户请求的路径（从query参数path获取，默认空）
    const urlParams = new URL(req.url, `http://${req.headers.host}`).searchParams;
    const userPath = urlParams.get('path') || '';

    // 解析安全路径
    const safePath = resolveSafePath(userPath);

    // 判断路径是文件还是目录
    const stats = await fs.stat(safePath);
    if (stats.isDirectory()) {
      // 目录：返回文件列表
      const dirList = await getDirList(safePath);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        code: 200,
        message: '目录读取成功',
        data: {
          path: safePath.replace(SAFE_ROOT_DIR, ''), // 相对路径
          entries: dirList
        }
      }));
    } else {
      // 文件：返回文件内容
      const content = await readSafeFile(safePath);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
      res.end(content);
    }
  } catch (err) {
    // 错误处理：区分不同错误类型
    let statusCode = 500;
    let errorMsg = '服务器内部错误';

    if (err.code === 'ENOENT') {
      statusCode = 404;
      errorMsg = '文件/目录不存在';
    } else if (err.message.includes('非法路径') || err.message.includes('非法文件类型')) {
      statusCode = 403;
      errorMsg = err.message;
    } else if (err.message.includes('文件过大')) {
      statusCode = 413;
      errorMsg = err.message;
    }

    res.statusCode = statusCode;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      code: statusCode,
      error: errorMsg,
      detail: process.env.NODE_ENV === 'development' ? err.message : '' // 开发环境显示详细错误
    }));
  }
};
