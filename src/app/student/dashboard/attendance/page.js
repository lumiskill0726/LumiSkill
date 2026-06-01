"use client";
import { useEffect, useState } from "react";
import styles from "./attendance.module.css";

export default function AttendancePage() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      // This would be a separate API endpoint in production
      const response = await fetch("/api/student/dashboard");
      const data = await response.json();
      // For now, using mock data structure
      setAttendanceData([]);
    } catch (error) {
      console.error("Failed to fetch attendance:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading attendance...</p>
      </div>
    );
  }

  // Calculate stats
  const totalClasses = attendanceData.length;
  const presentCount = attendanceData.filter(a => a.status === 'present').length;
  const absentCount = attendanceData.filter(a => a.status === 'absent').length;
  const lateCount = attendanceData.filter(a => a.status === 'late').length;
  const attendancePercentage = totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 0;

  const filteredData = filter === 'all' 
    ? attendanceData 
    : attendanceData.filter(a => a.status === filter);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Attendance Records</h1>
          <p className={styles.subtitle}>Track your class attendance and participation</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.statCardGreen}`}>
          <div className={styles.statIcon}>✅</div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Attendance Rate</p>
            <h3 className={styles.statValue}>{attendancePercentage}%</h3>
            <p className={styles.statChange}>{presentCount} of {totalClasses} classes</p>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.statCardBlue}`}>
          <div className={styles.statIcon}>📅</div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Total Classes</p>
            <h3 className={styles.statValue}>{totalClasses}</h3>
            <p className={styles.statChange}>All time</p>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.statCardOrange}`}>
          <div className={styles.statIcon}>⏰</div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Late Arrivals</p>
            <h3 className={styles.statValue}>{lateCount}</h3>
            <p className={styles.statChange}>Times late</p>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.statCardRed}`}>
          <div className={styles.statIcon}>❌</div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Absences</p>
            <h3 className={styles.statValue}>{absentCount}</h3>
            <p className={styles.statChange}>Classes missed</p>
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
          className={`${styles.filterBtn} ${filter === 'present' ? styles.active : ''}`}
          onClick={() => setFilter('present')}
        >
          ✅ Present
        </button>
        <button 
          className={`${styles.filterBtn} ${filter === 'absent' ? styles.active : ''}`}
          onClick={() => setFilter('absent')}
        >
          ❌ Absent
        </button>
        <button 
          className={`${styles.filterBtn} ${filter === 'late' ? styles.active : ''}`}
          onClick={() => setFilter('late')}
        >
          ⏰ Late
        </button>
      </div>

      {/* Attendance List */}
      {filteredData.length > 0 ? (
        <div className={styles.attendanceList}>
          {filteredData.map((record) => (
            <div key={record.id} className={styles.attendanceCard}>
              <div className={styles.attendanceDate}>
                <div className={styles.dateDay}>
                  {new Date(record.class_date).getDate()}
                </div>
                <div className={styles.dateMonth}>
                  {new Date(record.class_date).toLocaleDateString('en-US', { month: 'short' })}
                </div>
              </div>

              <div className={styles.attendanceInfo}>
                <h4 className={styles.classTopic}>{record.class_topic || 'Regular Class'}</h4>
                <p className={styles.classDate}>
                  {new Date(record.class_date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                {record.remarks && (
                  <p className={styles.remarks}>Note: {record.remarks}</p>
                )}
              </div>

              <div className={styles.attendanceStatus}>
                <span className={`${styles.statusBadge} ${styles[record.status]}`}>
                  {record.status === 'present' ? '✅ Present' :
                   record.status === 'absent' ? '❌ Absent' :
                   record.status === 'late' ? '⏰ Late' :
                   '✓ Excused'}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📋</div>
          <h3>No Attendance Records</h3>
          <p>
            {filter === 'all' 
              ? 'Attendance records will appear here once classes begin'
              : `No ${filter} records found`}
          </p>
        </div>
      )}
    </div>
  );
}
