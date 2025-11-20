
'use client';

import { useEffect } from 'react';
import { RefreshCw, Zap } from 'lucide-react';

interface ErrorState {
    error: { message?: string };
    reset: () => void;
}

export default function Error({ error, reset }: ErrorState) {
    useEffect(() => {
        console.error("Next.js Runtime Error Caught by Boundary:", error.message, error.message);
    }, [error]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center px-4">
            <div className="text-center space-y-6 animate-fade-in max-w-lg p-8 glass border border-red-300 dark:border-red-900/50 rounded-xl shadow-2xl">

                <Zap className="w-16 h-16 mx-auto text-red-600 dark:text-red-400" />
                <p className="text-lg text-gray-700 dark:text-gray-300">
                    We could not load the link statistics. This may mean the link does not exist.
                </p>
                <div className="text-left text-xs text-red-500 dark:text-red-300 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg overflow-auto">
                    {error.message}
                </div>

                <button
                    onClick={
                        // Attempts to re-render the segment (will re-run fetchStats)
                        () => reset()
                    }
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                    <RefreshCw className="w-4 h-4 shrink-0" />
                    <span>Try Again</span>
                </button>
            </div>
        </div>
    );
}