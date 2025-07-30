import React from 'react';
import { User, Role, Page } from '../types';

interface HeaderProps {
  currentUser: User | null;
  navigateTo: (page: Page) => void;
  onLogout: () => void;
}

const NavLink: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
  <button onClick={onClick} className="text-gray-600 hover:text-teal-600 transition-colors duration-300">
    {children}
  </button>
);

const Header: React.FC<HeaderProps> = ({ currentUser, navigateTo, onLogout }) => {
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigateTo(Page.HOME)}>
          <svg className="h-8 w-8 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="text-xl font-bold text-gray-800">AlFuzzy Medis</h1>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <NavLink onClick={() => navigateTo(Page.HOME)}>Homepage</NavLink>
          {currentUser?.role === Role.SANTRI && (
            <>
              <NavLink onClick={() => navigateTo(Page.SCREENING)}>Screening Kesehatan</NavLink>
              <NavLink onClick={() => navigateTo(Page.HISTORY)}>Riwayat Kesehatan</NavLink>
              <NavLink onClick={() => navigateTo(Page.EDUCATION)}>Edukasi Kesehatan</NavLink>
            </>
          )}
          {currentUser?.role === Role.ORANG_TUA && (
            <>
              <NavLink onClick={() => navigateTo(Page.HISTORY)}>Riwayat Kesehatan Santri</NavLink>
              <NavLink onClick={() => navigateTo(Page.EDUCATION)}>Edukasi Kesehatan</NavLink>
            </>
          )}
          {currentUser?.role === Role.ADMIN && (
             <>
              <NavLink onClick={() => navigateTo(Page.ADMIN_DASHBOARD)}>Dashboard</NavLink>
              <NavLink onClick={() => navigateTo(Page.ADMIN_MANAGE_RULES)}>Kelola Rules</NavLink>
             </>
          )}

          {currentUser ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Hi, {currentUser.name.split(' ')[0]}</span>
              <button
                onClick={onLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300 shadow-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigateTo(Page.LOGIN)}
              className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors duration-300 shadow"
            >
              Login
            </button>
          )}
        </nav>
        <div className="md:hidden">
          {/* Mobile menu button can be added here */}
        </div>
      </div>
    </header>
  );
};

export default Header;