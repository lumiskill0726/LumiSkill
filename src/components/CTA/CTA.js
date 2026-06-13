import Link from 'next/link';
import styles from './CTA.module.css';

export default function CTA() {
  return (
    <section className={styles.ctaSection} id="enroll">
      <div className={styles.bg}>
        <div className={styles.glow1} />
        <div className={styles.glow2} />
        <div className={styles.grid} />
      </div>

      <div className={`container ${styles.content}`}>
        {/* Urgency Banner */}
        <div className={styles.urgency}>
          <span className={styles.urgencyDot} />
          🔥 &nbsp; <strong>June 2026 Batch:</strong> Only 20 Seats Remaining!
        </div>

        {/* Headline */}
        <h2 className={styles.title}>
          Your Child&apos;s Coding
          <br />
          <span className={styles.titleGradient}>Journey Starts Today</span>
        </h2>

        <p className={styles.subtitle}>
          Every day you wait is a day your child falls behind in the digital future.
          Give them the edge they deserve with LumiSkill.
        </p>

        {/* Benefits */}
        <div className={styles.benefits}>
          {[
            '🎓 Free Demo Class',
            '✅ No Prior Experience Needed',
            '💰 7-Day Money Back',
            '📱 Learn from Home',
          ].map((b, i) => (
            <div key={i} className={styles.benefit}>
              {b}
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className={styles.buttons}>
          <Link href="/contact" className={`btn btn-secondary btn-lg ${styles.mainBtn}`}>
            🎓 Book FREE Demo Class Now
          </Link>
          <Link href="/courses" className={`btn btn-outline-white btn-lg`}>
            📚 Browse All Courses
          </Link>
        </div>

        {/* Sub-text */}
        <p className={styles.subText}>
          Join <strong>2,500+ students</strong> who are already building their future.
          No spam, no pressure. Just great learning.
        </p>

        {/* Funnel Steps */}
        <div className={styles.funnel}>
          <div className={styles.funnelStep}>
            <div className={styles.funnelNum}>1</div>
            <div className={styles.funnelLabel}>Free Demo Workshop</div>
          </div>
          <div className={styles.funnelArrow}>→</div>
          <div className={styles.funnelStep}>
            <div className={styles.funnelNum}>2</div>
            <div className={styles.funnelLabel}>Starter Course ₹8,999</div>
          </div>
          <div className={styles.funnelArrow}>→</div>
          <div className={styles.funnelStep}>
            <div className={styles.funnelNum}>3</div>
            <div className={styles.funnelLabel}>Main Program</div>
          </div>
          <div className={styles.funnelArrow}>→</div>
          <div className={styles.funnelStep}>
            <div className={styles.funnelNum}>4</div>
            <div className={styles.funnelLabel}>Elite Mentorship</div>
          </div>
        </div>
      </div>
    </section>
  );
}
