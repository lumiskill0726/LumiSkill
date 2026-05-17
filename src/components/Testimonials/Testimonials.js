import styles from './Testimonials.module.css';

const testimonials = [
  {
    id: 1,
    name: 'Priya Sharma',
    role: 'Parent of Arjun (Class 9)',
    city: 'Delhi',
    avatar: '👩',
    rating: 5,
    quote:
      'My son was always on games and YouTube. After joining LumiSkill, he started building his own games! His confidence has skyrocketed and his school grades improved too. Best investment we ever made.',
    highlight: 'Built his own game in 2 months!',
    course: 'Python + Game Dev',
  },
  {
    id: 2,
    name: 'Rahul Verma',
    role: 'Parent of Sneha (Class 11)',
    city: 'Mumbai',
    avatar: '👨',
    rating: 5,
    quote:
      'Sneha completed the Web Development course and built her school project website herself. Her teacher was so impressed! The instructors at LumiSkill are extremely patient and knowledgeable.',
    highlight: 'Built school project website!',
    course: 'Web Development',
  },
  {
    id: 3,
    name: 'Anita Patel',
    role: 'Parent of Rohan (Class 8)',
    city: 'Ahmedabad',
    avatar: '👩',
    rating: 5,
    quote:
      'I was skeptical at first — Rohan is only in Class 8. But the Logic & Game Building course was perfect for his age. He loves every class and never misses a session. Highly recommended!',
    highlight: 'Never misses a single class!',
    course: 'Logic & Game Building',
  },
  {
    id: 4,
    name: 'Vikram Singh',
    role: 'Parent of Aarav (Class 12)',
    city: 'Bangalore',
    avatar: '👨',
    rating: 5,
    quote:
      'Aarav enrolled in the AI & Automation course before his college entrance. It not only improved his technical skills but helped him crack his college interviews too. Fantastic mentors!',
    highlight: 'Cracked college interview with AI knowledge!',
    course: 'AI & Automation',
  },
  {
    id: 5,
    name: 'Meera Iyer',
    role: 'Parent of Divya (Class 10)',
    city: 'Chennai',
    avatar: '👩',
    rating: 5,
    quote:
      'The weekly progress reports are a game-changer. I know exactly what my daughter is learning every week. The teachers respond quickly on WhatsApp. Divya loves the community!',
    highlight: 'Weekly reports keep me informed!',
    course: 'Python + Web Dev',
  },
  {
    id: 6,
    name: 'Suresh Joshi',
    role: 'Parent of Karan (Class 7)',
    city: 'Pune',
    avatar: '👨',
    rating: 5,
    quote:
      'Starting early was the best decision. Karan is in Class 7 and already understands programming logic better than many adults. LumiSkill has completely changed his outlook on technology.',
    highlight: 'Started coding in Class 7!',
    course: 'Logic & Game Building',
  },
];

const stats = [
  { num: '2,500+', label: 'Happy Students' },
  { num: '4.9/5', label: 'Average Rating' },
  { num: '95%', label: 'Parent Satisfaction' },
  { num: '100%', label: 'Would Recommend' },
];

export default function Testimonials() {
  return (
    <section className={`section ${styles.testimonials}`} id="testimonials">
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <div className="section-tag">❤️ Parent Stories</div>
          <h2 className={styles.sectionTitle1}>
            Real Stories from <span>Real Families</span>
          </h2>
          <p className="section-subtitle">
            Don&apos;t just take our word for it. Hear directly from the parents whose
            children have transformed their futures with LumiSkill.
          </p>
        </div>

        {/* Stats */}
        <div className={styles.statsRow}>
          {stats.map((s, i) => (
            <div key={i} className={styles.statBox}>
              <div className={styles.statNum}>{s.num}</div>
              <div className={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className={styles.grid}>
          {testimonials.map((t) => (
            <div key={t.id} className={styles.card}>
              {/* Stars */}
              <div className={styles.stars}>
                {'⭐'.repeat(t.rating)}
              </div>

              {/* Quote */}
              <div className={styles.quoteIcon}>&ldquo;</div>
              <p className={styles.quote}>{t.quote}</p>

              {/* Highlight */}
              <div className={styles.highlight}>
                <span>🏆</span>
                <span>{t.highlight}</span>
              </div>

              {/* Course */}
              <div className={styles.courseBadge}>📚 {t.course}</div>

              {/* Author */}
              <div className={styles.author}>
                <div className={styles.avatar}>{t.avatar}</div>
                <div>
                  <div className={styles.name}>{t.name}</div>
                  <div className={styles.role}>{t.role}</div>
                  <div className={styles.city}>📍 {t.city}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Trust Banner */}
        <div className={styles.trustBanner}>
          <div className={styles.trustContent}>
            <div className={styles.trustEmoji}>🛡️</div>
            <div>
              <h4 className={styles.trustTitle}>100% Satisfaction Guarantee</h4>
              <p className={styles.trustText}>
                Not happy in the first 7 days? We&apos;ll refund your entire fee — no questions asked.
                We&apos;re that confident in our quality.
              </p>
            </div>
          </div>
          <div className={styles.trustBadges}>
            <div className={styles.trustBadge}>✅ Money-back guarantee</div>
            <div className={styles.trustBadge}>✅ No lock-in contract</div>
            <div className={styles.trustBadge}>✅ Cancel anytime</div>
          </div>
        </div>
      </div>
    </section>
  );
}
