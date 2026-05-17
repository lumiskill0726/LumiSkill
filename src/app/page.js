import Hero from '@/components/Hero/Hero';
import Courses from '@/components/Courses/Courses';
import WhyUs from '@/components/WhyUs/WhyUs';
import Pricing from '@/components/Pricing/Pricing';
import Testimonials from '@/components/Testimonials/Testimonials';
import FAQ from '@/components/FAQ/FAQ';
import CTA from '@/components/CTA/CTA';

export const metadata = {
  title: "LumiSkill – India's #1 Online Coding Academy for Class 6–12",
  description:
    'LumiSkill offers live coding classes, expert mentors, and real-world projects for school students. Learn Python, Web Dev, AI, Java, and App Development. Book your free demo class today!',
  alternates: { canonical: 'https://www.LumiSkill.com' },
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
