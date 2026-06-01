"use client";
import { useEffect, useState } from "react";
import styles from "./syllabus.module.css";

export default function SyllabusPage() {
  const [syllabusData, setSyllabusData] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSyllabusData();
  }, []);

  const fetchSyllabusData = async () => {
    try {
      const response = await fetch("/api/student/dashboard");
      const data = await response.json();
      if (data.success) {
        setSyllabusData(data.data.syllabus || []);
        setEnrollments(data.data.enrollments || []);
      }
    } catch (error) {
      console.error("Failed to fetch syllabus:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading syllabus...</p>
      </div>
    );
  }

  const activeEnrollment = enrollments.find(e => e.status === 'active');

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Course Syllabus</h1>
          <p className={styles.subtitle}>Track your learning path month by month</p>
        </div>
        {activeEnrollment && (
          <div className={styles.courseInfo}>
            <h3 className={styles.courseName}>{activeEnrollment.course_name}</h3>
            <p className={styles.courseDuration}>
              {activeEnrollment.course_duration_months} Months Program
            </p>
          </div>
        )}
      </div>

      {syllabusData.length > 0 ? (
        <div className={styles.timeline}>
          {syllabusData.map((month, index) => {
            const completedTopics = month.topics?.filter(t => t.completed).length || 0;
            const totalTopics = month.topics?.length || month.total_topics;
            const progress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

            return (
              <div key={month.id} className={styles.monthCard}>
                <div className={styles.monthHeader}>
                  <div className={styles.monthNumber}>
                    <span className={styles.monthLabel}>Month</span>
                    <span className={styles.monthValue}>{month.month_number}</span>
                  </div>
                  <div className={styles.monthInfo}>
                    <h3 className={styles.monthTitle}>{month.month_title}</h3>
                    <div className={styles.monthMeta}>
                      <span className={`${styles.statusBadge} ${styles[month.status]}`}>
                        {month.status === 'completed' ? '✅ Completed' :
                         month.status === 'in_progress' ? '🔄 In Progress' :
                         '⏳ Not Started'}
                      </span>
                      <span className={styles.topicsCount}>
                        {completedTopics}/{totalTopics} Topics
                      </span>
                    </div>
                  </div>
                  <div className={styles.progressCircle}>
                    <svg viewBox="0 0 80 80">
                      <circle cx="40" cy="40" r="35" fill="none" stroke="#2a2a2a" strokeWidth="8"/>
                      <circle 
                        cx="40" 
                        cy="40" 
                        r="35" 
                        fill="none" 
                        stroke={month.status === 'completed' ? '#10B981' : '#6C3EE8'}
                        strokeWidth="8"
                        strokeDasharray={`${progress * 2.199} 219.9`}
                        strokeLinecap="round"
                        transform="rotate(-90 40 40)"
                      />
                      <text x="40" y="40" textAnchor="middle" dy="6" fill="white" fontSize="16" fontWeight="bold">
                        {progress}%
                      </text>
                    </svg>
                  </div>
                </div>

                {month.topics && month.topics.length > 0 && (
                  <div className={styles.topicsList}>
                    {month.topics.map((topic, topicIndex) => (
                      <div 
                        key={topicIndex} 
                        className={`${styles.topicItem} ${topic.completed ? styles.completed : ''}`}
                      >
                        <div className={styles.topicCheckbox}>
                          {topic.completed ? '✅' : '⬜'}
                        </div>
                        <span className={styles.topicName}>{topic.topic}</span>
                      </div>
                    ))}
                  </div>
                )}

                {month.started_at && (
                  <div className={styles.monthFooter}>
                    <span className={styles.dateInfo}>
                      Started: {new Date(month.started_at).toLocaleDateString()}
                    </span>
                    {month.completed_at && (
                      <span className={styles.dateInfo}>
                        Completed: {new Date(month.completed_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📚</div>
          <h3>No Syllabus Available</h3>
          <p>Syllabus will be available once you enroll in a course</p>
        </div>
      )}
    </div>
  );
}
