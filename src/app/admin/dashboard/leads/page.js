"use client";
import { useEffect, useState } from "react";
import styles from "./leads.module.css";

export default function AdminLeads() {
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await fetch("/api/leads");
      const data = await response.json();
      
      if (data.success) {
        setLeads(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch leads:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateLeadStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setLeads(leads.map(lead => 
          lead.id === id ? { ...lead, status: newStatus } : lead
        ));
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch = 
      lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone?.includes(searchTerm) ||
      lead.course_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || lead.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const badges = {
      new: { label: "New", color: "#3b82f6" },
      contacted: { label: "Contacted", color: "#f59e0b" },
      converted: { label: "Converted", color: "#10b981" },
      closed: { label: "Closed", color: "#6b7280" },
    };
    return badges[status] || badges.new;
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading leads...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>All Leads</h1>
          <p className={styles.subtitle}>
            Total: {leads.length} lead{leads.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button onClick={fetchLeads} className={styles.refreshBtn}>
          🔄 Refresh
        </button>
      </div>

      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search by name, email, phone, or course..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className={styles.statusFilter}
        >
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="converted">Converted</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {filteredLeads.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyIcon}>📝</p>
          <h3 className={styles.emptyTitle}>No leads found</h3>
          <p className={styles.emptyText}>
            {searchTerm || filterStatus !== "all"
              ? "Try adjusting your filters"
              : "Leads will appear here once users submit forms"}
          </p>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Course</th>
                <th>Message</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => {
                const badge = getStatusBadge(lead.status);
                return (
                  <tr key={lead.id}>
                    <td>
                      <div className={styles.nameCell}>
                        <div className={styles.avatar}>
                          {lead.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className={styles.name}>{lead.name}</div>
                          {lead.student_class && (
                            <div className={styles.class}>Class {lead.student_class}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className={styles.contactCell}>
                        <a href={`mailto:${lead.email}`} className={styles.email}>
                          {lead.email}
                        </a>
                        <a href={`tel:${lead.phone}`} className={styles.phone}>
                          {lead.phone}
                        </a>
                      </div>
                    </td>
                    <td>
                      <span className={styles.course}>{lead.course_name || "N/A"}</span>
                    </td>
                    <td>
                      <div className={styles.message}>
                        {lead.message || "No message"}
                      </div>
                    </td>
                    <td>
                      <span
                        className={styles.statusBadge}
                        style={{ backgroundColor: badge.color }}
                      >
                        {badge.label}
                      </span>
                    </td>
                    <td className={styles.date}>
                      {new Date(lead.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td>
                      <select
                        value={lead.status}
                        onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                        className={styles.statusSelect}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="converted">Converted</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
