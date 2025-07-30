
import React from 'react';

const ArticleCard: React.FC<{ title: string; excerpt: string; imageUrl: string }> = ({ title, excerpt, imageUrl }) => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
    <img className="h-48 w-full object-cover" src={imageUrl} alt={title} />
    <div className="p-6">
      <h3 className="text-xl font-bold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600 mb-4">{excerpt}</p>
      <a href="#" className="font-semibold text-teal-600 hover:text-teal-700">Baca Selengkapnya &rarr;</a>
    </div>
  </div>
);

const EducationPage: React.FC = () => {
  const articles = [
    {
      title: 'Menjaga Kebersihan Diri untuk Mencegah Scabies',
      excerpt: 'Scabies adalah penyakit kulit menular yang disebabkan oleh tungau. Pelajari cara mencegah penyebarannya di lingkungan asrama.',
      imageUrl: 'https://picsum.photos/400/300?image=10',
    },
    {
      title: 'Pentingnya Gizi Seimbang untuk Daya Tahan Tubuh',
      excerpt: 'Daya tahan tubuh yang kuat adalah kunci untuk melawan berbagai penyakit. Ketahui makanan apa saja yang baik untuk imunitas.',
      imageUrl: 'https://picsum.photos/400/300?image=20',
    },
    {
      title: 'ISPA: Gejala, Penyebab, dan Pencegahan',
      excerpt: 'Infeksi Saluran Pernapasan Akut (ISPA) sering terjadi di lingkungan padat. Kenali gejalanya agar dapat ditangani sejak dini.',
      imageUrl: 'https://picsum.photos/400/300?image=30',
    },
    {
      title: 'Etika Batuk dan Bersin yang Benar',
      excerpt: 'Mencegah penyebaran kuman penyakit bisa dimulai dari hal sederhana seperti etika batuk dan bersin. Pelajari caranya di sini.',
      imageUrl: 'https://picsum.photos/400/300?image=40',
    },
  ];

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Edukasi Kesehatan</h2>
          <p className="text-lg text-gray-600 mt-2">Tingkatkan pengetahuan untuk hidup lebih sehat.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {articles.map((article, index) => (
            <ArticleCard key={index} {...article} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EducationPage;
