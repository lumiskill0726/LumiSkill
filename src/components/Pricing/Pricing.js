import Link from 'next/link';
import styles from './Pricing.module.css';

const programs = [
  {
    classLabel: 'Class 6–8',
    icon: '🌱',
    name: 'Foundation & Logic Building',
    tagline: 'The perfect starting point for young coders',
    startingPrice: '4,999',
    badge: null,
    highlight: false,
    accentColor: '#10b981',
    features: [
      '✅ Logic & Problem Solving',
      '✅ Scratch & Python Basics',
      '✅ Fun Mini Projects',
      '✅ Live Interactive Classes',
      '✅ WhatsApp Community',
      '✅ Monthly Progress Report',
      '✅ Course Completion Certificate',
      '✅ Parent Progress Dashboard',
    ],
    cta: 'Explore Foundation',
    ctaStyle: 'btn-outline',
  },
  {
    classLabel: 'Class 9–10',
    icon: '⚡',
    name: 'Core Programming',
    tagline: 'Build real skills, real websites, real confidence',
    startingPrice: '7,999',
    badge: '🔥 Most Popular',
    highlight: true,
    accentColor: '#6c3ee8',
    features: [
      '✅ Python, HTML, CSS & JavaScript',
      '✅ Build Real Websites & Apps',
      '✅ Live Interactive Classes',
      '✅ WhatsApp + Discord Community',
      '✅ Weekly Progress Report',
      '✅ Industry-Recognised Certificate',
      '✅ Mentorship Sessions',
      '✅ Priority Doubt Support',
    ],
    cta: 'Explore Core Program',
    ctaStyle: 'btn-primary',
  },
  {
    classLabel: 'Class 11–12',
    icon: '🏆',
    name: 'Advanced & Career-Ready',
    tagline: 'From student to future-ready developer',
    startingPrice: '9,999',
    badge: 'Advanced',
    highlight: false,
    accentColor: '#f59e0b',
    features: [
      '✅ Java, DSA & APIs',
      '✅ AI & Automation Projects',
      '✅ Full Portfolio Building',
      '✅ Unlimited Live Classes',
      '✅ Daily Progress Report',
      '✅ Premium Certificate',
      '✅ Unlimited 1-on-1 Mentorship',
      '✅ 24/7 Priority Support',
      '✅ Career Guidance Sessions',
    ],
    cta: 'Explore Advanced',
    ctaStyle: 'btn-secondary',
  },
];

const bootcamps = [
  {
    icon: '🎯',
    title: 'Summer AI Bootcamp',
    duration: '4 Weeks Intensive',
    price: '₹4,999',
    desc: 'Build 3 AI projects in 4 weeks. Ideal for Class 9–12.',
  },
  {
    icon: '🌐',
    title: 'Web Dev Bootcamp',
    duration: '6 Weeks Intensive',
    price: '₹3,999',
    desc: 'From zero to full-stack web developer in 6 weeks.',
  },
  {
    icon: '🏫',
    title: 'School Partnership',
    duration: 'Annual Contract',
    price: 'Custom',
    desc: 'Coding labs, AI workshops & teacher training for schools.',
  },
];

export default function Pricing() {
  return (
    <section className={`section ${styles.pricing}`} id="pricing">
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <div className="section-tag">📚 Programs & Pricing</div>
          <h2 className="section-title">
            Choose Your Child&apos;s <span>Learning Path</span>
          </h2>
          <p className="section-subtitle">
            Structured programs designed for every class level — from first-time coders to
            career-ready developers. All plans include live classes &amp; real projects.
          </p>
        </div>

        {/* Programs Grid */}
        <div className={styles.plansGrid}>
          {programs.map((program, i) => (
            <div
              key={i}
              className={`${styles.planCard} ${program.highlight ? styles.featured : ''}`}
            >
              {program.badge && (
                <div className={styles.planBadge}>{program.badge}</div>
              )}

              <div className={styles.planTop}>
                {/* Class Label Pill */}
                <div
                  className={styles.classLabel}
                  style={{ background: program.highlight ? 'rgba(255,255,255,0.2)' : `${program.accentColor}18`, color: program.highlight ? 'white' : program.accentColor }}
                >
                  {program.classLabel}
                </div>

                <div className={styles.planIcon}>{program.icon}</div>
                <div className={styles.planName}>{program.name}</div>
                <div className={styles.planTagline}>{program.tagline}</div>

                {/* Price */}
                <div className={styles.planPrice}>
                  <span className={styles.startingFrom}>Starting from</span>
                  <div className={styles.priceRow}>
                    <span className={styles.currency}>₹</span>
                    <span className={styles.amount}>{program.startingPrice}</span>
                  </div>
                </div>
              </div>

              <ul className={styles.features}>
                {program.features.map((feature, j) => (
                  <li key={j} className={styles.feature}>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href="/courses"
                className={`btn ${program.ctaStyle} ${styles.planCta}`}
              >
                {program.cta} →
              </Link>
            </div>
          ))}
        </div>

        {/* Free Trial Banner */}
        <div className={styles.freeTrial}>
          <div className={styles.freeTrialContent}>
            <span className={styles.freeTrialIcon}>🎁</span>
            <div>
              <h4 className={styles.freeTrialTitle}>Not Sure Which Program? Try a Free Demo Class!</h4>
              <p className={styles.freeTrialText}>
                Join a live session for free. No credit card needed. See the magic yourself.
              </p>
            </div>
          </div>
          <Link href="/contact" className="btn btn-secondary">
            Book Free Demo
          </Link>
        </div>

        {/* Premium Bootcamps */}
        <div className={styles.bootcamps}>
          <h3 className={styles.bootcampTitle}>Premium Bootcamps &amp; Partnerships</h3>
          <div className={styles.bootcampGrid}>
            {bootcamps.map((item, i) => (
              <Link key={i} href="/courses" className={styles.bootcampCard}>
                <div className={styles.bootcampIcon}>{item.icon}</div>
                <div>
                  <div className={styles.bootcampName}>{item.title}</div>
                  <div className={styles.bootcampDuration}>{item.duration}</div>
                  <p className={styles.bootcampDesc}>{item.desc}</p>
                </div>
                <div className={styles.bootcampPrice}>{item.price}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
