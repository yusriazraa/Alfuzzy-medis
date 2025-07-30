
import React, { useState, useCallback, useEffect } from 'react';
import { Role, User, Page } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import SantriDashboard from './components/SantriDashboard';
import ParentDashboard from './components/ParentDashboard';
import AdminDashboard from './components/AdminDashboard';
import ScreeningPage from './components/ScreeningPage';
import HistoryPage from './components/HistoryPage';
import EducationPage from './components/EducationPage';
import AdminManageRulesPage from './components/AdminManageRulesPage';
import * as api from './api';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Coba ambil sesi user saat aplikasi pertama kali dimuat
    const checkSession = async () => {
      try {
        const user = await api.checkSession();
        if (user) {
          setCurrentUser(user);
          navigateToDashboard(user);
        }
      } catch (error) {
        // Tidak ada sesi aktif, tidak masalah
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
  };
  
  const navigateToDashboard = (user: User) => {
     switch (user.role) {
        case Role.SANTRI:
          navigateTo(Page.SANTRI_DASHBOARD);
          break;
        case Role.ORANG_TUA:
          navigateTo(Page.PARENT_DASHBOARD);
          break;
        case Role.ADMIN:
          navigateTo(Page.ADMIN_DASHBOARD);
          break;
        default:
          navigateTo(Page.HOME);
      }
  }

  const handleLogin = useCallback(async (username: string) => {
    try {
      const user = await api.login(username, 'password'); // password diabaikan di API palsu
      setCurrentUser(user);
      navigateToDashboard(user);
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            // Anda bisa menampilkan pesan error di UI login di sini
        }
    }
  }, []);

  const handleLogout = async () => {
    await api.logout();
    setCurrentUser(null);
    navigateTo(Page.HOME);
  };
  
  const renderPage = () => {
    if (isLoading) {
        return <div className="flex justify-center items-center h-screen"><p>Loading...</p></div>;
    }

    if (!currentUser) {
      switch (currentPage) {
        case Page.LOGIN:
          return <LoginPage onLogin={handleLogin} />;
        case Page.HOME:
        default:
          return <HomePage navigateToLogin={() => navigateTo(Page.LOGIN)} />;
      }
    }

    switch (currentPage) {
      case Page.SANTRI_DASHBOARD:
        return <SantriDashboard user={currentUser} navigateTo={navigateTo} />;
      case Page.PARENT_DASHBOARD:
        return <ParentDashboard user={currentUser} navigateTo={navigateTo} />;
      case Page.ADMIN_DASHBOARD:
        return <AdminDashboard user={currentUser} navigateTo={navigateTo} />;
      case Page.ADMIN_MANAGE_RULES:
        return <AdminManageRulesPage />;
      case Page.SCREENING:
        return <ScreeningPage user={currentUser} onScreeningComplete={() => navigateTo(Page.HISTORY)} />;
      case Page.HISTORY:
        return <HistoryPage user={currentUser} />;
      case Page.EDUCATION:
        return <EducationPage />;
      case Page.HOME:
         return <HomePage navigateToLogin={() => navigateTo(Page.LOGIN)} />;
      default:
        // Saat user sudah login, defaultnya adalah dashboard mereka
        navigateToDashboard(currentUser);
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header currentUser={currentUser} navigateTo={navigateTo} onLogout={handleLogout} />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
};

export default App;
