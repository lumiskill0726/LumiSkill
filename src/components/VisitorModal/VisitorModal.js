"use client";
import { useState, useEffect } from "react";
import styles from "./VisitorModal.module.css";

export default function VisitorModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if user has already filled the form
    const hasFilledForm = localStorage.getItem("visitor_form_filled");
    
    if (!hasFilledForm) {
      // Show modal after 2 seconds
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Mark as seen even if not filled
    localStorage.setItem("visitor_form_filled", "skipped");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // Basic validation
    if (!formData.name || !formData.email || !formData.phone) {
      setError("All fields are required");
      setIsSubmitting(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      setIsSubmitting(false);
      return;
    }

    // Phone validation (basic)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ""))) {
      setError("Please enter a valid 10-digit phone number");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/visitors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit form");
      }

      // Mark as filled
      localStorage.setItem("visitor_form_filled", "completed");
      
      // Request push notification permission
      requestNotificationPermission();
      
      // Close modal
      setIsOpen(false);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const requestNotificationPermission = async () => {
    if ("Notification" in window && "serviceWorker" in navigator) {
      try {
        const permission = await Notification.requestPermission();
        
        if (permission === "granted") {
          // Register service worker and subscribe to push notifications
          const registration = await navigator.serviceWorker.ready;
          
          // Get VAPID public key from environment
          const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
          
          if (vapidPublicKey) {
            const subscription = await registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
            });

            // Send subscription to server
            await fetch("/api/push-subscribe", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(subscription),
            });
          }
        }
      } catch (error) {
        console.error("Error requesting notification permission:", error);
      }
    }
  };

  // Helper function to convert VAPID key
  const urlBase64ToUint8Array = (base64String) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button
          className={styles.closeBtn}
          onClick={handleClose}
          aria-label="Close"
        >
          ✕
        </button>

        <div className={styles.header}>
          <h2 className={styles.title}>Welcome to LumiSkill! 🎓</h2>
          <p className={styles.subtitle}>
            Get exclusive updates and course offers directly to your inbox
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
              placeholder="your.email@example.com"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phone" className={styles.label}>
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={styles.input}
              placeholder="10-digit mobile number"
              required
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.actions}>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Get Started 🚀"}
            </button>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={handleClose}
            >
              Maybe Later
            </button>
          </div>

          <p className={styles.privacy}>
            We respect your privacy. Your information is safe with us.
          </p>
        </form>
      </div>
    </div>
  );
}
