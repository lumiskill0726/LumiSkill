"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import VisitorModal from "@/components/VisitorModal/VisitorModal";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();

  const isAdminRoute = pathname.startsWith("/admin");
  const isStudentDashboard = pathname.startsWith("/student/dashboard");
  const isStudentLogin = pathname === "/student/login";

  return (
    <>
      {!isAdminRoute && !isStudentDashboard && !isStudentLogin && <ServiceWorkerRegistration />}
      {!isAdminRoute && !isStudentDashboard && !isStudentLogin && <VisitorModal />}
      {!isAdminRoute && !isStudentDashboard && !isStudentLogin && <Header />}
      
      <main>{children}</main>
      
      {!isAdminRoute && !isStudentDashboard && !isStudentLogin && <Footer />}
    </>
  );
}
