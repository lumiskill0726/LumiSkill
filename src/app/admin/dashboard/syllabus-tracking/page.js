"use client";
import { useEffect, useState } from "react";
import styles from "./syllabus-tracking.module.css";

export default function SyllabusTrackingPage() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [syllabusData, setSyllabusData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch("/api/admin/courses");
      const data = await response.json();
      if (data.success) {
        setCourses(data.courses || []);
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      showMessage("error", "Failed to load courses");
    }
  };

  const fetchBatchesForCourse = async (courseSlug) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/batches?course_slug=${courseSlug}`);
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

  const fetchSyllabusForBatch = async (batchId) => {
    setIsLoading(true);
    
    try {
      // Fetch syllabus tracking for this batch
      const syllabusResponse = await fetch(`/api/admin/batches/syllabus?batch_id=${batchId}`);
      const syllabusResult = await syllabusResponse.json();
      
      if (syllabusResult.success && syllabusResult.syllabus.length > 0) {
        setSyllabusData(syllabusResult.syllabus);
      } else {
        showMessage("error", "No syllabus data found for this batch.");
      }
    } catch (error) {
      console.error("Failed to fetch syllabus:", error);
      showMessage("error", "Failed to load syllabus");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCourseChange = (courseSlug) => {
    setSelectedCourse(courseSlug);
    setSelectedBatch("");
    setSyllabusData([]);
    setBatches([]);
    
    if (courseSlug) {
      fetchBatchesForCourse(courseSlug);
    }
  };

  const handleBatchChange = (batchId) => {
    setSelectedBatch(batchId);
    setSyllabusData([]);
    
    if (batchId) {
      fetchSyllabusForBatch(batchId);
    }
  };

  const handleTopicToggle = (monthIndex, topicIndex) => {
    const updatedSyllabus = [...syllabusData];
    updatedSyllabus[monthIndex].topics[topicIndex].completed = 
      !updatedSyllabus[monthIndex].topics[topicIndex].completed;
    setSyllabusData(updatedSyllabus);
  };

  const handleSaveProgress = async () => {
    setIsSaving(true);
    try {
      // Prepare updates for batch syllabus
      const updates = syllabusData.map(month => ({
        month_number: month.month_number,
        topics: month.topics
      }));

      // Send update to batch syllabus API
      const response = await fetch("/api/admin/batches/syllabus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          batch_id: selectedBatch,
          updates: updates
        })
      });

      const data = await response.json();

      if (data.success) {
        const batch = batches.find(b => b.id === selectedBatch);
        showMessage("success", `Progress updated for batch successfully!`);
        // Refresh syllabus data
        fetchSyllabusForBatch(selectedBatch);
      } else {
        showMessage("error", data.error || "Failed to save progress");
      }
    } catch (error) {
      console.error("Failed to save progress:", error);
      showMessage("error", "Failed to save progress");
    } finally {
      setIsSaving(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  const getSelectedCourseName = () => {
    const course = courses.find(c => c.slug === selectedCourse);
    return course?.title || "";
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Syllabus Tracking</h1>
          <p className={styles.subtitle}>Track and update student progress</p>
        </div>
      </div>

      {message.text && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}

      {/* Course Selection */}
      <div className={styles.section}>
        <label className={styles.label}>Select Course</label>
        <select
          className={styles.select}
          value={selectedCourse}
          onChange={(e) => handleCourseChange(e.target.value)}
        >
          <option value="">-- Select a Course --</option>
          {courses.map((course) => (
            <option key={course.id} value={course.slug}>
              {course.icon} {course.title} ({course.level})
            </option>
          ))}
        </select>
      </div>

      {/* Batch Selection */}
      {selectedCourse && !selectedBatch && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            Select Batch - {getSelectedCourseName()}
          </h2>
          
          {isLoading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Loading batches...</p>
            </div>
          ) : batches.length > 0 ? (
            <div className={styles.batchesGrid}>
              {batches.map((batch) => (
                <div key={batch.id} className={styles.batchCard}>
                  <div className={styles.batchIcon}>📅</div>
                  <div className={styles.batchInfo}>
                    <h3 className={styles.batchName}>{batch.batch_name}</h3>
                    <p className={styles.batchMeta}>
                      {batch.student_count || 0} Student{batch.student_count !== 1 ? 's' : ''} Enrolled
                    </p>
                  </div>
                  <button
                    className={styles.viewBtn}
                    onClick={() => handleBatchChange(batch.id)}
                  >
                    View Syllabus
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📅</div>
              <h3>No Batches Found</h3>
              <p>No batches available for this course yet</p>
            </div>
          )}
        </div>
      )}

      {/* Syllabus Editing View */}
      {selectedBatch && (
        <div className={styles.section}>
          <div className={styles.syllabusHeader}>
            <button
              className={styles.backBtn}
              onClick={() => {
                setSelectedBatch("");
                setSyllabusData([]);
              }}
            >
              ← Back to Batches
            </button>
            <div className={styles.studentHeader}>
              <h2 className={styles.sectionTitle}>
                {batches.find(b => b.id === selectedBatch)?.batch_name} - Syllabus Progress
              </h2>
              <p className={styles.studentEmail}>
                {batches.find(b => b.id === selectedBatch)?.student_count || 0} students in this batch
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Loading syllabus...</p>
            </div>
          ) : syllabusData.length > 0 ? (
            <>
              <div className={styles.syllabusGrid}>
                {syllabusData.map((month, monthIndex) => {
                  const completedCount = month.topics.filter(t => t.completed).length;
                  const totalCount = month.topics.length;
                  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

                  return (
                    <div key={month.id} className={styles.monthCard}>
                      <div className={styles.monthHeader}>
                        <div className={styles.monthNumber}>
                          Month {month.month_number}
                        </div>
                        <div className={styles.monthInfo}>
                          <h3 className={styles.monthTitle}>{month.month_title}</h3>
                          <div className={styles.monthMeta}>
                            <span className={`${styles.statusBadge} ${styles[month.status]}`}>
                              {month.status === 'completed' ? '✅ Completed' :
                               month.status === 'in_progress' ? '🔄 In Progress' :
                               '⏳ Not Started'}
                            </span>
                            <span className={styles.progressText}>
                              {completedCount}/{totalCount} Topics ({percentage}%)
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className={styles.topicsList}>
                        {month.topics.map((topic, topicIndex) => (
                          <label
                            key={topicIndex}
                            className={`${styles.topicItem} ${topic.completed ? styles.completed : ''}`}
                          >
                            <input
                              type="checkbox"
                              checked={topic.completed}
                              onChange={() => handleTopicToggle(monthIndex, topicIndex)}
                              className={styles.checkbox}
                            />
                            <span className={styles.topicName}>{topic.topic}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className={styles.saveSection}>
                <button
                  className={styles.saveBtn}
                  onClick={handleSaveProgress}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "💾 Update All Students in Batch"}
                </button>
              </div>
            </>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📚</div>
              <h3>No Syllabus Data</h3>
              <p>Syllabus tracking data not available for this batch</p>
            </div>
          )}
        </div>
      )}

      {/* Initial Empty State */}
      {!selectedCourse && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>✅</div>
          <h3>Select a Course to Begin</h3>
          <p>Choose a course from the dropdown above to view enrolled students and track their progress</p>
        </div>
      )}
    </div>
  );
}
