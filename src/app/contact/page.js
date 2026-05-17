'use client';
import { useState } from 'react';
import styles from './contact.module.css';

export default function ContactPage() {
  const [form, setForm] = useState({
    parentName: '', childName: '', classGrade: '', phone: '', email: '', course: '', message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={`container ${styles.heroContent}`}>
          <div className="section-tag" style={{ color: '#A78BFA', background: 'rgba(108,62,232,0.2)', border: '1px solid rgba(108,62,232,0.4)' }}>📞 Get In Touch</div>
          <h1 className={styles.heroTitle}>
            Book Your <span className={styles.heroAccent}>Free Demo Class</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Fill the form below and our academic advisor will call you within 2 hours
            to understand your child&apos;s needs and schedule a free demo class.
          </p>
          <div className={styles.heroBadges}>
            <span>✅ 100% Free</span>
            <span>⏱ 2-hour callback</span>
            <span>🎓 No commitment</span>
          </div>
        </div>
      </section>

      <section className={`section ${styles.contactSection}`}>
        <div className="container">
          <div className={styles.layout}>
            {/* Left — Form */}
            <div className={styles.formWrap}>
              {submitted ? (
                <div className={styles.success}>
                  <div className={styles.successIcon}>🎉</div>
                  <h3 className={styles.successTitle}>Request Received!</h3>
                  <p className={styles.successText}>
                    Thank you, <strong>{form.parentName}</strong>! Our academic advisor will call you
                    at <strong>{form.phone}</strong> within 2 hours to schedule your free demo class.
                  </p>
                  <p className={styles.successSub}>
                    Meanwhile, you can also reach us on WhatsApp for instant support.
                  </p>
                  <a
                    href="https://wa.me/919999999999"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary"
                  >
                    💬 Chat on WhatsApp
                  </a>
                </div>
              ) : (
                <>
                  <h2 className={styles.formTitle}>Book Free Demo Class</h2>
                  <p className={styles.formSubtitle}>Fill out the form and we&apos;ll get back to you in 2 hours.</p>
                  <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.formRow}>
                      <div className={styles.field}>
                        <label className={styles.label}>Parent&apos;s Name *</label>
                        <input
                          type="text"
                          name="parentName"
                          placeholder="Your full name"
                          value={form.parentName}
                          onChange={handleChange}
                          required
                          className={styles.input}
                        />
                      </div>
                      <div className={styles.field}>
                        <label className={styles.label}>Child&apos;s Name *</label>
                        <input
                          type="text"
                          name="childName"
                          placeholder="Child's full name"
                          value={form.childName}
                          onChange={handleChange}
                          required
                          className={styles.input}
                        />
                      </div>
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.field}>
                        <label className={styles.label}>Child&apos;s Class *</label>
                        <select name="classGrade" value={form.classGrade} onChange={handleChange} required className={styles.input}>
                          <option value="">Select class</option>
                          {[6,7,8,9,10,11,12].map(c => <option key={c} value={`Class ${c}`}>Class {c}</option>)}
                        </select>
                      </div>
                      <div className={styles.field}>
                        <label className={styles.label}>Phone Number *</label>
                        <input
                          type="tel"
                          name="phone"
                          placeholder="+91 XXXXX XXXXX"
                          value={form.phone}
                          onChange={handleChange}
                          required
                          className={styles.input}
                        />
                      </div>
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        placeholder="your@email.com"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>Interested Course</label>
                    <select name="course" value={form.course} onChange={handleChange} className={styles.input}>
                        <option value="">Not sure yet (we&apos;ll guide you)</option>
                        <optgroup label="Class 6–8 (Foundation)">
                          <option>Java Basics</option>
                          <option>Python Basics</option>
                        </optgroup>
                        <optgroup label="Class 9–10 (Core Programming)">
                          <option>Python Programming</option>
                          <option>Web Development</option>
                          <option>Java Programming</option>
                        </optgroup>
                        <optgroup label="Class 11–12 (Advanced)">
                          <option>Java &amp; DSA</option>
                          <option>AI &amp; Automation</option>
                          <option>Full Stack Web Development</option>
                        </optgroup>
                      </select>
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>Message (optional)</label>
                      <textarea
                        name="message"
                        placeholder="Any specific questions or requirements..."
                        value={form.message}
                        onChange={handleChange}
                        rows={3}
                        className={styles.textarea}
                      />
                    </div>
                    <button type="submit" className={`btn btn-primary ${styles.submitBtn}`}>
                      🎓 Book My Free Demo Class →
                    </button>
                    <p className={styles.formNote}>
                      🔒 Your information is 100% safe. We never share it with anyone.
                    </p>
                  </form>
                </>
              )}
            </div>

            {/* Right — Info */}
            <div className={styles.infoWrap}>
              <div className={styles.infoCard}>
                <h3 className={styles.infoTitle}>Contact Information</h3>
                <div className={styles.infoItems}>
                  {[
                    { icon: '📞', label: 'Phone', val: '+91-99999-99999', href: 'tel:+919999999999' },
                    { icon: '📧', label: 'Email', val: 'hello@LumiSkill.com', href: 'mailto:hello@LumiSkill.com' },
                    { icon: '💬', label: 'WhatsApp', val: 'Chat with us now', href: 'https://wa.me/919999999999' },
                    { icon: '🕐', label: 'Support Hours', val: 'Mon–Sat, 9 AM – 9 PM', href: null },
                  ].map((item, i) => (
                    <div key={i} className={styles.infoItem}>
                      <span className={styles.infoIcon}>{item.icon}</span>
                      <div>
                        <div className={styles.infoLabel}>{item.label}</div>
                        {item.href ? (
                          <a href={item.href} className={styles.infoVal}>{item.val}</a>
                        ) : (
                          <div className={styles.infoVal}>{item.val}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.processCard}>
                <h3 className={styles.processTitle}>What Happens Next?</h3>
                {[
                  { num: '1', text: 'You fill the form above' },
                  { num: '2', text: 'Our advisor calls within 2 hours' },
                  { num: '3', text: 'We understand your child\'s needs' },
                  { num: '4', text: 'Free demo class is scheduled' },
                  { num: '5', text: 'Your child starts learning! 🚀' },
                ].map((step, i) => (
                  <div key={i} className={styles.processStep}>
                    <div className={styles.processNum}>{step.num}</div>
                    <div className={styles.processText}>{step.text}</div>
                  </div>
                ))}
              </div>

              <div className={styles.trustCard}>
                <div className={styles.trustTitle}>💛 2,500+ Parents Trust Us</div>
                <div className={styles.trustRating}>⭐⭐⭐⭐⭐ 4.9/5 Rating</div>
                <div className={styles.trustQuote}>
                  &ldquo;The admission process was so smooth and the first demo class immediately impressed us!&rdquo;
                </div>
                <div className={styles.trustAuthor}>— Priya S., Parent from Delhi</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
