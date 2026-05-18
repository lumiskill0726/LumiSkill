import styles from '../legal.module.css';

export const metadata = {
  title: 'Privacy Policy | LumiSkill',
  description: 'LumiSkill Privacy Policy — how we collect, use, and protect your personal information.',
  alternates: { canonical: 'https://www.lumiskill.com/privacy' },
};

export default function PrivacyPage() {
  return (
    <>
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroTag}>🔒 Legal</div>
          <h1 className={styles.heroTitle}>Privacy Policy</h1>
          <p className={styles.heroMeta}>Last updated: June 1, 2025 &nbsp;|&nbsp; Effective: June 1, 2025</p>
        </div>
      </section>

      <section className={styles.content}>
        <div className="container">
          <div className={styles.wrapper}>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>📋 Introduction</h2>
              <p className={styles.para}>
                LumiSkill ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website <strong>www.lumiskill.com</strong> and use our online coding education services.
              </p>
              <p className={styles.para}>
                By using our website or enrolling in our courses, you agree to the collection and use of information in accordance with this policy. If you do not agree, please do not use our services.
              </p>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>📥 Information We Collect</h2>
              <p className={styles.para}>We collect the following types of information:</p>
              <ul className={styles.list}>
                <li><strong>Personal Information:</strong> Name, email address, phone number, and student's class/age provided during registration or contact forms.</li>
                <li><strong>Payment Information:</strong> Payment is processed securely through Razorpay. We do not store your card details, UPI, or bank account information on our servers.</li>
                <li><strong>Usage Data:</strong> Browser type, pages visited, time spent, IP address, and device information collected automatically.</li>
                <li><strong>Communication Data:</strong> Messages sent via contact forms, WhatsApp, or email.</li>
                <li><strong>Student Progress Data:</strong> Course completion, assignment submissions, and performance data for enrolled students.</li>
              </ul>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>🎯 How We Use Your Information</h2>
              <ul className={styles.list}>
                <li>To enroll you in courses and provide access to learning materials</li>
                <li>To process payments securely via Razorpay</li>
                <li>To send course updates, class schedules, and progress reports to parents</li>
                <li>To respond to inquiries and provide customer support</li>
                <li>To send promotional offers (you may opt out at any time)</li>
                <li>To improve our website, courses, and services</li>
                <li>To comply with legal obligations</li>
              </ul>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>🤝 Third-Party Services</h2>
              <p className={styles.para}>We use trusted third-party services to operate our business:</p>
              <ul className={styles.list}>
                <li><strong>Razorpay</strong> — Payment processing (PCI-DSS compliant). View their privacy policy at razorpay.com/privacy</li>
                <li><strong>Google Analytics</strong> — Website traffic analysis (anonymized)</li>
                <li><strong>Zoom / Google Meet</strong> — Live online classes</li>
                <li><strong>WhatsApp / Discord</strong> — Student support communities</li>
                <li><strong>Google Classroom</strong> — Course materials and assignments</li>
              </ul>
              <p className={styles.para}>These third parties have their own privacy policies, and we encourage you to review them.</p>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>🍪 Cookies</h2>
              <p className={styles.para}>
                We use cookies and similar tracking technologies to improve your browsing experience. Cookies are small files stored on your device. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
              </p>
              <p className={styles.para}>
                We use session cookies (expire when browser closes) and persistent cookies (remain until deleted) for analytics and user preferences.
              </p>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>🔐 Data Security</h2>
              <p className={styles.para}>
                We implement industry-standard security measures including SSL/TLS encryption, secure servers, and access controls to protect your personal data. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
              </p>
              <div className={styles.highlight}>
                <strong>Payment Security:</strong> All payment transactions are encrypted and processed through Razorpay's secure payment gateway. LumiSkill never stores your payment card details.
              </div>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>👶 Children's Privacy</h2>
              <p className={styles.para}>
                Our services are designed for students aged 11–18 (Class 6–12). We collect information about minors only with verifiable parental or guardian consent. Parents and guardians may request access to, correction of, or deletion of their child's personal information by contacting us.
              </p>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>⚖️ Your Rights</h2>
              <ul className={styles.list}>
                <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
                <li><strong>Correction:</strong> Request correction of inaccurate personal data</li>
                <li><strong>Deletion:</strong> Request deletion of your personal data (subject to legal requirements)</li>
                <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications at any time</li>
                <li><strong>Portability:</strong> Request transfer of your data in a machine-readable format</li>
              </ul>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>🌏 Governing Law</h2>
              <p className={styles.para}>
                This Privacy Policy is governed by the laws of India, including the Information Technology Act, 2000, and the Information Technology (Amendment) Act, 2008. Any disputes arising under this policy shall be subject to the exclusive jurisdiction of courts in India.
              </p>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>📝 Changes to This Policy</h2>
              <p className={styles.para}>
                We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date. We encourage you to review this policy periodically.
              </p>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>📬 Contact Us</h2>
              <p className={styles.para}>If you have any questions about this Privacy Policy, please contact us:</p>
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
