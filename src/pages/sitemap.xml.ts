import { getCollection } from 'astro:content';
import games from '../data/games.json';

const SITE_URL = 'https://zynfexgame.me';

export async function GET() {
  const blogEntries = await getCollection('blog');
  
  // Static pages
  const staticPages = [
    '/',
    '/about/',
    '/contact/',
    '/disclaimer/',
    '/privacy-policy/',
    '/terms/',
    '/blog/',
    '/categories/'
  ];

  // Game pages
  const gamePages = games.map(g => `/games/${g.slug}/`);

  // Blog pages
  const blogPages = blogEntries.map(b => `/blog/${b.id}/`);

  // Category pages
  const categorySet = new Set(games.map(g => g.category));
  const categoryPages = Array.from(categorySet).map(cat => `/categories/${cat.toLowerCase().replace(/[^a-z0-9]+/g, '-')}/`);

  const allPages = [...new Set([...staticPages, ...gamePages, ...blogPages, ...categoryPages])];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${SITE_URL}${page}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page === '/' ? 'daily' : 'weekly'}</changefreq>
    <priority>${page === '/' ? '1.0' : page.includes('/games/') || page.includes('/blog/') ? '0.8' : '0.5'}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml'
    }
  });
}
