"use client";
import { useEffect, useState } from "react";
import styles from "./notices.module.css";

export default function NoticesPage() {
  const [notices, setNotices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const response = await fetch("/api/student/dashboard");
      const data = await response.json();
      if (data.success) {
        setNotices(data.data.notices || []);
      }
    } catch (error) {
      console.error("Failed to fetch notices:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredNotices = filter === 'all' 
    ? notices 
    : notices.filter(n => n.notice_type === filter);

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading notices...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Notices & Announcements</h1>
          <p className={styles.subtitle}>Stay updated with important information</p>
        </div>
        <div className={styles.filters}>
          <button 
            className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`${styles.filterBtn} ${filter === 'urgent' ? styles.active : ''}`}
            onClick={() => setFilter('urgent')}
          >
            🚨 Urgent
          </button>
          <button 
            className={`${styles.filterBtn} ${filter === 'announcement' ? styles.active : ''}`}
            onClick={() => setFilter('announcement')}
          >
            📢 Announcements
          </button>
          <button 
            className={`${styles.filterBtn} ${filter === 'holiday' ? styles.active : ''}`}
            onClick={() => setFilter('holiday')}
          >
            🎉 Holidays
          </button>
        </div>
      </div>

      {filteredNotices.length > 0 ? (
        <div className={styles.noticesList}>
          {filteredNotices.map((notice) => (
            <div key={notice.id} className={`${styles.noticeCard} ${styles[notice.notice_type]}`}>
              <div className={styles.noticeHeader}>
                <div className={styles.noticeIcon}>
                  {notice.notice_type === 'urgent' ? '🚨' :
                   notice.notice_type === 'announcement' ? '📢' :
                   notice.notice_type === 'holiday' ? '🎉' : '📝'}
                </div>
                <div className={styles.noticeMeta}>
                  <span className={styles.noticeType}>{notice.notice_type}</span>
                  <span className={styles.noticeDate}>
                    {new Date(notice.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
              <h3 className={styles.noticeTitle}>{notice.title}</h3>
              <p className={styles.noticeMessage}>{notice.message}</p>
              {notice.expires_at && (
                <div className={styles.noticeExpiry}>
                  Expires: {new Date(notice.expires_at).toLocaleDateString()}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📭</div>
          <h3>No notices found</h3>
          <p>There are no {filter !== 'all' ? filter : ''} notices at the moment</p>
        </div>
      )}
    </div>
  );
}
