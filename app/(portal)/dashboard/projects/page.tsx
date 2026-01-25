'use client'

import { useState, useEffect } from 'react'
import { fetchWithAuth } from '@/lib/auth'
import { ProjectCard } from '@/components/portal/ProjectCard'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default function ProjectsPage() {
    const [projects, setProjects] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        loadProjects()
    }, [])

    const loadProjects = async () => {
        try {
            const response = await fetchWithAuth('/api/customer/projects')
            const data = await response.json() as any
            if (data.success) {
                setProjects(data.data)
            }
        } catch (error) {
            console.error('Failed to load projects:', error)
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-vibrant-gold border-t-transparent"></div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-forest-green mb-2">
                        My Projects
                    </h1>
                    <p className="text-gray-600">
                        Track the status of your landscaping services
                    </p>
                </div>
                <Link href="/quote-request">
                    <Button>Request New Service</Button>
                </Link>
            </div>

            {projects.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                    <div className="text-4xl mb-4">🌳</div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">No projects yet</h3>
                    <p className="text-gray-600 mb-6">
                        Ready to transform your yard? Request a quote to get started!
                    </p>
                    <Link href="/quote-request">
                        <Button>Get a Quote</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6">
                    {projects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            id={project.id}
                            serviceType={project.service_type}
                            status={project.status}
                            date={project.created_at}
                            description={project.description}
                            totalAmount={project.total_amount}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
