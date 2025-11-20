'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import Footer from '@/components/footer';
import Header from '@/components/header';
import Link from 'next/link';
import { Home, Trash2, View, Link as LinkIcon, Calendar, Clock, Copy, Check, ExternalLink, AlertCircle } from 'lucide-react';
import { App_URL } from '@/config/config';
import Loading from '@/components/loading';
import Error from '@/components/error';

interface LinkStats {
  id: number;
  short_code: string;
  original_url: string;
  click_count: number;
  last_clicked_at: string | null;
  created_at: string;
  updated_at: string;
}

export default function StatsPage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;

  const [stats, setStats] = useState<LinkStats | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/links/${code}`);
        setStats(response.data);
        toast.success('Stats loaded successfully!');
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          const status = err.response.status;
          if (status === 404) {
            setError(`Link with code "${code}" not found`);
            toast.error('Link not found');
          } else {
            setError(`Failed to load link stats (Error ${status})`);
            toast.error('Failed to load stats');
          }
        } else {
          setError('A network error occurred. Please try again.');
          toast.error('Network error');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [code]);

  // Handle copy to clipboard
  const handleCopy = async () => {
    const baseUrl = App_URL;
    const shortUrl = `${baseUrl}/${code}`;

    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      toast.success('URL copied to clipboard!', {
        icon: '📋',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy URL');
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this link? This action cannot be undone.');
    if (!confirmed) return;

    const deletePromise = axios.delete(`/api/links/${code}`);

    toast.promise(
      deletePromise,
      {
        loading: 'Deleting link...',
        success: 'Link deleted successfully!',
        error: 'Failed to delete link',
      }
    );

    try {
      await deletePromise;
      setTimeout(() => router.push('/'), 1000);
    } catch (err) {
      // Error already handled by toast.promise
    }
  };

  // Loading State
  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Header />
        <Loading />
        <Footer />
      </main>
    );
  }

  // Error State
  if (error) {
    return (
      <Error error={{ message: error }} reset={() => router.push('/')} />
    );
  }

  // No stats found (shouldn't happen after error check, but just in case)
  if (!stats) {
    return null;
  }

  // --- Main Content Logic ---
  const createdDate = new Date(stats.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const lastClickedDate = stats.last_clicked_at
    ? new Date(stats.last_clicked_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
    : 'Never';

  const baseUrl = App_URL;
  const shortUrl = `${baseUrl}/${stats.short_code}`;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'glass',
          style: {
            background: 'rgba(255, 255, 255, 0.9)',
            color: '#0f172a',
            border: '1px solid rgba(226, 232, 240, 0.5)',
          },
        }}
      />

      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="space-y-4 sm:space-y-6 animate-slide-in-up">
          {/* Short Code Card */}
          <div className="glass border border-gray-200/50 dark:border-gray-700/50 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-xl card-hover">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 flex-shrink-0" />
                  <span>Short Code</span>
                </h2>
                <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3">
                  <code className="text-xl sm:text-2xl md:text-3xl font-mono font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent px-4 sm:px-6 py-2 sm:py-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg sm:rounded-xl border-2 border-blue-200 dark:border-blue-800 break-all">
                    {stats.short_code}
                  </code>
                  <button
                    onClick={handleCopy}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base rounded-lg sm:rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>
                </div>
                <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mt-4'>
                  <p className="flex-1 text-xs sm:text-sm text-gray-600 dark:text-gray-100 font-mono break-all bg-gray-300 dark:bg-gray-800 px-3 sm:px-4 py-2 rounded-lg">
                    {shortUrl}
                  </p>
                  <Link
                    className={`relative px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 cursor-pointer`}
                    href={shortUrl}
                    target='_blank'
                  >
                    <ExternalLink className="w-4 h-4 shrink-0 mt-0.5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    <span>View Link</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Original URL Card */}
          <div className="glass border border-gray-200/50 dark:border-gray-700/50 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-xl card-hover">
            <h2 className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
              <ExternalLink className="w-4 h-4 shrink-0" />
              <span>Target URL</span>
            </h2>
            <Link
              href={stats.original_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-start gap-2 text-sm sm:text-base text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium break-all group transition-colors"
            >
              <span className="group-hover:underline">{stats.original_url}</span>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="glass border border-gray-200/50 dark:border-gray-700/50 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-xl card-hover relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-500 to-purple-600 opacity-10 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16"></div>
              <div className="relative">
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <div className="p-2 sm:p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg sm:rounded-xl">
                    <View className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    Total Clicks
                  </h3>
                </div>
                <p className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  {stats.click_count.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="glass border border-gray-200/50 dark:border-gray-700/50 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-xl card-hover relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-purple-500 to-pink-600 opacity-10 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16"></div>
              <div className="relative">
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <div className="p-2 sm:p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg sm:rounded-xl">
                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    Created
                  </h3>
                </div>
                <p className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 dark:text-gray-500 break-words">
                  {createdDate}
                </p>
              </div>
            </div>

            <div className="glass border border-gray-200/50 dark:border-gray-700/50 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-xl card-hover relative overflow-hidden sm:col-span-2 lg:col-span-1">
              <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-green-400 to-emerald-500 opacity-10 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16"></div>
              <div className="relative">
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <div className="p-2 sm:p-3 bg-green-100 dark:bg-green-900/30 rounded-lg sm:rounded-xl">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    Last Clicked
                  </h3>
                </div>
                <p className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 dark:text-gray-500 break-words">
                  {lastClickedDate}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="glass border border-gray-200/50 dark:border-gray-700/50 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-xl">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-500 mb-4 sm:mb-6">Actions</h2>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
              <button
                onClick={handleDelete}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-red-600 hover:bg-red-700 text-white text-sm sm:text-base rounded-lg sm:rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span>Delete Link</span>
              </button>
              <Link
                href={"/"}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-gray-600 hover:bg-gray-700 text-white text-sm sm:text-base rounded-lg sm:rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Home className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span>Home</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}