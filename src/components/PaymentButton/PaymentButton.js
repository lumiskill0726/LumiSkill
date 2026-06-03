'use client';
import { useRouter, usePathname } from 'next/navigation';
import styles from './PaymentButton.module.css';

export default function PaymentButton({ courseName, amount, priceDisplay, className = '' }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = () => {
    // Extract course slug from pathname (e.g., /courses/java-basics -> java-basics)
    const slug = pathname.split('/').pop();
    router.push(`/enroll/${slug}`);
  };

  return (
    <button
      className={`btn btn-primary ${styles.payBtn} ${className}`}
      onClick={handleClick}
    >
      💳 Enroll & Pay Now
    </button>
  );
}
 