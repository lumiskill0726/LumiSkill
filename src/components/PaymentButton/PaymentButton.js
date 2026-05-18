'use client';
import { useState } from 'react';
import styles from './PaymentButton.module.css';

export default function PaymentButton({ courseName, amount, priceDisplay, className = '' }) {
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [error, setError] = useState('');

  // Strip ₹ and commas to get numeric value e.g. "₹4,999" → 4999
  const numericAmount = amount || parseInt(priceDisplay?.replace(/[₹,]/g, '') || '0');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handlePay = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      setError('Please fill in all fields to continue.');
      return;
    }
    if (!/^\d{10}$/.test(form.phone)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Step 1: Create order on server
      const res = await fetch('/api/razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: numericAmount,
          courseName,
          studentName: form.name,
        }),
      });

      const order = await res.json();
      if (!res.ok || order.error) throw new Error(order.error || 'Order creation failed');

      // Step 2: Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'LumiSkill',
        description: courseName,
        image: 'https://www.lumiskill.com/logo.png',
        order_id: order.id,
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        notes: { courseName },
        theme: { color: '#6C3EE8' },
        handler: function (response) {
          // Payment successful
          setShowForm(false);
          alert(`🎉 Payment successful! Your enrollment for ${courseName} is confirmed.\n\nPayment ID: ${response.razorpay_payment_id}\n\nOur team will contact you within 24 hours with class details.`);
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      // Load Razorpay script if not already loaded
      if (!window.Razorpay) {
        await loadRazorpayScript();
      }

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        setError(`Payment failed: ${response.error.description}. Please try again.`);
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className={`btn btn-primary ${styles.payBtn} ${className}`}
        onClick={() => setShowForm(true)}
      >
        💳 Enroll & Pay Now
      </button>

      {/* Modal */}
      {showForm && (
        <div className={styles.overlay} onClick={(e) => { if (e.target === e.currentTarget) { setShowForm(false); setLoading(false); } }}>
          <div className={styles.modal}>
            <button className={styles.closeBtn} onClick={() => { setShowForm(false); setLoading(false); }}>✕</button>

            <div className={styles.modalHeader}>
              <div className={styles.modalIcon}>💳</div>
              <h3 className={styles.modalTitle}>Enroll in {courseName}</h3>
              <div className={styles.modalPrice}>{priceDisplay || `₹${numericAmount.toLocaleString('en-IN')}`} <span>one-time fee</span></div>
            </div>

            <form onSubmit={handlePay} className={styles.form}>
              <div className={styles.field}>
                <label className={styles.label}>Student&apos;s Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Arjun Sharma"
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Parent&apos;s Email *</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="parent@example.com"
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>WhatsApp Mobile Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  className={styles.input}
                  maxLength={10}
                  required
                />
              </div>

              {error && <p className={styles.error}>⚠️ {error}</p>}

              <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
                {loading ? '⏳ Opening Payment...' : `Pay ${priceDisplay || `₹${numericAmount.toLocaleString('en-IN')}`} Securely`}
              </button>

              <div className={styles.trust}>
                <span>🔒 256-bit SSL</span>
                <span>⚡ Powered by Razorpay</span>
                <span>✅ UPI · Cards · NetBanking</span>
              </div>
              <p className={styles.refundNote}>
                7-day money-back guarantee. See our <a href="/refund" target="_blank">Refund Policy</a>.
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
}
