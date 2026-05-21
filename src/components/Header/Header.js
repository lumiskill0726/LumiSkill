"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Header.module.css";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [menuOpen]);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={`container ${styles.inner}`}>
        {/* Logo */}
        <Link
          href="/"
          className={styles.logo}
          onClick={() => setMenuOpen(false)}
        >
          <div className={`${styles.logoIcon} ${scrolled ? styles.scrolled : ""}`}>
            <Image
              src={scrolled ? "/logo-transparent.jpg" : "/logo-white.png"}
              alt="LumiSkill Logo"
              width={80}
              height={64}
              className={styles.logoImage}
              style={{ width: '100%', height: 'auto' }}
              priority
            />
          </div>
          <span className={styles.logoText}>
            Lumi<span className={styles.logoAccent}>Skill</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className={styles.nav}>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={styles.navLink}>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA Buttons */}
        <div className={styles.actions}>
          <Link href="/contact" className={`btn btn-outline ${styles.btnDemo}`}>
            Free Demo
          </Link>
          <Link
            href="/courses"
            className={`btn btn-primary ${styles.btnEnroll}`}
          >
            Enroll Now 🚀
          </Link>
        </div>

        {/* Hamburger */}
        <button
          className={`${styles.hamburger} ${menuOpen ? styles.active : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.open : ""}`}>
        <nav className={styles.mobileNav}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={styles.mobileNavLink}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className={styles.mobileCtas}>
            <Link
              href="/contact"
              className="btn btn-outline"
              onClick={() => setMenuOpen(false)}
            >
              Free Demo Class
            </Link>
            <Link
              href="/courses"
              className="btn btn-primary"
              onClick={() => setMenuOpen(false)}
            >
              Enroll Now 🚀
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
