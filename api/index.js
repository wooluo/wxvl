const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const hljs = require('highlight.js');

const DOC_DIR = path.join(process.cwd(), 'doc');

// Configure marked
marked.setOptions({
    highlight: (code, lang) => {
        if (lang && hljs.getLanguage(lang)) {
            return hljs.highlight(code, { language: lang }).value;
        }
        return hljs.highlightAuto(code).value;
    }
});

// Helper: Get all months
function getMonths() {
    if (!fs.existsSync(DOC_DIR)) return [];
    
    const months = [];
    const dirs = fs.readdirSync(DOC_DIR);
    
    for (const dir of dirs) {
        const dirPath = path.join(DOC_DIR, dir);
        if (fs.statSync(dirPath).isDirectory()) {
            const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.md'));
            if (files.length > 0) {
                months.push({
                    name: dir,
                    count: files.length
                });
            }
        }
    }
    
    return months.sort((a, b) => b.name.localeCompare(a.name));
}

// Helper: Get articles in a month
function getArticlesInMonth(month) {
    const monthPath = path.join(DOC_DIR, month);
    if (!fs.existsSync(monthPath)) return [];
    
    const files = fs.readdirSync(monthPath);
    return files
        .filter(f => f.endsWith('.md'))
        .map(f => {
            const filePath = path.join(monthPath, f);
            const stat = fs.statSync(filePath);
            return {
                name: f,
                path: `${month}/${f}`,
                month: month,
                size: stat.size,
                mtime: stat.mtime.toISOString()
            };
        })
        .sort((a, b) => b.mtime.localeCompare(a.mtime));
}

// Helper: Get all articles
function getAllArticles() {
    const months = getMonths();
    let allArticles = [];
    
    for (const m of months) {
        const articles = getArticlesInMonth(m.name);
        allArticles = allArticles.concat(articles);
    }
    
    return allArticles;
}

// Helper: Search articles
function searchArticles(query) {
    const allArticles = getAllArticles();
    const results = [];
    const queryLower = query.toLowerCase();
    
    for (const article of allArticles) {
        const title = article.name.replace('.md', '').toLowerCase();
        if (title.includes(queryLower)) {
            results.push({
                title: article.name.replace('.md', ''),
                path: article.path,
                month: article.month
            });
        }
    }
    
    return results.slice(0, 50); // Limit to 50 results
}

// Helper: Read article
function readArticle(articlePath) {
    const fullPath = path.join(DOC_DIR, articlePath);
    
    // Security check
    if (!fullPath.startsWith(DOC_DIR)) {
        return null;
    }
    
    if (!fs.existsSync(fullPath)) {
        return null;
    }
    
    const content = fs.readFileSync(fullPath, 'utf8');
    const stat = fs.statSync(fullPath);
    
    // Extract title from first heading or filename
    let title = path.basename(articlePath, '.md');
    const titleMatch = content.match(/^#\s+(.+)$/m);
    if (titleMatch) {
        title = titleMatch[1].trim();
    }
    
    // Parse markdown to HTML
    const html = marked.parse(content);
    
    // Extract month from path
    const month = path.dirname(articlePath);
    
    return {
        title,
        html,
        content,
        month,
        size: stat.size,
        mtime: stat.mtime.toISOString()
    };
}

// Export API handler
module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    const { action } = req.query;
    
    try {
        // Stats endpoint
        if (req.url.startsWith('/api/stats')) {
            const months = getMonths();
            const totalArticles = months.reduce((sum, m) => sum + m.count, 0);
            
            return res.status(200).json({
                code: 200,
                data: {
                    totalArticles,
                    totalMonths: months.length
                }
            });
        }
        
        // Months list endpoint
        if (req.url.startsWith('/api/months')) {
            const months = getMonths();
            return res.status(200).json({
                code: 200,
                data: months
            });
        }
        
        // Article list endpoint
        if (req.url.startsWith('/api/list')) {
            const { month } = req.query;
            
            let articles;
            if (month) {
                articles = getArticlesInMonth(month);
            } else {
                articles = getAllArticles();
            }
            
            return res.status(200).json({
                code: 200,
                data: articles
            });
        }
        
        // Search endpoint
        if (req.url.startsWith('/api/search')) {
            const { q } = req.query;
            
            if (!q || q.length < 2) {
                return res.status(200).json({
                    code: 200,
                    data: []
                });
            }
            
            const results = searchArticles(q);
            return res.status(200).json({
                code: 200,
                data: results
            });
        }
        
        // Single article endpoint
        if (req.url.startsWith('/api/article')) {
            const { path: articlePath } = req.query;
            
            if (!articlePath) {
                return res.status(400).json({
                    code: 400,
                    message: 'Missing path parameter'
                });
            }
            
            const article = readArticle(articlePath);
            
            if (!article) {
                return res.status(404).json({
                    code: 404,
                    message: 'Article not found'
                });
            }
            
            return res.status(200).json({
                code: 200,
                data: article
            });
        }
        
        // Fallback: 404
        return res.status(404).json({
            code: 404,
            message: 'API endpoint not found'
        });
        
    } catch (err) {
        console.error('API Error:', err);
        return res.status(500).json({
            code: 500,
            message: 'Internal server error',
            error: err.message
        });
    }
};
