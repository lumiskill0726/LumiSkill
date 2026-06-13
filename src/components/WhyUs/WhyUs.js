import styles from './WhyUs.module.css';

const features = [
  {
    icon: '🎥',
    title: 'Live Interactive Classes',
    description:
      'Not boring recorded videos! Every class is live, interactive, and fun — with real-time Q&A and instant doubt resolution.',
    color: '#6C3EE8',
    bg: 'rgba(108, 62, 232, 0.08)',
  },
  {
    icon: '🏗️',
    title: 'Project-Based Learning',
    description:
      'Students build real projects from day 1 — games, websites, AI apps. Your child will have a portfolio before they graduate!',
    color: '#FF6B35',
    bg: 'rgba(255, 107, 53, 0.08)',
  },
  {
    icon: '🧑‍💻',
    title: 'Expert Mentors',
    description:
      'Learn from IIT graduates & industry professionals with years of real-world experience — not just textbook teachers.',
    color: '#22C55E',
    bg: 'rgba(34, 197, 94, 0.08)',
  },
  {
    icon: '📊',
    title: 'Weekly Progress Reports',
    description:
      'Parents receive weekly reports on their child\'s progress, attendance, and project completions. Full transparency.',
    color: '#3B82F6',
    bg: 'rgba(59, 130, 246, 0.08)',
  },
  {
    icon: '🎯',
    title: 'Personalised Attention',
    description:
      'Small batch sizes (max 15 students) ensure every student gets personalized attention and guidance.',
    color: '#F59E0B',
    bg: 'rgba(245, 158, 11, 0.08)',
  },
  {
    icon: '🏆',
    title: 'Competitions & Certificates',
    description:
      'Students participate in coding competitions, hackathons, and earn industry-recognized certificates.',
    color: '#EC4899',
    bg: 'rgba(236, 72, 153, 0.08)',
  },
  {
    icon: '👨‍👩‍👧',
    title: 'Parent-Student Community',
    description:
      'Access to our exclusive WhatsApp & Discord community — connect with other families, share projects, get updates.',
    color: '#10B981',
    bg: 'rgba(16, 185, 129, 0.08)',
  },
  {
    icon: '💰',
    title: 'Affordable Pricing',
    description:
      'World-class education at prices accessible to every Indian family. Starting at just ₹8999 with flexible payment plans.',
    color: '#8B5CF6',
    bg: 'rgba(139, 92, 246, 0.08)',
  },
];

const comparisons = [
  { feature: 'Live Interactive Classes', LumiSkill: true, others: false },
  { feature: 'Project-Based Learning', LumiSkill: true, others: false },
  { feature: 'Weekly Parent Reports', LumiSkill: true, others: false },
  { feature: 'Small Batches (≤15 students)', LumiSkill: true, others: false },
  { feature: 'Expert IIT/Industry Mentors', LumiSkill: true, others: '⚠️ Partial' },
  { feature: 'Coding Competitions', LumiSkill: true, others: false },
  { feature: 'Flexible Payment Plans', LumiSkill: true, others: false },
  { feature: '24/7 Doubt Support', LumiSkill: true, others: false },
];

export default function WhyUs() {
  return (
    <section className={`section ${styles.whyUs}`} id="why-us">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">💡 Why LumiSkill</div>
          <h2 className="section-title">
            Why 2,500+ Parents <span>Trust LumiSkill</span>
          </h2>
          <p className="section-subtitle">
            We&apos;re not just another coding platform. We&apos;re a community that is obsessed
            with student outcomes and parent trust.
          </p>
        </div>

        {/* Features Grid */}
        <div className={styles.featuresGrid}>
          {features.map((feature, i) => (
            <div key={i} className={styles.featureCard}>
              <div
                className={styles.iconWrap}
                style={{ background: feature.bg, color: feature.color }}
              >
                <span>{feature.icon}</span>
              </div>
              <div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDesc}>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className={styles.comparison}>
          <h3 className={styles.compTitle}>LumiSkill vs. Other Platforms</h3>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Feature</th>
                  <th className={styles.LumiSkillCol}>
                    <span className={styles.LumiSkillBadge}>LumiSkill ✨</span>
                  </th>
                  <th>Other Platforms</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((row, i) => (
                  <tr key={i}>
                    <td>{row.feature}</td>
                    <td className={styles.LumiSkillCol}>
                      <span className={styles.checkYes}>✅</span>
                    </td>
                    <td>
                      {row.others === false ? (
                        <span className={styles.checkNo}>❌</span>
                      ) : (
                        <span className={styles.checkPartial}>{row.others}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quote */}
        <div className={styles.quote}>
          <div className={styles.quoteIcon}>&ldquo;</div>
          <p className={styles.quoteText}>
            The biggest success factor is student outcomes and parent trust.
            At LumiSkill, every decision we make is guided by one question:
            <strong> &ldquo;Will this help the student grow?&rdquo;</strong>
          </p>
          <div className={styles.quoteAuthor}>
            <div className={styles.quoteAvatar}>👨‍💼</div>
            <div>
              <div className={styles.quoteName}>Founder, LumiSkill</div>
              <div className={styles.quoteRole}>IIT Graduate · EdTech Entrepreneur</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
