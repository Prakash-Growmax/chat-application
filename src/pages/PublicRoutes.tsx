import React from "react";
import MainLayout from "./Mainlayout";
interface PublicLayoutProps {
  children: React.ReactNode; // Type for children
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return <MainLayout hideHeader>{children}</MainLayout>;
};

export default PublicLayout;
