'use client';

import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface LinkFormProps {
  onSuccess?: () => void;
}

export function LinkForm({ onSuccess }: LinkFormProps) {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const createPromise = axios.post('/api/links', {
      originalUrl,
      customCode: customCode || undefined,
    });

    toast.promise(
      createPromise,
      {
        loading: 'Creating your short link...',
        success: (response) => {
          setOriginalUrl('');
          setCustomCode('');
          onSuccess?.();
          return `Link created! Code: ${response.data.short_code}`;
        },
        error: (err) => {
          if (axios.isAxiosError(err)) {
            return err.response?.data?.error || 'Failed to create link';
          }
          return 'An error occurred';
        },
      }
    );

    try {
      await createPromise;
    } catch (err) {
      // Error handled by toast.promise
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-8 shadow-xl card-hover">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create Short Link</h2>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">Transform your long URLs into short, shareable links</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Original URL Input */}
        <div className="space-y-2">
          <label
            htmlFor="url"
            className={`block text-sm font-semibold transition-colors ${focusedField === 'url'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-300'
              }`}
          >
            Original URL
          </label>
          <div className="relative group">
            <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-20 blur transition-opacity ${focusedField === 'url' ? 'opacity-30' : ''
              }`}></div>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <input
              id="url"
              type="url"
              placeholder="https://example.com/very/long/url"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              onFocus={() => setFocusedField('url')}
              onBlur={() => setFocusedField(null)}
              required
              disabled={loading}
              className="relative w-full pl-12 pr-4 py-3.5 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* Custom Code Input */}
        <div className="space-y-2">
          <label
            htmlFor="code"
            className={`block text-sm font-semibold transition-colors ${focusedField === 'code'
                ? 'text-purple-600 dark:text-purple-400'
                : 'text-gray-700 dark:text-gray-300'
              }`}
          >
            Custom Short Code
            <span className="ml-2 text-xs font-normal text-gray-500 dark:text-gray-400">(Optional)</span>
          </label>
          <div className="relative group">
            <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-20 blur transition-opacity ${focusedField === 'code' ? 'opacity-30' : ''
              }`}></div>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
            </div>
            <input
              id="code"
              type="text"
              placeholder="e.g., DOCS24"
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value.toUpperCase())}
              onFocus={() => setFocusedField('code')}
              onBlur={() => setFocusedField(null)}
              pattern="[A-Za-z0-9]{6,8}"
              disabled={loading}
              maxLength={8}
              className="relative w-full pl-12 pr-4 py-3.5 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 dark:focus:border-purple-400 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 font-mono"
            />
          </div>
          <div className="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400">
            <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>6-8 alphanumeric characters. Leave empty for auto-generated code.</span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !originalUrl}
          className="relative w-full group overflow-hidden rounded-md"
        >
          <div className="absolute inset-0 bg-linear-to-r from-blue-600 via-purple-600 to-blue-600 bg-[length:200%_100%] animate-[shimmer_2s_infinite]"></div>
          <div className={`relative px-6 py-4 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 ${loading ? 'cursor-wait' : ''
            }`}>
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Creating Link...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Create Short Link</span>
              </>
            )}
          </div>
        </button>

        {/* Info Cards */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <svg className="w-3.5 h-3.5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span>Track Clicks</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <svg className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <span>Secure Links</span>
          </div>
        </div>
      </form>
    </div>
  );
}