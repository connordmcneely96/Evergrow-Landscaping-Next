import { PostCard } from '@/components/blog/PostCard'
import { CategoryFilter } from '@/components/blog/CategoryFilter'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

// Mock data - will be replaced with API call to GET /api/blog/posts
const posts = [
    {
        id: 1,
        title: 'How to Choose a Reliable Landscaper in El Dorado',
        slug: 'how-to-choose-reliable-landscaper-el-dorado',
        excerpt: 'Finding a trustworthy landscaping company shouldn\'t be a gamble. Here are 7 key factors to consider before hiring anyone to work on your property.',
        featuredImage: '/images/blog/choosing-landscaper.jpg',
        category: 'Landscaping Tips',
        author: 'Evergreen Team',
        publishedAt: '2025-01-20',
        readTime: '5 min read',
    },
    {
        id: 2,
        title: 'Spring Lawn Care Tips for Oklahoma Homeowners',
        slug: 'spring-lawn-care-tips-oklahoma',
        excerpt: 'Oklahoma\'s unpredictable spring weather requires a strategic approach to lawn care. Learn what to do (and when) for a lush green lawn all summer.',
        featuredImage: '/images/blog/spring-lawn-care.jpg',
        category: 'Lawn Care',
        author: 'Evergreen Team',
        publishedAt: '2025-01-15',
        readTime: '7 min read',
    },
    {
        id: 3,
        title: 'Flower Bed Ideas That Thrive in Our Climate',
        slug: 'flower-bed-ideas-oklahoma-climate',
        excerpt: 'Not all plants are created equal in Oklahoma\'s climate. Discover native and hardy plant options that look beautiful and require less maintenance.',
        featuredImage: '/images/blog/flower-bed-ideas.jpg',
        category: 'Flower Beds',
        author: 'Evergreen Team',
        publishedAt: '2025-01-10',
        readTime: '6 min read',
    },
    {
        id: 4,
        title: 'Why Regular Lawn Maintenance Saves You Money',
        slug: 'why-regular-lawn-maintenance-saves-money',
        excerpt: 'Skipping lawn care to save money? Here\'s why that approach actually costs more in the long run—and how consistent maintenance protects your investment.',
        featuredImage: '/images/blog/lawn-maintenance-savings.jpg',
        category: 'Lawn Care',
        author: 'Evergreen Team',
        publishedAt: '2025-01-05',
        readTime: '4 min read',
    },
    {
        id: 5,
        title: 'Pressure Washing: What Homeowners Need to Know',
        slug: 'pressure-washing-guide-homeowners',
        excerpt: 'Thinking about pressure washing your driveway or deck? Learn about the benefits, risks, and why hiring a pro is often the safer choice.',
        featuredImage: '/images/blog/pressure-washing-guide.jpg',
        category: 'Pressure Washing',
        author: 'Evergreen Team',
        publishedAt: '2025-01-01',
        readTime: '5 min read',
    },
]

export default function BlogPage() {
    return (
        <main>
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-forest-green to-forest-green-600 py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center text-white">
                        <h1 className="text-h1 font-heading font-bold mb-4">
                            Landscaping Tips & Insights
                        </h1>
                        <p className="text-xl">
                            Expert advice for homeowners in El Dorado and Oklahoma City
                        </p>
                    </div>
                </div>
            </section>

            {/* Blog Content */}
            <section className="section py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        {/* Category Filter */}
                        <CategoryFilter />

                        {/* Featured Post */}
                        <div className="mb-12">
                            <div className="bg-forest-green-50 rounded-lg overflow-hidden shadow-md border border-forest-green-100">
                                <PostCard post={posts[0]} featured />
                            </div>
                        </div>

                        {/* Post Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {posts.slice(1).map((post) => (
                                <PostCard key={post.id} post={post} />
                            ))}
                        </div>

                        {/* Load More */}
                        <div className="text-center mt-12">
                            <Button variant="outline" size="lg">
                                Load More Articles
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Newsletter CTA */}
            <section className="section py-16 bg-gradient-to-r from-forest-green to-forest-green-600">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center text-white">
                        <h2 className="text-h2 font-heading mb-4 text-white">
                            Get Landscaping Tips in Your Inbox
                        </h2>
                        <p className="text-xl mb-8">
                            Join our newsletter for seasonal tips, project ideas, and exclusive offers.
                        </p>
                        <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Your email address"
                                className="flex-1 px-4 py-3 rounded-lg text-gray-900 border-none focus:ring-2 focus:ring-vibrant-gold outline-none"
                                required
                            />
                            <Button variant="primary" size="lg" type="submit" className="bg-vibrant-gold text-deep-charcoal hover:bg-yellow-400 border-none">
                                Subscribe
                            </Button>
                        </form>
                        <p className="text-sm text-white/80 mt-4">
                            We respect your privacy. Unsubscribe anytime.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    )
}

export const metadata = {
    title: 'Blog | Evergreen Landscaping',
    description: 'Landscaping tips, lawn care advice, and seasonal guides for homeowners in El Dorado and Oklahoma City.',
}
