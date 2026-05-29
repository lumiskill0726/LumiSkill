import { Inter } from 'next/font/google';
import './globals.css';
import LayoutWrapper from './LayoutWrapper';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://www.lumiskill.com'),
  title: {
    default: 'LumiSkill – Best Online Coding Classes for Class 6–12 Students in India',
    template: '%s | LumiSkill – Online Coding Academy',
  },
  description:
    'LumiSkill (also known as Lumi Skill / LumiSkills) is India\'s best online coding academy for school students Class 6–12. Learn Python, JavaScript, Web Development, AI & Machine Learning, Java, DSA with live classes, expert mentors, real projects. Best coding classes for kids in India.',
  keywords: [
    // Brand variations
    'LumiSkill',
    'Lumi Skill',
    'LumiSkills',
    'Lumi Skills',
    'lumiskill.com',
    'lumi skill coding',
    'lumiskill online coding',
    'lumiskill academy',
    'lumiskill courses',
    'lumiskill classes',
    // Core product keywords
    'best online coding classes India',
    'online coding classes for kids',
    'coding academy for students',
    'coding classes for school students',
    'learn coding online India',
    'coding for class 6 7 8 9 10 11 12',
    'live coding classes for kids',
    'coding bootcamp for students India',
    // Subject-specific
    'python classes for students',
    'python online course India',
    'web development course for kids',
    'java course for students',
    'AI course for school students',
    'machine learning for kids',
    'data structures algorithms DSA course',
    'full stack web development course India',
    // Audience-specific
    'coding for class 6',
    'coding for class 7',
    'coding for class 8',
    'coding for class 9',
    'coding for class 10',
    'coding for class 11',
    'coding for class 12',
    'online coding for children India',
    'coding classes for teenagers',
    'tech skills for students',
    'future ready skills kids',
    // Parent-focused
    'best coding course for my child',
    'online learning platform kids India',
    'edtech India school students',
    'coding education for children',
    'live online classes for kids India',
    'programming classes for school students',
    // Competitive
    'coding classes India better than WhiteHat Jr',
    'affordable coding classes India',
    'top coding academy India',
    'coding institute for students',
    'project based learning coding India',
  ],
  authors: [{ name: 'LumiSkill', url: 'https://www.lumiskill.com' }],
  creator: 'LumiSkill',
  publisher: 'LumiSkill',
  applicationName: 'LumiSkill',
  referrer: 'origin-when-cross-origin',
  formatDetection: { email: false, telephone: false },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://www.lumiskill.com',
    siteName: 'LumiSkill',
    title: 'LumiSkill – Best Online Coding Classes for Class 6–12 Students',
    description:
      'India\'s best live coding academy for school students. Python, Web Dev, AI, Java & more. Expert mentors, real projects, 7-day money-back guarantee.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'LumiSkill - Best Online Coding Academy for Class 6–12 Students in India',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@LumiSkill',
    creator: '@LumiSkill',
    title: 'LumiSkill – Best Online Coding Classes for Class 6–12 Students',
    description:
      'Live coding classes for school students in India. Python, AI, Web Dev, Java & more. Expert mentors. Real projects.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://www.lumiskill.com',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon.ico',
  },
  category: 'education',
  classification: 'Online Education / EdTech',
  verification: {
    // google: 'YOUR_GOOGLE_VERIFICATION_CODE', // Add when you verify via Google Search Console
    // yandex: 'YOUR_YANDEX_CODE',
    // bing: 'YOUR_BING_CODE',
  },
};

/* ============================================================
   JSON-LD Structured Data Schemas
   ============================================================ */

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://www.lumiskill.com/#website',
  name: 'LumiSkill',
  alternateName: ['Lumi Skill', 'LumiSkills', 'Lumi Skills'],
  url: 'https://www.lumiskill.com',
  description: 'India\'s best online coding academy for school students Class 6–12.',
  inLanguage: 'en-IN',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://www.lumiskill.com/courses?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': ['EducationalOrganization', 'Organization'],
  '@id': 'https://www.lumiskill.com/#organization',
  name: 'LumiSkill',
  alternateName: ['Lumi Skill', 'LumiSkills', 'Lumi Skills Coding Academy'],
  url: 'https://www.lumiskill.com',
  logo: {
    '@type': 'ImageObject',
    url: 'https://www.lumiskill.com/logo.png',
    width: 200,
    height: 60,
  },
  image: 'https://www.lumiskill.com/og-image.jpg',
  description:
    'LumiSkill is India\'s best online coding academy for school students Class 6–12. We offer live classes in Python, JavaScript, Web Development, AI & Machine Learning, Java, and Data Structures & Algorithms.',
  foundingDate: '2024',
  numberOfEmployees: { '@type': 'QuantitativeValue', value: '20' },
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'IN',
    addressRegion: 'India',
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'hello@lumiskill.com',
      telephone: '+91-9999999999',
      availableLanguage: ['English', 'Hindi'],
      hoursAvailable: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '09:00',
        closes: '21:00',
      },
    },
  ],
  sameAs: [
    'https://www.instagram.com/lumiskill',
    'https://www.youtube.com/@lumiskill',
    'https://www.linkedin.com/company/lumiskill',
    'https://twitter.com/lumiskill',
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Online Coding Courses',
    itemListElement: [
      { '@type': 'OfferCatalog', name: 'Coding for Class 6–8' },
      { '@type': 'OfferCatalog', name: 'Coding for Class 9–10' },
      { '@type': 'OfferCatalog', name: 'Coding for Class 11–12' },
    ],
  },
};

const courseListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'LumiSkill Online Coding Courses for Students',
  description: 'Best online coding courses for school students Class 6–12 in India.',
  url: 'https://www.lumiskill.com/courses',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      item: {
        '@type': 'Course',
        name: 'Java Basics – Class 6–8',
        description: 'Start your coding journey with Java. Learn syntax, variables, loops and build simple programs.',
        url: 'https://www.lumiskill.com/courses/java-basics',
        provider: { '@type': 'Organization', name: 'LumiSkill', url: 'https://www.lumiskill.com' },
        offers: { '@type': 'Offer', price: '4999', priceCurrency: 'INR', availability: 'https://schema.org/InStock' },
        courseMode: 'online',
        inLanguage: 'en',
        hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'online', courseSchedule: { '@type': 'Schedule', repeatFrequency: 'P1W', repeatCount: 16 } },
      },
    },
    {
      '@type': 'ListItem',
      position: 2,
      item: {
        '@type': 'Course',
        name: 'Python Basics – Class 6–8',
        description: 'Learn Python — the world\'s most beginner-friendly language. Perfect for Class 6–8 students.',
        url: 'https://www.lumiskill.com/courses/python-basics',
        provider: { '@type': 'Organization', name: 'LumiSkill', url: 'https://www.lumiskill.com' },
        offers: { '@type': 'Offer', price: '5999', priceCurrency: 'INR', availability: 'https://schema.org/InStock' },
        courseMode: 'online',
        inLanguage: 'en',
      },
    },
    {
      '@type': 'ListItem',
      position: 3,
      item: {
        '@type': 'Course',
        name: 'Web Development – Class 9–10',
        description: 'Build complete websites with HTML5, CSS3, JavaScript. Real projects included.',
        url: 'https://www.lumiskill.com/courses/web-development',
        provider: { '@type': 'Organization', name: 'LumiSkill', url: 'https://www.lumiskill.com' },
        offers: { '@type': 'Offer', price: '9999', priceCurrency: 'INR', availability: 'https://schema.org/InStock' },
        courseMode: 'online',
        inLanguage: 'en',
      },
    },
    {
      '@type': 'ListItem',
      position: 4,
      item: {
        '@type': 'Course',
        name: 'AI & Automation – Class 11–12',
        description: 'Build AI apps with Python, machine learning, and APIs. The skill of the future.',
        url: 'https://www.lumiskill.com/courses/ai-automation',
        provider: { '@type': 'Organization', name: 'LumiSkill', url: 'https://www.lumiskill.com' },
        offers: { '@type': 'Offer', price: '9999', priceCurrency: 'INR', availability: 'https://schema.org/InStock' },
        courseMode: 'online',
        inLanguage: 'en',
      },
    },
    {
      '@type': 'ListItem',
      position: 5,
      item: {
        '@type': 'Course',
        name: 'Java & DSA – Class 11–12',
        description: 'Master Java, Data Structures & Algorithms. Crack top engineering colleges and tech interviews.',
        url: 'https://www.lumiskill.com/courses/java-dsa',
        provider: { '@type': 'Organization', name: 'LumiSkill', url: 'https://www.lumiskill.com' },
        offers: { '@type': 'Offer', price: '11999', priceCurrency: 'INR', availability: 'https://schema.org/InStock' },
        courseMode: 'online',
        inLanguage: 'en',
      },
    },
    {
      '@type': 'ListItem',
      position: 6,
      item: {
        '@type': 'Course',
        name: 'Full Stack Web Development – Class 11–12',
        description: 'Build complete web apps with React, Node.js and MongoDB. Career-ready portfolio.',
        url: 'https://www.lumiskill.com/courses/full-stack-web-dev',
        provider: { '@type': 'Organization', name: 'LumiSkill', url: 'https://www.lumiskill.com' },
        offers: { '@type': 'Offer', price: '14999', priceCurrency: 'INR', availability: 'https://schema.org/InStock' },
        courseMode: 'online',
        inLanguage: 'en',
      },
    },
  ],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is LumiSkill?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'LumiSkill (also called Lumi Skill or LumiSkills) is India\'s best online coding academy for school students Class 6–12. We offer live coding classes in Python, Web Development, AI, Java, DSA, and Full Stack Development with expert mentors and real project-based learning.',
      },
    },
    {
      '@type': 'Question',
      name: 'What are the best online coding classes for kids in India?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'LumiSkill offers the best online coding classes for school students in India. Our courses are live (not recorded), taught by expert mentors, and include real projects. We cover Python, JavaScript, Web Development, AI, Java, and more for students in Class 6–12.',
      },
    },
    {
      '@type': 'Question',
      name: 'What courses does LumiSkill offer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'LumiSkill offers 8 courses: Java Basics (Class 6–8), Python Basics (Class 6–8), Python Programming (Class 9–10), Web Development (Class 9–10), Java Programming (Class 9–10), Java & DSA (Class 11–12), AI & Automation (Class 11–12), and Full Stack Web Development (Class 11–12).',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does LumiSkill cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'LumiSkill courses start from ₹4,999 for beginner courses (Class 6–8) and go up to ₹14,999 for advanced courses (Class 11–12). All courses include live classes, real projects, weekly progress reports, and course completion certificates.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does LumiSkill offer a free demo class?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! LumiSkill offers a 100% free demo class. You can meet the mentor, experience our teaching style, and ask all your questions before deciding to enroll. Book your free demo at lumiskill.com/contact.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are LumiSkill classes live or recorded?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'All LumiSkill classes are 100% live with a real expert mentor — not boring pre-recorded videos. Students can ask questions in real-time and get personalized attention. Maximum 15 students per batch to ensure quality.',
      },
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />

        {/* === STRUCTURED DATA === */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(courseListSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </head>
      <body>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
