'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, MapPin } from 'lucide-react';

const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Commercial', href: '/commercial' },
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
];

const services = [
    { name: 'Lawn Care', href: '/services/lawn-care' },
    { name: 'Flower Beds', href: '/services/flower-beds' },
    { name: 'Seasonal Cleanup', href: '/services/seasonal-cleanup' },
    { name: 'Pressure Washing', href: '/services/pressure-washing' },
];

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
    const pathname = usePathname();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsOpen(false);
        setActiveSubmenu(null);
    }, [pathname]);

    const isHomePage = pathname === '/';
    const headerBg = isScrolled || !isHomePage ? 'bg-forest-green shadow-lg py-2' : 'bg-transparent py-4';
    const textColor = 'text-white'; // Always white

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBg}`}>
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 group">
                        <span className={`font-heading font-bold text-2xl tracking-tight ${textColor}`}>
                            EVER<span className="text-vibrant-gold">GROW</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-8">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`text-sm font-semibold uppercase tracking-wider hover:text-vibrant-gold transition-colors ${textColor}`}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <div className="relative group">
                            <button className={`text-sm font-semibold uppercase tracking-wider hover:text-vibrant-gold transition-colors flex items-center ${textColor}`}>
                                Services
                            </button>
                            <div className="absolute top-full left-0 pt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                <div className="bg-white rounded-lg shadow-xl py-2 overflow-hidden">
                                    {services.map((service) => (
                                        <Link
                                            key={service.href}
                                            href={service.href}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-forest-green-50 hover:text-forest-green"
                                        >
                                            {service.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </nav>

                    {/* CTA Buttons */}
                    <div className="hidden lg:flex items-center space-x-4">
                        <a
                            href="tel:+14054795794"
                            className={`flex items-center space-x-2 font-semibold hover:text-vibrant-gold transition-colors ${textColor}`}
                        >
                            <Phone className="w-4 h-4" />
                            <span>405-479-5794</span>
                        </a>
                        <Link
                            href="/portal"
                            className={`text-sm font-semibold uppercase tracking-wider hover:text-vibrant-gold transition-colors mr-4 ${textColor}`}
                        >
                            Client Login
                        </Link>
                        <Link
                            href="/quote-request"
                            className="bg-vibrant-gold text-deep-charcoal px-6 py-2.5 rounded-md font-bold uppercase text-sm tracking-wide hover:bg-yellow-400 transition-colors shadow-md"
                        >
                            Get a Quote
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={`lg:hidden p-2 rounded-md ${textColor}`}
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-full left-0 right-0 bg-white shadow-xl border-t border-gray-100 lg:hidden overflow-y-auto max-h-[80vh]"
                    >
                        <div className="container mx-auto px-4 py-6 flex flex-col space-y-4">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="text-lg font-semibold text-deep-charcoal border-b border-gray-100 pb-2"
                                >
                                    {item.name}
                                </Link>
                            ))}

                            <div className="border-b border-gray-100 pb-2">
                                <button
                                    onClick={() => setActiveSubmenu(activeSubmenu === 'services' ? null : 'services')}
                                    className="flex items-center justify-between w-full text-lg font-semibold text-deep-charcoal"
                                >
                                    Services
                                    <span className={`transform transition-transform ${activeSubmenu === 'services' ? 'rotate-180' : ''}`}>▼</span>
                                </button>
                                <AnimatePresence>
                                    {activeSubmenu === 'services' && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden bg-gray-50 rounded-md mt-2"
                                        >
                                            {services.map((service) => (
                                                <Link
                                                    key={service.href}
                                                    href={service.href}
                                                    className="block px-4 py-3 text-sm text-gray-600 border-b border-gray-200 last:border-0"
                                                >
                                                    {service.name}
                                                </Link>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="pt-4 flex flex-col space-y-3">
                                <a
                                    href="tel:+14054795794"
                                    className="flex items-center justify-center space-x-2 text-forest-green font-bold text-lg"
                                >
                                    <Phone className="w-5 h-5" />
                                    <span>(405) 479-5794</span>
                                </a>
                                <a
                                    href="tel:+14054795794"
                                    className="flex items-center justify-center space-x-2 text-forest-green font-bold text-lg"
                                >
                                    <Phone className="w-5 h-5" />
                                    <span>(405) 479-5794</span>
                                </a>
                                <Link
                                    href="/quote-request"
                                    className="bg-vibrant-gold text-deep-charcoal py-3 rounded-lg font-bold uppercase text-center tracking-wide shadow-md"
                                >
                                    Get a Free Quote
                                </Link>
                                <Link
                                    href="/login"
                                    className="bg-forest-green-50 text-forest-green py-3 rounded-lg font-bold uppercase text-center tracking-wide border border-forest-green-100"
                                >
                                    Customer Portal
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
