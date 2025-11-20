'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
    const [isDark, setIsDark] = useState(false);
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setMounted(true);
        // Check initial theme from localStorage or system preference
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            setIsDark(true);
            document.documentElement.classList.add('dark');
        } else {
            setIsDark(false);
            document.documentElement.classList.remove('dark');
        }
    }, []);

    function toggleTheme() {
        if (isDark) {
            setIsDark(false);
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            setIsDark(true);
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
    }

    const isHomePage = pathname === '/';

    return (
        <header className="glass border-b border-gray-200/50 dark:border-gray-700/50 backdrop-blur-xl shadow-sm sticky top-0 z-50 animate-slide-in-down">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {!isHomePage && (
                            <Link
                                href="/"
                                className=" text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                                aria-label="Back to home"
                            >
                                <ArrowLeft />
                            </Link>
                        )}
                        {/* <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Link2/>
                        </div> */}
                        <div>
                            <Link href={"/"}
                                className="text-3xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                                TinyLink
                            </Link>
                            {/* <p className="text-sm text-gray-600 dark:text-gray-400">Shorten, Track, Share</p> */}
                        </div>
                    </div>
                    {mounted && (
                        <button
                            onClick={toggleTheme}
                            className="p-3 rounded-xl transition-all duration-300 group cursor-pointer"
                            aria-label="Toggle theme"
                        >
                            {isDark ? (
                                <Sun className="w-5 h-5 text-yellow-500 group-hover:rotate-180 transition-transform duration-500" />
                            ) : (
                                <Moon className="w-5 h-5 text-gray-500 group-hover:-rotate-12 transition-transform duration-500" />
                            )}
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}