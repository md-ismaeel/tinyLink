"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Plus, Link2, Hash, Info, Check, Lock, Zap, X } from "lucide-react";

interface LinkFormProps {
  onSuccess?: () => void;
  setShowForm: (value: boolean) => void;
}

export function LinkForm({ onSuccess, setShowForm }: LinkFormProps) {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const createPromise = axios.post("/api/links", {
      originalUrl,
      customCode: customCode || undefined,
    });

    toast.promise(createPromise, {
      loading: "Creating your short link...",
      success: (response) => {
        setOriginalUrl("");
        setCustomCode("");
        onSuccess?.();
        return `Link created! Code: ${response.data.short_code}`;
      },
      error: (err) => {
        if (axios.isAxiosError(err)) {
          return err.response?.data?.error || "Failed to create link";
        }
        return "An error occurred";
      },
    });

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
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex gap-2 items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Plus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Create Short Link
            </h2>
          </div>
          <button
            onClick={() => setShowForm(false)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Transform your long URLs into short, shareable links
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Original URL Input */}
        <div className="space-y-2">
          <label
            htmlFor="url"
            className={`block text-sm font-semibold transition-colors ${focusedField === "url"
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-700 dark:text-gray-300"
              }`}
          >
            Original URL
          </label>
          <div className="relative group">
            <div
              className={`absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-20 blur transition-opacity ${focusedField === "url" ? "opacity-30" : ""
                }`}
            ></div>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
              <Link2 className="w-5 h-5" />
            </div>
            <input
              id="url"
              type="url"
              placeholder="https://example.com/very/long/url"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              onFocus={() => setFocusedField("url")}
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
            className={`block text-sm font-semibold transition-colors ${focusedField === "code"
                ? "text-purple-600 dark:text-purple-400"
                : "text-gray-700 dark:text-gray-300"
              }`}
          >
            Custom Short Code
            <span className="ml-2 text-xs font-normal text-gray-500 dark:text-gray-400">
              (Optional)
            </span>
          </label>
          <div className="relative group">
            <div
              className={`absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-20 blur transition-opacity ${focusedField === "code" ? "opacity-30" : ""
                }`}
            ></div>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
              <Hash className="w-5 h-5" />
            </div>
            <input
              id="code"
              type="text"
              placeholder="e.g., DOCS24"
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value.toUpperCase())}
              onFocus={() => setFocusedField("code")}
              onBlur={() => setFocusedField(null)}
              pattern="[A-Za-z0-9]{6,8}"
              disabled={loading}
              maxLength={8}
              className="relative w-full pl-12 pr-4 py-3.5 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:border-purple-500 dark:focus:border-purple-400 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 font-mono"
            />
          </div>
          <div className="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400">
            <Info className="w-4 h-4 mt-0.5 shrink-0" />
            <span>
              6-8 alphanumeric characters. Leave empty for auto-generated code.
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !originalUrl}
          className={`relative w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 cursor-pointer ${loading ? "cursor-wait" : ""
            }`}
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Creating Link...</span>
            </>
          ) : (
            <>
              <Plus className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              <span>Create Short Link</span>
            </>
          )}
        </button>

        {/* Info Cards */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
            </div>
            <span>Track Clicks</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Lock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            </div>
            <span>Secure Links</span>
          </div>
        </div>
      </form>
    </div>
  );
}
