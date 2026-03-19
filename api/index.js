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

// Helper functions
function getMonths() {
    if (!fs.existsSync(DOC_DIR)) return [];
    const months = [];
    const dirs = fs.readdirSync(DOC_DIR);
    for (const dir of dirs) {
        const dirPath = path.join(DOC_DIR, dir);
        if (fs.statSync(dirPath).isDirectory()) {
            const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.md'));
            if (files.length > 0) {
                months.push({ name: dir, count: files.length });
            }
        }
    }
    return months.sort((a, b) => b.name.localeCompare(a.name));
}

function getArticlesInMonth(month) {
    const monthPath = path.join(DOC_DIR, month);
    if (!fs.existsSync(monthPath)) return [];
    return fs.readdirSync(monthPath)
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

function getAllArticles() {
    return getMonths().flatMap(m => getArticlesInMonth(m.name));
}

function searchArticles(query) {
    const queryLower = query.toLowerCase();
    return getAllArticles()
        .filter(a => a.name.replace('.md', '').toLowerCase().includes(queryLower))
        .slice(0, 50)
        .map(a => ({
            title: a.name.replace('.md', ''),
            path: a.path,
            month: a.month
        }));
}

function readArticle(articlePath) {
    const fullPath = path.join(DOC_DIR, articlePath);
    if (!fullPath.startsWith(DOC_DIR) || !fs.existsSync(fullPath)) return null;
    
    const content = fs.readFileSync(fullPath, 'utf8');
    const stat = fs.statSync(fullPath);
    let title = path.basename(articlePath, '.md');
    const titleMatch = content.match(/^#\s+(.+)$/m);
    if (titleMatch) title = titleMatch[1].trim();
    
    return {
        title,
        html: marked.parse(content),
        content,
        month: path.dirname(articlePath),
        size: stat.size,
        mtime: stat.mtime.toISOString()
    };
}

// API Handler
module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') return res.status(200).end();
    
    const { action, month, q, path: articlePath } = req.query;
    
    try {
        switch (action) {
            case 'stats': {
                const months = getMonths();
                return res.status(200).json({
                    code: 200,
                    data: {
                        totalArticles: months.reduce((sum, m) => sum + m.count, 0),
                        totalMonths: months.length
                    }
                });
            }
            case 'months':
                return res.status(200).json({ code: 200, data: getMonths() });
            
            case 'list':
                return res.status(200).json({
                    code: 200,
                    data: month ? getArticlesInMonth(month) : getAllArticles()
                });
            
            case 'search':
                if (!q || q.length < 2) {
                    return res.status(200).json({ code: 200, data: [] });
                }
                return res.status(200).json({ code: 200, data: searchArticles(q) });
            
            case 'article': {
                if (!articlePath) {
                    return res.status(400).json({ code: 400, message: 'Missing path parameter' });
                }
                const article = readArticle(articlePath);
                if (!article) {
                    return res.status(404).json({ code: 404, message: 'Article not found' });
                }
                return res.status(200).json({ code: 200, data: article });
            }
            default:
                return res.status(200).json({ 
                    code: 200, 
                    message: 'WXVL API',
                    endpoints: ['stats', 'months', 'list', 'search', 'article']
                });
        }
    } catch (err) {
        console.error('API Error:', err);
        return res.status(500).json({ code: 500, message: 'Internal server error', error: err.message });
    }
};
