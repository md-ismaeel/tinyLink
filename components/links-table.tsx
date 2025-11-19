'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface LinkData {
  id: number;
  short_code: string;
  original_url: string;
  click_count: number;
  last_clicked_at: string | null;
  created_at: string;
}

interface LinksTableProps {
  refreshTrigger?: number;
}

export function LinksTable({ refreshTrigger = 0 }: LinksTableProps) {
  const [links, setLinks] = useState<LinkData[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/links');
      setLinks(response.data);
    } catch (err) {
      toast.error('Failed to fetch links');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, [refreshTrigger]);

  const handleDelete = async (code: string) => {
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
      setLinks(links.filter(link => link.short_code !== code));
    } catch (err) {
      // Error handled by toast.promise
    }
  };

  const handleCopy = async (code: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    const shortUrl = `${baseUrl}/${code}`;

    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(code);
      toast.success('URL copied to clipboard!', {
        icon: '📋',
      });
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      toast.error('Failed to copy URL');
    }
  };

  const truncateUrl = (url: string, maxLength: number = 40) => {
    return url.length > maxLength ? url.substring(0, maxLength) + '...' : url;
  };

  if (loading) {
    return (
      <div className="glass border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-8 shadow-xl">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center gap-4">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex-1 shimmer-loading"></div>
              <div className="h-12 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg shimmer-loading"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (links.length === 0) {
    return (
      <div className="glass border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-12 shadow-xl text-center">
        <div className="max-w-sm mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center animate-float">
            <svg className="w-10 h-10 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No links yet</h3>
          <p className="text-gray-600 dark:text-gray-400">Create your first short link to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-xl overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Short Code
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Target URL
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Clicks
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Last Clicked
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {links.map((link, index) => (
              <>
                <tr
                  key={link.id}
                  className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors stagger-item"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleCopy(link.short_code)}
                      className="group flex items-center gap-2 font-mono text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                      title="Click to copy"
                    >
                      <span className="bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                        {link.short_code}
                      </span>
                      {copied === link.short_code ? (
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href={link.original_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
                      title={link.original_url}
                    >
                      <span className="truncate max-w-xs">{truncateUrl(link.original_url)}</span>
                      <svg className="w-4 h-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                        <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                        </svg>
                      </div>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {link.click_count.toLocaleString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {link.last_clicked_at
                        ? new Date(link.last_clicked_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                        : 'Never'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/code/${link.short_code}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Stats
                      </Link>
                      <button
                        onClick={() => handleDelete(link.short_code)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr >
              </>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
        {links.map((link, index) => (
          <div
            key={link.id}
            className="p-6 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors stagger-item"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <button
                  onClick={() => handleCopy(link.short_code)}
                  className="flex items-center gap-2 font-mono text-sm font-bold text-blue-600 dark:text-blue-400"
                >
                  <span className="bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-lg">
                    {link.short_code}
                  </span>
                  {copied === link.short_code && (
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                  <span className="font-bold">{link.click_count}</span>
                </div>
              </div>
              <a
                href={link.original_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-gray-600 dark:text-gray-400 truncate"
              >
                {truncateUrl(link.original_url, 50)}
              </a>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Last: {link.last_clicked_at
                    ? new Date(link.last_clicked_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                    : 'Never'}
                </span>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/code/${link.short_code}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-medium"
                  >
                    Stats
                  </Link>
                  <button
                    onClick={() => handleDelete(link.short_code)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-xs font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
        }
      </div >
    </div>
  );
}