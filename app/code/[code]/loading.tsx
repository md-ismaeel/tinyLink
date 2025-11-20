import React from 'react'

export default function loading() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center px-4">
            <div className="text-center space-y-4 animate-fade-in">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto">
                    <div className="absolute inset-0 border-4 border-blue-200 dark:border-blue-900 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-blue-500 dark:border-blue-400 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <p className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300">Loading stats...</p>
            </div>
        </div>
    )
}
