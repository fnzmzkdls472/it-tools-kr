import http from 'node:http';
import { existsSync } from 'node:fs';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const currentDir = dirname(fileURLToPath(import.meta.url));
const distDir = join(currentDir, '..', 'dist');
const toolsDir = join(currentDir, '..', 'src', 'tools');

if (!existsSync(distDir)) {
  throw new Error('dist 디렉터리가 없습니다. 먼저 vite build를 실행하세요.');
}

// 1. 프리렌더할 라우트 수집 (홈 + about + 모든 도구)
const routes = ['/', '/about'];
for (const entry of await readdir(toolsDir, { withFileTypes: true })) {
  if (!entry.isDirectory()) {
    continue;
  }
  try {
    const content = await readFile(join(toolsDir, entry.name, 'index.ts'), 'utf-8');
    const match = content.match(/path:\s*['"`](\/[^'"`]+)['"`]/);
    if (match) {
      routes.push(match[1]);
    }
  }
  catch {
    // index.ts 없는 디렉터리는 건너뜀
  }
}

// 2. dist 를 정적 서빙 (없는 경로는 index.html 로 SPA 폴백)
const MIME = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json',
  '.txt': 'text/plain',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
};

const server = http.createServer(async (req, res) => {
  const urlPath = decodeURIComponent((req.url ?? '/').split('?')[0]);
  let filePath = join(distDir, urlPath);
  if (urlPath.endsWith('/')) {
    filePath = join(filePath, 'index.html');
  }
  // 확장자 없는 경로(=라우트)는 SPA 폴백
  if (!extname(filePath) || !existsSync(filePath)) {
    filePath = join(distDir, 'index.html');
  }
  try {
    const data = await readFile(filePath);
    res.writeHead(200, { 'Content-Type': MIME[extname(filePath)] ?? 'application/octet-stream' });
    res.end(data);
  }
  catch {
    res.writeHead(404);
    res.end('not found');
  }
});

await new Promise(resolve => server.listen(0, resolve));
const { port } = server.address();
console.log(`프리렌더 서버 시작 (port ${port}), 라우트 ${routes.length}개`);

// 3. 헤드리스 브라우저로 각 라우트 렌더 → 정적 HTML 저장
const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

let done = 0;
for (const route of routes) {
  const page = await browser.newPage();
  try {
    await page.goto(`http://localhost:${port}${route}`, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.waitForSelector('#app > *', { timeout: 15000 }).catch(() => {});
    // head 의 useHead 적용이 끝나도록 짧게 대기
    await new Promise(r => setTimeout(r, 300));

    const html = await page.content();
    const outDir = route === '/' ? distDir : join(distDir, route);
    await mkdir(outDir, { recursive: true });
    await writeFile(join(outDir, 'index.html'), html);
    done += 1;
  }
  catch (err) {
    console.error(`프리렌더 실패: ${route} - ${err.message}`);
  }
  finally {
    await page.close();
  }
}

await browser.close();
server.close();
console.log(`프리렌더 완료: ${done}/${routes.length} 페이지`);
