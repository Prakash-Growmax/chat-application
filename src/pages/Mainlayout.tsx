import AppContext from "@/components/context/AppContext";
import { Header } from "@/components/layout/Header";
import Sidebar from "@/components/ui/sidebar";
import { useContext } from "react";

interface MainLayoutProps {
  children: React.ReactNode;
  hideHeader?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  hideHeader = false,
}) => {
  const { sideDrawerOpen, MainLayout_MarginLeft } = useContext(AppContext);

  return (
    <div className="flex min-h-screen">
      {!hideHeader && <Sidebar />}

      <div
        className={`flex-1 flex flex-col  transition-all duration-300 h-[90%]`}
        style={{
          marginLeft: sideDrawerOpen ? MainLayout_MarginLeft : 0,
        }}
      >
        {!hideHeader && (
          <header className="fixed top-0 left-0 right-0 h-16 z-50">
            <Header />
          </header>
        )}
        <main
          className={`flex-1 pt-16 justify-center items-center  
            duration-200 ease-in-out`}
          style={{
            width: sideDrawerOpen
              ? `calc(100vw - ${MainLayout_MarginLeft}px)`
              : `100%`,
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
