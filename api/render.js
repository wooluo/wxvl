import { marked } from 'https://esm.sh/marked@12.0.1';

export const config = {
  runtime: 'edge'
};

export default async function handler(req) {
  try {
    // 解析请求路径（如 /2025-04/Vite漏洞.md → wxvl/doc/2025-04/Vite漏洞.md）
    const url = new URL(req.url);
    const mdPath = `wxvl/doc/${url.pathname.replace(/^\//, '')}`;
    
    // 替换为你的 GitHub 仓库原始文件 URL（必填！）
    // 格式：https://raw.githubusercontent.com/[用户名]/[仓库名]/main/[文件路径]
    const githubRawUrl = `https://raw.githubusercontent.com/你的用户名/你的仓库名/main/${mdPath}`;

    // 读取并渲染 Markdown
    const res = await fetch(githubRawUrl);
    if (!res.ok) throw new Error('Markdown 文件不存在');
    const mdContent = await res.text();
    const htmlContent = marked.parse(mdContent);

    // 返回带 GitHub 样式的 HTML
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>${mdPath.split('/').pop()}</title>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/github-markdown-css@5.5.1/github-markdown.min.css">
          <style>.markdown-body { max-width: 980px; margin: 20px auto; padding: 20px; }</style>
        </head>
        <body class="markdown-body">${htmlContent}</body>
      </html>
    `;

    return new Response(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  } catch (err) {
    return new Response(`<h1>错误：${err.message}</h1>`, { status: 404 });
  }
}
