"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "./success.module.css";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("paymentId");

  useEffect(() => {
    // Confetti effect (optional)
    if (typeof window !== "undefined") {
      // You can add confetti library here if needed
    }
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <div className={styles.successIcon}>✓</div>
        </div>

        <h1 className={styles.title}>Payment Successful!</h1>
        <p className={styles.message}>
          Congratulations! Your course enrollment has been confirmed.
        </p>

        {paymentId && (
          <div className={styles.paymentInfo}>
            <p className={styles.label}>Payment ID:</p>
            <p className={styles.paymentId}>{paymentId}</p>
          </div>
        )}

        <div className={styles.infoBox}>
          <h3 className={styles.infoTitle}>What's Next?</h3>
          <ul className={styles.infoList}>
            <li>✓ Check your email for course access details</li>
            <li>✓ Login to your student dashboard</li>
            <li>✓ Start learning immediately</li>
            <li>✓ Join our community Discord server</li>
          </ul>
        </div>

        <div className={styles.actions}>
          <Link href="/student/login" className={styles.primaryBtn}>
            Go to Student Dashboard
          </Link>
          <Link href="/" className={styles.secondaryBtn}>
            Back to Home
          </Link>
        </div>

        <p className={styles.support}>
          Need help? Contact us at{" "}
          <a href="mailto:info@lumiskill.com">info@lumiskill.com</a>
        </p>
      </div>
    </div>
  );
}
