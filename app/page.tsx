'use client';

import { useState } from 'react';
import { LinkForm } from '@/components/link-form';
import { LinksTable } from '@/components/links-table';
import { Toaster } from 'react-hot-toast';
import Header from '@/components/header';
import Footer from '@/components/footer';

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [showForm, setShowForm] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'glass',
          duration: 3000,
          style: {
            background: 'rgba(255, 255, 255, 0.9)',
            color: '#0f172a',
            border: '1px solid rgba(226, 232, 240, 0.5)',
            backdropFilter: 'blur(20px)',
          },
        }}
      />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-400/20 dark:bg-pink-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 text-center animate-fade-in relative z-10">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-400 mb-4">
          Shorten your URLs with <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">ease</span>
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Create short, memorable links and track every click with powerful analytics
        </p>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 relative z-10">
        <div className="space-y-8">
          {/* Create Link Button - Shows when form is hidden */}
          {!showForm && (
            <div className="flex justify-center animate-slide-in-up">
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-102 cursor-pointer"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create New Short Link
              </button>
            </div>
          )}

          {/* Form Section - Initially hidden */}
          {showForm && (
            <div className="animate-slide-in-up">
              <LinkForm
                onSuccess={() => {
                  setRefreshKey(prev => prev + 1);
                  setShowForm(false);
                }}
                setShowForm={setShowForm}
              />
            </div>
          )}

          {/* Table Section */}
          <div className="animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Links</h2>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live</span>
              </div>
            </div>
            <LinksTable refreshTrigger={refreshKey} />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}