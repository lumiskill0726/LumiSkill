import Link from "next/link";
import styles from "./courses.module.css";
import CTA from "@/components/CTA/CTA";

export const metadata = {
  title: "All Courses – Python, Web Dev, AI, Java | LumiSkill",
  description:
    "Explore all LumiSkill coding courses for Class 6–12: Python, Web Development, AI & Automation, Java & DSA, App Development, and Logic Building. Live classes, real projects, expert mentors.",
  alternates: { canonical: 'https://www.lumiskill.com/courses' },
};

const curriculum = [
  {
    class: "Class 6–8",
    color: "#22C55E",
    bg: "rgba(34, 197, 94, 0.08)",
    icon: "🎮",
    title: "Foundation & Logic Building",
    tagline: "Start the coding journey with fun!",
    subjects: [
      {
        name: "Java Basics",
        desc: "Intro to Java, syntax, variables, simple programs",
        icon: "☕",
        duration: "4 Months",
        price: "₹4,999",
        slug: "java-basics",
      },
      {
        name: "Python Basics",
        desc: "Variables, loops, simple programs",
        icon: "🐍",
        duration: "4 Months",
        price: "₹5,999",
        slug: "python-basics",
      },
    ],
    outcome:
      "Build their first Java & Python programs and develop logical thinking",
  },
  {
    class: "Class 9–10",
    color: "#6C3EE8",
    bg: "rgba(108, 62, 232, 0.08)",
    icon: "💻",
    title: "Core Programming",
    tagline: "Build real projects!",
    subjects: [
      {
        name: "Python Programming",
        desc: "OOP, functions, mini-projects",
        icon: "🐍",
        duration: "6 Months",
        price: "₹7,999",
        slug: "python-programming",
      },
      {
        name: "Web Development",
        desc: "HTML5, CSS3, JavaScript",
        icon: "🌐",
        duration: "6 Months",
        price: "₹9,999",
        slug: "web-development",
      },
      {
        name: "Java Programming",
        desc: "OOP, functions, mini-projects",
        icon: "☕",
        duration: "6 Months",
        price: "₹8,999",
        slug: "java-programming",
      },
    ],
    outcome: "Build complete websites and real Java & Python projects",
  },
  {
    class: "Class 11–12",
    color: "#FF6B35",
    bg: "rgba(255, 107, 53, 0.08)",
    icon: "🚀",
    title: "Advanced & Career-Ready",
    tagline: "Crack interviews & build AI!",
    subjects: [
      {
        name: "Java & DSA",
        desc: "Core Java, Data Structures, Algorithms",
        icon: "☕",
        duration: "8 Months",
        price: "₹11,999",
        slug: "java-dsa",
      },
      {
        name: "AI & Automation",
        desc: "Machine Learning, APIs, AI projects",
        icon: "🤖",
        duration: "6 Months",
        price: "₹9,999",
        slug: "ai-automation",
      },
      {
        name: "Full Stack Web Development",
        desc: "React, Node.js, databases, full projects",
        icon: "🌐",
        duration: "8 Months",
        price: "₹14,999",
        slug: "full-stack-web-dev",
      },
    ],
    outcome: "Interview-ready with AI projects and a strong portfolio",
  },
];

const features = [
  {
    icon: "🎥",
    title: "Live Classes",
    desc: "Not recorded! Every session is live with Q&A.",
  },
  {
    icon: "🏗️",
    title: "Real Projects",
    desc: "Build real, working projects as you progress through the course.",
  },
  {
    icon: "👥",
    title: "Small Batches",
    desc: "Max 15 students. You're never ignored.",
  },
  {
    icon: "📊",
    title: "Weekly Reports",
    desc: "Parents get detailed progress every week.",
  },
  {
    icon: "🏆",
    title: "Certificates",
    desc: "Industry-recognized on course completion.",
  },
  {
    icon: "💬",
    title: "24/7 Support",
    desc: "WhatsApp + Discord support always available.",
  },
];

export default function CoursesPage() {
  return (
    <>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={`container ${styles.heroContent}`}>
          <div
            className="section-tag"
            style={{
              color: "#A78BFA",
              background: "rgba(108,62,232,0.2)",
              border: "1px solid rgba(108,62,232,0.4)",
            }}
          >
            📚 All Courses
          </div>
          <h1 className={styles.heroTitle}>
            Structured Learning for
            <br />
            <span className={styles.heroGradient}>Every Class, Every Goal</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Courses designed by IIT graduates and industry experts.
            Age-appropriate, project-based, and delivered live by passionate
            mentors.
          </p>
          <div className={styles.heroBadges}>
            <span>🎓 8 Courses</span>
            <span>📅 4–8 Months</span>
            <span>🏫 Class 6–12</span>
            <span>💰 From ₹4,999</span>
          </div>
        </div>

        {/* Feature cards inside hero */}
        <div className={`container ${styles.heroFeaturesWrap}`}>
          <div className={styles.featuresGrid}>
            {features.map((f, i) => (
              <div key={i} className={styles.featureItem}>
                <span className={styles.featureIcon}>{f.icon}</span>
                <div>
                  <div className={styles.featureTitle}>{f.title}</div>
                  <div className={styles.featureDesc}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum by Class */}
      <section className={`section ${styles.curriculum}`}>
        <div className="container">
          <div className="section-header">
            <div className="section-tag">🎓 Curriculum</div>
            <h2 className="section-title">
              Courses by <span>Class Group</span>
            </h2>
            <p className="section-subtitle">
              Each program is specifically tailored to the age group, learning
              capacity, and career goals of your child.
            </p>
          </div>

          <div className={styles.classGroups}>
            {curriculum.map((group, i) => (
              <div
                key={i}
                className={styles.classGroup}
                style={{ borderColor: group.color + "40" }}
              >
                <div
                  className={styles.classGroupHeader}
                  style={{
                    background: group.bg,
                    borderColor: group.color + "30",
                  }}
                >
                  <div className={styles.classGroupIcon}>{group.icon}</div>
                  <div>
                    <div
                      className={styles.classLabel}
                      style={{ color: group.color }}
                    >
                      {group.class}
                    </div>
                    <h3 className={styles.classTitle}>{group.title}</h3>
                    <p className={styles.classTagline}>{group.tagline}</p>
                  </div>
                </div>

                <div className={styles.subjects}>
                  {group.subjects.map((sub, j) => (
                    <div key={j} className={styles.subjectCard}>
                      <div className={styles.subjectIcon}>{sub.icon}</div>
                      <div className={styles.subjectInfo}>
                        <div className={styles.subjectName}>{sub.name}</div>
                        <div className={styles.subjectDesc}>{sub.desc}</div>
                        <div className={styles.subjectDuration}>
                          📅 {sub.duration}
                        </div>
                      </div>
                      <div className={styles.subjectPriceWrap}>
                        <div className={styles.subjectPrice}>{sub.price}</div>
                        <div className={styles.subjectPriceSub}>
                          one-time fee
                        </div>
                      </div>
                      <Link
                        href={`/courses/${sub.slug}`}
                        className={`btn btn-primary btn-sm ${styles.subjectEnroll}`}
                      >
                        View Course →
                      </Link>
                    </div>
                  ))}
                </div>

                <div className={styles.outcomeRow}>
                  <span className={styles.outcomeIcon}>🎯</span>
                  <span className={styles.outcomeText}>
                    <strong>Outcome:</strong> {group.outcome}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free Trial */}
      <section className={`section ${styles.freeTrialSection}`}>
        <div className="container">
          <div className={styles.freeTrialBox}>
            <div className={styles.freeTrialEmoji}>🎁</div>
            <div>
              <h2 className={styles.freeTrialTitle}>
                Try Before You Buy — 100% Free Demo Class
              </h2>
              <p className={styles.freeTrialDesc}>
                Not sure which course to pick? Join a live demo class for free.
                See the teaching style, meet the mentor, ask your questions —
                then decide. No pressure, no commitment.
              </p>
              <Link href="/contact" className="btn btn-primary btn-lg">
                🎓 Book My Free Demo Class
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CTA />
    </>
  );
}
