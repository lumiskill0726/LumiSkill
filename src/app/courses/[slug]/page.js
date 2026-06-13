import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import PaymentButton from '@/components/PaymentButton/PaymentButton';
import styles from './page.module.css';

/* ---- Fetch all active courses for static generation ---- */
async function getAllActiveCourses() {
  const supabase = supabaseAdmin();
  const { data: courses } = await supabase
    .from('courses')
    .select('slug')
    .eq('is_active', true);
  return courses || [];
}

/* ---- Fetch single course by slug ---- */
async function getCourseBySlug(slug) {
  const supabase = supabaseAdmin();
  const { data: courses } = await supabase
    .from('courses')
    .select(`
      *,
      course_syllabus (
        id,
        month_number,
        title,
        topics
      ),
      course_faqs (
        id,
        question,
        answer,
        display_order
      )
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .limit(1);

  if (!courses || courses.length === 0) return null;

  const course = courses[0];
  return {
    id: course.id,
    slug: course.slug,
    title: course.title,
    subtitle: course.subtitle || course.level,
    tagline: course.description,
    badge: course.badge,
    badgeType: course.badge_type,
    level: course.level,
    duration: `${course.duration_months} Months`,
    price: `₹${course.price.toLocaleString('en-IN')}`,
    students: `${course.students_enrolled || 0}+`,
    icon: course.icon || '📚',
    description: course.description,
    longDescription: course.long_description,
    skills: [],
    outcomes: [],
    whoIsItFor: [],
    curriculum: course.course_syllabus
      ?.sort((a, b) => a.month_number - b.month_number)
      .map((s) => ({
        week: `Month ${s.month_number}`,
        title: s.title,
        topics: s.topics,
      })) || [],
    faqs: course.course_faqs
      ?.sort((a, b) => a.display_order - b.display_order)
      .map((f) => ({
        q: f.question,
        a: f.answer,
      })) || [],
    gradient: 'linear-gradient(135deg, #1e1e2e 0%, #2a2a4a 100%)',
    heroGradient: 'linear-gradient(135deg, #6C3EE8 0%, #3776AB 100%)',
  };
}

/* ---- Generate static pages for all active courses ---- */
export async function generateStaticParams() {
  const courses = await getAllActiveCourses();
  return courses.map((course) => ({ slug: course.slug }));
}

/* ---- Dynamic SEO metadata ---- */
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) return { title: 'Course Not Found | LumiSkill' };

  return {
    title: `${course.title} – ${course.subtitle} | LumiSkill`,
    description: `${course.description} ${course.duration}, ${course.level}. Only ${course.price} one-time fee. Enroll now at LumiSkill.`,
    alternates: { canonical: `https://www.lumiskill.com/courses/${slug}` },
    openGraph: {
      title: `${course.title} | LumiSkill`,
      description: course.description,
      url: `https://www.lumiskill.com/courses/${slug}`,
    },
  };
}

export default async function CourseDetailPage({ params }) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  if (!course) notFound();

  /* Related courses (exclude current) */
  const allCourses = await getAllActiveCourses();
  const supabase = supabaseAdmin();
  const { data: relatedData } = await supabase
    .from('courses')
    .select('id, slug, title, icon, price')
    .eq('is_active', true)
    .neq('slug', slug)
    .limit(4);
  
  const related = relatedData?.map(c => ({
    slug: c.slug,
    title: c.title,
    icon: c.icon || '📚',
    price: `₹${c.price.toLocaleString('en-IN')}`,
  })) || [];

  /* JSON-LD Schemas */
  const numericPrice = parseInt(course.price.replace(/[₹,]/g, ''));

  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: `${course.title} – ${course.subtitle} | LumiSkill`,
    description: course.longDescription,
    url: `https://www.lumiskill.com/courses/${slug}`,
    image: 'https://www.lumiskill.com/og-image.jpg',
    provider: {
      '@type': 'Organization',
      name: 'LumiSkill',
      url: 'https://www.lumiskill.com',
      '@id': 'https://www.lumiskill.com/#organization',
    },
    offers: {
      '@type': 'Offer',
      price: numericPrice,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      validFrom: '2024-01-01',
      category: 'Online Course',
    },
    courseMode: 'online',
    inLanguage: 'en-IN',
    educationalLevel: course.level,
    timeRequired: `P${parseInt(course.duration)}M`,
    coursePrerequisites: course.whoIsItFor[0],
    teaches: course.skills.join(', '),
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      instructor: { '@type': 'Person', name: 'LumiSkill Expert Mentor' },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: parseInt(course.students) || 100,
      bestRating: '5',
      worstRating: '1',
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.lumiskill.com' },
      { '@type': 'ListItem', position: 2, name: 'Courses', item: 'https://www.lumiskill.com/courses' },
      { '@type': 'ListItem', position: 3, name: course.title, item: `https://www.lumiskill.com/courses/${slug}` },
    ],
  };

  const faqSchema = course.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: course.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  } : null;

  return (
    <>
      {/* Inline JSON-LD for this course */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      {/* ===== HERO ===== */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroGrid} />
        <div className={`container ${styles.heroContent}`}>

          {/* Left — Course info */}
          <div className={styles.heroLeft}>
            {/* Breadcrumb */}
            <div className={styles.breadcrumb}>
              <Link href="/">Home</Link>
              <span className={styles.breadcrumbSep}>›</span>
              <Link href="/courses">Courses</Link>
              <span className={styles.breadcrumbSep}>›</span>
              <span>{course.title}</span>
            </div>

            {/* Meta badges */}
            <div className={styles.heroMeta}>
              <span className={styles.heroIcon}>{course.icon}</span>
              <span className={styles.heroBadge}>{course.badge}</span>
              <span className={styles.heroClass}>{course.subtitle}</span>
            </div>

            <h1 className={styles.heroTitle}>{course.title}</h1>
            <p className={styles.heroTagline}>{course.tagline}</p>

            <div className={styles.heroStats}>
              <div className={styles.heroStat}>⏱ <strong>{course.duration}</strong></div>
              <div className={styles.heroStat}>📊 <strong>{course.level}</strong></div>
              <div className={styles.heroStat}>👨‍🎓 <strong>{course.students} students</strong></div>
              <div className={styles.heroStat}>🎯 <strong>{course.curriculum.length} Modules</strong></div>
            </div>
          </div>

          {/* Right — Sticky Enrollment Card (hero) */}
          <div className={styles.enrollCard}>
            <div className={styles.enrollCardPrice}>{course.price}</div>
            <div className={styles.enrollCardPriceSub}>one-time fee · all inclusive</div>

            <ul className={styles.enrollCardFeatures}>
              <li>Live classes with expert mentors</li>
              <li>{course.duration} structured program</li>
              <li>Real projects for your portfolio</li>
              <li>Weekly progress reports to parents</li>
              <li>Course completion certificate</li>
              <li>WhatsApp & Discord support</li>
              <li>Free makeup classes if missed</li>
            </ul>

            <PaymentButton
              courseName={course.title}
              priceDisplay={course.price}
              className={styles.enrollPayBtn}
            />

            <Link href="/contact" className={`btn btn-secondary ${styles.enrollDemoBtn}`}>
              🎓 Book Free Demo First
            </Link>

            <div className={styles.enrollCardTrust}>
              <span className={styles.moneyBack}>✅ 7-Day Money-Back Guarantee</span>
              <span>🔒 Secure payment via Razorpay</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== MAIN CONTENT ===== */}
      <section className={styles.mainContent}>
        <div className={`container ${styles.contentGrid}`}>

          {/* Left — Details */}
          <div className={styles.contentLeft}>

            {/* About the course */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>📖 About This Course</h2>
              <p className={styles.description}>{course.longDescription}</p>
            </div>

            {/* What you'll learn */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>🎯 What Your Child Will Learn</h2>
              <ul className={styles.outcomeList}>
                {course.outcomes.map((o, i) => (
                  <li key={i}>{o}</li>
                ))}
              </ul>
            </div>

            {/* Who is it for */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>👤 Who Is This Course For?</h2>
              <ul className={styles.whoList}>
                {course.whoIsItFor.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>

            {/* Curriculum */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>📚 Course Curriculum</h2>
              <div className={styles.curriculumList}>
                {course.curriculum.map((mod, i) => (
                  <div key={i} className={styles.moduleCard}>
                    <div className={styles.moduleHeader}>
                      <span className={styles.moduleWeek}>{mod.week}</span>
                      <span className={styles.moduleTitle}>{mod.title}</span>
                      <span className={styles.moduleCount}>{mod.topics.length} topics</span>
                    </div>
                    <div className={styles.moduleTopics}>
                      {mod.topics.map((topic, j) => (
                        <div key={j} className={styles.topicItem}>{topic}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>❓ Frequently Asked Questions</h2>
              <div className={styles.faqList}>
                {course.faqs.map((faq, i) => (
                  <div key={i} className={styles.faqItem}>
                    <div className={styles.faqQ}>{faq.q}</div>
                    <div className={styles.faqA}>{faq.a}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right — Sidebar */}
          <div className={styles.sidebarBottom}>

            {/* Demo box */}
            <div className={styles.demoBox}>
              <div className={styles.demoBoxEmoji}>🎁</div>
              <div className={styles.demoBoxTitle}>Try a Free Demo Class</div>
              <p className={styles.demoBoxDesc}>
                Meet the mentor, experience our teaching style, ask questions — completely free. No commitment.
              </p>
              <Link href="/contact" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Book Free Demo →
              </Link>
            </div>

            {/* Other courses */}
            <div className={styles.otherCourses}>
              <div className={styles.otherCoursesTitle}>🎓 Other Courses</div>
              {related.map((c) => (
                <Link key={c.slug} href={`/courses/${c.slug}`} className={styles.otherCourseLink}>
                  <span className={styles.otherCourseName}>{c.icon} {c.title}</span>
                  <span className={styles.otherCoursePrice}>{c.price}</span>
                </Link>
              ))}
            </div>

          </div>

        </div>
      </section>
    </>
  );
}
