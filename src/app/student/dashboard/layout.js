"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import styles from "./dashboard.module.css";

export default function StudentLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [student, setStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Verify authentication
    const verifyAuth = async () => {
      try {
        const response = await fetch("/api/student/auth/verify");
        const data = await response.json();

        if (!data.authenticated) {
          router.push("/student/login");
          return;
        }

        setStudent(data.student);
      } catch (error) {
        console.error("Auth verification failed:", error);
        router.push("/student/login");
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/student/auth/logout", { method: "POST" });
      router.push("/student/login");
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
    { href: "/student/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/student/dashboard/courses", label: "My Courses", icon: "📚" },
    { href: "/student/dashboard/notices", label: "Notices", icon: "📢" },
    { href: "/student/dashboard/progress", label: "Progress Reports", icon: "📈" },
    { href: "/student/dashboard/syllabus", label: "Syllabus", icon: "📝" },
    { href: "/student/dashboard/attendance", label: "Attendance", icon: "✅" },
    { href: "/student/dashboard/assignments", label: "Assignments", icon: "📋" },
  ];

  // Get breadcrumbs
  const getBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ label: 'Home', href: '/student/dashboard' }];
    
    let currentPath = '';
    paths.forEach((path, index) => {
      if (path !== 'student' && path !== 'dashboard') {
        currentPath += `/${path}`;
        const navItem = navItems.find(item => item.href.includes(path));
        breadcrumbs.push({
          label: navItem?.label || path.charAt(0).toUpperCase() + path.slice(1),
          href: `/student/dashboard${currentPath}`
        });
      }
    });
    
    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <img 
              src="/logo-white.png" 
              alt="LumiSkill" 
              width={55}
              height={55}
              className={styles.logoImage}
            />
            <span className={styles.logoText}>
              Lumi<span className={styles.logoAccent}>Skill</span>
            </span>
          </div>
          {/* <p className={styles.portalLabel}>Student Portal</p> */}
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
              {student?.name?.charAt(0).toUpperCase()}
            </div>
            <div className={styles.userDetails}>
              <p className={styles.userName}>{student?.name}</p>
              <p className={styles.userRole}>{student?.email}</p>
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
            {navItems.find((item) => item.href === pathname)?.label || "Dashboard"}
          </h1>
          <div className={styles.topBarActions}>
            <span className={styles.welcomeText}>Welcome, {student?.name}</span>
          </div>
        </header>

        {/* Breadcrumbs */}
        <div className={styles.breadcrumbs}>
          {breadcrumbs.map((crumb, index) => (
            <span key={crumb.href} className={styles.breadcrumbItem}>
              {index > 0 && <span className={styles.breadcrumbSeparator}>/</span>}
              {index === breadcrumbs.length - 1 ? (
                <span className={styles.breadcrumbCurrent}>{crumb.label}</span>
              ) : (
                <Link href={crumb.href} className={styles.breadcrumbLink}>
                  {crumb.label}
                </Link>
              )}
            </span>
          ))}
        </div>

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
