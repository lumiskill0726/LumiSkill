"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalVisitors: 0,
    totalLeads: 0,
    newLeads: 0,
    pushSubscribers: 0,
  });
  const [recentVisitors, setRecentVisitors] = useState([]);
  const [recentLeads, setRecentLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch visitors count
      const visitorsRes = await fetch("/api/admin/stats/visitors");
      const visitorsData = await visitorsRes.json();

      // Fetch leads count
      const leadsRes = await fetch("/api/admin/stats/leads");
      const leadsData = await leadsRes.json();

      setStats({
        totalVisitors: visitorsData.total || 0,
        totalLeads: leadsData.total || 0,
        newLeads: leadsData.new || 0,
        pushSubscribers: visitorsData.pushSubscribers || 0,
      });

      setRecentVisitors(visitorsData.recent || []);
      setRecentLeads(leadsData.recent || []);
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

  return (
    <div className={styles.dashboard}>
      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.statCardPurple}`}>
          <div className={styles.statIcon}>👥</div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Total Visitors</p>
            <h3 className={styles.statValue}>{stats.totalVisitors}</h3>
            <p className={styles.statChange}>All time</p>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.statCardBlue}`}>
          <div className={styles.statIcon}>📝</div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Total Leads</p>
            <h3 className={styles.statValue}>{stats.totalLeads}</h3>
            <p className={styles.statChange}>All submissions</p>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.statCardGreen}`}>
          <div className={styles.statIcon}>✨</div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>New Leads</p>
            <h3 className={styles.statValue}>{stats.newLeads}</h3>
            <p className={styles.statChange}>Pending review</p>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.statCardOrange}`}>
          <div className={styles.statIcon}>🔔</div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Push Subscribers</p>
            <h3 className={styles.statValue}>{stats.pushSubscribers}</h3>
            <p className={styles.statChange}>Active</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className={styles.activityGrid}>
        {/* Recent Visitors */}
        <div className={styles.activityCard}>
          <div className={styles.activityHeader}>
            <h3 className={styles.activityTitle}>Recent Visitors</h3>
            <a href="/admin/visitors" className={styles.viewAllLink}>
              View All →
            </a>
          </div>
          <div className={styles.activityList}>
            {recentVisitors.length > 0 ? (
              recentVisitors.map((visitor, index) => (
                <div key={index} className={styles.activityItem}>
                  <div className={styles.activityAvatar}>
                    {visitor.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className={styles.activityDetails}>
                    <p className={styles.activityName}>{visitor.name}</p>
                    <p className={styles.activityMeta}>{visitor.email}</p>
                  </div>
                  <div className={styles.activityTime}>
                    {new Date(visitor.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.emptyState}>No visitors yet</p>
            )}
          </div>
        </div>

        {/* Recent Leads */}
        <div className={styles.activityCard}>
          <div className={styles.activityHeader}>
            <h3 className={styles.activityTitle}>Recent Leads</h3>
            <a href="/admin/leads" className={styles.viewAllLink}>
              View All →
            </a>
          </div>
          <div className={styles.activityList}>
            {recentLeads.length > 0 ? (
              recentLeads.map((lead, index) => (
                <div key={index} className={styles.activityItem}>
                  <div className={styles.activityAvatar}>
                    {lead.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className={styles.activityDetails}>
                    <p className={styles.activityName}>{lead.name}</p>
                    <p className={styles.activityMeta}>
                      {lead.form_type} • {lead.email}
                    </p>
                  </div>
                  <span
                    className={`${styles.statusBadge} ${
                      styles[`status${lead.status}`]
                    }`}
                  >
                    {lead.status}
                  </span>
                </div>
              ))
            ) : (
              <p className={styles.emptyState}>No leads yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={styles.quickActions}>
        <h3 className={styles.sectionTitle}>Quick Actions</h3>
        <div className={styles.actionsGrid}>
          <a href="/admin/visitors" className={styles.actionCard}>
            <span className={styles.actionIcon}>👥</span>
            <span className={styles.actionLabel}>View All Visitors</span>
          </a>
          <a href="/admin/leads" className={styles.actionCard}>
            <span className={styles.actionIcon}>📝</span>
            <span className={styles.actionLabel}>Manage Leads</span>
          </a>
          <button className={styles.actionCard} onClick={() => fetchDashboardData()}>
            <span className={styles.actionIcon}>🔄</span>
            <span className={styles.actionLabel}>Refresh Data</span>
          </button>
        </div>
      </div>
    </div>
  );
}
