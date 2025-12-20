import { useState, useEffect, useRef } from 'react';

// Navigation links
const navLinks = ['Products', 'Features', 'About', 'Reviews'];

// Products data
const products = [
  {
    id: 1,
    name: 'Carbon Fiber Steering Wheel',
    description: 'Premium hand-crafted steering wheel with alcantara grip',
    price: 1299,
    originalPrice: 1599,
    rating: 5,
    reviews: 128,
    image: 'https://images.unsplash. com/photo-1489824904134-891ab64532f1?w=600&q=80',
    tag: 'Bestseller',
    tagColor: 'bg-accent',
  },
  {
    id: 2,
    name: 'LED Ambient Lighting Kit',
    description: '64-color ambient lighting with app control',
    price: 449,
    originalPrice: null,
    rating: 5,
    reviews: 89,
    image: 'https://images.unsplash. com/photo-1511919884226-fd3cad34687c?w=600&q=80',
    tag: 'New Arrival',
    tagColor: 'bg-white/10 backdrop-blur',
  },
  {
    id: 3,
    name: 'Premium Leather Floor Mats',
    description: 'Custom-fit all-weather protection with luxury finish',
    price: 299,
    originalPrice: 379,
    rating: 5,
    reviews: 256,
    image: 'https://images.unsplash. com/photo-1549399542-7e3f8b79c341?w=600&q=80',
    tag: '-20% OFF',
    tagColor: 'bg-green-500 text-dark-900',
  },
];

// Features data
const features = [
  {
    icon: (
      <svg className="w-7 h-7 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 11. 08V12a10 10 0 1 1-5. 93-9.14" />
        <polyline points="22 4 12 14. 01 9 11.01" />
      </svg>
    ),
    title: 'Premium Materials',
    description: 'Only the finest carbon fiber, leather, and aerospace-grade materials in every product',
  },
  {
    icon: (
      <svg className="w-7 h-7 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: 'Fast Installation',
    description: 'Designed for easy DIY installation with detailed guides and video tutorials',
  },
  {
    icon: (
      <svg className="w-7 h-7 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    title: '24/7 Expert Support',
    description: 'Our team of automotive experts available around the clock for any questions',
  },
];

// Testimonials data
const testimonials = [
  {
    id: 1,
    text: 'The carbon fiber steering wheel completely transformed my M4.  The quality is exceptional - you can feel the craftsmanship in every detail.',
    name: 'Marcus Chen',
    role: 'BMW M4 Owner',
    image: 'https://images.unsplash. com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
  },
  {
    id: 2,
    text: 'Fast shipping, perfect fit, and the ambient lighting kit was incredibly easy to install.  My Audi looks absolutely stunning now.',
    name: 'Sarah Mitchell',
    role: 'Audi RS5 Owner',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
  },
  {
    id: 3,
    text: 'Customer service went above and beyond. They helped me find the perfect accessories for my Porsche.  Highly recommend!',
    name: 'James Rodriguez',
    role: 'Porsche 911 Owner',
    image: 'https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100&q=80',
  },
];

// Stats data
const stats = [
  { value: '50+', label: 'Countries Shipped' },
  { value: '15K+', label: 'Happy Customers' },
  { value: '500+', label: 'Products Available' },
  { value: '98%', label: 'Satisfaction Rate' },
];

// Marquee items
const marqueeItems = ['CARBON FIBER', 'LEATHER INTERIOR', 'PERFORMANCE PARTS', 'LIGHTING SYSTEMS', 'AUDIO UPGRADES'];

// Footer links
const footerLinks = {
  Products: ['Steering Wheels', 'Interior', 'Exterior', 'Lighting', 'Audio', 'Performance'],
  Company: ['About Us', 'Careers', 'Press', 'Blog', 'Partners'],
  Support: ['Help Center', 'Contact Us', 'Shipping', 'Returns', 'Warranty'],
};

// Social links
const socialLinks = [
  { name: 'Twitter', icon: 'M23 3a10.9 10.9 0 0 1-3.14 1. 53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11. 64 0 0 1-7 2c9 5 20 0 20-11. 5a4.5 4.5 0 0 0-.08-.83A7.72 7. 72 0 0 0 23 3z' },
  { name: 'Instagram', icon: 'M16 11. 37A4 4 0 1 1 12. 63 8 4 4 0 0 1 16 11. 37zM17. 5 6. 5h. 01M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z' },
  { name: 'YouTube', icon: 'M22. 54 6.42a2. 78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6. 46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 . 46 5.33A2.78 2.78 0 0 0 3.4 19c1.72. 46 8.6.46 8.6. 46s6.88 0 8. 6-.46a2.78 2. 78 0 0 0 1. 94-2 29 29 0 0 0 . 46-5.25 29 29 0 0 0-. 46-5.33zM9. 75 15. 02l5.75-3.27-5.75-3.27v6.54z' },
  { name: 'LinkedIn', icon: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z' },
];

export default function BioSyncLandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [email, setEmail] = useState('');
  const cursorRef = useRef(null);

  // Handle scroll for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window. scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Custom cursor
  useEffect(() => {
    const cursor = cursorRef.current;
    if (! cursor) return;

    const moveCursor = (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e. clientY}px`;
      cursor.style.opacity = '1';
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  // Close mobile menu on link click
  const handleMobileNavClick = () => {
    setMobileMenuOpen(false);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you for subscribing with: ${email}`);
    setEmail('');
  };

  return (
    <div className="bg-dark-900 text-white font-sans overflow-x-hidden">
      {/* Custom Cursor */}
      <div
        ref={cursorRef}
        className="fixed w-5 h-5 bg-accent rounded-full pointer-events-none z-[9999] mix-blend-difference opacity-0 hidden lg:block -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300"
      />

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ?  'bg-dark-900/90 backdrop-blur-xl border-b border-white/10' : ''}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 lg:h-24">
            {/* Logo */}
            <a href="#" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:rotate-12">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="font-display font-bold text-xl tracking-tight">APEX</span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className="nav-link px-5 py-2 text-sm text-white/70 hover:text-white transition-colors duration-300 relative group"
                >
                  {link}
                  <span className="absolute bottom-0 left-5 right-5 h-px bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </a>
              ))}
            </div>

            {/* CTA & Menu */}
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="hidden sm:flex items-center gap-2 px-6 py-3 bg-white text-dark-900 rounded-full text-sm font-semibold hover:bg-accent hover:text-white transition-all duration-300"
              >
                <span>Shop Now</span>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1. 5"
              >
                <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? '-rotate-45' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-dark-900/98 backdrop-blur-xl z-40 transition-opacity duration-500 lg:hidden ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              onClick={handleMobileNavClick}
              className="text-4xl font-display font-bold text-white/50 hover:text-white transition-colors"
            >
              {link}
            </a>
          ))}
          <a href="#" className="mt-8 px-8 py-4 bg-accent text-white rounded-full text-lg font-semibold">
            Shop Now
          </a>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 lg:pt-0 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-accent/20 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-[128px]" />
        </div>

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8 animate-fade-in-up">
                <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                <span className="text-sm text-white/70">New 2024 Collection Available</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-display font-bold leading-[0. 9] mb-6 animate-fade-in-up">
                <span className="block">Elevate</span>
                <span className="block text-accent">Your Drive</span>
              </h1>

              <p className="text-lg lg:text-xl text-white/60 max-w-lg mb-10 leading-relaxed animate-fade-in-up">
                Premium car accessories crafted for enthusiasts who demand excellence.  Transform your vehicle into a statement of luxury and performance.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up">
                <a
                  href="#products"
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-accent hover:bg-accent-light rounded-full text-base font-semibold transition-all duration-300"
                >
                  <span>Explore Collection</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-full text-base font-medium transition-all duration-300"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <span>Watch Video</span>
                </a>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-8 lg:gap-12 mt-16 pt-8 border-t border-white/10 animate-fade-in-up">
                <div>
                  <div className="text-3xl lg:text-4xl font-display font-bold">
                    15K<span className="text-accent">+</span>
                  </div>
                  <div className="text-sm text-white/50 mt-1">Happy Customers</div>
                </div>
                <div>
                  <div className="text-3xl lg:text-4xl font-display font-bold">
                    500<span className="text-accent">+</span>
                  </div>
                  <div className="text-sm text-white/50 mt-1">Premium Products</div>
                </div>
                <div>
                  <div className="text-3xl lg:text-4xl font-display font-bold">4.9</div>
                  <div className="text-sm text-white/50 mt-1">Customer Rating</div>
                </div>
              </div>
            </div>

            {/* Right Content - Hero Image */}
            <div className="order-1 lg:order-2 relative">
              <div className="relative aspect-square max-w-lg mx-auto lg:max-w-none">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-accent/20 rounded-full blur-[100px] animate-pulse" />

                {/* Main Image Container */}
                <div className="relative bg-gradient-to-br from-dark-700 to-dark-800 rounded-3xl overflow-hidden border border-white/10">
                  <img
                    src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&q=80"
                    alt="Luxury Car Interior"
                    className="w-full h-full object-cover animate-fade-in-up"
                    loading="eager"
                  />

                  {/* Floating Badge */}
                  <div className="absolute top-6 right-6 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/20">
                    <span className="text-sm font-medium">Premium Quality</span>
                  </div>

                  {/* Bottom Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-dark-900/90 to-transparent">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white/60">Featured</p>
                        <p className="font-semibold">Carbon Fiber Collection</p>
                      </div>
                      <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-dark-700 rounded-2xl border border-white/10 flex items-center justify-center animate-float">
                  <img
                    src="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=200&q=80"
                    alt="Steering Wheel"
                    className="w-16 h-16 object-cover rounded-xl"
                  />
                </div>

                <div className="absolute -bottom-6 -right-6 px-5 py-3 bg-dark-700 rounded-xl border border-white/10 animate-float-delayed">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80"
                        className="w-8 h-8 rounded-full border-2 border-dark-700 object-cover"
                        alt="Customer"
                      />
                      <img
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80"
                        className="w-8 h-8 rounded-full border-2 border-dark-700 object-cover"
                        alt="Customer"
                      />
                      <img
                        src="https://images.unsplash. com/photo-1599566150163-29194dcabd36?w=100&q=80"
                        className="w-8 h-8 rounded-full border-2 border-dark-700 object-cover"
                        alt="Customer"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-accent">★★★★★</span>
                      </div>
                      <p className="text-xs text-white/60">2.5k Reviews</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs text-white/40 uppercase tracking-widest">Scroll</span>
          <svg className="w-5 h-5 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* Marquee Section */}
      <section className="py-8 border-y border-white/10 bg-dark-800 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-12 px-6">
              {marqueeItems. map((item) => (
                <span key={item} className="flex items-center gap-12">
                  <span className="text-2xl font-display font-bold text-white/20">{item}</span>
                  <span className="w-2 h-2 bg-accent rounded-full" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-24 lg:py-32 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
            <div>
              <span className="inline-block px-4 py-2 bg-accent/10 border border-accent/20 rounded-full text-accent text-sm font-medium mb-6">
                Featured Products
              </span>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-tight">
                Curated for
                <span className="text-accent"> Excellence</span>
              </h2>
            </div>
            <a href="#" className="group inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors">
              <span>View All Products</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {/* Products Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {products.map((product) => (
              <div
                key={product. id}
                className="group relative bg-dark-800 rounded-3xl overflow-hidden border border-white/5 transition-all duration-500 hover:-translate-y-3"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-60" />

                  {/* Quick Actions */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    <button className="w-10 h-10 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center hover:bg-accent transition-colors">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20. 84 4.61a5. 5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7. 78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </button>
                    <button className="w-10 h-10 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center hover:bg-accent transition-colors">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                  </div>

                  {/* Tag */}
                  <div className={`absolute top-4 left-4 px-3 py-1 ${product.tagColor} rounded-full text-xs font-semibold`}>
                    {product.tag}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex text-accent text-sm">{'★'. repeat(product.rating)}</div>
                    <span className="text-white/50 text-sm">({product.reviews})</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-accent transition-colors">{product.name}</h3>
                  <p className="text-white/50 text-sm mb-4">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold">${product.price. toLocaleString()}</span>
                      {product.originalPrice && (
                        <span className="text-white/40 line-through text-sm">${product.originalPrice.toLocaleString()}</span>
                      )}
                    </div>
                    <button className="w-12 h-12 bg-accent rounded-full flex items-center justify-center hover:bg-accent-light transition-colors">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 20a1 1 0 1 0 0 2 1 1 0 0 0 0-2zM20 20a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                        <path d="M1 1h4l2. 68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1. 61L23 6H6" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 lg:py-32 bg-dark-800 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[150px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Image */}
            <div className="relative">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80"
                  alt="Luxury Car"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-transparent to-transparent" />
              </div>

              {/* Floating Card */}
              <div className="absolute -bottom-8 -right-8 lg:right-8 bg-dark-700 backdrop-blur-xl rounded-2xl p-6 border border-white/10 max-w-xs">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-accent/20 rounded-xl flex items-center justify-center">
                    <svg className="w-7 h-7 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">5 Years</div>
                    <div className="text-white/60 text-sm">Premium Warranty</div>
                  </div>
                </div>
                <p className="text-white/60 text-sm">Every product backed by our industry-leading warranty and support</p>
              </div>
            </div>

            {/* Right - Content */}
            <div>
              <span className="inline-block px-4 py-2 bg-accent/10 border border-accent/20 rounded-full text-accent text-sm font-medium mb-6">
                Why Choose Us
              </span>
              <h2 className="text-4xl sm:text-5xl font-display font-bold leading-tight mb-8">
                Crafted with
                <span className="text-accent"> Precision</span>
              </h2>

              {/* Feature List */}
              <div className="space-y-6">
                {features.map((feature) => (
                  <div
                    key={feature.title}
                    className="group flex gap-5 p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-accent/30 transition-all duration-300"
                  >
                    <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-colors">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-white/60">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About / Split Section */}
      <section id="about" className="py-24 lg:py-32 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Card */}
            <div className="relative group">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80"
                  alt="Sports Car"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <span className="text-accent text-sm font-semibold uppercase tracking-wider">Our Story</span>
                  <h3 className="text-3xl font-display font-bold mt-2 mb-4">Built by Enthusiasts, For Enthusiasts</h3>
                  <p className="text-white/70">
                    Founded by a team of automotive engineers and car lovers who believe every drive should be extraordinary. 
                  </p>
                </div>
              </div>
            </div>

            {/* Right Card */}
            <div className="relative group">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden">
                <img
                  src="https://images. unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80"
                  alt="Car Interior"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <span className="text-accent text-sm font-semibold uppercase tracking-wider">Our Promise</span>
                  <h3 className="text-3xl font-display font-bold mt-2 mb-4">Uncompromising Quality</h3>
                  <p className="text-white/70">
                    Every product undergoes rigorous testing to ensure it meets our exacting standards for durability and aesthetics.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat. label} className="bg-dark-800 rounded-2xl p-6 text-center border border-white/5">
                <div className="text-4xl font-display font-bold text-accent mb-2">{stat.value}</div>
                <div className="text-white/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="reviews" className="py-24 lg:py-32 bg-dark-800 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[150px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-accent/10 border border-accent/20 rounded-full text-accent text-sm font-medium mb-6">
              Testimonials
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold">
              What Our <span className="text-accent">Customers</span> Say
            </h2>
          </div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-dark-700 rounded-3xl p-8 border border-white/5 hover:border-accent/20 transition-all duration-300"
              >
                <div className="flex items-center gap-1 text-accent mb-6">★★★★★</div>
                <p className="text-white/80 text-lg mb-8 leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                    loading="lazy"
                  />
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-white/50 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 lg:py-32 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="relative bg-gradient-to-br from-dark-700 to-dark-800 rounded-3xl p-8 lg:p-16 overflow-hidden border border-white/10">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-[128px]" />

            <div className="relative grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block px-4 py-2 bg-accent/10 border border-accent/20 rounded-full text-accent text-sm font-medium mb-6">
                  Newsletter
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4">
                  Stay in the <span className="text-accent">Fast Lane</span>
                </h2>
                <p className="text-white/60 text-lg">
                  Subscribe to get exclusive deals, new product launches, and automotive tips delivered to your inbox.
                </p>
              </div>

              <div>
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-6 py-4 bg-white/5 border border-white/10 rounded-full text-white placeholder:text-white/40 focus:outline-none focus:border-accent transition-colors"
                    required
                  />
                  <button
                    type="submit"
                    className="px-8 py-4 bg-accent hover:bg-accent-light rounded-full text-base font-semibold transition-all duration-300 whitespace-nowrap"
                  >
                    Subscribe
                  </button>
                </form>
                <p className="text-white/40 text-sm mt-4">No spam, unsubscribe anytime.  We respect your privacy.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?w=1600&q=80"
            alt="Background"
            className="w-full h-full object-cover opacity-20"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-dark-900 via-dark-900/95 to-dark-900" />
        </div>

        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6">
            Ready to Transform
            <span className="block text-accent">Your Ride? </span>
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto mb-10">
            Join thousands of satisfied customers who have elevated their driving experience with APEX Auto accessories. 
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-5 bg-accent hover:bg-accent-light rounded-full text-lg font-semibold transition-all duration-300"
            >
              <span>Shop Collection</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <a
              href="#"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-5 bg-white/5 hover:bg-white/10 border border-white/20 rounded-full text-lg font-medium transition-all duration-300"
            >
              Contact Sales
            </a>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-16 pt-8 border-t border-white/10">
            <div className="flex items-center gap-2 text-white/40">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
              <span className="text-sm">Secure Payment</span>
            </div>
            <div className="flex items-center gap-2 text-white/40">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span className="text-sm">Free Shipping</span>
            </div>
            <div className="flex items-center gap-2 text-white/40">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path d="M3. 51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4. 64 4.36A9 9 0 0 0 20. 49 15" />
              </svg>
              <span className="text-sm">30-Day Returns</span>
            </div>
            <div className="flex items-center gap-2 text-white/40">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span className="text-sm">5-Year Warranty</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-800 border-t border-white/10 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
            {/* Brand */}
            <div className="col-span-2 lg:col-span-2">
              <a href="#" className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
                <span className="font-display font-bold text-xl">APEX Auto</span>
              </a>
              <p className="text-white/50 mb-6 max-w-sm leading-relaxed">
                Premium car accessories for enthusiasts who demand excellence.  Transform your vehicle into a statement of luxury and performance.
              </p>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social. name}
                    href="#"
                    className="w-10 h-10 bg-white/5 hover:bg-accent/20 border border-white/10 hover:border-accent/30 rounded-full flex items-center justify-center transition-all duration-300"
                    aria-label={social.name}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d={social.icon} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Footer Links */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="font-semibold mb-4">{category}</h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-white/50 hover:text-white transition-colors text-sm">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Footer */}
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-sm">© 2024 APEX Auto. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-white/40 hover:text-white text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-white/40 hover:text-white text-sm transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-white/40 hover:text-white text-sm transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}