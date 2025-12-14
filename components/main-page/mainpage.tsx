'use client';

import Link from 'next/link';
import { Search, Upload, Bell, Shield, CheckCircle, MapPin, Users, Sparkles, ChevronRight, ArrowRight, Star, ShieldCheck, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function MainPage() {
  const [stats, setStats] = useState({ itemsFound: 0, happyUsers: 0, cities: 0 });
  const [activeFeature, setActiveFeature] = useState(0);
  
  useEffect(() => {
    // Animate stats counter
    const timer = setTimeout(() => {
      setStats({
        itemsFound: 12457,
        happyUsers: 8321,
        cities: 156
      });
    }, 500);
    
    // Auto rotate features
    const featureInterval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 4);
    }, 4000);
    
    return () => {
      clearTimeout(timer);
      clearInterval(featureInterval);
    };
  }, []);

  const features = [
    {
      icon: <Upload className="text-blue-600" size={24} />,
      title: "Post Items",
      description: "Easily report lost or found items with photos, location, and details",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-100",
      details: "Upload multiple photos, add detailed descriptions, and specify exact locations using our interactive map."
    },
    {
      icon: <Search className="text-green-600" size={24} />,
      title: "Smart Matching",
      description: "AI-powered algorithm finds potential matches automatically",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-100",
      details: "Our intelligent system analyzes photos, descriptions, and location data to find the most likely matches."
    },
    {
      icon: <Bell className="text-purple-600" size={24} />,
      title: "Get Notified",
      description: "Receive instant notifications when matches are found",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-100",
      details: "Get real-time alerts via email, SMS, or push notifications when potential matches are identified."
    },
    {
      icon: <Shield className="text-orange-600" size={24} />,
      title: "Verified Process",
      description: "Secure verification and admin review for safe returns",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-100",
      details: "Our moderation team verifies matches and facilitates safe, secure item returns with confirmation tracking."
    }
  ];

  const testimonials = [
    {
      name: "Alex Johnson",
      role: "Found lost wallet",
      content: "I lost my wallet with all my cards and ID. Within 2 days, I got a notification that someone found it. The process was seamless!",
      avatarColor: "bg-blue-500"
    },
    {
      name: "Maria Rodriguez",
      role: "Returned a laptop",
      content: "Found a laptop at the park. Using this platform, I connected with the owner the same day. The verification process made it safe for both of us.",
      avatarColor: "bg-green-500"
    },
    {
      name: "David Chen",
      role: "Found phone in taxi",
      content: "Left my phone in a taxi and thought it was gone forever. Thanks to this service, the driver found it and returned it within hours.",
      avatarColor: "bg-purple-500"
    }
  ];

  const processSteps = [
    { step: 1, title: "Report Item", description: "Submit lost or found item details with photos" },
    { step: 2, title: "Algorithm Matching", description: "Our system scans for potential matches 24/7" },
    { step: 3, title: "Connect", description: "Get notified and connect with the other party" },
    { step: 4, title: "Verify & Return", description: "Verify details and arrange safe return" },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 via-white to-indigo-50 overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed top-0 left-0 right-0 bottom-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-500"></div>
      </div>

      {/* Header/Navigation */}
      <header className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="bg-linear-to-r from-blue-600 to-indigo-600 p-2 rounded-xl">
                <Search className="text-white" size={28} />
              </div>
              <span className="text-2xl font-bold bg-linear-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                FynDR
              </span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/how-it-works" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                How it Works
              </Link>
              <Link href="/success-stories" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Success Stories
              </Link>
              <Link href="/safety" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Safety
              </Link>
              <Link href="/help" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Help Center
              </Link>
            </nav>
            
            <div className="flex items-center space-x-4">
              <Link 
                href="/auth"
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Log In
              </Link>
              <Link 
                href="/auth"
                className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-all hover:shadow-lg"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
        <section className="relative z-10 py-16 md:py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6"
              >
                <Sparkles size={16} />
                <span className="font-medium">Over 12,000 items reunited with owners</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight"
              >
                Lost Something?
                <br />
                <span className="bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  We'll Help Find It
                </span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed"
              >
                Connect lost items with their owners using our intelligent matching system. 
                Report lost or found items and get matched automatically with secure verification.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16"
              >
                <Link 
                  href="/auth"
                  className="group bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-10 py-5 rounded-xl text-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 flex items-center"
                >
                  Get Started Free
                  <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" size={20} />
                </Link>
                <Link 
                  href="/how-it-works"
                  className="group bg-white hover:bg-gray-50 text-gray-900 font-semibold px-10 py-5 rounded-xl text-lg border-2 border-gray-300 transition-all duration-300 hover:shadow-xl flex items-center"
                >
                  <Eye className="mr-3" size={20} />
                  See How It Works
                  <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                </Link>
              </motion.div>
              
              {/* Stats */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto mb-20"
              >
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-center w-14 h-14 bg-linear-to-br from-blue-100 to-blue-200 rounded-xl mb-4 mx-auto">
                    <Search className="text-blue-600" size={28} />
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {stats.itemsFound.toLocaleString()}+
                  </div>
                  <div className="text-gray-600">Items Found & Returned</div>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-center w-14 h-14 bg-linear-to-br from-green-100 to-green-200 rounded-xl mb-4 mx-auto">
                    <Users className="text-green-600" size={28} />
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {stats.happyUsers.toLocaleString()}+
                  </div>
                  <div className="text-gray-600">Happy Users</div>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-center w-14 h-14 bg-linear-to-br from-purple-100 to-purple-200 rounded-xl mb-4 mx-auto">
                    <MapPin className="text-purple-600" size={28} />
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {stats.cities}+
                  </div>
                  <div className="text-gray-600">Cities Worldwide</div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

      {/* How It Works */}
      <section className="relative z-10 py-16 bg-linear-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It <span className="text-blue-600">Works</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Our 4-step process makes recovering lost items simple and secure
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {processSteps.map((step, index) => (
              <motion.div 
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 h-full hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center justify-center w-16 h-16 bg-linear-to-r from-blue-500 to-indigo-500 rounded-2xl mb-6 mx-auto text-white text-2xl font-bold">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">{step.title}</h3>
                  <p className="text-gray-600 text-center">{step.description}</p>
                </div>
                
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                    <ChevronRight className="text-gray-300" size={32} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Features */}
     <section className="relative z-10 py-20 bg-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    
    {/* Header */}
    <div className="text-center mb-16">
      <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
        Why Choose <span className="text-blue-600">FynDR</span>
      </h2>
      <p className="text-gray-600 text-lg max-w-2xl mx-auto">
        Purpose-built features that significantly increase your recovery success rate
      </p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">

      {/* Left Feature Cards */}
      <div className="space-y-6">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={`
              relative cursor-pointer transition-all duration-300 
              bg-white rounded-2xl p-7 shadow-md border border-gray-100 
              hover:shadow-xl hover:-translate-y-1
              ${activeFeature === index ? 'ring-2 ring-blue-500/40 shadow-xl' : ''}
            `}
            onMouseEnter={() => setActiveFeature(index)}
            onClick={() => setActiveFeature(index)}
          >
            <div className="flex items-start">
              <div
                className={`${feature.bgColor} w-16 h-16 rounded-xl flex items-center justify-center mr-6 shadow-inner`}
              >
                {feature.icon}
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
                  {feature.title}
                  {activeFeature === index && (
                    <span className="ml-3 px-3 py-1 text-xs font-semibold rounded-full bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow">
                      Active
                    </span>
                  )}
                </h3>

                <p className="text-gray-600 mb-2 leading-relaxed">
                  {feature.description}
                </p>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {feature.details}
                </p>
              </div>
            </div>

            {activeFeature === index && (
              <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl bg-linear-to-r from-blue-600 to-indigo-600"></div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Right Detail Preview */}
      <motion.div
        key={activeFeature}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="rounded-3xl p-12 shadow-xl border border-blue-100 bg-linear-to-br from-blue-50 to-indigo-50"
      >
        <div className="text-center">

          <div className={`inline-flex p-6 rounded-2xl shadow-md mb-8 ${features[activeFeature].bgColor}`}>
            {features[activeFeature].icon}
          </div>

          <h3 className="text-3xl font-bold text-gray-900 mb-6">
            {features[activeFeature].title}
          </h3>

          <p className="text-gray-700 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            {features[activeFeature].details}
          </p>

          {/* Small indicators */}
          <div className="flex justify-center space-x-3 mb-10">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all ${
                  activeFeature === i ? 'bg-blue-600 scale-110' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <Link
            href="/auth"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold text-lg transition-colors"
          >
            Try it now
            <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>
      </motion.div>
    </div>
  </div>
</section>


      {/* Testimonials */}
      <section className="relative z-10 py-16 bg-linear-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              See what our users have to say about their recovery experiences
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center mb-6">
                  <div className={`${testimonial.avatarColor} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4`}>
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-blue-600 font-medium">{testimonial.role}</p>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={18} fill="currentColor" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              href="/success-stories"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold text-lg"
            >
              Read more success stories
              <ChevronRight className="ml-2" size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Security & Trust */}
    <section className="relative z-10 py-20">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="bg-linear-to-r from-blue-700 via-indigo-700 to-indigo-800 rounded-3xl p-12 text-white shadow-2xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
        
        {/* Left Content */}
        <div>
          <div className="inline-flex items-center bg-white/20 border border-white/10 text-white px-5 py-2 rounded-full mb-6 backdrop-blur">
            <ShieldCheck size={20} className="mr-2" />
            <span className="font-semibold tracking-wide">Security First</span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-6">
            Your Safety Is Our Priority
          </h2>

          <p className="text-blue-100 text-lg mb-10 leading-relaxed">
            We use multi-layer verification, secure communication methods, and
            strict data protection policies to ensure safe and trustworthy
            interactions. Every match is carefully reviewed by our team to
            maintain a secure community.
          </p>

          <div className="flex flex-col sm:flex-row gap-5">
            <Link
              href="/safety"
              className="bg-white text-blue-700 hover:bg-blue-50 font-semibold px-8 py-4 rounded-xl shadow transition-all"
            >
              Learn About Safety
            </Link>

            <Link
              href="/auth"
              className="border-2 border-white text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-xl transition-all"
            >
              Get Started Securely
            </Link>
          </div>
        </div>

        {/* Right Icons Grid */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white/10 rounded-2xl p-6 backdrop-blur shadow-sm">
            <Shield className="mb-4 text-green-400" size={36} />
            <h3 className="font-semibold text-xl mb-2">Verified Users</h3>
            <p className="text-blue-100 text-sm">Email & phone verification</p>
          </div>

          <div className="bg-white/10 rounded-2xl p-6 backdrop-blur shadow-sm">
            <Eye className="mb-4 text-blue-300" size={36} />
            <h3 className="font-semibold text-xl mb-2">Admin Review</h3>
            <p className="text-blue-100 text-sm">Every match manually verified</p>
          </div>

          <div className="bg-white/10 rounded-2xl p-6 backdrop-blur shadow-sm">
            <CheckCircle className="mb-4 text-green-400" size={36} />
            <h3 className="font-semibold text-xl mb-2">Secure Returns</h3>
            <p className="text-blue-100 text-sm">Strict return protocols</p>
          </div>

          <div className="bg-white/10 rounded-2xl p-6 backdrop-blur shadow-sm">
            <Bell className="mb-4 text-yellow-300" size={36} />
            <h3 className="font-semibold text-xl mb-2">Safe Notifications</h3>
            <p className="text-blue-100 text-sm">Private & encrypted alerts</p>
          </div>
        </div>

      </div>
    </div>
  </div>
</section>


      {/* CTA Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-linear-to-br from-white to-blue-50 rounded-3xl p-12 shadow-2xl border border-gray-100"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Ready to Find What's Lost?
            </h2>
            
            <p className="text-gray-600 text-xl mb-10 max-w-2xl mx-auto">
              Join thousands who have successfully reunited with their lost items. 
              It's free to get started.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link 
                href="/auth"
                className="group bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-10 py-5 rounded-xl text-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 flex items-center justify-center"
              >
                Start Free Finding
                <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" size={20} />
              </Link>
              
              <Link 
                href="/search"
                className="group bg-white hover:bg-gray-50 text-gray-900 font-semibold px-10 py-5 rounded-xl text-lg border-2 border-gray-300 transition-all duration-300 hover:shadow-xl flex items-center justify-center"
              >
                <Search className="mr-3" size={20} />
                Search Lost Items
              </Link>
            </div>
            
            <p className="text-gray-500 mt-8">
              No credit card required • Free forever for basic use
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-10 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-6 md:mb-0">
              <div className="bg-linear-to-r from-blue-600 to-indigo-600 p-2 rounded-xl">
                <Search className="text-white" size={24} />
              </div>
              <span className="text-2xl font-bold bg-linear-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                FynDR
              </span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8 mb-6 md:mb-0">
              <Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors">
                About
              </Link>
              <Link href="/blog" className="text-gray-600 hover:text-blue-600 transition-colors">
                Blog
              </Link>
              <Link href="/privacy" className="text-gray-600 hover:text-blue-600 transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-gray-600 hover:text-blue-600 transition-colors">
                Terms
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">
                Contact
              </Link>
            </div>
            
            <div className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Recoverly. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}