import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://intern-up.vercel.app';
  const now = new Date();

  const routes = [
    '',
    '/domains',
    '/how-it-works',
    '/about',
    '/registry',
    '/faq',
    '/contact',
    '/verify',
    '/terms',
    '/privacy',
    '/refund-policy',
    '/certificate-policy',
    '/login',
    '/register',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency:
      route === '' || route === '/registry' || route === '/domains' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : route === '/domains' || route === '/registry' ? 0.8 : 0.5,
  }));
}
