import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';
import { ColorPaletteModal } from './components/ColorPaletteModal';
import { EmergencySOSModal } from './components/EmergencySOSModal';

// Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { CommitteePage } from './pages/CommitteePage';
import { ProgramsPage } from './pages/ProgramsPage';
import { BloodNetworkPage } from './pages/BloodNetworkPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { GalleryPage } from './pages/GalleryPage';
import { NoticesPage } from './pages/NoticesPage';
import { VolunteerPage } from './pages/VolunteerPage';
import { DonationPage } from './pages/DonationPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPanelPage } from './pages/AdminPanelPage';

const MainContent: React.FC = () => {
  const { activePage } = useApp();

  const renderActivePage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage />;
      case 'about':
        return <AboutPage />;
      case 'committee':
        return <CommitteePage />;
      case 'programs':
        return <ProgramsPage />;
      case 'blood-network':
        return <BloodNetworkPage />;
      case 'projects':
        return <ProjectsPage />;
      case 'gallery':
        return <GalleryPage />;
      case 'notices':
        return <NoticesPage />;
      case 'volunteer':
        return <VolunteerPage />;
      case 'donate':
        return <DonationPage />;
      case 'contact':
        return <ContactPage />;
      case 'admin':
        return <AdminPanelPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans transition-colors duration-300">
      <Navbar />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {renderActivePage()}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />

      {/* Global Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
