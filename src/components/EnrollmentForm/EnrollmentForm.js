'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './EnrollmentForm.module.css';

export default function EnrollmentForm({ courseName, courseSlug, priceDisplay }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    studentName: '',
    parentName: '',
    email: '',
    phone: '',
    studentClass: '',
  });
  const [error, setError] = useState('');

  const numericAmount = parseInt(priceDisplay?.replace(/[₹,]/g, '') || '0');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.studentName || !form.parentName || !form.email || !form.phone || !form.studentClass) {
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
      // Load Razorpay script
      const res = await loadRazorpayScript();
      if (!res) {
        alert('Razorpay SDK failed to load. Please check your internet connection.');
        setLoading(false);
        return;
      }

      // Create order
      const orderResponse = await fetch('/api/razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: numericAmount,
          courseName,
          studentName: form.studentName,
          parentName: form.parentName,
          email: form.email,
          phone: form.phone,
          studentClass: form.studentClass,
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderData.id) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      // Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'LumiSkill',
        description: courseName,
        image: 'https://www.lumiskill.com/logo-white.png',
        order_id: orderData.id,
        prefill: {
          name: form.studentName,
          email: form.email,
          contact: form.phone,
        },
        notes: {
          courseName,
          courseSlug,
          studentName: form.studentName,
          parentName: form.parentName,
          studentClass: form.studentClass,
        },
        theme: {
          color: '#6C3EE8',
        },
        handler: async function (response) {
          try {
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                courseName,
                courseSlug,
                studentName: form.studentName,
                parentName: form.parentName,
                email: form.email,
                phone: form.phone,
                studentClass: form.studentClass,
                amount: orderData.amount,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              router.push(`/payment/success?paymentId=${response.razorpay_payment_id}`);
            } else {
              router.push('/payment/failure');
            }
          } catch (err) {
            console.error('Verification error:', err);
            router.push('/payment/failure');
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        setError(`Payment failed: ${response.error.description}`);
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.formTitle}>Student & Parent Details</h2>

      <div className={styles.field}>
        <label className={styles.label}>Student's Full Name *</label>
        <input
          type="text"
          name="studentName"
          value={form.studentName}
          onChange={handleChange}
          placeholder="e.g. Arjun Sharma"
          className={styles.input}
          required
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Parent's Full Name *</label>
        <input
          type="text"
          name="parentName"
          value={form.parentName}
          onChange={handleChange}
          placeholder="e.g. Rajesh Sharma"
          className={styles.input}
          required
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Parent's Email *</label>
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

      <div className={styles.field}>
        <label className={styles.label}>Student's Class *</label>
        <select
          name="studentClass"
          value={form.studentClass}
          onChange={handleChange}
          className={styles.input}
          required
        >
          <option value="">Select Class</option>
          <option value="6">Class 6</option>
          <option value="7">Class 7</option>
          <option value="8">Class 8</option>
          <option value="9">Class 9</option>
          <option value="10">Class 10</option>
          <option value="11">Class 11</option>
          <option value="12">Class 12</option>
        </select>
      </div>

      {error && <p className={styles.error}>⚠️ {error}</p>}

      <button type="submit" className={styles.submitBtn} disabled={loading}>
        {loading ? '⏳ Opening Payment...' : `Pay ${priceDisplay} Securely`}
      </button>

      <div className={styles.trust}>
        <span>🔒 256-bit SSL Encryption</span>
        <span>⚡ Powered by Razorpay</span>
        <span>✅ UPI · Cards · NetBanking · Wallets</span>
      </div>

      <p className={styles.refundNote}>
        7-day money-back guarantee. See our <a href="/refund" target="_blank">Refund Policy</a>.
      </p>
    </form>
  );
}
