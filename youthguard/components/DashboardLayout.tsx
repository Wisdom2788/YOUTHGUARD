import React, { useState } from 'react';
import DashboardSidebar from './DashboardSidebar';
import Header from './Header';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* DashboardSidebar - Always visible on desktop, toggleable on mobile */}
      <DashboardSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      
      <div className="flex-grow flex flex-col">
        {/* Header - Only visible on mobile (below md breakpoint) */}
        <Header toggleSidebar={toggleSidebar} />
        
        {/* Main content area with responsive margins */}
        <main className="flex-grow pl-4 pr-4 sm:pl-6 sm:pr-6 py-4 sm:py-6 md:py-8 slide-up md:ml-64">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;