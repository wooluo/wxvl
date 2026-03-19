// api/render.js - 修复后可运行的 Edge Function
import { marked } from 'https://esm.sh/marked@12.0.1';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  try {
    // 1. 解析请求路径（如 /2025-04/Vite漏洞.md → 映射到仓库的 doc/2025-04/Vite漏洞.md）
    const url = new URL(req.url);
    const mdPath = url.pathname.replace(/^\//, 'doc/'); // 拼接 doc 目录
    
    // 2. 替换为你的 GitHub 仓库原始文件 URL（关键！）
    // 格式：https://raw.githubusercontent.com/[用户名]/[仓库名]/[分支]/[文件路径]
    const githubRawUrl = `https://raw.githubusercontent.com/你的用户名/你的仓库名/main/${mdPath}`;

    // 3. 读取 Markdown 内容
    const response = await fetch(githubRawUrl);
    if (!response.ok) throw new Error('文件不存在');
    const markdownContent = await response.text();

    // 4. 渲染为 HTML（带 GitHub 样式）
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>${mdPath.split('/').pop()}</title>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/github-markdown-css@5.5.1/github-markdown.min.css">
          <style>
            .markdown-body { max-width: 980px; margin: 0 auto; padding: 45px; }
            @media (max-width: 768px) { .markdown-body { padding: 15px; } }
          </style>
        </head>
        <body class="markdown-body">
          ${marked.parse(markdownContent)}
        </body>
      </html>
    `;

    return new Response(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  } catch (err) {
    return new Response(`错误：${err.message}`, { status: 404 });
  }
}
