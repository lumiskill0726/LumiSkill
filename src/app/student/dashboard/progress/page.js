"use client";
import { useEffect, useState } from "react";
import styles from "./progress.module.css";

export default function ProgressPage() {
  const [progressReports, setProgressReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProgressReports();
  }, []);

  const fetchProgressReports = async () => {
    try {
      const response = await fetch("/api/student/dashboard");
      const data = await response.json();
      if (data.success) {
        setProgressReports(data.data.progressReports || []);
      }
    } catch (error) {
      console.error("Failed to fetch progress reports:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading progress reports...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Progress Reports</h1>
        <p className={styles.subtitle}>Track your learning journey and achievements</p>
      </div>

      {progressReports.length > 0 ? (
        <div className={styles.reportsList}>
          {progressReports.map((report) => (
            <div key={report.id} className={styles.reportCard}>
              <div className={styles.reportHeader}>
                <div>
                  <h3 className={styles.reportTitle}>{report.report_title}</h3>
                  <p className={styles.reportDate}>
                    {new Date(report.report_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className={styles.overallProgress}>
                  <div className={styles.progressCircle}>
                    <svg viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#2a2a2a" strokeWidth="10"/>
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="45" 
                        fill="none" 
                        stroke="#6C3EE8" 
                        strokeWidth="10"
                        strokeDasharray={`${report.progress_percentage * 2.827} 282.7`}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                      />
                      <text x="50" y="50" textAnchor="middle" dy="7" fill="white" fontSize="20" fontWeight="bold">
                        {report.progress_percentage}%
                      </text>
                    </svg>
                  </div>
                </div>
              </div>

              <div className={styles.statsGrid}>
                <div className={styles.statBox}>
                  <div className={styles.statIcon}>📈</div>
                  <div className={styles.statContent}>
                    <p className={styles.statLabel}>Progress</p>
                    <p className={styles.statValue}>{report.progress_percentage}%</p>
                  </div>
                </div>

                <div className={styles.statBox}>
                  <div className={styles.statIcon}>✅</div>
                  <div className={styles.statContent}>
                    <p className={styles.statLabel}>Attendance</p>
                    <p className={styles.statValue}>{report.attendance_percentage}%</p>
                  </div>
                </div>

                <div className={styles.statBox}>
                  <div className={styles.statIcon}>📋</div>
                  <div className={styles.statContent}>
                    <p className={styles.statLabel}>Assignments</p>
                    <p className={styles.statValue}>
                      {report.assignments_completed}/{report.total_assignments}
                    </p>
                  </div>
                </div>

                <div className={styles.statBox}>
                  <div className={styles.statIcon}>🏗️</div>
                  <div className={styles.statContent}>
                    <p className={styles.statLabel}>Projects</p>
                    <p className={styles.statValue}>
                      {report.projects_completed}/{report.total_projects}
                    </p>
                  </div>
                </div>
              </div>

              {report.report_text && (
                <div className={styles.reportSection}>
                  <h4 className={styles.sectionTitle}>Report Summary</h4>
                  <p className={styles.reportText}>{report.report_text}</p>
                </div>
              )}

              {report.mentor_feedback && (
                <div className={styles.reportSection}>
                  <h4 className={styles.sectionTitle}>💬 Mentor Feedback</h4>
                  <p className={styles.feedbackText}>{report.mentor_feedback}</p>
                </div>
              )}

              {report.strengths && (
                <div className={styles.reportSection}>
                  <h4 className={styles.sectionTitle}>💪 Strengths</h4>
                  <p className={styles.strengthsText}>{report.strengths}</p>
                </div>
              )}

              {report.areas_to_improve && (
                <div className={styles.reportSection}>
                  <h4 className={styles.sectionTitle}>🎯 Areas to Improve</h4>
                  <p className={styles.improveText}>{report.areas_to_improve}</p>
                </div>
              )}

              {report.next_steps && (
                <div className={styles.reportSection}>
                  <h4 className={styles.sectionTitle}>🚀 Next Steps</h4>
                  <p className={styles.nextStepsText}>{report.next_steps}</p>
                </div>
              )}

              <div className={styles.reportFooter}>
                <span className={styles.createdBy}>Created by: {report.created_by}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📊</div>
          <h3>No Progress Reports Yet</h3>
          <p>Your mentor will share progress reports as you advance in your course</p>
        </div>
      )}
    </div>
  );
}
