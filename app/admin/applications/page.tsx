'use client'

export default function AdminApplicationsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Job Applications</h1>
                <p className="text-sm text-gray-500 mt-1">Review applications from potential team members</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Coming Soon</h2>
                <p className="text-sm text-gray-500">Job application management is under development. Applications are stored in the database.</p>
            </div>
        </div>
    )
}
