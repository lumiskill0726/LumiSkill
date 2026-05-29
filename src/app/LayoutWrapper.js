"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import VisitorModal from "@/components/VisitorModal/VisitorModal";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();

  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <ServiceWorkerRegistration />}
      {!isAdminRoute && <VisitorModal />}
      {!isAdminRoute && <Header />}
      
      <main>{children}</main>
      
      {!isAdminRoute && <Footer />}
    </>
  );
}
