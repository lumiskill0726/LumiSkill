"use client";
import { useEffect, useState } from "react";
import styles from "./progress.module.css";

export default function AdminProgressPage() {
  const [reports, setReports] = useState([]);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [formData, setFormData] = useState({
    student_id: "",
    course_slug: "",
    report_title: "",
    report_date: new Date().toISOString().split('T')[0],
    progress_percentage: 0,
    attendance_percentage: 0,
    assignments_completed: 0,
    total_assignments: 0,
    projects_completed: 0,
    mentor_feedback: "",
    strengths: "",
    areas_to_improve: "",
    next_steps: ""
  });

  useEffect(() => {
    fetchReports();
    fetchStudents();
  }, [searchTerm, courseFilter]);

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (courseFilter) params.append("course", courseFilter);

      const response = await fetch(`/api/admin/progress?${params}`);
      const data = await response.json();

      if (data.success) {
        setReports(data.reports || []);
      }
    } catch (error) {
      console.error("Failed to fetch progress reports:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await fetch("/api/admin/students");
      const data = await response.json();
      if (data.success) {
        setStudents(data.students || []);
      }
    } catch (error) {
      console.error("Failed to fetch students:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/admin/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        alert("Progress report created successfully!");
        setShowModal(false);
        resetForm();
        fetchReports();
      } else {
        alert(data.error || "Failed to create progress report");
      }
    } catch (error) {
      console.error("Error creating progress report:", error);
      alert("Failed to create progress report");
    }
  };

  const resetForm = () => {
    setSelectedStudent("");
    setFormData({
      student_id: "",
      course_slug: "",
      report_title: "",
      report_date: new Date().toISOString().split('T')[0],
      progress_percentage: 0,
      attendance_percentage: 0,
      assignments_completed: 0,
      total_assignments: 0,
      projects_completed: 0,
      mentor_feedback: "",
      strengths: "",
      areas_to_improve: "",
      next_steps: ""
    });
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
        <p>Loading progress reports...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Progress Reports</h1>
          <p className={styles.subtitle}>Create and manage student progress reports</p>
        </div>
        <button
          className={styles.addBtn}
          onClick={() => setShowModal(true)}
        >
          <span className={styles.addIcon}>➕</span>
          Create Report
        </button>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search by student name or report title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <select
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">All Courses</option>
          {courses.map((course) => (
            <option key={course.slug} value={course.slug}>
              {course.name}
            </option>
          ))}
        </select>

        <button
          className={styles.resetBtn}
          onClick={() => {
            setSearchTerm("");
            setCourseFilter("");
          }}
        >
          Reset Filters
        </button>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📊</div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Total Reports</p>
            <h3 className={styles.statValue}>{reports.length}</h3>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📈</div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Avg Progress</p>
            <h3 className={styles.statValue}>
              {reports.length > 0
                ? Math.round(
                    reports.reduce((sum, r) => sum + (r.progress_percentage || 0), 0) /
                      reports.length
                  )
                : 0}%
            </h3>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>✅</div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Avg Attendance</p>
            <h3 className={styles.statValue}>
              {reports.length > 0
                ? Math.round(
                    reports.reduce((sum, r) => sum + (r.attendance_percentage || 0), 0) /
                      reports.length
                  )
                : 0}%
            </h3>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🎯</div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>This Month</p>
            <h3 className={styles.statValue}>
              {reports.filter(r => {
                const reportDate = new Date(r.report_date);
                const now = new Date();
                return reportDate.getMonth() === now.getMonth() &&
                       reportDate.getFullYear() === now.getFullYear();
              }).length}
            </h3>
          </div>
        </div>
      </div>

      {/* Reports List */}
      {reports.length > 0 ? (
        <div className={styles.reportsList}>
          {reports.map((report) => (
            <div key={report.id} className={styles.reportCard}>
              <div className={styles.reportHeader}>
                <div className={styles.reportHeaderLeft}>
                  <div className={styles.studentAvatar}>
                    {report.students?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className={styles.reportTitle}>{report.report_title}</h3>
                    <p className={styles.studentName}>{report.students?.name}</p>
                    <div className={styles.reportMeta}>
                      <span className={styles.courseBadge}>
                        {courses.find(c => c.slug === report.course_slug)?.name || report.course_slug}
                      </span>
                      <span className={styles.dateText}>
                        {new Date(report.report_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.reportStats}>
                <div className={styles.reportStat}>
                  <span className={styles.statLabel}>Progress</span>
                  <div className={styles.progressBar}>
                    <div 
                      className={styles.progressFill}
                      style={{ width: `${report.progress_percentage}%` }}
                    ></div>
                  </div>
                  <span className={styles.statValue}>{report.progress_percentage}%</span>
                </div>

                <div className={styles.reportStat}>
                  <span className={styles.statLabel}>Attendance</span>
                  <div className={styles.progressBar}>
                    <div 
                      className={styles.progressFill}
                      style={{ width: `${report.attendance_percentage}%` }}
                    ></div>
                  </div>
                  <span className={styles.statValue}>{report.attendance_percentage}%</span>
                </div>

                <div className={styles.reportStat}>
                  <span className={styles.statLabel}>Assignments</span>
                  <span className={styles.statValue}>
                    {report.assignments_completed}/{report.total_assignments}
                  </span>
                </div>

                <div className={styles.reportStat}>
                  <span className={styles.statLabel}>Projects</span>
                  <span className={styles.statValue}>{report.projects_completed}</span>
                </div>
              </div>

              {report.mentor_feedback && (
                <div className={styles.feedback}>
                  <p className={styles.feedbackLabel}>Mentor Feedback:</p>
                  <p className={styles.feedbackText}>{report.mentor_feedback}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📊</div>
          <h3>No Progress Reports Found</h3>
          <p>Create your first progress report to get started</p>
        </div>
      )}

      {/* Create Report Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Create Progress Report</h2>
              <button
                className={styles.closeBtn}
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.modalBody}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Student *</label>
                  <select
                    required
                    value={formData.student_id}
                    onChange={(e) => {
                      setFormData({ ...formData, student_id: e.target.value });
                      setSelectedStudent(e.target.value);
                    }}
                    className={styles.formSelect}
                  >
                    <option value="">Select a student</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name} - {student.email}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Course *</label>
                  <select
                    required
                    value={formData.course_slug}
                    onChange={(e) =>
                      setFormData({ ...formData, course_slug: e.target.value })
                    }
                    className={styles.formSelect}
                  >
                    <option value="">Select a course</option>
                    {courses.map((course) => (
                      <option key={course.slug} value={course.slug}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Report Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.report_title}
                    onChange={(e) =>
                      setFormData({ ...formData, report_title: e.target.value })
                    }
                    className={styles.formInput}
                    placeholder="e.g., Monthly Progress - January 2024"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Report Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.report_date}
                    onChange={(e) =>
                      setFormData({ ...formData, report_date: e.target.value })
                    }
                    className={styles.formInput}
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Progress %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.progress_percentage}
                    onChange={(e) =>
                      setFormData({ ...formData, progress_percentage: parseInt(e.target.value) || 0 })
                    }
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Attendance %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.attendance_percentage}
                    onChange={(e) =>
                      setFormData({ ...formData, attendance_percentage: parseInt(e.target.value) || 0 })
                    }
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Assignments Completed</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.assignments_completed}
                    onChange={(e) =>
                      setFormData({ ...formData, assignments_completed: parseInt(e.target.value) || 0 })
                    }
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Total Assignments</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.total_assignments}
                    onChange={(e) =>
                      setFormData({ ...formData, total_assignments: parseInt(e.target.value) || 0 })
                    }
                    className={styles.formInput}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Projects Completed</label>
                <input
                  type="number"
                  min="0"
                  value={formData.projects_completed}
                  onChange={(e) =>
                    setFormData({ ...formData, projects_completed: parseInt(e.target.value) || 0 })
                  }
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Mentor Feedback</label>
                <textarea
                  value={formData.mentor_feedback}
                  onChange={(e) =>
                    setFormData({ ...formData, mentor_feedback: e.target.value })
                  }
                  className={styles.formTextarea}
                  placeholder="Overall feedback on student's performance..."
                  rows="3"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Strengths</label>
                <textarea
                  value={formData.strengths}
                  onChange={(e) =>
                    setFormData({ ...formData, strengths: e.target.value })
                  }
                  className={styles.formTextarea}
                  placeholder="Student's key strengths..."
                  rows="2"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Areas to Improve</label>
                <textarea
                  value={formData.areas_to_improve}
                  onChange={(e) =>
                    setFormData({ ...formData, areas_to_improve: e.target.value })
                  }
                  className={styles.formTextarea}
                  placeholder="Areas that need improvement..."
                  rows="2"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Next Steps</label>
                <textarea
                  value={formData.next_steps}
                  onChange={(e) =>
                    setFormData({ ...formData, next_steps: e.target.value })
                  }
                  className={styles.formTextarea}
                  placeholder="Recommended next steps..."
                  rows="2"
                />
              </div>

              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.submitBtn}>
                  Create Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
