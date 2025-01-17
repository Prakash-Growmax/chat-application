import AppContext from "@/components/context/AppContext";
import { Header } from "@/components/layout/Header";
import Sidebar from "@/components/ui/sidebar";
import { useContext } from "react";

interface MainLayoutProps {
  children: React.ReactNode; // Type for children
  hideHeader?: boolean; // Optional boolean prop
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  hideHeader = false,
}) => {
  const { sideDrawerOpen } = useContext(AppContext);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div
        className={`flex-1 flex flex-col transition-all duration-300 
          ${sideDrawerOpen ? "ml-0" : "ml-0"}`}
      >
        {!hideHeader && (
          <header className="fixed top-0 left-0 right-0 h-16 z-50">
            <Header />
          </header>
        )}
        <main
          className={`flex-1 pt-16  
            duration-200 
            ease-in-out
           ${sideDrawerOpen ? "ml-48" : "ml-0"}`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
