import { BrowserRouter, useLocation } from 'react-router-dom';
import { Suspense } from 'react';

import AppRoutes from './AppRoutes';
import { ErrorBoundary } from '@/components/layout/ErrorBoundary';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/theme-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppContext from './components/context/AppContext';
import { useMemo, useState, useEffect } from 'react';
import { drawerWidth } from './constants/general.constant';
import { DrawerOpen_LocalKey } from './constants/storage.constant';
import { useMediaQuery, useTheme } from '@mui/material';
import ChatLayout from './pages/Chat/ChatWrapper/ChatLayout';
import MainLayout from './pages/Mainlayout';

// Function to determine if a route needs the main layout
const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const noLayoutRoutes = ['/', '/login', '/chat']; // Routes without MainLayout

  return noLayoutRoutes.includes(location.pathname) ? (
    <>{children}</> // Render without MainLayout
  ) : (
    <MainLayout>{children}</MainLayout> // Wrap other routes in MainLayout
  );
};

// **Query Client for React Query**
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTab = useMediaQuery(theme.breakpoints.down('md'));

  // **Persistent Sidebar State**
  const [sideDrawerOpen, setSideDrawerOpen] = useState(() => {
    const savedState = localStorage.getItem(DrawerOpen_LocalKey);
    return savedState ? JSON.parse(savedState) : !(isMobile || isTab);
  });

  const [historyList, setHistoryList] = useState(false);
  const [sideDrawerWidth, setSideDrawerWidth] = useState<number>(drawerWidth);

  // **Main Content Margin Based on Sidebar**
  const MainLayout_MarginLeft = useMemo(
    () => sideDrawerWidth + 16,
    [sideDrawerWidth]
  );

  useEffect(() => {
    const updateWidth = () => {
      const width = window.innerWidth;
      setSideDrawerWidth(Math.max(width * 0.175, 200));
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // **Provide Sidebar Context Globally**
  const drawerConfig = useMemo(
    () => ({
      sideDrawerOpen,
      setSideDrawerOpen,
      historyList,
      setHistoryList,
      sideDrawerWidth,
      MainLayout_MarginLeft,
    }),
    [sideDrawerOpen, historyList, sideDrawerWidth, MainLayout_MarginLeft]
  );

  return (
    <ThemeProvider>
      <ErrorBoundary>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <AppContext.Provider value={drawerConfig}>
              <BrowserRouter>
                <ChatLayout>
                  <LayoutWrapper>
                    {' '}
                    {/* ✅ Conditional Layout Wrapping */}
                    <Suspense>
                      <AppRoutes />{' '}
                      {/* ✅ Only AppRoutes updates on route change */}
                    </Suspense>
                  </LayoutWrapper>
                </ChatLayout>
              </BrowserRouter>
              <Toaster />
            </AppContext.Provider>
          </QueryClientProvider>
        </AuthProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
