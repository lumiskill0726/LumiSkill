"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./courses.module.css";

export default function CoursesPage() {
  const [enrollments, setEnrollments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch("/api/student/dashboard");
      const data = await response.json();
      if (data.success) {
        setEnrollments(data.data.enrollments || []);
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading courses...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>My Courses</h1>
          <p className={styles.subtitle}>View and manage your enrolled courses</p>
        </div>
        <Link href="/courses" className={styles.browseBtn}>
          Browse More Courses
        </Link>
      </div>

      {enrollments.length > 0 ? (
        <div className={styles.coursesList}>
          {enrollments.map((enrollment) => {
            const endDate = new Date(enrollment.end_date);
            const today = new Date();
            const daysLeft = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
            const monthsLeft = Math.ceil(daysLeft / 30);
            const isExpired = daysLeft < 0;

            return (
              <div key={enrollment.id} className={styles.courseCard}>
                <div className={styles.courseHeader}>
                  <div className={styles.courseIcon}>
                    {enrollment.course_level === 'Beginner' ? '🎮' : 
                     enrollment.course_level === 'Intermediate' ? '💻' : '🚀'}
                  </div>
                  <div className={styles.courseHeaderInfo}>
                    <h3 className={styles.courseName}>{enrollment.course_name}</h3>
                    <div className={styles.courseMeta}>
                      <span className={styles.courseLevel}>{enrollment.course_level}</span>
                      <span className={styles.courseDuration}>
                        6 Months
                      </span>
                      <span className={`${styles.statusBadge} ${styles[enrollment.status]}`}>
                        {enrollment.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={styles.courseBody}>
                  <div className={styles.statsRow}>
                    <div className={styles.statItem}>
                      <span className={styles.statIcon}>📅</span>
                      <div>
                        <p className={styles.statLabel}>Start Date</p>
                        <p className={styles.statValue}>
                          {new Date(enrollment.enrollment_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    <div className={styles.statItem}>
                      <span className={styles.statIcon}>🎯</span>
                      <div>
                        <p className={styles.statLabel}>End Date</p>
                        <p className={styles.statValue}>
                          {new Date(enrollment.end_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    <div className={styles.statItem}>
                      <span className={styles.statIcon}>⏱️</span>
                      <div>
                        <p className={styles.statLabel}>Time Left</p>
                        <p className={`${styles.statValue} ${isExpired ? styles.expired : ''}`}>
                          {isExpired ? 'Expired' : `${monthsLeft} months`}
                        </p>
                      </div>
                    </div>

                    <div className={styles.statItem}>
                      <span className={styles.statIcon}>💰</span>
                      <div>
                        <p className={styles.statLabel}>Amount Paid</p>
                        <p className={styles.statValue}>₹{enrollment.amount_paid}</p>
                      </div>
                    </div>
                  </div>

                  {enrollment.payment_id && (
                    <div className={styles.paymentInfo}>
                      <span className={styles.paymentLabel}>Payment ID:</span>
                      <span className={styles.paymentId}>{enrollment.payment_id}</span>
                      <span className={`${styles.paymentStatus} ${styles[enrollment.payment_status]}`}>
                        {enrollment.payment_status}
                      </span>
                    </div>
                  )}
                </div>

                <div className={styles.courseFooter}>
                  <div className={styles.enrollmentDate}>
                    Enrolled on {new Date(enrollment.enrollment_date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                  <div className={styles.courseActions}>
                    <Link href="/student/dashboard/syllabus" className={styles.actionBtn}>
                      View Syllabus
                    </Link>
                    <Link href="/student/dashboard/progress" className={styles.actionBtn}>
                      View Progress
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📚</div>
          <h3>No Courses Enrolled</h3>
          <p>You haven't enrolled in any courses yet</p>
          <Link href="/courses" className={styles.browseCourses}>
            Browse Available Courses
          </Link>
        </div>
      )}
    </div>
  );
}
