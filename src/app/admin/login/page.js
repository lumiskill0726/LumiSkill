"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";

export default function AdminLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Redirect to dashboard
      router.push("/admin/dashboard");
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>🎓</span>
            <h1 className={styles.logoText}>
              Lumi<span className={styles.logoAccent}>Skill</span>
            </h1>
          </div>
          <h2 className={styles.title}>Admin Login</h2>
          <p className={styles.subtitle}>
            Access your dashboard to manage leads and analytics
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
              placeholder="admin@lumiskill.com"
              required
              autoComplete="email"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className={styles.spinner}></span>
                Logging in...
              </>
            ) : (
              "Login to Dashboard"
            )}
          </button>
        </form>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            🔒 Secure admin access only
          </p>
        </div>
      </div>
    </div>
  );
}
