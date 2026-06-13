"use client";
import { useEffect, useState } from "react";
import styles from "./batches.module.css";

export default function BatchesPage() {
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editingBatch, setEditingBatch] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [formData, setFormData] = useState({
    course_id: "",
    course_slug: "",
    batch_name: "",
    batch_code: "",
    start_date: "",
    end_date: "",
    max_students: 30,
    status: "upcoming",
  });
  const [batchStudents, setBatchStudents] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);

  useEffect(() => {
    fetchBatches();
    fetchCourses();
    fetchStudents();
  }, []);

  const fetchBatches = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/batches");
      const data = await response.json();
      if (data.success) {
        setBatches(data.batches || []);
      }
    } catch (error) {
      console.error("Failed to fetch batches:", error);
      showMessage("error", "Failed to load batches");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch("/api/admin/courses");
      const data = await response.json();
      if (data.success) {
        setCourses(data.courses || []);
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
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

  const fetchBatchStudents = async (batchId) => {
    try {
      const response = await fetch(`/api/admin/batches/students?batch_id=${batchId}`);
      const data = await response.json();
      if (data.success) {
        setBatchStudents(data.students || []);
        // Filter available students (not in this batch)
        const enrolledIds = (data.students || []).map(s => s.id);
        setAvailableStudents(students.filter(s => !enrolledIds.includes(s.id)));
      }
    } catch (error) {
      console.error("Failed to fetch batch students:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "/api/admin/batches";
      const method = editingBatch ? "PUT" : "POST";

      const payload = {
        ...formData,
      };

      if (editingBatch) {
        payload.id = editingBatch.id;
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        showMessage("success", editingBatch ? "Batch updated successfully!" : "Batch created successfully!");
        setShowModal(false);
        resetForm();
        fetchBatches();
      } else {
        showMessage("error", data.error || "Failed to save batch");
      }
    } catch (error) {
      console.error("Error saving batch:", error);
      showMessage("error", "Failed to save batch");
    }
  };

  const handleEdit = (batch) => {
    setEditingBatch(batch);
    setFormData({
      course_id: batch.course_id,
      course_slug: batch.course_slug,
      batch_name: batch.batch_name,
      batch_code: batch.batch_code,
      start_date: batch.start_date,
      end_date: batch.end_date || "",
      max_students: batch.max_students,
      status: batch.status,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this batch?")) return;

    try {
      const response = await fetch(`/api/admin/batches?id=${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        showMessage("success", "Batch deleted successfully!");
        fetchBatches();
      } else {
        showMessage("error", data.error || "Failed to delete batch");
      }
    } catch (error) {
      console.error("Error deleting batch:", error);
      showMessage("error", "Failed to delete batch");
    }
  };

  const handleViewDetails = async (batch) => {
    setSelectedBatch(batch);
    await fetchBatchStudents(batch.id);
    setShowDetailsModal(true);
  };

  const handleAddStudent = async (studentId) => {
    try {
      const response = await fetch("/api/admin/batches/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          batch_id: selectedBatch.id,
          student_id: studentId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        showMessage("success", "Student added to batch successfully!");
        await fetchBatchStudents(selectedBatch.id);
        setShowAddStudentModal(false);
      } else {
        showMessage("error", data.error || "Failed to add student");
      }
    } catch (error) {
      console.error("Error adding student:", error);
      showMessage("error", "Failed to add student");
    }
  };

  const handleRemoveStudent = async (studentId) => {
    if (!confirm("Are you sure you want to remove this student from the batch?")) return;

    try {
      const response = await fetch("/api/admin/batches/students", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          batch_id: selectedBatch.id,
          student_id: studentId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        showMessage("success", "Student removed from batch successfully!");
        await fetchBatchStudents(selectedBatch.id);
      } else {
        showMessage("error", data.error || "Failed to remove student");
      }
    } catch (error) {
      console.error("Error removing student:", error);
      showMessage("error", "Failed to remove student");
    }
  };

  const resetForm = () => {
    setEditingBatch(null);
    setFormData({
      course_id: "",
      course_slug: "",
      batch_name: "",
      batch_code: "",
      start_date: "",
      end_date: "",
      max_students: 30,
      status: "upcoming",
    });
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  const handleCourseChange = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    if (course) {
      setFormData({
        ...formData,
        course_id: courseId,
        course_slug: course.slug,
      });
    }
  };

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      upcoming: styles.statusUpcoming,
      active: styles.statusActive,
      completed: styles.statusCompleted,
    };
    return statusMap[status] || styles.statusUpcoming;
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading batches...</p>
      </div>
    );
  }

  const activeBatches = batches.filter(b => b.status === "active").length;
  const upcomingBatches = batches.filter(b => b.status === "upcoming").length;
  const totalStudents = batches.reduce((sum, b) => sum + (b.student_count || 0), 0);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Batch Management</h1>
          <p className={styles.subtitle}>Manage course batches and student assignments</p>
        </div>
        <button
          className={styles.addBtn}
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          <span className={styles.addIcon}>➕</span>
          Create New Batch
        </button>
      </div>

      {message.text && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}

      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📚</div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Total Batches</p>
            <h3 className={styles.statValue}>{batches.length}</h3>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>✅</div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Active Batches</p>
            <h3 className={styles.statValue}>{activeBatches}</h3>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📅</div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Upcoming Batches</p>
            <h3 className={styles.statValue}>{upcomingBatches}</h3>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🎓</div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Total Students</p>
            <h3 className={styles.statValue}>{totalStudents}</h3>
          </div>
        </div>
      </div>

      {/* Batches Grid */}
      {batches.length > 0 ? (
        <div className={styles.batchesGrid}>
          {batches.map((batch) => (
            <div key={batch.id} className={styles.batchCard}>
              <div className={styles.batchHeader}>
                <div className={styles.batchIcon}>
                  {courses.find(c => c.id === batch.course_id)?.icon || "📚"}
                </div>
                <span className={`${styles.statusBadge} ${getStatusBadgeClass(batch.status)}`}>
                  {batch.status}
                </span>
              </div>

              <h3 className={styles.batchName}>{batch.batch_name}</h3>
              <p className={styles.batchCode}>{batch.batch_code}</p>
              <p className={styles.courseName}>
                {courses.find(c => c.id === batch.course_id)?.title || "Unknown Course"}
              </p>

              <div className={styles.batchDetails}>
                <div className={styles.batchDetail}>
                  <span className={styles.detailIcon}>📅</span>
                  <span>Start: {new Date(batch.start_date).toLocaleDateString()}</span>
                </div>
                {batch.end_date && (
                  <div className={styles.batchDetail}>
                    <span className={styles.detailIcon}>🏁</span>
                    <span>End: {new Date(batch.end_date).toLocaleDateString()}</span>
                  </div>
                )}
                <div className={styles.batchDetail}>
                  <span className={styles.detailIcon}>🎓</span>
                  <span>{batch.student_count || 0} / {batch.max_students} students</span>
                </div>
              </div>

              <div className={styles.batchFooter}>
                <button
                  className={styles.viewBtn}
                  onClick={() => handleViewDetails(batch)}
                >
                  View Details
                </button>
                <div className={styles.batchActions}>
                  <button className={styles.editBtn} onClick={() => handleEdit(batch)}>
                    ✏️
                  </button>
                  <button className={styles.deleteBtn} onClick={() => handleDelete(batch.id)}>
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📚</div>
          <h3>No Batches Found</h3>
          <p>Create your first batch to get started</p>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {editingBatch ? "Edit Batch" : "Create New Batch"}
              </h2>
              <button className={styles.closeBtn} onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.modalBody}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Course *</label>
                  <select
                    required
                    value={formData.course_id}
                    onChange={(e) => handleCourseChange(e.target.value)}
                    className={styles.formSelect}
                  >
                    <option value="">-- Select Course --</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.icon} {course.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Batch Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.batch_name}
                    onChange={(e) => setFormData({ ...formData, batch_name: e.target.value })}
                    className={styles.formInput}
                    placeholder="e.g., Morning Batch"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Batch Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.batch_code}
                    onChange={(e) => setFormData({ ...formData, batch_code: e.target.value })}
                    className={styles.formInput}
                    placeholder="e.g., JB-JUN-2026"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Start Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>End Date</label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Max Students *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.max_students}
                    onChange={(e) => setFormData({ ...formData, max_students: parseInt(e.target.value) })}
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Status *</label>
                  <select
                    required
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className={styles.formSelect}
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className={styles.formActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles.submitBtn}>
                  {editingBatch ? "Update Batch" : "Create Batch"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Batch Details Modal */}
      {showDetailsModal && selectedBatch && (
        <div className={styles.modalOverlay} onClick={() => setShowDetailsModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {selectedBatch.batch_name} - Details
              </h2>
              <button className={styles.closeBtn} onClick={() => setShowDetailsModal(false)}>
                ✕
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.detailsSection}>
                <h3 className={styles.sectionTitle}>Batch Information</h3>
                <div className={styles.detailsGrid}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Batch Code:</span>
                    <span className={styles.detailValue}>{selectedBatch.batch_code}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Course:</span>
                    <span className={styles.detailValue}>
                      {courses.find(c => c.id === selectedBatch.course_id)?.title}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Status:</span>
                    <span className={`${styles.statusBadge} ${getStatusBadgeClass(selectedBatch.status)}`}>
                      {selectedBatch.status}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Start Date:</span>
                    <span className={styles.detailValue}>
                      {new Date(selectedBatch.start_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.detailsSection}>
                <div className={styles.sectionHeader}>
                  <h3 className={styles.sectionTitle}>
                    Students ({batchStudents.length} / {selectedBatch.max_students})
                  </h3>
                  <button
                    className={styles.addStudentBtn}
                    onClick={() => setShowAddStudentModal(true)}
                    disabled={batchStudents.length >= selectedBatch.max_students}
                  >
                    ➕ Add Student
                  </button>
                </div>

                {batchStudents.length > 0 ? (
                  <div className={styles.studentsList}>
                    {batchStudents.map((student) => (
                      <div key={student.id} className={styles.studentItem}>
                        <div className={styles.studentInfo}>
                          <div className={styles.studentAvatar}>
                            {student.name?.charAt(0).toUpperCase() || student.email?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className={styles.studentName}>{student.name}</p>
                            <p className={styles.studentEmail}>{student.email}</p>
                          </div>
                        </div>
                        <button
                          className={styles.removeStudentBtn}
                          onClick={() => handleRemoveStudent(student.id)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.emptySection}>
                    <p>No students assigned to this batch yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddStudentModal && (
        <div className={styles.modalOverlay} onClick={() => setShowAddStudentModal(false)}>
          <div className={styles.smallModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Add Student to Batch</h2>
              <button className={styles.closeBtn} onClick={() => setShowAddStudentModal(false)}>
                ✕
              </button>
            </div>

            <div className={styles.modalBody}>
              {availableStudents.length > 0 ? (
                <div className={styles.studentsList}>
                  {availableStudents.map((student) => (
                    <div key={student.id} className={styles.studentItem}>
                      <div className={styles.studentInfo}>
                        <div className={styles.studentAvatar}>
                          {student.name?.charAt(0).toUpperCase() || student.email?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className={styles.studentName}>{student.name}</p>
                          <p className={styles.studentEmail}>{student.email}</p>
                        </div>
                      </div>
                      <button
                        className={styles.addStudentBtnSmall}
                        onClick={() => handleAddStudent(student.id)}
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.emptySection}>
                  <p>No available students to add</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
