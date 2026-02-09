'use client'

export default function AdminBlogPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Blog Management</h1>
                <p className="text-sm text-gray-500 mt-1">Create and manage blog posts</p>
            </div>
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-8 text-center">
                <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </div>
                <h2 className="text-lg font-semibold text-white mb-1">Coming Soon</h2>
                <p className="text-sm text-gray-500">Blog management interface is under development. Posts can be managed via the API.</p>
            </div>
        </div>
    )
}
