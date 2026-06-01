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

  return (
    <>
      {!isAdminRoute && !isStudentDashboard && <ServiceWorkerRegistration />}
      {!isAdminRoute && !isStudentDashboard && <VisitorModal />}
      {!isAdminRoute && !isStudentDashboard && <Header />}
      
      <main>{children}</main>
      
      {!isAdminRoute && !isStudentDashboard && <Footer />}
    </>
  );
}
