import { notFound } from 'next/navigation';
import { coursesData, getCourseBySlug } from '@/data/courses';
import EnrollmentForm from '@/components/EnrollmentForm/EnrollmentForm';
import styles from './page.module.css';

/* ---- Generate static pages for all courses ---- */
export async function generateStaticParams() {
  return coursesData.map((course) => ({ slug: course.slug }));
}

/* ---- Dynamic SEO metadata ---- */
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) return { title: 'Course Not Found | LumiSkill' };

  return {
    title: `Enroll in ${course.title} | LumiSkill`,
    description: `Complete your enrollment for ${course.title}. ${course.description}`,
    robots: 'noindex, nofollow',
  };
}

export default async function EnrollPage({ params }) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);

  if (!course) notFound();

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h1 className={styles.title}>Complete Your Enrollment</h1>
          <p className={styles.subtitle}>
            You're one step away from starting your coding journey!
          </p>
        </div>

        <div className={styles.content}>
          {/* Left - Course Summary */}
          <div className={styles.courseInfo}>
            <div className={styles.courseCard}>
              <div className={styles.courseIcon}>{course.icon}</div>
              <h2 className={styles.courseName}>{course.title}</h2>
              <p className={styles.courseTagline}>{course.tagline}</p>
              
              <div className={styles.courseDetails}>
                <div className={styles.detail}>
                  <span className={styles.detailLabel}>Duration</span>
                  <span className={styles.detailValue}>{course.duration}</span>
                </div>
                <div className={styles.detail}>
                  <span className={styles.detailLabel}>Level</span>
                  <span className={styles.detailValue}>{course.level}</span>
                </div>
                <div className={styles.detail}>
                  <span className={styles.detailLabel}>Students</span>
                  <span className={styles.detailValue}>{course.students}</span>
                </div>
              </div>

              <div className={styles.priceSection}>
                <div className={styles.price}>{course.price}</div>
                <div className={styles.priceSub}>one-time fee · all inclusive</div>
              </div>

              <div className={styles.features}>
                <h3 className={styles.featuresTitle}>What's Included:</h3>
                <ul className={styles.featuresList}>
                  <li>✓ Live classes with expert mentors</li>
                  <li>✓ {course.duration} structured program</li>
                  <li>✓ Real projects for portfolio</li>
                  <li>✓ Weekly progress reports</li>
                  <li>✓ Course completion certificate</li>
                  <li>✓ WhatsApp & Discord support</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right - Enrollment Form */}
          <div className={styles.formSection}>
            <EnrollmentForm 
              courseName={course.title}
              courseSlug={slug}
              priceDisplay={course.price}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
