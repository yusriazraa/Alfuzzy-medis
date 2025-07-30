
import React from 'react';
import { User, Page } from '../types';

interface ParentDashboardProps {
  user: User;
  navigateTo: (page: Page) => void;
}

const ActionCard: React.FC<{ title: string; description: string; icon: React.ReactNode; onClick: () => void }> = ({ title, description, icon, onClick }) => (
    <div 
      onClick={onClick}
      className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:bg-teal-50 transition-all duration-300 cursor-pointer flex items-start space-x-4"
    >
      <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-full bg-teal-100 text-teal-600">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        <p className="text-gray-600 mt-1">{description}</p>
      </div>
    </div>
);

const ParentDashboard: React.FC<ParentDashboardProps> = ({ user, navigateTo }) => {
  return (
    <div className="container mx-auto p-6 my-10">
      <h2 className="text-3xl font-bold text-gray-800">Selamat Datang, {user.name}!</h2>
      <p className="text-gray-600 mt-2 mb-8">Anda dapat memantau kondisi kesehatan ananda melalui halaman ini.</p>
      <div className="grid md:grid-cols-2 gap-6">
        <ActionCard
            title="Lihat Riwayat Kesehatan Santri"
            description="Akses semua catatan riwayat pemeriksaan kesehatan ananda."
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>}
            onClick={() => navigateTo(Page.HISTORY)}
        />
        <ActionCard
            title="Edukasi Kesehatan"
            description="Pelajari informasi kesehatan yang relevan untuk komunitas pesantren."
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
            onClick={() => navigateTo(Page.EDUCATION)}
        />
      </div>
    </div>
  );
};

export default ParentDashboard;
