import Hero from '@/components/Hero/Hero';
import Courses from '@/components/Courses/Courses';
import WhyUs from '@/components/WhyUs/WhyUs';
import Pricing from '@/components/Pricing/Pricing';
import Testimonials from '@/components/Testimonials/Testimonials';
import FAQ from '@/components/FAQ/FAQ';
import CTA from '@/components/CTA/CTA';

export const metadata = {
  title: 'LumiSkill – Best Online Coding Classes for Kids | Lumi Skill Academy India',
  description:
    'LumiSkill (Lumi Skill / LumiSkills) — India\'s best live online coding academy for school students Class 6–12. Learn Python, Web Development, AI, Java & DSA with expert mentors, real projects, and 7-day money-back guarantee. Book your FREE demo class today!',
  keywords: [
    'LumiSkill', 'Lumi Skill', 'LumiSkills', 'lumiskill academy',
    'best online coding classes India', 'coding for kids India',
    'live coding classes school students', 'python course for students',
    'coding academy class 6 to 12', 'AI course for school students India',
  ],
  alternates: { canonical: 'https://www.lumiskill.com' },
  openGraph: {
    title: 'LumiSkill – Best Online Coding Classes for Class 6–12 | India',
    description: 'Live coding classes, expert mentors, real projects. Learn Python, AI, Web Dev, Java & more. 7-day money-back guarantee.',
    url: 'https://www.lumiskill.com',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'LumiSkill Coding Academy' }],
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Courses />
      <WhyUs />
      <Pricing />
      <Testimonials />
      <FAQ />
      <CTA />
    </>
  );
}
