'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Header.module.css';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/courses', label: 'Courses' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [menuOpen]);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.inner}`}>
        {/* Logo */}
        <Link href="/" className={styles.logo} onClick={() => setMenuOpen(false)}>
          <div className={styles.logoIcon}>
            {/* < / > code logo */}
            <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="lgbg2" x1="0" y1="0" x2="42" y2="42" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#7C3AED"/>
                  <stop offset="1" stopColor="#4C1D95"/>
                </linearGradient>
              </defs>
              {/* Background */}
              <rect width="42" height="42" rx="12" fill="url(#lgbg2)"/>
              {/* Subtle inner glow */}
              <rect x="1" y="1" width="40" height="40" rx="11" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" fill="none"/>
              {/* Left bracket < */}
              <path d="M13 14 L7.5 21 L13 28" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              {/* Right bracket > */}
              <path d="M29 14 L34.5 21 L29 28" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              {/* Gold slash / */}
              <line x1="24" y1="12" x2="18" y2="30" stroke="#FCD34D" strokeWidth="2.8" strokeLinecap="round"/>
            </svg>
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
          <Link href="/courses" className={`btn btn-primary ${styles.btnEnroll}`}>
            Enroll Now 🚀
          </Link>
        </div>

        {/* Hamburger */}
        <button
          className={`${styles.hamburger} ${menuOpen ? styles.active : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.open : ''}`}>
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
            <Link href="/contact" className="btn btn-outline" onClick={() => setMenuOpen(false)}>
              Free Demo Class
            </Link>
            <Link href="/courses" className="btn btn-primary" onClick={() => setMenuOpen(false)}>
              Enroll Now 🚀
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
