'use client';
import { useState } from 'react';
import styles from './FAQ.module.css';

const faqs = [
  {
    q: 'What is the right age to start coding?',
    a: "The best age to start is Class 6 (around 11 years). At LumiSkill, we have programs starting from Class 6 with fun, age-appropriate content. The earlier a child starts, the stronger their logical thinking becomes. But it's never too late — even Class 12 students benefit enormously!",
  },
  {
    q: 'Do my child need any prior coding experience?',
    a: 'Absolutely not! Our beginner courses are designed from ground zero. We start with the very basics — what is a computer, how does code work — and gradually move to complex projects. No experience needed at all.',
  },
  {
    q: 'How are the live classes conducted?',
    a: 'Classes are conducted via Zoom/Google Meet with screen sharing and live coding. Students can ask questions anytime during the session. All classes are recorded and shared within 24 hours for revision. Batch size is max 15 students for personalized attention.',
  },
  {
    q: 'What happens if my child misses a class?',
    a: "No worries! Every class is recorded and shared with the student within 24 hours. Your child can watch the recording and catch up. Additionally, we offer a free doubt-clearing session every weekend for students who miss classes or need extra help.",
  },
  {
    q: 'Will coding affect my child\'s school studies?',
    a: "Actually, it's the opposite! Coding improves logical thinking, problem-solving, and mathematics. Our classes are scheduled on weekends and evenings to ensure there's no conflict with school hours. Most parents report improved school performance after joining.",
  },
  {
    q: 'What certificate will my child receive?',
    a: 'Students receive industry-recognized certificates upon completing each course. For premium plans, they receive certificates co-branded with our industry partners. These certificates are valued by colleges and can be added to college applications, CVs, and portfolios.',
  },
  {
    q: 'What is the refund policy?',
    a: "We offer a 7-day money-back guarantee — no questions asked. If your child doesn't like the classes in the first 7 days, we'll refund the full amount. We're that confident in our quality!",
  },
  {
    q: 'Can schools or coaching centres partner with LumiSkill?',
    a: 'Yes! We actively partner with schools to set up coding labs, run AI workshops, and provide teacher training programs. We offer annual contracts and per-student pricing models. Contact us at schools@LumiSkill.com for partnership details.',
  },
  {
    q: 'What devices does my child need?',
    a: "A laptop or desktop computer with a stable internet connection is recommended. A tablet may work for beginner courses but is not ideal for coding. We'll help you set up all required free software before the first class.",
  },
  {
    q: 'How quickly will results show?',
    a: "Most students complete their first mini-project within the first 2–3 classes! By the end of month 1, they'll have built something they can show their friends and family. Full skill development happens over the course duration (2–5 months).",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className={`section ${styles.faq}`} id="faq">
      <div className="container">
        <div className={styles.layout}>
          {/* Left */}
          <div className={styles.left}>
            <div className="section-tag">❓ FAQ</div>
            <h2 className="section-title">
              Questions Parents <span>Ask Us Most</span>
            </h2>
            <p className="section-subtitle">
              We understand that choosing the right learning platform for your child
              is a big decision. Here are the most common questions parents ask us.
            </p>

            <div className={styles.leftCard}>
              <div className={styles.leftCardIcon}>💬</div>
              <div>
                <div className={styles.leftCardTitle}>Still have questions?</div>
                <div className={styles.leftCardText}>
                  Chat with us on WhatsApp — we reply within 5 minutes!
                </div>
                <a
                  href="https://wa.me/919999999999"
                  target="_blank"
                  rel="noreferrer"
                  className={`btn btn-primary ${styles.leftCardBtn}`}
                >
                  💬 Chat on WhatsApp
                </a>
              </div>
            </div>

            <div className={styles.leftCard}>
              <div className={styles.leftCardIcon}>📞</div>
              <div>
                <div className={styles.leftCardTitle}>Book a Free Counselling Call</div>
                <div className={styles.leftCardText}>
                  Talk to our academic advisor about the best course for your child.
                </div>
                <a
                  href="tel:+919999999999"
                  className={`btn btn-outline ${styles.leftCardBtn}`}
                >
                  📞 Call Now
                </a>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className={styles.right}>
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`${styles.faqItem} ${openIndex === i ? styles.open : ''}`}
              >
                <button
                  className={styles.faqQuestion}
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                >
                  <span>{faq.q}</span>
                  <span className={styles.faqIcon}>
                    {openIndex === i ? '−' : '+'}
                  </span>
                </button>
                <div className={styles.faqAnswer}>
                  <p>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
