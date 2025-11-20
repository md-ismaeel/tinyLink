import Link from 'next/link';

import { Link as LinkIcon,Github,Twitter,Instagram} from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="glass border-t border-gray-200/50 dark:border-gray-700/50 backdrop-blur-xl mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between md:gap-4">

                    {/* 1. Logo and Brand (First on mobile and desktop) */}
                    <div className="flex items-center gap-3 order-1">
                        <Link href={"/"}
                            className="text-2xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                            <LinkIcon className="w-5 h-5" />
                            TinyLink
                        </Link>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 order-3 md:order-2">
                        © {currentYear} TinyLink. All rights reserved.
                    </p>

                    {/* 3. Social Links (Last on mobile and desktop) */}
                    <div className="flex items-center gap-5 order-2 md:order-3">
                        {/* GitHub */}
                        <Link
                            href="https://github.com/md-ismaeel"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            aria-label="GitHub Profile"
                        >
                            <Github className="w-6 h-6" />
                        </Link>

                        {/* Twitter/X */}
                        <Link
                            href="https://twitter.com/impossible_bro"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            aria-label="Twitter Profile"
                        >
                            <Twitter className="w-6 h-6" />
                        </Link>

                        {/* Instagram */}
                        <Link
                            href="https://instagram.com/ismail_15_"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            aria-label="Instagram Profile"
                        >
                            <Instagram className="w-6 h-6" />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}