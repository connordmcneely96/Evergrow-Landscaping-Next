'use client'

import { useState, useEffect } from 'react'
import { fetchWithAuth } from '@/lib/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { toast } from 'react-hot-toast'
import { Star } from 'lucide-react'

export default function FeedbackPage() {
    const [projects, setProjects] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        projectId: '',
        rating: 5,
        comment: ''
    })

    useEffect(() => {
        loadCompletedProjects()
    }, [])

    const loadCompletedProjects = async () => {
        try {
            const response = await fetchWithAuth('/api/customer/projects')
            const data = await response.json() as any
            if (data.success) {
                // Filter only completed projects
                setProjects(data.data.filter((p: any) => p.status === 'completed'))
            }
        } catch (error) {
            console.error('Failed to load projects:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.projectId) {
            toast.error('Please select a project to review')
            return
        }

        setIsSubmitting(true)

        try {
            const response = await fetchWithAuth('/api/customer/feedback', {
                method: 'POST',
                body: JSON.stringify(formData)
            })

            if (response.ok) {
                toast.success('Thank you for your feedback!')
                setFormData({ projectId: '', rating: 5, comment: '' })
            } else {
                toast.error('Failed to submit feedback')
            }
        } catch (error) {
            console.error('Feedback submission error:', error)
            toast.error('Something went wrong')
        } finally {
            setIsSubmitting(false)
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
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-heading font-bold text-forest-green mb-2">
                    Share Your Feedback
                </h1>
                <p className="text-gray-600">
                    We value your opinion! Tell us about your recent experience with Evergrow.
                </p>
            </div>

            <div className="bg-white rounded-lg shadow-hard p-8 border border-gray-100">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Project
                        </label>
                        <select
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-forest-green focus:ring-forest-green py-2 px-3"
                            value={formData.projectId}
                            onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                            required
                        >
                            <option value="">-- Choose a completed service --</option>
                            {projects.map((project) => (
                                <option key={project.id} value={project.id}>
                                    {project.service_type} - {new Date(project.scheduled_date).toLocaleDateString()}
                                </option>
                            ))}
                        </select>
                        {projects.length === 0 && (
                            <p className="text-sm text-yellow-600 mt-1">
                                You don&apos;t have any completed projects to review yet.
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rating
                        </label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, rating: star })}
                                    className="focus:outline-none transition-transform hover:scale-110"
                                >
                                    <Star
                                        className={`w-8 h-8 ${star <= formData.rating
                                                ? 'fill-vibrant-gold text-vibrant-gold'
                                                : 'text-gray-300'
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Comments
                        </label>
                        <Textarea
                            placeholder="What did you like? How can we improve?"
                            rows={4}
                            value={formData.comment}
                            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting || projects.length === 0}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                    </Button>
                </form>
            </div>
        </div>
    )
}
