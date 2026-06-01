"use client";
import { useEffect, useState } from "react";
import styles from "./students.module.css";

export default function AdminStudentsPage() {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    phone: "",
    parent_name: "",
    parent_email: "",
    student_class: "",
    password: ""
  });

  useEffect(() => {
    fetchStudents();
  }, [searchTerm, courseFilter, statusFilter]);

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (courseFilter) params.append("course", courseFilter);
      if (statusFilter) params.append("status", statusFilter);

      const response = await fetch(`/api/admin/students?${params}`);
      const data = await response.json();

      if (data.success) {
        setStudents(data.students || []);
      }
    } catch (error) {
      console.error("Failed to fetch students:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/admin/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStudent),
      });

      const data = await response.json();

      if (data.success) {
        alert("Student added successfully!");
        setShowAddModal(false);
        setNewStudent({
          name: "",
          email: "",
          phone: "",
          parent_name: "",
          parent_email: "",
          student_class: "",
          password: ""
        });
        fetchStudents();
      } else {
        alert(data.error || "Failed to add student");
      }
    } catch (error) {
      console.error("Error adding student:", error);
      alert("Failed to add student");
    }
  };

  const viewStudentDetails = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
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
        <p>Loading students...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Students Management</h1>
          <p className={styles.subtitle}>Manage enrolled students and their courses</p>
        </div>
        <button
          className={styles.addBtn}
          onClick={() => setShowAddModal(true)}
        >
          <span className={styles.addIcon}>➕</span>
          Add New Student
        </button>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
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

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="paused">Paused</option>
        </select>

        <button
          className={styles.resetBtn}
          onClick={() => {
            setSearchTerm("");
            setCourseFilter("");
            setStatusFilter("");
          }}
        >
          Reset Filters
        </button>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>👥</div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Total Students</p>
            <h3 className={styles.statValue}>{students.length}</h3>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>✅</div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Active Enrollments</p>
            <h3 className={styles.statValue}>
              {students.filter(s => s.enrollments?.some(e => e.status === 'active')).length}
            </h3>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🎓</div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Completed</p>
            <h3 className={styles.statValue}>
              {students.filter(s => s.enrollments?.some(e => e.status === 'completed')).length}
            </h3>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>⏸️</div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Paused</p>
            <h3 className={styles.statValue}>
              {students.filter(s => s.enrollments?.some(e => e.status === 'paused')).length}
            </h3>
          </div>
        </div>
      </div>

      {/* Students Table */}
      {students.length > 0 ? (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Enrolled Courses</th>
                <th>Payment Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => {
                const activeEnrollments = student.enrollments?.filter(e => e.status === 'active') || [];
                const paidEnrollments = student.enrollments?.filter(e => e.payment_status === 'paid') || [];
                
                return (
                  <tr key={student.id}>
                    <td>
                      <div className={styles.studentInfo}>
                        <div className={styles.studentAvatar}>
                          {student.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className={styles.studentName}>{student.name}</p>
                          <p className={styles.studentClass}>
                            {student.student_class ? `Class ${student.student_class}` : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className={styles.emailCell}>{student.email}</td>
                    <td>{student.phone || 'N/A'}</td>
                    <td>
                      <div className={styles.coursesCell}>
                        {student.enrollments && student.enrollments.length > 0 ? (
                          <>
                            {student.enrollments.slice(0, 2).map((enrollment, idx) => (
                              <span
                                key={idx}
                                className={`${styles.courseBadge} ${styles[enrollment.status]}`}
                              >
                                {enrollment.course_name}
                              </span>
                            ))}
                            {student.enrollments.length > 2 && (
                              <span className={styles.moreCount}>
                                +{student.enrollments.length - 2} more
                              </span>
                            )}
                          </>
                        ) : (
                          <span className={styles.noCourses}>No enrollments</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span
                        className={`${styles.paymentBadge} ${
                          paidEnrollments.length === student.enrollments?.length
                            ? styles.paid
                            : paidEnrollments.length > 0
                            ? styles.partial
                            : styles.pending
                        }`}
                      >
                        {paidEnrollments.length === student.enrollments?.length
                          ? 'Paid'
                          : paidEnrollments.length > 0
                          ? 'Partial'
                          : 'Pending'}
                      </span>
                    </td>
                    <td>
                      <button
                        className={styles.viewBtn}
                        onClick={() => viewStudentDetails(student)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>👥</div>
          <h3>No Students Found</h3>
          <p>No students match your current filters</p>
        </div>
      )}

      {/* Student Details Modal */}
      {showModal && selectedStudent && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Student Details</h2>
              <button
                className={styles.closeBtn}
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Name:</span>
                  <span className={styles.detailValue}>{selectedStudent.name}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Email:</span>
                  <span className={styles.detailValue}>{selectedStudent.email}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Phone:</span>
                  <span className={styles.detailValue}>{selectedStudent.phone || 'N/A'}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Class:</span>
                  <span className={styles.detailValue}>
                    {selectedStudent.student_class || 'N/A'}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Parent Name:</span>
                  <span className={styles.detailValue}>
                    {selectedStudent.parent_name || 'N/A'}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Parent Email:</span>
                  <span className={styles.detailValue}>
                    {selectedStudent.parent_email || 'N/A'}
                  </span>
                </div>
              </div>

              <div className={styles.enrollmentsSection}>
                <h3 className={styles.sectionTitle}>Enrollments</h3>
                {selectedStudent.enrollments && selectedStudent.enrollments.length > 0 ? (
                  <div className={styles.enrollmentsList}>
                    {selectedStudent.enrollments.map((enrollment) => (
                      <div key={enrollment.id} className={styles.enrollmentCard}>
                        <div className={styles.enrollmentHeader}>
                          <h4 className={styles.enrollmentCourse}>
                            {enrollment.course_name}
                          </h4>
                          <span
                            className={`${styles.enrollmentStatus} ${styles[enrollment.status]}`}
                          >
                            {enrollment.status}
                          </span>
                        </div>
                        <div className={styles.enrollmentDetails}>
                          <div className={styles.enrollmentDetail}>
                            <span className={styles.enrollmentLabel}>Level:</span>
                            <span>{enrollment.course_level}</span>
                          </div>
                          <div className={styles.enrollmentDetail}>
                            <span className={styles.enrollmentLabel}>Amount:</span>
                            <span>₹{enrollment.amount_paid}</span>
                          </div>
                          <div className={styles.enrollmentDetail}>
                            <span className={styles.enrollmentLabel}>Payment:</span>
                            <span
                              className={`${styles.paymentBadge} ${styles[enrollment.payment_status]}`}
                            >
                              {enrollment.payment_status}
                            </span>
                          </div>
                          <div className={styles.enrollmentDetail}>
                            <span className={styles.enrollmentLabel}>Start Date:</span>
                            <span>
                              {new Date(enrollment.start_date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className={styles.enrollmentDetail}>
                            <span className={styles.enrollmentLabel}>End Date:</span>
                            <span>
                              {new Date(enrollment.end_date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={styles.noEnrollments}>No enrollments found</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddModal && (
        <div className={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Add New Student</h2>
              <button
                className={styles.closeBtn}
                onClick={() => setShowAddModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddStudent} className={styles.modalBody}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Name *</label>
                  <input
                    type="text"
                    required
                    value={newStudent.name}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, name: e.target.value })
                    }
                    className={styles.formInput}
                    placeholder="Enter student name"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Email *</label>
                  <input
                    type="email"
                    required
                    value={newStudent.email}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, email: e.target.value })
                    }
                    className={styles.formInput}
                    placeholder="student@example.com"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Phone</label>
                  <input
                    type="tel"
                    value={newStudent.phone}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, phone: e.target.value })
                    }
                    className={styles.formInput}
                    placeholder="+91 1234567890"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Class</label>
                  <input
                    type="text"
                    value={newStudent.student_class}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, student_class: e.target.value })
                    }
                    className={styles.formInput}
                    placeholder="e.g., 10th"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Parent Name</label>
                  <input
                    type="text"
                    value={newStudent.parent_name}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, parent_name: e.target.value })
                    }
                    className={styles.formInput}
                    placeholder="Enter parent name"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Parent Email</label>
                  <input
                    type="email"
                    value={newStudent.parent_email}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, parent_email: e.target.value })
                    }
                    className={styles.formInput}
                    placeholder="parent@example.com"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Password *</label>
                  <input
                    type="password"
                    required
                    value={newStudent.password}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, password: e.target.value })
                    }
                    className={styles.formInput}
                    placeholder="Enter password"
                  />
                </div>
              </div>

              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.submitBtn}>
                  Add Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
