
export default function Loading() {
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
    )
}
