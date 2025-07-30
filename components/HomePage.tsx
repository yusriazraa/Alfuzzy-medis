
import React, { useState } from 'react';
import { FAQItem } from '../types';

// --- Reusable Components defined outside ---
const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-teal-100 text-teal-600 mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2 text-gray-800">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const DiseaseCategoryCard: React.FC<{ title: string; diseases: string[]; icon: React.ReactNode }> = ({ title, diseases, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-teal-500">
    <div className="flex items-center mb-4">
      <div className="text-teal-500 mr-3">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
    </div>
    <ul className="space-y-2 list-disc list-inside text-gray-600">
      {diseases.map(disease => <li key={disease}>{disease}</li>)}
    </ul>
  </div>
);

const FaqItemComponent: React.FC<{ item: FAQItem; isOpen: boolean; onClick: () => void }> = ({ item, isOpen, onClick }) => (
    <div className="border-b">
        <button onClick={onClick} className="w-full flex justify-between items-center text-left py-4 px-2 hover:bg-gray-100 focus:outline-none">
            <span className="text-lg font-medium text-gray-800">{item.question}</span>
            <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </span>
        </button>
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
            <div className="p-4 bg-gray-50 text-gray-600">
                <p>{item.answer}</p>
            </div>
        </div>
    </div>
);


// --- Main HomePage Component ---
const HomePage: React.FC<{ navigateToLogin: () => void }> = ({ navigateToLogin }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const faqData: FAQItem[] = [
    { question: 'Apa itu AlFuzzy Medis?', answer: 'AlFuzzy Medis adalah sistem digital berbasis web yang dirancang untuk membantu melakukan screening gejala dan deteksi dini penyakit di lingkungan pesantren Al-Kautsar 561 menggunakan metode logika fuzzy.' },
    { question: 'Siapa saja yang dapat menggunakan sistem ini?', answer: 'Sistem ini dapat diakses oleh Santri untuk pemeriksaan mandiri, Orang Tua untuk memantau riwayat kesehatan anak, dan Admin untuk mengelola data dan sistem.' },
    { question: 'Apakah diagnosis dari sistem ini akurat?', answer: 'Sistem ini memberikan diagnosis awal berdasarkan gejala yang dimasukkan dan tidak menggantikan konsultasi medis profesional. Ini adalah alat bantu untuk deteksi dini dan kewaspadaan.' },
    { question: 'Bagaimana cara menggunakan fitur screening?', answer: 'Setelah login sebagai santri, pilih menu "Screening Kesehatan", jawab pertanyaan mengenai gejala yang Anda rasakan, dan sistem akan memberikan hasil diagnosis awal.' },
  ];

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-teal-600 text-white relative">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="container mx-auto px-6 py-24 md:py-32 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
            Pantau Kesehatan Santri Secara Cepat dan Akurat
          </h2>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-teal-100">
            Sistem digital untuk screening gejala, diagnosa otomatis dan pencatatan riwayat kesehatan santri di lingkungan Pesantren Al-Kautsar 561.
          </p>
          <button onClick={navigateToLogin} className="bg-white text-teal-600 font-bold py-3 px-8 rounded-full hover:bg-teal-50 transition-transform transform hover:scale-105 duration-300 shadow-lg">
            Mulai Screening Sekarang
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">Fitur Utama</h2>
            <p className="text-gray-600 mt-2">Solusi kesehatan terintegrasi untuk komunitas pesantren.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>}
              title="Screening Gejala Mandiri"
              description="Santri dapat melakukan pemeriksaan gejala awal secara mandiri, kapan saja dan di mana saja."
            />
            <FeatureCard
              icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 0l-3-3m3 3l-3 4m4 6H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
              title="Diagnosis Otomatis"
              description="Dapatkan hasil diagnosis dini berdasarkan logika fuzzy untuk membantu mengidentifikasi potensi penyakit."
            />
            <FeatureCard
              icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>}
              title="Riwayat Pemeriksaan"
              description="Akses mudah ke seluruh riwayat kesehatan untuk pemantauan berkelanjutan oleh santri dan orang tua."
            />
          </div>
        </div>
      </section>

      {/* Detectable Diseases Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">Penyakit yang Dapat Dideteksi</h2>
            <p className="text-gray-600 mt-2">Sistem kami dapat membantu deteksi dini untuk kategori penyakit berikut.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <DiseaseCategoryCard
              icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.07 0a5 5 0 010 7.07" /></svg>}
              title="Saluran Pernapasan"
              diseases={['ISPA', 'Faringitis', 'Common Cold', 'Parotitis']}
            />
            <DiseaseCategoryCard
              icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
              title="Disebabkan Virus"
              diseases={['Herpes', 'Konjungtivitis', 'Influenza']}
            />
            <DiseaseCategoryCard
              icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1.586-1.586a2 2 0 00-2.828 0L6 14" /></svg>}
              title="Infeksi Kulit"
              diseases={['Dermatitis', 'Scabies', 'Stomatitis']}
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">Frequently Asked Questions</h2>
            <p className="text-gray-600 mt-2">Temukan jawaban untuk pertanyaan yang sering diajukan.</p>
          </div>
          <div className="bg-white rounded-lg shadow-md">
            {faqData.map((item, index) => (
               <FaqItemComponent
                 key={index}
                 item={item}
                 isOpen={openFaqIndex === index}
                 onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
               />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
