export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
    ],
    sitemap: 'https://www.lumiskill.com/sitemap.xml',
    host: 'https://www.lumiskill.com',
  };
}
