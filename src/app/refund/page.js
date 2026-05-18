import styles from '../legal.module.css';

export const metadata = {
  title: 'Refund & Cancellation Policy | LumiSkill',
  description: 'LumiSkill Refund and Cancellation Policy — understand our refund process and eligibility criteria.',
  alternates: { canonical: 'https://www.lumiskill.com/refund' },
};

export default function RefundPage() {
  return (
    <>
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroTag}>💰 Legal</div>
          <h1 className={styles.heroTitle}>Refund & Cancellation Policy</h1>
          <p className={styles.heroMeta}>Last updated: June 1, 2025 &nbsp;|&nbsp; Effective: June 1, 2025</p>
        </div>
      </section>

      <section className={styles.content}>
        <div className="container">
          <div className={styles.wrapper}>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>📋 Overview</h2>
              <p className={styles.para}>
                At LumiSkill, we are committed to delivering high-quality coding education. We understand that circumstances can change, and we have designed a fair refund and cancellation policy to protect both our students and our business.
              </p>
              <div className={styles.highlight}>
                <strong>Our Promise:</strong> We offer a 7-day satisfaction guarantee for new enrollments. If you are not satisfied within 7 days of your first class, we will process a full refund — no questions asked.
              </div>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>✅ Refund Eligibility</h2>
              <p className={styles.para}>You are eligible for a refund under the following conditions:</p>
              <ul className={styles.list}>
                <li><strong>7-Day Money Back Guarantee:</strong> Full refund if requested within 7 days of your first class and you have attended no more than 2 classes</li>
                <li><strong>Class Not Delivered:</strong> Full refund if LumiSkill fails to deliver the purchased class and cannot schedule a makeup session within 14 days</li>
                <li><strong>Technical Failure by LumiSkill:</strong> Full refund for a class if our platform or instructor fails to conduct the session due to our technical issues</li>
                <li><strong>Duplicate Payment:</strong> Full refund of the duplicate amount if the same order is charged twice</li>
                <li><strong>Incorrect Charge:</strong> Full refund if you were charged an incorrect amount due to a pricing error on our end</li>
              </ul>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>❌ Non-Refundable Cases</h2>
              <p className={styles.para}>Refunds will <strong>NOT</strong> be provided in the following situations:</p>
              <ul className={styles.list}>
                <li>Refund request made after 7 days of the first class</li>
                <li>Student has attended more than 2 classes of the enrolled course</li>
                <li>Course materials, notes, or recorded sessions have been accessed or downloaded</li>
                <li>Refund request due to change of mind after course commencement</li>
                <li>Poor internet connectivity or device issues on the student's end</li>
                <li>Student's failure to attend scheduled classes without prior notice</li>
                <li>Violation of our Terms & Conditions leading to account termination</li>
                <li>Free demo classes — these are complimentary and non-refundable</li>
              </ul>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>🔄 Cancellation Policy</h2>
              <ul className={styles.list}>
                <li><strong>Before Course Start:</strong> Full refund if you cancel before attending any class</li>
                <li><strong>During Course (within 7 days):</strong> Eligible for refund as per our 7-day guarantee</li>
                <li><strong>After 7 Days:</strong> No refund for cancellations; however, you may request a course transfer to a different batch</li>
                <li><strong>Course Transfer:</strong> One free batch transfer is allowed per enrollment (subject to seat availability)</li>
              </ul>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>📝 How to Request a Refund</h2>
              <p className={styles.para}>To initiate a refund, please follow these steps:</p>
              <ul className={styles.list}>
                <li><strong>Step 1:</strong> Email us at <a href="mailto:refunds@lumiskill.com" style={{color: 'var(--primary)', fontWeight: 600}}>refunds@lumiskill.com</a> with subject line: "Refund Request – [Your Name] – [Course Name]"</li>
                <li><strong>Step 2:</strong> Include your Order ID, payment receipt, registered email, and reason for refund</li>
                <li><strong>Step 3:</strong> Our team will review and respond within 2 business days</li>
                <li><strong>Step 4:</strong> Approved refunds will be processed to the original payment method within 7–10 business days</li>
              </ul>
              <div className={styles.highlight}>
                <strong>Refund Timeline:</strong> Once approved, refunds take 7–10 business days to reflect in your account depending on your bank or payment provider. UPI refunds are typically faster (1–3 days).
              </div>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>💳 Payment Failure Refunds</h2>
              <p className={styles.para}>
                If your payment fails but the amount is debited from your account (this can happen due to bank timeouts), the amount will be automatically reversed by Razorpay within <strong>5–7 business days</strong>. If you do not receive the reversal within this timeframe, please contact us with your bank statement.
              </p>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>🏫 School Partnership Refunds</h2>
              <p className={styles.para}>
                For school annual contracts and bulk enrollment packages, refund terms are governed by the specific agreement signed between LumiSkill and the institution. Please refer to your contract or contact us at <a href="mailto:schools@lumiskill.com" style={{color: 'var(--primary)', fontWeight: 600}}>schools@lumiskill.com</a> for details.
              </p>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>⚖️ Dispute Resolution</h2>
              <p className={styles.para}>
                If you are dissatisfied with our refund decision, you may escalate the matter by emailing our grievance officer at <a href="mailto:grievance@lumiskill.com" style={{color: 'var(--primary)', fontWeight: 600}}>grievance@lumiskill.com</a>. We commit to resolving all genuine disputes within 14 business days.
              </p>
              <p className={styles.para}>
                If the dispute remains unresolved, it shall be subject to the dispute resolution process outlined in our Terms & Conditions.
              </p>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>📬 Contact for Refunds</h2>
              <p className={styles.para}>For refund requests or queries, reach us through:</p>
              <div className={styles.contactBox}>
                <p>
                  <strong>LumiSkill — Refund Support</strong><br />
                  📧 Refunds: <a href="mailto:refunds@lumiskill.com">refunds@lumiskill.com</a><br />
                  📧 General: <a href="mailto:hello@lumiskill.com">hello@lumiskill.com</a><br />
                  📞 Phone: <a href="tel:+919999999999">+91-99999-99999</a><br />
                  🕐 Response Time: Within 2 business days<br />
                  📍 Online — Teaching Across India
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
