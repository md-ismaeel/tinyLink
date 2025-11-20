import { Loader } from 'lucide-react';

export default function Loading() {
    const iconSize = "3.5rem";

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center px-4">
            <div className="text-center space-y-4 animate-fade-in">
                <div className="mx-auto flex items-center justify-center">
                    <Loader
                        className="text-blue-500 dark:text-blue-400 animate-spin"
                        style={{ fontSize: iconSize }}
                        aria-label="Loading"
                    />
                </div>
                <p className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300">
                    Loading stats...
                </p>
            </div>
        </div>
    );
}