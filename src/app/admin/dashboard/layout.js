"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import styles from "./dashboard.module.css";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Verify authentication
    const verifyAuth = async () => {
      try {
        const response = await fetch("/api/admin/verify");
        const data = await response.json();

        if (!data.authenticated) {
          router.push("/admin/login");
          return;
        }

        setUser(data.user);
      } catch (error) {
        console.error("Auth verification failed:", error);
        router.push("/admin/login");
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading...</p>
      </div>
    );
  }

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/admin/visitors", label: "Visitors", icon: "👥" },
    { href: "/admin/leads", label: "Leads", icon: "📝" },
  ];

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>🎓</span>
            <span className={styles.logoText}>
              Lumi<span className={styles.logoAccent}>Skill</span>
            </span>
          </div>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${
                pathname === item.href ? styles.navItemActive : ""
              }`}
              onClick={() => setIsSidebarOpen(false)}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navLabel}>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className={styles.userDetails}>
              <p className={styles.userName}>{user?.email}</p>
              <p className={styles.userRole}>{user?.role}</p>
            </div>
          </div>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={styles.main}>
        {/* Top Bar */}
        <header className={styles.topBar}>
          <button
            className={styles.menuBtn}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            ☰
          </button>
          <h1 className={styles.pageTitle}>
            {navItems.find((item) => item.href === pathname)?.label || "Admin"}
          </h1>
          <div className={styles.topBarActions}>
            <span className={styles.welcomeText}>Welcome, Admin</span>
          </div>
        </header>

        {/* Page Content */}
        <main className={styles.content}>{children}</main>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className={styles.overlay}
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}
