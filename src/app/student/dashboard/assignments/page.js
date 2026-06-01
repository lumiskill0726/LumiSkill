"use client";
import { useEffect, useState } from "react";
import styles from "./assignments.module.css";

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await fetch("/api/student/dashboard");
      const data = await response.json();
      setAssignments([]);
    } catch (error) {
      console.error("Failed to fetch assignments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading assignments...</p>
      </div>
    );
  }

  const pendingCount = assignments.filter(a => a.status === 'pending').length;
  const submittedCount = assignments.filter(a => a.status === 'submitted').length;
  const gradedCount = assignments.filter(a => a.status === 'graded').length;
  const lateCount = assignments.filter(a => a.status === 'late').length;

  const filteredAssignments = filter === 'all' 
    ? assignments 
    : assignments.filter(a => a.status === filter);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Assignments</h1>
          <p className={styles.subtitle}>Track and submit your homework</p>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.statCardOrange}`}>
          <div className={styles.statIcon}>📋</div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Pending</p>
            <h3 className={styles.statValue}>{pendingCount}</h3>
            <p className={styles.statChange}>To submit</p>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.statCardBlue}`}>
          <div className={styles.statIcon}>📤</div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Submitted</p>
            <h3 className={styles.statValue}>{submittedCount}</h3>
            <p className={styles.statChange}>Under review</p>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.statCardGreen}`}>
          <div className={styles.statIcon}>✅</div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Graded</p>
            <h3 className={styles.statValue}>{gradedCount}</h3>
            <p className={styles.statChange}>Completed</p>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.statCardRed}`}>
          <div className={styles.statIcon}>⏰</div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Late</p>
            <h3 className={styles.statValue}>{lateCount}</h3>
            <p className={styles.statChange}>Past due</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <button 
          className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button 
          className={`${styles.filterBtn} ${filter === 'pending' ? styles.active : ''}`}
          onClick={() => setFilter('pending')}
        >
          📋 Pending
        </button>
        <button 
          className={`${styles.filterBtn} ${filter === 'submitted' ? styles.active : ''}`}
          onClick={() => setFilter('submitted')}
        >
          📤 Submitted
        </button>
        <button 
          className={`${styles.filterBtn} ${filter === 'graded' ? styles.active : ''}`}
          onClick={() => setFilter('graded')}
        >
          ✅ Graded
        </button>
      </div>

      {/* Assignments List */}
      {filteredAssignments.length > 0 ? (
        <div className={styles.assignmentsList}>
          {filteredAssignments.map((assignment) => {
            const dueDate = new Date(assignment.due_date);
            const today = new Date();
            const daysLeft = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
            const isOverdue = daysLeft < 0 && assignment.status === 'pending';

            return (
              <div key={assignment.id} className={styles.assignmentCard}>
                <div className={styles.assignmentHeader}>
                  <div className={styles.assignmentTitle}>
                    <h3>{assignment.assignment_title}</h3>
                    <span className={`${styles.statusBadge} ${styles[assignment.status]}`}>
                      {assignment.status === 'pending' ? '📋 Pending' :
                       assignment.status === 'submitted' ? '📤 Submitted' :
                       assignment.status === 'graded' ? '✅ Graded' :
                       '⏰ Late'}
                    </span>
                  </div>
                  {assignment.due_date && (
                    <div className={styles.dueDate}>
                      <span className={styles.dueLabel}>Due:</span>
                      <span className={`${styles.dueValue} ${isOverdue ? styles.overdue : ''}`}>
                        {dueDate.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                      {assignment.status === 'pending' && daysLeft >= 0 && (
                        <span className={styles.daysLeft}>
                          {daysLeft === 0 ? 'Due today' : `${daysLeft} days left`}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {assignment.assignment_description && (
                  <p className={styles.description}>{assignment.assignment_description}</p>
                )}

                <div className={styles.assignmentFooter}>
                  <div className={styles.assignmentMeta}>
                    {assignment.submission_date && (
                      <span className={styles.metaItem}>
                        📤 Submitted: {new Date(assignment.submission_date).toLocaleDateString()}
                      </span>
                    )}
                    {assignment.status === 'graded' && assignment.score !== null && (
                      <span className={styles.metaItem}>
                        🎯 Score: {assignment.score}/{assignment.max_score}
                      </span>
                    )}
                  </div>

                  {assignment.status === 'pending' && (
                    <button className={styles.submitBtn}>
                      Submit Assignment
                    </button>
                  )}

                  {assignment.status === 'graded' && assignment.feedback && (
                    <button className={styles.viewBtn}>
                      View Feedback
                    </button>
                  )}
                </div>

                {assignment.status === 'graded' && assignment.feedback && (
                  <div className={styles.feedback}>
                    <h4 className={styles.feedbackTitle}>Mentor Feedback:</h4>
                    <p className={styles.feedbackText}>{assignment.feedback}</p>
                    <span className={styles.gradedBy}>
                      Graded by: {assignment.graded_by}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📚</div>
          <h3>No Assignments</h3>
          <p>
            {filter === 'all' 
              ? 'Assignments will appear here once they are assigned'
              : `No ${filter} assignments found`}
          </p>
        </div>
      )}
    </div>
  );
}
