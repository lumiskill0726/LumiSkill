"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

export default function StudentDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/student/dashboard");
      const data = await response.json();

      if (data.success) {
        setDashboardData(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  const { enrollments = [], notices = [], progressReports = [], syllabus = [] } = dashboardData || {};
  const activeEnrollment = enrollments.find(e => e.status === 'active');

  return (
    <div className={styles.dashboard}>
      {/* Welcome Banner */}
      <div className={styles.welcomeBanner}>
        <div className={styles.bannerContent}>
          <h2 className={styles.bannerTitle}>Welcome Back! 🎉</h2>
          <p className={styles.bannerText}>
            Continue your learning journey and track your progress
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.statCardPurple}`}>
          <div className={styles.statIcon}>📚</div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Enrolled Courses</p>
            <h3 className={styles.statValue}>{enrollments.length}</h3>
            <p className={styles.statChange}>
              {enrollments.filter(e => e.status === 'active').length} active
            </p>
          </div>
        </div>

        {activeEnrollment && (
          <>
            <div className={`${styles.statCard} ${styles.statCardBlue}`}>
              <div className={styles.statIcon}>📅</div>
              <div className={styles.statContent}>
                <p className={styles.statLabel}>Days Left</p>
                <h3 className={styles.statValue}>{activeEnrollment.days_left}</h3>
                <p className={styles.statChange}>
                  {activeEnrollment.months_left} months remaining
                </p>
              </div>
            </div>

            <div className={`${styles.statCard} ${styles.statCardGreen}`}>
              <div className={styles.statIcon}>📈</div>
              <div className={styles.statContent}>
                <p className={styles.statLabel}>Progress</p>
                <h3 className={styles.statValue}>
                  {progressReports[0]?.progress_percentage || 0}%
                </h3>
                <p className={styles.statChange}>Overall completion</p>
              </div>
            </div>
          </>
        )}

        <div className={`${styles.statCard} ${styles.statCardOrange}`}>
          <div className={styles.statIcon}>📢</div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>New Notices</p>
            <h3 className={styles.statValue}>{notices.length}</h3>
            <p className={styles.statChange}>Unread</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className={styles.contentGrid}>
        {/* My Courses */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>My Courses</h3>
            <Link href="/student/dashboard/courses" className={styles.viewAllLink}>
              View All →
            </Link>
          </div>

          {enrollments.length > 0 ? (
            <div className={styles.coursesList}>
              {enrollments.map((enrollment) => (
                <div key={enrollment.id} className={styles.courseCard}>
                  <div className={styles.courseHeader}>
                    <div className={styles.courseIcon}>
                      {enrollment.course_level === 'Beginner' ? '🎮' : 
                       enrollment.course_level === 'Intermediate' ? '💻' : '🚀'}
                    </div>
                    <span className={`${styles.courseBadge} ${styles[`badge${enrollment.status}`]}`}>
                      {enrollment.status}
                    </span>
                  </div>
                  <h4 className={styles.courseTitle}>{enrollment.course_name}</h4>
                  <p className={styles.courseLevel}>{enrollment.course_level}</p>
                  <div className={styles.courseFooter}>
                    <div className={styles.courseDuration}>
                      📅 {enrollment.course_duration_months} months
                    </div>
                    {!enrollment.is_expired && (
                      <div className={styles.courseDaysLeft}>
                        {enrollment.days_left} days left
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>No courses enrolled yet</p>
              <Link href="/courses" className={styles.browseBtn}>
                Browse Courses
              </Link>
            </div>
          )}
        </div>

        {/* Recent Notices */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Recent Notices</h3>
            <Link href="/student/dashboard/notices" className={styles.viewAllLink}>
              View All →
            </Link>
          </div>

          {notices.length > 0 ? (
            <div className={styles.noticesList}>
              {notices.slice(0, 3).map((notice) => (
                <div key={notice.id} className={styles.noticeCard}>
                  <div className={styles.noticeHeader}>
                    <span className={`${styles.noticeType} ${styles[`type${notice.notice_type}`]}`}>
                      {notice.notice_type === 'urgent' ? '🚨' :
                       notice.notice_type === 'announcement' ? '📢' :
                       notice.notice_type === 'holiday' ? '🎉' : '📝'}
                    </span>
                    <span className={styles.noticeDate}>
                      {new Date(notice.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className={styles.noticeTitle}>{notice.title}</h4>
                  <p className={styles.noticeMessage}>
                    {notice.message.substring(0, 100)}
                    {notice.message.length > 100 ? '...' : ''}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>No notices available</p>
            </div>
          )}
        </div>
      </div>

      {/* Progress Reports */}
      {progressReports.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Latest Progress Report</h3>
            <Link href="/student/dashboard/progress" className={styles.viewAllLink}>
              View All →
            </Link>
          </div>

          <div className={styles.progressCard}>
            <div className={styles.progressHeader}>
              <h4 className={styles.progressTitle}>{progressReports[0].report_title}</h4>
              <span className={styles.progressDate}>
                {new Date(progressReports[0].report_date).toLocaleDateString()}
              </span>
            </div>
            <div className={styles.progressStats}>
              <div className={styles.progressStat}>
                <span className={styles.progressLabel}>Progress</span>
                <span className={styles.progressValue}>
                  {progressReports[0].progress_percentage}%
                </span>
              </div>
              <div className={styles.progressStat}>
                <span className={styles.progressLabel}>Attendance</span>
                <span className={styles.progressValue}>
                  {progressReports[0].attendance_percentage}%
                </span>
              </div>
              <div className={styles.progressStat}>
                <span className={styles.progressLabel}>Assignments</span>
                <span className={styles.progressValue}>
                  {progressReports[0].assignments_completed}/{progressReports[0].total_assignments}
                </span>
              </div>
            </div>
            {progressReports[0].mentor_feedback && (
              <div className={styles.progressFeedback}>
                <p className={styles.feedbackLabel}>Mentor Feedback:</p>
                <p className={styles.feedbackText}>{progressReports[0].mentor_feedback}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className={styles.quickActions}>
        <h3 className={styles.sectionTitle}>Quick Actions</h3>
        <div className={styles.actionsGrid}>
          <Link href="/student/dashboard/syllabus" className={styles.actionCard}>
            <span className={styles.actionIcon}>📝</span>
            <span className={styles.actionLabel}>View Syllabus</span>
          </Link>
          <Link href="/student/dashboard/attendance" className={styles.actionCard}>
            <span className={styles.actionIcon}>✅</span>
            <span className={styles.actionLabel}>Check Attendance</span>
          </Link>
          <Link href="/student/dashboard/assignments" className={styles.actionCard}>
            <span className={styles.actionIcon}>📋</span>
            <span className={styles.actionLabel}>View Assignments</span>
          </Link>
          <button className={styles.actionCard} onClick={fetchDashboardData}>
            <span className={styles.actionIcon}>🔄</span>
            <span className={styles.actionLabel}>Refresh Data</span>
          </button>
        </div>
      </div>
    </div>
  );
}
