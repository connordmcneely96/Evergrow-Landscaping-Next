import Link from 'next/link';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-forest-green-900 text-white pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div>
                        <Link href="/" className="inline-block mb-4">
                            <span className="font-heading font-bold text-2xl tracking-tight text-white">
                                EVER<span className="text-vibrant-gold">GROW</span>
                            </span>
                        </Link>
                        <p className="text-gray-300 text-sm leading-relaxed mb-6">
                            Professional landscaping services dedicated to transforming outdoor spaces in El Dorado, Oklahoma City, and surrounding areas.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-vibrant-gold hover:text-deep-charcoal transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-vibrant-gold hover:text-deep-charcoal transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-vibrant-gold hover:text-deep-charcoal transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Services Column */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 text-vibrant-gold">Services</h3>
                        <ul className="space-y-3 text-sm text-gray-300">
                            <li><Link href="/services/lawn-care" className="hover:text-white transition-colors">Lawn Care & Mowing</Link></li>
                            <li><Link href="/services/flower-beds" className="hover:text-white transition-colors">Flower Bed Design</Link></li>
                            <li><Link href="/services/seasonal-cleanup" className="hover:text-white transition-colors">Spring & Fall Cleanup</Link></li>
                            <li><Link href="/services/pressure-washing" className="hover:text-white transition-colors">Pressure Washing</Link></li>
                            <li><Link href="/services/fertilization" className="hover:text-white transition-colors">Fertilization & Weed Control</Link></li>
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 text-vibrant-gold">Contact Us</h3>
                        <ul className="space-y-4 text-sm text-gray-300">
                            <li className="flex items-start">
                                <MapPin className="w-5 h-5 mr-3 text-vibrant-gold flex-shrink-0" />
                                <span>123 Main St,<br />El Dorado, OK 73537</span>
                            </li>
                            <li className="flex items-center">
                                <Phone className="w-5 h-5 mr-3 text-vibrant-gold flex-shrink-0" />
                                <a href="tel:+14054795794" className="hover:text-white transition-colors">(405) 479-5794</a>
                            </li>
                            <li className="flex items-center">
                                <Mail className="w-5 h-5 mr-3 text-vibrant-gold flex-shrink-0" />
                                <a href="mailto:contact@evergrow.com" className="hover:text-white transition-colors">contact@evergrow.com</a>
                            </li>
                        </ul>
                    </div>

                    {/* CTA Column */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 text-vibrant-gold">Get Started</h3>
                        <p className="text-gray-300 text-sm mb-6">
                            Ready to transform your lawn? Get a free, no-obligation quote today.
                        </p>
                        <Link
                            href="/quote-request"
                            className="inline-block bg-vibrant-gold text-deep-charcoal px-6 py-3 rounded-md font-bold text-sm hover:bg-yellow-400 transition-colors w-full text-center"
                        >
                            Request a Free Quote
                        </Link>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-forest-green-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
                    <p>&copy; {currentYear} Evergrow Landscaping. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link href="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
