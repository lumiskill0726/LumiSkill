'use client';
import Link from 'next/link';
import styles from './Courses.module.css';

/* ── Colorful unique SVG icons per course ── */

const JavaBasicsIcon = () => (
  <svg width="62" height="62" viewBox="0 0 64 64" fill="none">
    {/* Java Coffee Cup — orange & brown */}
    <rect x="10" y="22" width="34" height="28" rx="6" fill="#F89820"/>
    <rect x="10" y="22" width="34" height="10" rx="6" fill="#e67e00"/>
    <path d="M44 27h6a5 5 0 0 1 0 10h-6" stroke="#F89820" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <rect x="8" y="50" width="38" height="5" rx="2.5" fill="#5382A1"/>
    {/* Steam — animated feel */}
    <path d="M19 19 Q21 13 19 7" stroke="#FFD580" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.85"/>
    <path d="M27 19 Q29 13 27 7" stroke="#FFD580" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.7"/>
    <path d="M35 19 Q37 13 35 7" stroke="#FFD580" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.55"/>
    {/* Cup highlight */}
    <rect x="14" y="26" width="8" height="3" rx="1.5" fill="white" opacity="0.25"/>
  </svg>
);

const PythonBasicsIcon = () => (
  <svg width="62" height="62" viewBox="0 0 64 64" fill="none">
    {/* Official Python logo colors: blue + yellow */}
    <path d="M32 6c-9 0-14 4-14 10v5h14v2H18c-7 0-10 5-10 11s4 10 10 10h3v-5c0-4 3-6 6-6h10c4 0 7-2 7-6V16c0-6-5-10-12-10z" fill="#3776AB"/>
    <path d="M32 58c9 0 14-4 14-10v-5H32v-2h14c7 0 10-5 10-11s-4-10-10-10h-3v5c0 4-3 6-6 6H27c-4 0-7 2-7 6v10c0 6 5 10 12 10z" fill="#FFD43B"/>
    <circle cx="26" cy="15" r="2.5" fill="white"/>
    <circle cx="38" cy="49" r="2.5" fill="#3776AB"/>
  </svg>
);

const PythonProgrammingIcon = () => (
  <svg width="62" height="62" viewBox="0 0 64 64" fill="none">
    {/* OOP — purple screen with cyan brackets */}
    <rect x="6" y="10" width="52" height="44" rx="8" fill="#1e1e2e"/>
    <rect x="6" y="10" width="52" height="44" rx="8" stroke="#6C3EE8" strokeWidth="2"/>
    {/* Cursor line highlight */}
    <rect x="10" y="28" width="44" height="8" rx="2" fill="#6C3EE8" opacity="0.2"/>
    {/* Brackets */}
    <path d="M18 18 L12 32 L18 46" stroke="#00BFFF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M46 18 L52 32 L46 46" stroke="#00BFFF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    {/* Slash */}
    <line x1="28" y1="18" x2="36" y2="46" stroke="#FFD43B" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

const WebDevIcon = () => (
  <svg width="62" height="62" viewBox="0 0 64 64" fill="none">
    {/* Browser window */}
    <rect x="4" y="8" width="56" height="48" rx="7" fill="#f0f4ff"/>
    <rect x="4" y="8" width="56" height="16" rx="7" fill="#1e1e2e"/>
    <rect x="4" y="16" width="56" height="8" fill="#1e1e2e"/>
    {/* Traffic lights */}
    <circle cx="15" cy="16" r="3" fill="#FF5F57"/>
    <circle cx="24" cy="16" r="3" fill="#FFBD2E"/>
    <circle cx="33" cy="16" r="3" fill="#28C840"/>
    {/* HTML orange tag < > */}
    <path d="M12 36 L6 44 L12 52" stroke="#E34F26" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    {/* CSS blue tag */}
    <path d="M52 36 L58 44 L52 52" stroke="#1572B6" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    {/* JS yellow slash */}
    <line x1="28" y1="32" x2="36" y2="56" stroke="#F7DF1E" strokeWidth="3.5" strokeLinecap="round"/>
  </svg>
);

const JavaProgrammingIcon = () => (
  <svg width="62" height="62" viewBox="0 0 64 64" fill="none">
    {/* Gear — orange & blue Java colors */}
    <path d="M32 8l3.5 6.5A14 14 0 0 1 46 18l7-1 2 7-6 3.5A14 14 0 0 1 49 32a14 14 0 0 1 0 4.5l6 3.5-2 7-7-1A14 14 0 0 1 35.5 49.5L32 56l-3.5-6.5A14 14 0 0 1 18 46l-7 1-2-7 6-3.5A14 14 0 0 1 15 32a14 14 0 0 1 0-4.5l-6-3.5 2-7 7 1A14 14 0 0 1 28.5 14.5Z" fill="#5382A1" stroke="#3a6080" strokeWidth="1.5"/>
    <circle cx="32" cy="32" r="9" fill="#F89820"/>
    <circle cx="32" cy="32" r="5" fill="white"/>
    <circle cx="32" cy="32" r="2.5" fill="#F89820"/>
  </svg>
);

const JavaDSAIcon = () => (
  <svg width="62" height="62" viewBox="0 0 64 64" fill="none">
    {/* Binary tree — green nodes */}
    <circle cx="32" cy="10" r="7" fill="#22C55E"/>
    <circle cx="16" cy="32" r="7" fill="#3B82F6"/>
    <circle cx="48" cy="32" r="7" fill="#3B82F6"/>
    <circle cx="8" cy="54" r="6" fill="#F89820"/>
    <circle cx="24" cy="54" r="6" fill="#F89820"/>
    <circle cx="40" cy="54" r="6" fill="#F89820"/>
    <circle cx="56" cy="54" r="6" fill="#F89820"/>
    {/* Connecting lines */}
    <line x1="27" y1="15" x2="21" y2="26" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="37" y1="15" x2="43" y2="26" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="11" y1="38" x2="10" y2="48" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round"/>
    <line x1="21" y1="38" x2="22" y2="48" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round"/>
    <line x1="43" y1="38" x2="42" y2="48" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round"/>
    <line x1="53" y1="38" x2="54" y2="48" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round"/>
    {/* Node labels */}
    <text x="32" y="14" textAnchor="middle" fontSize="7" fill="white" fontWeight="bold">1</text>
    <text x="16" y="36" textAnchor="middle" fontSize="7" fill="white" fontWeight="bold">2</text>
    <text x="48" y="36" textAnchor="middle" fontSize="7" fill="white" fontWeight="bold">3</text>
  </svg>
);

const AIAutomationIcon = () => (
  <svg width="62" height="62" viewBox="0 0 64 64" fill="none">
    {/* Neural network — purple/pink nodes */}
    {/* Input layer — blue */}
    <circle cx="10" cy="18" r="5" fill="#3B82F6"/>
    <circle cx="10" cy="32" r="5" fill="#3B82F6"/>
    <circle cx="10" cy="46" r="5" fill="#3B82F6"/>
    {/* Hidden layer — purple */}
    <circle cx="32" cy="12" r="5" fill="#8B5CF6"/>
    <circle cx="32" cy="25" r="5" fill="#8B5CF6"/>
    <circle cx="32" cy="38" r="5" fill="#8B5CF6"/>
    <circle cx="32" cy="51" r="5" fill="#8B5CF6"/>
    {/* Output — orange/gold */}
    <circle cx="54" cy="25" r="6" fill="#F59E0B"/>
    <circle cx="54" cy="39" r="6" fill="#F59E0B"/>
    {/* Connections */}
    <line x1="15" y1="18" x2="27" y2="12" stroke="#C4B5FD" strokeWidth="1.5" opacity="0.7"/>
    <line x1="15" y1="18" x2="27" y2="25" stroke="#C4B5FD" strokeWidth="1.5" opacity="0.7"/>
    <line x1="15" y1="32" x2="27" y2="25" stroke="#C4B5FD" strokeWidth="1.5" opacity="0.7"/>
    <line x1="15" y1="32" x2="27" y2="38" stroke="#C4B5FD" strokeWidth="1.5" opacity="0.7"/>
    <line x1="15" y1="46" x2="27" y2="38" stroke="#C4B5FD" strokeWidth="1.5" opacity="0.7"/>
    <line x1="15" y1="46" x2="27" y2="51" stroke="#C4B5FD" strokeWidth="1.5" opacity="0.7"/>
    <line x1="37" y1="12" x2="48" y2="25" stroke="#FDE68A" strokeWidth="1.5" opacity="0.8"/>
    <line x1="37" y1="25" x2="48" y2="25" stroke="#FDE68A" strokeWidth="1.5" opacity="0.8"/>
    <line x1="37" y1="38" x2="48" y2="39" stroke="#FDE68A" strokeWidth="1.5" opacity="0.8"/>
    <line x1="37" y1="51" x2="48" y2="39" stroke="#FDE68A" strokeWidth="1.5" opacity="0.8"/>
  </svg>
);

const FullStackIcon = () => (
  <svg width="62" height="62" viewBox="0 0 64 64" fill="none">
    {/* Stacked layers — each a different color */}
    {/* DB layer — teal */}
    <ellipse cx="32" cy="52" rx="22" ry="7" fill="#0D9488"/>
    <rect x="10" y="45" width="44" height="7" fill="#0D9488"/>
    <ellipse cx="32" cy="45" rx="22" ry="7" fill="#14B8A6"/>
    {/* API layer — blue */}
    <ellipse cx="32" cy="35" rx="22" ry="7" fill="#2563EB"/>
    <rect x="10" y="28" width="44" height="7" fill="#2563EB"/>
    <ellipse cx="32" cy="28" rx="22" ry="7" fill="#3B82F6"/>
    {/* UI layer — purple */}
    <ellipse cx="32" cy="18" rx="22" ry="7" fill="#7C3AED"/>
    <rect x="10" y="11" width="44" height="7" fill="#7C3AED"/>
    <ellipse cx="32" cy="11" rx="22" ry="7" fill="#8B5CF6"/>
    {/* Labels */}
    <text x="32" y="14" textAnchor="middle" fontSize="6.5" fill="white" fontWeight="800">UI</text>
    <text x="32" y="31" textAnchor="middle" fontSize="6.5" fill="white" fontWeight="800">API</text>
    <text x="32" y="48" textAnchor="middle" fontSize="6.5" fill="white" fontWeight="800">DB</text>
  </svg>
);

const courses = [
  {
    id: 1,
    IconComponent: JavaBasicsIcon,
    gradient: 'linear-gradient(135deg, #1e1e2e 0%, #2a2a4a 100%)',
    badge: 'Beginner Friendly',
    badgeType: 'fun',
    title: 'Java Basics',
    subtitle: 'Class 6–8',
    description: 'Start your coding journey with Java — learn syntax, variables, and simple programs. A perfect first step into programming.',
    skills: ['Java Syntax', 'Variables', 'Loops', 'Simple Programs'],
    duration: '4 Months',
    level: 'Beginner',
    price: '₹4,999',
    students: '400+',
  },
  {
    id: 2,
    IconComponent: PythonBasicsIcon,
    gradient: 'linear-gradient(135deg, #1a2a3a 0%, #2a3a1a 100%)',
    badge: 'Most Popular',
    badgeType: 'popular',
    title: 'Python Basics',
    subtitle: 'Class 6–8',
    description: "Learn Python — the world's most beginner-friendly language. Build simple programs and develop logical thinking skills.",
    skills: ['Variables & Loops', 'Functions', 'Logic Building', 'Mini Programs'],
    duration: '4 Months',
    level: 'Beginner',
    price: '₹5,999',
    students: '600+',
  },
  {
    id: 3,
    IconComponent: PythonProgrammingIcon,
    gradient: 'linear-gradient(135deg, #0d0d1a 0%, #1a0d2e 100%)',
    badge: 'Best Seller',
    badgeType: 'bestseller',
    title: 'Python Programming',
    subtitle: 'Class 9–10',
    description: 'Advance your Python skills with OOP, functions, and real mini-projects. Build practical programs from scratch.',
    skills: ['OOP', 'Functions', 'File Handling', 'Mini Projects'],
    duration: '6 Months',
    level: 'Beginner–Intermediate',
    price: '₹7,999',
    students: '800+',
  },
  {
    id: 4,
    IconComponent: WebDevIcon,
    gradient: 'linear-gradient(135deg, #0a0a1a 0%, #1a0a0a 100%)',
    badge: '🔥 Trending',
    badgeType: 'trending',
    title: 'Web Development',
    subtitle: 'Class 9–10',
    description: 'Build stunning websites from scratch. Learn HTML5, CSS3 and JavaScript to create real projects you can show off to the world.',
    skills: ['HTML5 & CSS3', 'JavaScript', 'Responsive Design', 'Real Projects'],
    duration: '6 Months',
    level: 'Beginner–Intermediate',
    price: '₹9,999',
    students: '650+',
  },
  {
    id: 5,
    IconComponent: JavaProgrammingIcon,
    gradient: 'linear-gradient(135deg, #1a1500 0%, #0a1a2a 100%)',
    badge: 'High Demand',
    badgeType: 'advanced',
    title: 'Java Programming',
    subtitle: 'Class 9–10',
    description: 'Master Java with OOP, functions, and hands-on mini-projects. Build a strong foundation for advanced courses.',
    skills: ['OOP Concepts', 'Functions', 'Collections', 'Mini Projects'],
    duration: '6 Months',
    level: 'Intermediate',
    price: '₹8,999',
    students: '350+',
  },
  {
    id: 6,
    IconComponent: JavaDSAIcon,
    gradient: 'linear-gradient(135deg, #0a1a0a 0%, #0a0a2a 100%)',
    badge: 'Advanced',
    badgeType: 'advanced',
    title: 'Java & DSA',
    subtitle: 'Class 11–12',
    description: 'Master Java and Data Structures & Algorithms — the foundation for cracking top coding interviews and building enterprise apps.',
    skills: ['Core Java', 'Data Structures', 'Algorithms', 'Interview Prep'],
    duration: '8 Months',
    level: 'Intermediate–Advanced',
    price: '₹11,999',
    students: '300+',
  },
  {
    id: 7,
    IconComponent: AIAutomationIcon,
    gradient: 'linear-gradient(135deg, #0d0020 0%, #200010 100%)',
    badge: '🔥 Hot',
    badgeType: 'trending',
    title: 'AI & Automation',
    subtitle: 'Class 11–12',
    description: 'Step into the future! Build AI-powered apps, learn machine learning basics, and automate real-world tasks with Python & APIs.',
    skills: ['AI Concepts', 'ML Basics', 'API Integration', 'AI Projects'],
    duration: '6 Months',
    level: 'Intermediate',
    price: '₹9,999',
    students: '400+',
  },
  {
    id: 8,
    IconComponent: FullStackIcon,
    gradient: 'linear-gradient(135deg, #001a1a 0%, #00001a 100%)',
    badge: 'Career Ready',
    badgeType: 'new',
    title: 'Full Stack Web Dev',
    subtitle: 'Class 11–12',
    description: 'Become a full stack developer — build complete web applications with React, Node.js, and databases for a career-ready portfolio.',
    skills: ['React.js', 'Node.js', 'Databases', 'Full Projects'],
    duration: '8 Months',
    level: 'Advanced',
    price: '₹14,999',
    students: '200+',
  },
];

export default function Courses() {
  return (
    <section className={`section ${styles.courses}`} id="courses">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">🎓 Our Curriculum</div>
          <h2 className="section-title">
            Courses Built for <span>Future Tech Leaders</span>
          </h2>
          <p className="section-subtitle">
            Structured programs designed by IIT &amp; industry experts. Each course combines
            live sessions, project work &amp; mentorship for real-world skill building.
          </p>
        </div>

        {/* Class Filter Tabs */}
        <div className={styles.filterTabs}>
          {['All Courses', 'Class 6–8', 'Class 9–10', 'Class 11–12'].map((tab) => (
            <button
              key={tab}
              className={`${styles.filterTab} ${tab === 'All Courses' ? styles.active : ''}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className={styles.grid}>
          {courses.map((course) => (
            <div key={course.id} className={styles.card}>
              {/* Card header */}
              <div className={styles.cardHeader} style={{ background: course.gradient }}>
                <div className={styles.courseIcon}>
                  <course.IconComponent />
                </div>
                <span className={`${styles.badge} ${styles[course.badgeType]}`}>
                  {course.badge}
                </span>
                <div className={styles.cardHeaderOverlay} />
              </div>

              {/* Card body */}
              <div className={styles.cardBody}>
                <div className={styles.metaRow}>
                  <span className={styles.levelBadge}>{course.level}</span>
                  <span className={styles.duration}>⏱ {course.duration}</span>
                </div>

                <h3 className={styles.courseTitle}>{course.title}</h3>
                <p className={styles.courseSubtitle}>{course.subtitle}</p>
                <p className={styles.courseDesc}>{course.description}</p>

                {/* Skills */}
                <div className={styles.skills}>
                  {course.skills.map((skill) => (
                    <span key={skill} className={styles.skill}>
                      ✓ {skill}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className={styles.cardFooter}>
                  <div className={styles.priceBlock}>
                    <div className={styles.price}>{course.price}</div>
                    <div className={styles.perMonth}>one-time fee</div>
                  </div>
                  <div className={styles.studentsCount}>
                    👨‍🎓 {course.students} students
                  </div>
                </div>

                <Link href="/contact" className={`btn btn-primary ${styles.enroll}`}>
                  Enroll Now
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className={styles.bottomCta}>
          <p>Not sure which course is right for your child?</p>
          <Link href="/contact" className="btn btn-secondary">
            🎓 Get Free Counselling
          </Link>
        </div>
      </div>
    </section>
  );
}
