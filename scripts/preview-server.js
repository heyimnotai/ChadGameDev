#!/usr/bin/env node
/**
 * Simple HTTP server for previewing the game
 * Usage: node scripts/preview-server.js [port]
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = parseInt(process.argv[2]) || 8080;

// Use /app/preview directly (Docker container path)
const PREVIEW_DIR = process.env.PREVIEW_DIR || path.join(__dirname, '..', 'preview');

console.log(`Preview directory: ${PREVIEW_DIR}`);
console.log(`Checking if directory exists: ${fs.existsSync(PREVIEW_DIR)}`);

if (!fs.existsSync(PREVIEW_DIR)) {
    console.error(`ERROR: Preview directory not found: ${PREVIEW_DIR}`);
    process.exit(1);
}

// List files in preview dir
console.log(`Files in preview directory:`);
fs.readdirSync(PREVIEW_DIR).forEach(f => console.log(`  - ${f}`));

const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.json': 'application/json',
};

const server = http.createServer((req, res) => {
    // Parse URL to handle query strings
    const urlPath = req.url.split('?')[0];
    let filePath = urlPath === '/' ? '/index.html' : urlPath;
    filePath = path.join(PREVIEW_DIR, filePath);

    console.log(`Request: ${req.url} -> ${filePath}`);

    const ext = path.extname(filePath);
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            console.error(`Error reading ${filePath}: ${err.message}`);
            if (err.code === 'ENOENT') {
                res.writeHead(404);
                res.end(`File not found: ${filePath}`);
            } else {
                res.writeHead(500);
                res.end(`Server error: ${err.message}`);
            }
        } else {
            res.writeHead(200, {
                'Content-Type': contentType,
                'Cache-Control': 'no-cache'
            });
            res.end(content);
        }
    });
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`ERROR: Port ${PORT} is already in use`);
    } else {
        console.error(`Server error: ${err.message}`);
    }
    process.exit(1);
});

server.listen(PORT, '0.0.0.0', () => {
    console.log('');
    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║                   PREVIEW SERVER RUNNING                       ║');
    console.log('╠════════════════════════════════════════════════════════════════╣');
    console.log('║                                                                ║');
    console.log(`║  ► Open in your browser: http://localhost:${PORT}                 ║`);
    console.log('║                                                                ║');
    console.log('║  Server is serving: /app/preview/                              ║');
    console.log('║  Press Ctrl+C to stop                                          ║');
    console.log('║                                                                ║');
    console.log('╚════════════════════════════════════════════════════════════════╝');
    console.log('');
    console.log('Waiting for requests...');
});

// Keep process alive
process.on('SIGINT', () => {
    console.log('\nShutting down server...');
    server.close();
    process.exit(0);
});
