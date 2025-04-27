import http from 'http';
import fs from 'fs';
import path from 'path';

const PORT = 3000;
const publicDir = path.join(process.cwd(), 'public');


// Create an HTTP server
const server = http.createServer((req, res) => {
    let filePath;


  // Serve files from `public` by default
    if (req.url.startsWith('/src/')) {
    // Map `/src/client/...` to the actual file in `src/client/...`
        filePath = path.join(process.cwd(), req.url);
    } else {
    // Serve files from `public`
        filePath = path.join(publicDir, req.url === '/' ? 'index.html' : req.url);
    }

    const ext = path.extname(filePath);
    const contentType = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    }[ext] || 'text/plain';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404: File Not Found');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});