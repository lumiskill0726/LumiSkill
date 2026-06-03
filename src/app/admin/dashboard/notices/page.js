"use client";
import { useEffect, useState } from "react";
import styles from "./notices.module.css";

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    notice_type: "general",
    target_audience: "all",
    target_course: ""
  });

  useEffect(() => {
    fetchNotices();
  }, [searchTerm, typeFilter]);

  const fetchNotices = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (typeFilter) params.append("type", typeFilter);

      const response = await fetch(`/api/admin/notices?${params}`);
      const data = await response.json();

      if (data.success) {
        setNotices(data.notices || []);
      }
    } catch (error) {
      console.error("Failed to fetch notices:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingNotice ? "/api/admin/notices" : "/api/admin/notices";
      const method = editingNotice ? "PUT" : "POST";
      
      const payload = editingNotice 
        ? { ...formData, id: editingNotice.id }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        alert(editingNotice ? "Notice updated successfully!" : "Notice created successfully!");
        setShowModal(false);
        resetForm();
        fetchNotices();
      } else {
        alert(data.error || "Failed to save notice");
      }
    } catch (error) {
      console.error("Error saving notice:", error);
      alert("Failed to save notice");
    }
  };

  const handleEdit = (notice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title,
      message: notice.message,
      notice_type: notice.notice_type,
      target_audience: notice.target_audience,
      target_course: notice.target_course || ""
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this notice?")) return;

    try {
      const response = await fetch(`/api/admin/notices?id=${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        alert("Notice deleted successfully!");
        fetchNotices();
      } else {
        alert(data.error || "Failed to delete notice");
      }
    } catch (error) {
      console.error("Error deleting notice:", error);
      alert("Failed to delete notice");
    }
  };

  const resetForm = () => {
    setEditingNotice(null);
    setFormData({
      title: "",
      message: "",
      notice_type: "general",
      target_audience: "all",
      target_course: ""
    });
  };

  const getNoticeIcon = (type) => {
    switch (type) {
      case "urgent": return "🚨";
      case "announcement": return "📢";
      case "holiday": return "🎉";
      default: return "📝";
    }
  };

  const courses = [
    { slug: "python-basics", name: "Python Basics" },
    { slug: "web-development", name: "Web Development" },
    { slug: "game-development", name: "Game Development" },
    { slug: "ai-ml", name: "AI & ML" },
  ];

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
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Notices Management</h1>
          <p className={styles.subtitle}>Create and manage student notices</p>
        </div>
        <button
          className={styles.addBtn}
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          <span className={styles.addIcon}>➕</span>
          Create Notice
        </button>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search notices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">All Types</option>
          <option value="general">General</option>
          <option value="urgent">Urgent</option>
          <option value="announcement">Announcement</option>
          <option value="holiday">Holiday</option>
        </select>

        <button
          className={styles.resetBtn}
          onClick={() => {
            setSearchTerm("");
            setTypeFilter("");
          }}
        >
          Reset Filters
        </button>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📢</div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Total Notices</p>
            <h3 className={styles.statValue}>{notices.length}</h3>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🚨</div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Urgent</p>
            <h3 className={styles.statValue}>
              {notices.filter(n => n.notice_type === 'urgent').length}
            </h3>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>✅</div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Active</p>
            <h3 className={styles.statValue}>
              {notices.filter(n => n.is_active).length}
            </h3>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🎉</div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Holidays</p>
            <h3 className={styles.statValue}>
              {notices.filter(n => n.notice_type === 'holiday').length}
            </h3>
          </div>
        </div>
      </div>

      {/* Notices List */}
      {notices.length > 0 ? (
        <div className={styles.noticesList}>
          {notices.map((notice) => (
            <div key={notice.id} className={styles.noticeCard}>
              <div className={styles.noticeHeader}>
                <div className={styles.noticeHeaderLeft}>
                  <span className={styles.noticeIcon}>
                    {getNoticeIcon(notice.notice_type)}
                  </span>
                  <div>
                    <h3 className={styles.noticeTitle}>{notice.title}</h3>
                    <div className={styles.noticeMeta}>
                      <span className={`${styles.typeBadge} ${styles[notice.notice_type]}`}>
                        {notice.notice_type}
                      </span>
                      <span className={styles.targetBadge}>
                        {notice.target_audience === 'all' ? 'All Students' :
                         notice.target_audience === 'course' ? `Course: ${notice.target_course}` :
                         'Specific Students'}
                      </span>
                      <span className={styles.dateText}>
                        {new Date(notice.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className={styles.noticeActions}>
                  <button
                    className={styles.editBtn}
                    onClick={() => handleEdit(notice)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(notice.id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
              <p className={styles.noticeMessage}>{notice.message}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📢</div>
          <h3>No Notices Found</h3>
          <p>Create your first notice to get started</p>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {editingNotice ? "Edit Notice" : "Create New Notice"}
              </h2>
              <button
                className={styles.closeBtn}
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className={styles.formInput}
                  placeholder="Enter notice title"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Message *</label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className={styles.formTextarea}
                  placeholder="Enter notice message"
                  rows="5"
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Notice Type *</label>
                  <select
                    required
                    value={formData.notice_type}
                    onChange={(e) =>
                      setFormData({ ...formData, notice_type: e.target.value })
                    }
                    className={styles.formSelect}
                  >
                    <option value="general">General</option>
                    <option value="urgent">Urgent</option>
                    <option value="announcement">Announcement</option>
                    <option value="holiday">Holiday</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Target Audience *</label>
                  <select
                    required
                    value={formData.target_audience}
                    onChange={(e) =>
                      setFormData({ ...formData, target_audience: e.target.value })
                    }
                    className={styles.formSelect}
                  >
                    <option value="all">All Students</option>
                    <option value="course">Specific Course</option>
                    <option value="students">Specific Students</option>
                  </select>
                </div>
              </div>

              {formData.target_audience === "course" && (
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Select Course *</label>
                  <select
                    required
                    value={formData.target_course}
                    onChange={(e) =>
                      setFormData({ ...formData, target_course: e.target.value })
                    }
                    className={styles.formSelect}
                  >
                    <option value="">Choose a course</option>
                    {courses.map((course) => (
                      <option key={course.slug} value={course.slug}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.submitBtn}>
                  {editingNotice ? "Update Notice" : "Create Notice"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
