"use client";
import Link from "next/link";
import styles from "./failure.module.css";

export default function PaymentFailurePage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <div className={styles.failureIcon}>✕</div>
        </div>

        <h1 className={styles.title}>Payment Failed</h1>
        <p className={styles.message}>
          We couldn't process your payment. Don't worry, no money has been deducted from your account.
        </p>

        <div className={styles.infoBox}>
          <h3 className={styles.infoTitle}>Common Reasons:</h3>
          <ul className={styles.infoList}>
            <li>• Insufficient balance in account</li>
            <li>• Payment cancelled by user</li>
            <li>• Network connectivity issues</li>
            <li>• Bank declined the transaction</li>
          </ul>
        </div>

        <div className={styles.actions}>
          <Link href="/checkout" className={styles.primaryBtn}>
            Try Again
          </Link>
          <Link href="/" className={styles.secondaryBtn}>
            Back to Home
          </Link>
        </div>

        <p className={styles.support}>
          Need help? Contact us at{" "}
          <a href="mailto:info@lumiskill.com">info@lumiskill.com</a> or call{" "}
          <a href="tel:+917021217553">+91-70212-17553</a>
        </p>
      </div>
    </div>
  );
}
