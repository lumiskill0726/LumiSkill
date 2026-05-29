"use client";
import { useEffect, useState } from "react";
import styles from "./visitors.module.css";

export default function AdminVisitors() {
  const [visitors, setVisitors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      const response = await fetch("/api/visitors");
      const data = await response.json();
      
      if (data.success) {
        setVisitors(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch visitors:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredVisitors = visitors.filter((visitor) =>
    visitor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visitor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visitor.phone?.includes(searchTerm)
  );

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading visitors...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>All Visitors</h1>
          <p className={styles.subtitle}>
            Total: {visitors.length} visitor{visitors.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button onClick={fetchVisitors} className={styles.refreshBtn}>
          🔄 Refresh
        </button>
      </div>

      <div className={styles.searchBox}>
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {filteredVisitors.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyIcon}>👥</p>
          <h3 className={styles.emptyTitle}>No visitors found</h3>
          <p className={styles.emptyText}>
            {searchTerm
              ? "Try adjusting your search"
              : "Visitors will appear here once they fill the form"}
          </p>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Date</th>
                <th>User Agent</th>
              </tr>
            </thead>
            <tbody>
              {filteredVisitors.map((visitor) => (
                <tr key={visitor.id}>
                  <td>
                    <div className={styles.nameCell}>
                      <div className={styles.avatar}>
                        {visitor.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className={styles.name}>{visitor.name}</span>
                    </div>
                  </td>
                  <td>
                    <a href={`mailto:${visitor.email}`} className={styles.email}>
                      {visitor.email}
                    </a>
                  </td>
                  <td>
                    <a href={`tel:${visitor.phone}`} className={styles.phone}>
                      {visitor.phone}
                    </a>
                  </td>
                  <td className={styles.date}>
                    {new Date(visitor.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className={styles.userAgent}>
                    {visitor.user_agent?.includes("Mobile") ? "📱 Mobile" : "💻 Desktop"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
