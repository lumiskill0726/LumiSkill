"use client";
import { useState } from "react";
import styles from "./notifications.module.css";

export default function AdminNotifications() {
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    url: "/",
    image: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setMessage({ type: "", text: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch("/api/admin/send-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send notification");
      }

      setMessage({
        type: "success",
        text: data.message || "Notification sent successfully!",
      });

      // Reset form
      setFormData({
        title: "",
        body: "",
        url: "/",
        image: "",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Failed to send notification",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Send Push Notification</h1>
        <p className={styles.subtitle}>
          Send notifications to all subscribed users
        </p>
      </div>

      <div className={styles.content}>
        <div className={styles.formSection}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="title" className={styles.label}>
                Notification Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={styles.input}
                placeholder="New Course Available!"
                required
                maxLength={50}
              />
              <span className={styles.hint}>
                {formData.title.length}/50 characters
              </span>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="body" className={styles.label}>
                Message *
              </label>
              <textarea
                id="body"
                name="body"
                value={formData.body}
                onChange={handleChange}
                className={styles.textarea}
                placeholder="Check out our new Python course for beginners!"
                required
                maxLength={200}
                rows={4}
              />
              <span className={styles.hint}>
                {formData.body.length}/200 characters
              </span>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="url" className={styles.label}>
                Click URL
              </label>
              <input
                type="text"
                id="url"
                name="url"
                value={formData.url}
                onChange={handleChange}
                className={styles.input}
                placeholder="/courses"
              />
              <span className={styles.hint}>
                Where users go when they click the notification
              </span>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="image" className={styles.label}>
                Image URL (Optional)
              </label>
              <input
                type="url"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className={styles.input}
                placeholder="https://example.com/image.jpg"
              />
              <span className={styles.hint}>
                Large image to display in notification
              </span>
            </div>

            {message.text && (
              <div
                className={`${styles.message} ${
                  message.type === "success"
                    ? styles.messageSuccess
                    : styles.messageError
                }`}
              >
                {message.text}
              </div>
            )}

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className={styles.spinner}></span>
                  Sending...
                </>
              ) : (
                <>
                  <span>📤</span>
                  Send Notification
                </>
              )}
            </button>
          </form>
        </div>

        <div className={styles.previewSection}>
          <h3 className={styles.previewTitle}>Preview</h3>
          <div className={styles.notificationPreview}>
            <div className={styles.previewHeader}>
              <img
                src="/logo-white.png"
                alt="LumiSkill"
                className={styles.previewLogo}
              />
              <span className={styles.previewAppName}>LumiSkill</span>
            </div>
            <div className={styles.previewContent}>
              <h4 className={styles.previewNotifTitle}>
                {formData.title || "Notification Title"}
              </h4>
              <p className={styles.previewNotifBody}>
                {formData.body || "Your notification message will appear here"}
              </p>
              {formData.image && (
                <img
                  src={formData.image}
                  alt="Notification"
                  className={styles.previewImage}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              )}
            </div>
          </div>

          <div className={styles.infoBox}>
            <h4 className={styles.infoTitle}>📊 Notification Info</h4>
            <ul className={styles.infoList}>
              <li>✅ Logo: LumiSkill logo (automatic)</li>
              <li>✅ Icon: LumiSkill icon (automatic)</li>
              <li>✅ Badge: LumiSkill badge (automatic)</li>
              <li>📱 Vibration: Enabled</li>
              <li>🔔 Sound: System default</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
