'use client';
import Link from 'next/link';
import styles from './Hero.module.css';

const floatingBadges = [
  { icon: '🐍', label: 'Python', top: '20%', left: '5%', delay: '0s' },
  { icon: '🌐', label: 'Web Dev', top: '15%', right: '8%', delay: '0.5s' },
  { icon: '🤖', label: 'AI & ML', bottom: '30%', left: '3%', delay: '1s' },
  { icon: '🧩', label: 'DSA', bottom: '25%', right: '5%', delay: '1.5s' },
  { icon: '☕', label: 'Java', top: '55%', left: '8%', delay: '0.8s' },
  { icon: '⚡', label: 'JavaScript', top: '50%', right: '6%', delay: '1.2s' },
];

const trustBadges = [
  { icon: '✅', text: 'Live Classes' },
  { icon: '🎯', text: 'Project-Based' },
  { icon: '🏆', text: 'Certified' },
];

export default function Hero() {
  return (
    <section className={styles.hero}>
      {/* Background Elements */}
      <div className={styles.bg}>
        <div className={styles.bgGlow1} />
        <div className={styles.bgGlow2} />
        <div className={styles.bgGlow3} />
        <div className={styles.grid} />
        <div className={styles.particles}>
          {[...Array(20)].map((_, i) => (
            <div key={i} className={styles.particle} style={{ '--i': i }} />
          ))}
        </div>
      </div>

      {/* Floating Tech Badges */}
      {floatingBadges.map((badge, i) => (
        <div
          key={i}
          className={styles.floatingBadge}
          style={{
            top: badge.top,
            left: badge.left,
            right: badge.right,
            bottom: badge.bottom,
            animationDelay: badge.delay,
          }}
        >
          <span className={styles.badgeIcon}>{badge.icon}</span>
          <span className={styles.badgeLabel}>{badge.label}</span>
        </div>
      ))}

      <div className={`container ${styles.content}`}>
        {/* Top announcement bar */}
        <div className={styles.announcement}>
          <span className={styles.announcementDot} />
          🎉 &nbsp; <strong>New Batch Starting June 2026</strong> — Only 20 Seats Left!
          <Link href="/contact" className={styles.announcementLink}>
            Register Now →
          </Link>
        </div>

        {/* Main Heading */}
        <h1 className={styles.heading}>
          Give Your Child the
          <br />
          <span className={styles.headingHighlight}>Superpower</span> of
          <br />
          <span className={styles.headingGradient}>Coding & AI</span>
        </h1>

        {/* Subheading */}
        <p className={styles.subheading}>
          India&apos;s most engaging online coding academy for Class 6–12. Live classes,
          real projects, expert mentors — where future tech leaders are built.
        </p>

        {/* Trust badges */}
        <div className={styles.trustRow}>
          {trustBadges.map((b, i) => (
            <div key={i} className={styles.trustBadge}>
              <span>{b.icon}</span>
              <span>{b.text}</span>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className={styles.ctas}>
          <Link href="/contact" className={`btn btn-secondary btn-lg ${styles.ctaPrimary}`}>
            🎓 Book Free Demo Class
          </Link>
          <Link href="/courses" className={`btn btn-outline-white btn-lg ${styles.ctaSecondary}`}>
            ▶ Explore Courses
          </Link>
        </div>

        {/* Social Proof */}
        <div className={styles.socialProof}>
          <div className={styles.avatars}>
            {['👦', '👧', '🧒', '👦', '👧'].map((emoji, i) => (
              <div key={i} className={styles.avatar} style={{ zIndex: 5 - i }}>
                {emoji}
              </div>
            ))}
          </div>
          <div className={styles.proofText}>
            <div className={styles.stars}>⭐⭐⭐⭐⭐</div>
            <p>
              <strong>2,500+ students</strong> already learning with LumiSkill
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div className={styles.statsRow}>
          {[
            { num: '2,500+', label: 'Active Students' },
            { num: '95%', label: 'Parent Satisfaction' },
            { num: '50+', label: 'Expert Mentors' },
            { num: '6', label: 'Core Subjects' },
          ].map((stat, i) => (
            <div key={i} className={styles.statItem}>
              <div className={styles.statNum}>{stat.num}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={styles.scroll}>
        <div className={styles.scrollMouse}>
          <div className={styles.scrollDot} />
        </div>
        <span>Scroll to explore</span>
      </div>
    </section>
  );
}
