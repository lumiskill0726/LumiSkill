import styles from '../legal.module.css';

export const metadata = {
  title: 'Terms & Conditions | LumiSkill',
  description: 'LumiSkill Terms and Conditions — please read these terms carefully before enrolling in our courses.',
  alternates: { canonical: 'https://www.lumiskill.com/terms' },
};

export default function TermsPage() {
  return (
    <>
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroTag}>📄 Legal</div>
          <h1 className={styles.heroTitle}>Terms & Conditions</h1>
          <p className={styles.heroMeta}>Last updated: June 1, 2025 &nbsp;|&nbsp; Effective: June 1, 2025</p>
        </div>
      </section>

      <section className={styles.content}>
        <div className="container">
          <div className={styles.wrapper}>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>📋 Agreement to Terms</h2>
              <p className={styles.para}>
                These Terms and Conditions constitute a legally binding agreement between you ("Student", "Parent", "Guardian", or "User") and <strong>LumiSkill</strong> ("Company", "we", "us", or "our") regarding your access to and use of our website <strong>www.lumiskill.com</strong> and online coding education services.
              </p>
              <p className={styles.para}>
                By enrolling in any course, making a payment, or accessing our website, you confirm that you have read, understood, and agree to be bound by these Terms. If you do not agree, you must not use our services.
              </p>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>🎓 Our Services</h2>
              <p className={styles.para}>LumiSkill provides online coding education services including:</p>
              <ul className={styles.list}>
                <li>Live online coding classes for students in Class 6–12</li>
                <li>Recorded supplementary learning materials</li>
                <li>Project-based assignments and assessments</li>
                <li>Mentorship sessions with expert instructors</li>
                <li>Course completion certificates</li>
                <li>Community access via WhatsApp and Discord</li>
              </ul>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>👤 Eligibility & Registration</h2>
              <ul className={styles.list}>
                <li>Our courses are designed for students aged 11–18 years (Class 6–12)</li>
                <li>Enrollment requires accurate personal information including name, age, contact details, and current class</li>
                <li>Students under 18 must have parental or guardian consent to enroll</li>
                <li>You are responsible for maintaining the confidentiality of your account login credentials</li>
                <li>One enrollment grants access to one student only — accounts are non-transferable</li>
              </ul>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>💳 Payment Terms</h2>
              <ul className={styles.list}>
                <li>All course fees are displayed in Indian Rupees (INR) and include applicable taxes</li>
                <li>Payments are processed securely through <strong>Razorpay</strong> — a PCI-DSS compliant payment gateway</li>
                <li>We accept UPI, Credit/Debit Cards, Net Banking, and Wallets via Razorpay</li>
                <li>Course access is activated only upon successful payment confirmation</li>
                <li>In case of payment failure, no amount will be deducted; if deducted, it will be auto-refunded within 5–7 business days</li>
                <li>LumiSkill reserves the right to modify course fees. Changes will not affect existing enrollments</li>
              </ul>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>📚 Course Access & Usage</h2>
              <ul className={styles.list}>
                <li>Upon enrollment, students receive access to course materials for the duration of their program</li>
                <li>Course content (videos, notes, projects) is for personal, non-commercial educational use only</li>
                <li>Sharing, redistributing, reselling, or republishing any course content is strictly prohibited</li>
                <li>Screen recording of live classes is not permitted without prior written consent</li>
                <li>LumiSkill reserves the right to modify, update, or discontinue course content to improve quality</li>
              </ul>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>🤝 Student Conduct</h2>
              <p className={styles.para}>Students are expected to:</p>
              <ul className={styles.list}>
                <li>Attend classes punctually and engage respectfully with instructors and peers</li>
                <li>Not engage in cheating, plagiarism, or academic dishonesty</li>
                <li>Not use offensive, abusive, or inappropriate language in any LumiSkill community</li>
                <li>Not share login credentials or course access with others</li>
                <li>Report technical issues promptly to support</li>
              </ul>
              <div className={styles.highlight}>
                LumiSkill reserves the right to terminate enrollment without refund if a student violates these conduct standards.
              </div>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>🔄 Rescheduling & Class Cancellations</h2>
              <ul className={styles.list}>
                <li>If LumiSkill cancels a scheduled class, a makeup session will be arranged within 7 days</li>
                <li>Students may request to reschedule classes with 24-hour advance notice (subject to availability)</li>
                <li>Repeated no-shows without notice may affect class scheduling priority</li>
              </ul>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>🏆 Certificates</h2>
              <p className={styles.para}>
                Certificates of completion are awarded upon successful completion of the course, including a minimum attendance of 75% and submission of assigned projects. LumiSkill certificates are issued for educational recognition and do not constitute a professional qualification unless specified.
              </p>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>🛡️ Intellectual Property</h2>
              <p className={styles.para}>
                All content on www.lumiskill.com including but not limited to course materials, videos, notes, logos, designs, and code examples are the intellectual property of LumiSkill. Unauthorized use, reproduction, or distribution of any content is strictly prohibited and may result in legal action.
              </p>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>⚠️ Limitation of Liability</h2>
              <p className={styles.para}>
                To the maximum extent permitted by law, LumiSkill shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our services. Our total liability shall not exceed the amount paid by you for the specific course in question.
              </p>
              <p className={styles.para}>
                LumiSkill does not guarantee specific career outcomes or job placements as a result of course completion.
              </p>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>🌏 Governing Law & Dispute Resolution</h2>
              <p className={styles.para}>
                These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from these Terms shall first be attempted to be resolved through mutual discussion. If unresolved, disputes shall be subject to the exclusive jurisdiction of courts in India.
              </p>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>📝 Modifications to Terms</h2>
              <p className={styles.para}>
                LumiSkill reserves the right to modify these Terms at any time. Updated Terms will be posted on this page with a revised effective date. Continued use of our services after changes constitutes acceptance of the updated Terms.
              </p>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>📬 Contact Us</h2>
              <p className={styles.para}>For any questions regarding these Terms, please reach out:</p>
              <div className={styles.contactBox}>
                <p>
                  <strong>LumiSkill</strong><br />
                  📧 Email: <a href="mailto:hello@lumiskill.com">hello@lumiskill.com</a><br />
                  📞 Phone: <a href="tel:+919999999999">+91-99999-99999</a><br />
                  🌐 Website: <a href="https://www.lumiskill.com">www.lumiskill.com</a><br />
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
