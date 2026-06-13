"use client";
import { useEffect, useState } from "react";
import styles from "./courses.module.css";

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    subtitle: "",
    description: "",
    long_description: "",
    level: "Beginner",
    duration_months: 4,
    price: 0,
    icon: "",
    badge: "",
    badge_type: "fun",
    next_batch_date: "",
    is_active: true,
  });
  const [syllabus, setSyllabus] = useState([]);
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, [searchTerm, statusFilter]);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (statusFilter) params.append("is_active", statusFilter);

      const response = await fetch(`/api/admin/courses?${params}`);
      const data = await response.json();

      if (data.success) {
        setCourses(data.courses || []);
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "/api/admin/courses";
      const method = editingCourse ? "PUT" : "POST";

      const payload = {
        ...formData,
        syllabus: syllabus.map((s) => ({
          month_number: s.month_number,
          title: s.title,
          topics: Array.isArray(s.topics) ? s.topics : s.topics.split(",").map((t) => t.trim()),
        })),
        faqs: faqs.map((f, idx) => ({
          question: f.question,
          answer: f.answer,
          display_order: f.display_order || idx,
        })),
      };

      if (editingCourse) {
        payload.id = editingCourse.id;
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        alert(editingCourse ? "Course updated successfully!" : "Course created successfully!");
        setShowModal(false);
        resetForm();
        fetchCourses();
      } else {
        alert(data.error || "Failed to save course");
      }
    } catch (error) {
      console.error("Error saving course:", error);
      alert("Failed to save course");
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      slug: course.slug,
      title: course.title,
      subtitle: course.subtitle || "",
      description: course.description || "",
      long_description: course.long_description || "",
      level: course.level,
      duration_months: course.duration_months,
      price: course.price,
      icon: course.icon || "",
      badge: course.badge || "",
      badge_type: course.badge_type || "fun",
      next_batch_date: course.next_batch_date || "",
      is_active: course.is_active,
    });
    setSyllabus(
      course.course_syllabus?.map((s) => ({
        month_number: s.month_number,
        title: s.title,
        topics: Array.isArray(s.topics) ? s.topics.join(", ") : s.topics,
      })) || []
    );
    setFaqs(
      course.course_faqs?.map((f) => ({
        question: f.question,
        answer: f.answer,
        display_order: f.display_order,
      })) || []
    );
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this course?")) return;

    try {
      const response = await fetch(`/api/admin/courses?id=${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        alert("Course deleted successfully!");
        fetchCourses();
      } else {
        alert(data.error || "Failed to delete course");
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("Failed to delete course");
    }
  };

  const toggleActive = async (course) => {
    try {
      const response = await fetch("/api/admin/courses", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: course.id,
          is_active: !course.is_active,
        }),
      });

      const data = await response.json();

      if (data.success) {
        fetchCourses();
      } else {
        alert(data.error || "Failed to update course status");
      }
    } catch (error) {
      console.error("Error updating course status:", error);
      alert("Failed to update course status");
    }
  };

  const resetForm = () => {
    setEditingCourse(null);
    setActiveTab("basic");
    setFormData({
      slug: "",
      title: "",
      subtitle: "",
      description: "",
      long_description: "",
      level: "Beginner",
      duration_months: 4,
      price: 0,
      icon: "",
      badge: "",
      badge_type: "fun",
      next_batch_date: "",
      is_active: true,
    });
    setSyllabus([]);
    setFaqs([]);
  };

  const addSyllabusModule = () => {
    setSyllabus([...syllabus, { month_number: syllabus.length + 1, title: "", topics: "" }]);
  };

  const removeSyllabusModule = (index) => {
    setSyllabus(syllabus.filter((_, i) => i !== index));
  };

  const updateSyllabusModule = (index, field, value) => {
    const updated = [...syllabus];
    updated[index][field] = value;
    setSyllabus(updated);
  };

  const addFaq = () => {
    setFaqs([...faqs, { question: "", answer: "", display_order: faqs.length }]);
  };

  const removeFaq = (index) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const updateFaq = (index, field, value) => {
    const updated = [...faqs];
    updated[index][field] = value;
    setFaqs(updated);
  };

  const getBadgeClass = (badgeType) => {
    const badgeMap = {
      fun: styles.badgeFun,
      popular: styles.badgePopular,
      bestseller: styles.badgeBestseller,
      trending: styles.badgeTrending,
      advanced: styles.badgeAdvanced,
      new: styles.badgeNew,
    };
    return badgeMap[badgeType] || styles.badgeFun;
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading courses...</p>
      </div>
    );
  }

  const activeCourses = courses.filter((c) => c.is_active).length;
  const upcomingBatches = courses.filter(
    (c) => c.next_batch_date && new Date(c.next_batch_date) > new Date()
  ).length;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Courses Management</h1>
          <p className={styles.subtitle}>Manage all courses, syllabus, and FAQs</p>
        </div>
        <button
          className={styles.addBtn}
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          <span className={styles.addIcon}>➕</span>
          Add New Course
        </button>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>

        <button
          className={styles.resetBtn}
          onClick={() => {
            setSearchTerm("");
            setStatusFilter("");
          }}
        >
          Reset Filters
        </button>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📚</div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Total Courses</p>
            <h3 className={styles.statValue}>{courses.length}</h3>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>✅</div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Active Courses</p>
            <h3 className={styles.statValue}>{activeCourses}</h3>
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
            <h3 className={styles.statValue}>
              {courses.reduce((sum, c) => sum + (c.students_enrolled || 0), 0)}
            </h3>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      {courses.length > 0 ? (
        <div className={styles.coursesGrid}>
          {courses.map((course) => (
            <div key={course.id} className={styles.courseCard}>
              <div className={styles.courseHeader}>
                <div className={styles.courseIcon}>{course.icon || "📚"}</div>
                <div className={styles.courseHeaderRight}>
                  {course.badge && (
                    <span className={`${styles.courseBadge} ${getBadgeClass(course.badge_type)}`}>
                      {course.badge}
                    </span>
                  )}
                  <span className={styles.levelBadge}>{course.level}</span>
                </div>
              </div>

              <h3 className={styles.courseTitle}>{course.title}</h3>
              <p className={styles.courseSubtitle}>{course.subtitle}</p>
              <p className={styles.courseDescription}>{course.description}</p>

              <div className={styles.courseDetails}>
                <div className={styles.courseDetail}>
                  <span className={styles.detailIcon}>⏱️</span>
                  <span>{course.duration_months} months</span>
                </div>
                <div className={styles.courseDetail}>
                  <span className={styles.detailIcon}>💰</span>
                  <span>₹{course.price}</span>
                </div>
              </div>

              {course.next_batch_date && (
                <div className={styles.batchDate}>
                  <span className={styles.detailIcon}>📅</span>
                  Next Batch: {new Date(course.next_batch_date).toLocaleDateString()}
                </div>
              )}

              <div className={styles.courseFooter}>
                <div className={styles.studentsCount}>
                  <span className={styles.detailIcon}>🎓</span>
                  {course.students_enrolled || 0} enrolled
                </div>
                <div className={styles.courseActions}>
                  <label className={styles.toggleSwitch}>
                    <input
                      type="checkbox"
                      checked={course.is_active}
                      onChange={() => toggleActive(course)}
                    />
                    <span className={styles.toggleSlider}></span>
                  </label>
                  <button className={styles.editBtn} onClick={() => handleEdit(course)}>
                    ✏️
                  </button>
                  <button className={styles.deleteBtn} onClick={() => handleDelete(course.id)}>
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
          <h3>No Courses Found</h3>
          <p>Create your first course to get started</p>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {editingCourse ? "Edit Course" : "Create New Course"}
              </h2>
              <button className={styles.closeBtn} onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>

            {/* Tabs */}
            <div className={styles.tabs}>
              <button
                className={`${styles.tab} ${activeTab === "basic" ? styles.tabActive : ""}`}
                onClick={() => setActiveTab("basic")}
              >
                📝 Basic Info
              </button>
              <button
                className={`${styles.tab} ${activeTab === "syllabus" ? styles.tabActive : ""}`}
                onClick={() => setActiveTab("syllabus")}
              >
                📖 Syllabus
              </button>
              <button
                className={`${styles.tab} ${activeTab === "faqs" ? styles.tabActive : ""}`}
                onClick={() => setActiveTab("faqs")}
              >
                ❓ FAQs
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.modalBody}>
              {/* Basic Info Tab */}
              {activeTab === "basic" && (
                <div className={styles.tabContent}>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Slug *</label>
                      <input
                        type="text"
                        required
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className={styles.formInput}
                        placeholder="e.g., python-basics"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Title *</label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className={styles.formInput}
                        placeholder="Course title"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Subtitle</label>
                      <input
                        type="text"
                        value={formData.subtitle}
                        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                        className={styles.formInput}
                        placeholder="Course subtitle"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Level *</label>
                      <select
                        required
                        value={formData.level}
                        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                        className={styles.formSelect}
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Beginner–Intermediate">Beginner–Intermediate</option>
                        <option value="Intermediate–Advanced">Intermediate–Advanced</option>
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Duration (months) *</label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={formData.duration_months}
                        onChange={(e) =>
                          setFormData({ ...formData, duration_months: parseInt(e.target.value) })
                        }
                        className={styles.formInput}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Price (₹) *</label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: parseFloat(e.target.value) })
                        }
                        className={styles.formInput}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Icon (emoji)</label>
                      <input
                        type="text"
                        value={formData.icon}
                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                        className={styles.formInput}
                        placeholder="e.g., 🐍"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Badge</label>
                      <input
                        type="text"
                        value={formData.badge}
                        onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                        className={styles.formInput}
                        placeholder="e.g., Most Popular"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Badge Type</label>
                      <select
                        value={formData.badge_type}
                        onChange={(e) => setFormData({ ...formData, badge_type: e.target.value })}
                        className={styles.formSelect}
                      >
                        <option value="fun">Fun</option>
                        <option value="popular">Popular</option>
                        <option value="bestseller">Bestseller</option>
                        <option value="trending">Trending</option>
                        <option value="advanced">Advanced</option>
                        <option value="new">New</option>
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Next Batch Date</label>
                      <input
                        type="date"
                        value={formData.next_batch_date}
                        onChange={(e) =>
                          setFormData({ ...formData, next_batch_date: e.target.value })
                        }
                        className={styles.formInput}
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className={styles.formTextarea}
                      placeholder="Short description"
                      rows="3"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Long Description</label>
                    <textarea
                      value={formData.long_description}
                      onChange={(e) =>
                        setFormData({ ...formData, long_description: e.target.value })
                      }
                      className={styles.formTextarea}
                      placeholder="Detailed description"
                      rows="5"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      />
                      <span>Active</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Syllabus Tab */}
              {activeTab === "syllabus" && (
                <div className={styles.tabContent}>
                  <div className={styles.syllabusSection}>
                    <div className={styles.sectionHeader}>
                      <h3 className={styles.sectionTitle}>Course Syllabus</h3>
                      <button
                        type="button"
                        className={styles.addItemBtn}
                        onClick={addSyllabusModule}
                      >
                        ➕ Add Module
                      </button>
                    </div>

                    {syllabus.length > 0 ? (
                      <div className={styles.itemsList}>
                        {syllabus.map((module, index) => (
                          <div key={index} className={styles.syllabusItem}>
                            <div className={styles.itemHeader}>
                              <span className={styles.itemNumber}>Month {module.month_number}</span>
                              <button
                                type="button"
                                className={styles.removeItemBtn}
                                onClick={() => removeSyllabusModule(index)}
                              >
                                🗑️
                              </button>
                            </div>
                            <div className={styles.formGroup}>
                              <label className={styles.formLabel}>Month Number</label>
                              <input
                                type="number"
                                min="1"
                                value={module.month_number}
                                onChange={(e) =>
                                  updateSyllabusModule(index, "month_number", parseInt(e.target.value))
                                }
                                className={styles.formInput}
                              />
                            </div>
                            <div className={styles.formGroup}>
                              <label className={styles.formLabel}>Title</label>
                              <input
                                type="text"
                                value={module.title}
                                onChange={(e) => updateSyllabusModule(index, "title", e.target.value)}
                                className={styles.formInput}
                                placeholder="Module title"
                              />
                            </div>
                            <div className={styles.formGroup}>
                              <label className={styles.formLabel}>Topics (comma-separated)</label>
                              <textarea
                                value={module.topics}
                                onChange={(e) => updateSyllabusModule(index, "topics", e.target.value)}
                                className={styles.formTextarea}
                                placeholder="Topic 1, Topic 2, Topic 3"
                                rows="3"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={styles.emptySection}>
                        <p>No syllabus modules added yet</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* FAQs Tab */}
              {activeTab === "faqs" && (
                <div className={styles.tabContent}>
                  <div className={styles.faqsSection}>
                    <div className={styles.sectionHeader}>
                      <h3 className={styles.sectionTitle}>Course FAQs</h3>
                      <button type="button" className={styles.addItemBtn} onClick={addFaq}>
                        ➕ Add FAQ
                      </button>
                    </div>

                    {faqs.length > 0 ? (
                      <div className={styles.itemsList}>
                        {faqs.map((faq, index) => (
                          <div key={index} className={styles.faqItem}>
                            <div className={styles.itemHeader}>
                              <span className={styles.itemNumber}>FAQ {index + 1}</span>
                              <button
                                type="button"
                                className={styles.removeItemBtn}
                                onClick={() => removeFaq(index)}
                              >
                                🗑️
                              </button>
                            </div>
                            <div className={styles.formGroup}>
                              <label className={styles.formLabel}>Question</label>
                              <input
                                type="text"
                                value={faq.question}
                                onChange={(e) => updateFaq(index, "question", e.target.value)}
                                className={styles.formInput}
                                placeholder="Enter question"
                              />
                            </div>
                            <div className={styles.formGroup}>
                              <label className={styles.formLabel}>Answer</label>
                              <textarea
                                value={faq.answer}
                                onChange={(e) => updateFaq(index, "answer", e.target.value)}
                                className={styles.formTextarea}
                                placeholder="Enter answer"
                                rows="3"
                              />
                            </div>
                            <div className={styles.formGroup}>
                              <label className={styles.formLabel}>Display Order</label>
                              <input
                                type="number"
                                min="0"
                                value={faq.display_order}
                                onChange={(e) =>
                                  updateFaq(index, "display_order", parseInt(e.target.value))
                                }
                                className={styles.formInput}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={styles.emptySection}>
                        <p>No FAQs added yet</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className={styles.formActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles.submitBtn}>
                  {editingCourse ? "Update Course" : "Create Course"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
