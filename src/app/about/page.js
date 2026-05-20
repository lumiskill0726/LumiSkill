import Link from 'next/link';
import styles from './about.module.css';
import CTA from '@/components/CTA/CTA';

export const metadata = {
  title: 'About Us – LumiSkill Coding Academy',
  description:
    'Learn about LumiSkill — our mission, story, team and values. We are on a mission to make quality coding education accessible to every Indian student.',
  alternates: { canonical: 'https://www.LumiSkill.com/about' },
};

const team = [
  { name: 'Arjun Mehta', role: 'Founder & CEO', bg: '#6C3EE8', emoji: '👨‍💻', desc: 'IIT Bombay graduate with 8 years in EdTech. Passionate about democratizing coding education.' },
  { name: 'Sneha Patel', role: 'Head of Curriculum', bg: '#FF6B35', emoji: '👩‍🏫', desc: 'Former Google engineer. Designs all course content with a focus on real-world application.' },
  { name: 'Rahul Sharma', role: 'Lead Mentor', bg: '#22C55E', emoji: '🧑‍🏫', desc: 'IIT Delhi + 6 years teaching experience. Specializes in Python, AI and motivating young learners.' },
  { name: 'Priya Singh', role: 'Student Success Head', bg: '#F59E0B', emoji: '👩‍💼', desc: 'Ensures every student and parent has the best experience. Runs our parent community.' },
];

const milestones = [
  { year: '2022', event: 'Founded LumiSkill with 10 students and a dream' },
  { year: '2023', event: 'Grew to 500+ students across 15 Indian cities' },
  { year: '2024', event: 'Launched AI & Automation course. 1,000+ students milestone' },
  { year: '2025', event: '2,500+ students. School partnerships. National expansion' },
];

const values = [
  { icon: '🏆', title: 'Student Outcomes First', desc: 'Every decision we make is guided by what helps students succeed.' },
  { icon: '🤝', title: 'Parent Trust', desc: 'We build long-term relationships with families through transparency.' },
  { icon: '🚀', title: 'Quality Over Quantity', desc: 'Small batches, personal attention, real results.' },
  { icon: '💡', title: 'Innovation', desc: "We're always updating our curriculum to reflect the latest in tech." },
  { icon: '❤️', title: 'Passion', desc: 'We genuinely love teaching and it shows in every class.' },
  { icon: '🌍', title: 'Accessibility', desc: 'Great coding education for every corner of India.' },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={`container ${styles.heroContent}`}>
          <div className="section-tag" style={{ color: '#A78BFA', background: 'rgba(108,62,232,0.2)', border: '1px solid rgba(108,62,232,0.4)' }}>🚀 Our Story</div>
          <h1 className={styles.heroTitle}>
            We&apos;re on a Mission to Make<br />
            <span className={styles.heroGradient}>Every Child a Future Coder</span>
          </h1>
          <p className={styles.heroSubtitle}>
            LumiSkill was born from a simple belief: every Indian child deserves access to
            world-class coding education — regardless of their city or background.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className={`section ${styles.mission}`}>
        <div className="container">
          <div className={styles.missionGrid}>
            <div className={styles.missionLeft}>
              <div className="section-tag">🎯 Our Mission</div>
              <h2 className="section-title">
                Building India&apos;s Next Generation of <span>Tech Leaders</span>
              </h2>
              <p className={styles.missionText}>
                The world is being built by coders. At LumiSkill, we believe the children
                studying in India&apos;s schools today will be the engineers, entrepreneurs,
                and innovators of tomorrow.
              </p>
              <p className={styles.missionText}>
                Our mission is to give every Class 6–12 student the technical skills,
                creative confidence, and problem-solving mindset they need to thrive
                in the 21st century — through live, engaging, and affordable education.
              </p>
              <div className={styles.missionStats}>
                {[
                  { num: '2,500+', label: 'Students Taught' },
                  { num: '95%', label: 'Satisfaction Rate' },
                  { num: '50+', label: 'Expert Mentors' },
                  { num: '6', label: 'Core Subjects' },
                ].map((s, i) => (
                  <div key={i} className={styles.missionStat}>
                    <div className={styles.missionStatNum}>{s.num}</div>
                    <div className={styles.missionStatLabel}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.missionRight}>
              <div className={styles.missionCard}>
                <div className={styles.missionCardIcon}>🎓</div>
                <h3>Our Vision</h3>
                <p>To become India&apos;s most trusted EdTech brand — a national tech education company, a teen startup incubator, and eventually an international learning platform.</p>
              </div>
              <div className={styles.missionCard}>
                <div className={styles.missionCardIcon}>💡</div>
                <h3>How We&apos;re Different</h3>
                <p>Live classes, project-based learning, small batches, weekly parent reports — we&apos;re obsessed with quality and outcomes, not just enrollment numbers.</p>
              </div>
              <div className={styles.missionCard}>
                <div className={styles.missionCardIcon}>🤝</div>
                <h3>Our Promise</h3>
                <p>7-day money-back guarantee. No lock-in. We&apos;re confident enough in our quality to offer this promise to every family.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className={`section ${styles.valuesSection}`}>
        <div className="container">
          <div className="section-header">
            <div className="section-tag">💎 Our Values</div>
            <h2 className="section-title">What We Stand For</h2>
          </div>
          <div className={styles.valuesGrid}>
            {values.map((v, i) => (
              <div key={i} className={styles.valueCard}>
                <div className={styles.valueIcon}>{v.icon}</div>
                <h3 className={styles.valueTitle}>{v.title}</h3>
                <p className={styles.valueDesc}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey */}
      {/* <section className={`section ${styles.journey}`}>
        <div className="container">
          <div className="section-header">
            <div className="section-tag">📅 Our Journey</div>
            <h2 className="section-title">From 10 Students to <span>2,500+</span></h2>
          </div>
          <div className={styles.timeline}>
            {milestones.map((m, i) => (
              <div key={i} className={styles.timelineItem}>
                <div className={styles.timelineYear}>{m.year}</div>
                <div className={styles.timelineDot} />
                <div className={styles.timelineEvent}>{m.event}</div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Team */}
      {/* <section className={`section ${styles.teamSection}`}>
        <div className="container">
          <div className="section-header">
            <div className="section-tag">👥 Our Team</div>
            <h2 className="section-title">Meet the <span>Minds Behind LumiSkill</span></h2>
            <p className="section-subtitle">IIT graduates, industry veterans, and passionate educators — united by one mission.</p>
          </div>
          <div className={styles.teamGrid}>
            {team.map((member, i) => (
              <div key={i} className={styles.teamCard}>
                <div className={styles.teamAvatar} style={{ background: member.bg + '22', border: `2px solid ${member.bg}44` }}>
                  <span>{member.emoji}</span>
                </div>
                <h3 className={styles.teamName}>{member.name}</h3>
                <div className={styles.teamRole} style={{ color: member.bg }}>{member.role}</div>
                <p className={styles.teamDesc}>{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      <CTA />
    </>
  );
}
