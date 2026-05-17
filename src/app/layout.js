import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://www.LumiSkill.com'),
  title: {
    default: 'LumiSkill – India\'s #1 Coding Academy for Class 6–12 Students',
    template: '%s | LumiSkill',
  },
  description:
    'LumiSkill is a premium online coding academy for school students (Class 6–12). Learn Python, JavaScript, Web Development, AI, Java & App Development with live classes, expert mentors, and real projects.',
  keywords: [
    'coding academy for kids',
    'online coding classes India',
    'coding for class 6 to 12',
    'python for students',
    'web development course kids',
    'AI course for students',
    'LumiSkill',
    'EdTech India',
    'live coding classes',
    'coding bootcamp school students',
  ],
  authors: [{ name: 'LumiSkill', url: 'https://www.LumiSkill.com' }],
  creator: 'LumiSkill',
  publisher: 'LumiSkill',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://www.LumiSkill.com',
    siteName: 'LumiSkill',
    title: 'LumiSkill – India\'s #1 Coding Academy for Class 6–12 Students',
    description:
      'Live coding classes, expert mentors, real projects. Empower your child with future-ready tech skills.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'LumiSkill - Coding Academy for Students',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LumiSkill – India\'s #1 Coding Academy for Class 6–12 Students',
    description:
      'Live coding classes, expert mentors, real projects. Empower your child with future-ready tech skills.',
    images: ['/og-image.jpg'],
    creator: '@LumiSkill',
  },
  alternates: {
    canonical: 'https://www.LumiSkill.com',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  category: 'education',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'EducationalOrganization',
              name: 'LumiSkill',
              url: 'https://www.LumiSkill.com',
              logo: 'https://www.LumiSkill.com/logo.png',
              description:
                'Online coding academy for school students Class 6–12. Offering live classes in Python, JavaScript, Web Development, AI, Java, and App Development.',
              address: {
                '@type': 'PostalAddress',
                addressCountry: 'IN',
              },
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'customer service',
                email: 'hello@LumiSkill.com',
                telephone: '+91-9999999999',
              },
              sameAs: [
                'https://www.instagram.com/LumiSkill',
                'https://www.youtube.com/@LumiSkill',
                'https://www.linkedin.com/company/LumiSkill',
              ],
              offers: {
                '@type': 'Offer',
                priceCurrency: 'INR',
                priceRange: '₹999 - ₹50,000',
              },
            }),
          }}
        />
        {/* Structured Data - Course */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ItemList',
              name: 'LumiSkill Coding Courses',
              itemListElement: [
                {
                  '@type': 'Course',
                  position: 1,
                  name: 'Python for Beginners',
                  description: 'Learn Python programming from scratch with fun projects.',
                  provider: { '@type': 'Organization', name: 'LumiSkill' },
                },
                {
                  '@type': 'Course',
                  position: 2,
                  name: 'Web Development Bootcamp',
                  description: 'Master HTML, CSS, JavaScript and build real websites.',
                  provider: { '@type': 'Organization', name: 'LumiSkill' },
                },
                {
                  '@type': 'Course',
                  position: 3,
                  name: 'AI & Automation',
                  description: 'Build AI projects and learn automation skills for the future.',
                  provider: { '@type': 'Organization', name: 'LumiSkill' },
                },
              ],
            }),
          }}
        />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
