#!/usr/bin/env node
/**
 * AI 工具学习中心 — 生产用静态文件服务器
 * 零依赖，纯 Node.js 内置模块
 * 用法：node server.js [port]
 *      PORT=8080 node server.js
 */

const http  = require('http');
const fs    = require('fs');
const path  = require('path');

const PORT = parseInt(process.env.PORT || process.argv[2] || '8899', 10);
const ROOT = __dirname;   // 服务目录 = 脚本所在目录

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md':   'text/plain; charset=utf-8',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.woff2':'font/woff2',
  '.woff': 'font/woff',
  '.ttf':  'font/ttf',
};

const CACHE_CONTROL = {
  '.html': 'no-cache',
  '.md':   'no-cache',
  '.json': 'no-cache',
};

function serveFile(res, filePath) {
  const ext      = path.extname(filePath).toLowerCase();
  const mimeType = MIME[ext] || 'application/octet-stream';
  const cc       = CACHE_CONTROL[ext] || 'public, max-age=3600';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }
    res.writeHead(200, {
      'Content-Type':  mimeType,
      'Cache-Control': cc,
      'X-Content-Type-Options': 'nosniff',
    });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  // 只接受 GET / HEAD
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405); res.end('Method Not Allowed'); return;
  }

  // 使用 WHATWG URL API 解析路径（避免 url.parse 安全隐患）
  let pathname;
  try {
    pathname = new URL(req.url, 'http://localhost').pathname;
  } catch {
    res.writeHead(400); res.end('Bad Request'); return;
  }

  // 规范化并防路径穿越
  const filePath = path.normalize(path.join(ROOT, pathname));
  if (!filePath.startsWith(ROOT + path.sep) && filePath !== ROOT) {
    res.writeHead(403); res.end('Forbidden'); return;
  }

  fs.stat(filePath, (err, stat) => {
    if (err) {
      // 文件不存在：静态资源返回 404，其余路由回退到 index.html（SPA）
      const ext = path.extname(pathname);
      if (ext && ext !== '.html') {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 Not Found');
      } else {
        serveFile(res, path.join(ROOT, 'index.html'));
      }
    } else if (stat.isDirectory()) {
      // 目录 → 尝试 index.html
      const idx = path.join(filePath, 'index.html');
      serveFile(res, fs.existsSync(idx) ? idx : path.join(ROOT, 'index.html'));
    } else {
      serveFile(res, filePath);
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  const ifaces = require('os').networkInterfaces();
  let lan = '';
  Object.values(ifaces).flat().forEach(i => {
    if (i.family === 'IPv4' && !i.internal) lan = i.address;
  });
  console.log(`\n🚀 AI 工具学习中心已启动`);
  console.log(`   本地访问：http://localhost:${PORT}`);
  if (lan) console.log(`   局域网：  http://${lan}:${PORT}`);
  console.log(`   按 Ctrl+C 停止\n`);
});

server.on('error', err => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ 端口 ${PORT} 已被占用，请用 PORT=其他端口 node server.js`);
  } else {
    console.error('服务器错误:', err.message);
  }
  process.exit(1);
});

// 优雅退出
process.on('SIGTERM', () => { server.close(() => process.exit(0)); });
process.on('SIGINT',  () => { server.close(() => process.exit(0)); });
