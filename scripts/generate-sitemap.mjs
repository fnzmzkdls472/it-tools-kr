import { readdir, readFile, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const SITE = 'https://too-liz.com';

const currentDir = dirname(fileURLToPath(import.meta.url));
const toolsDir = join(currentDir, '..', 'src', 'tools');
const outFile = join(currentDir, '..', 'public', 'sitemap.xml');

// 각 도구의 index.ts 에서 path 값을 추출
const entries = await readdir(toolsDir, { withFileTypes: true });
const toolPaths = [];

for (const entry of entries) {
  if (!entry.isDirectory()) {
    continue;
  }
  try {
    const indexContent = await readFile(join(toolsDir, entry.name, 'index.ts'), 'utf-8');
    const match = indexContent.match(/path:\s*['"`](\/[^'"`]+)['"`]/);
    if (match) {
      toolPaths.push(match[1]);
    }
  }
  catch {
    // index.ts 없는 디렉터리(tool.ts 등)는 건너뜀
  }
}

const staticPaths = ['/', '/about', '/privacy'];
const allPaths = [...staticPaths, ...toolPaths.sort()];
const today = new Date().toISOString().split('T')[0];

const urls = allPaths
  .map(
    p => `  <url>\n    <loc>${SITE}${p}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n  </url>`,
  )
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

await writeFile(outFile, xml);
console.log(`sitemap.xml 생성 완료: ${allPaths.length}개 URL`);
