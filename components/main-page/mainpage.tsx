'use client';

import Link from 'next/link';
import { Search, Upload, Bell, Shield, CheckCircle, MapPin, Users, Sparkles, ChevronRight, ArrowRight, Star, ShieldCheck, Eye, Clock, TrendingUp, Globe, Award, Zap, Lock, MessageSquare, Download, BarChart, Users as UsersIcon, Target } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import CountUp from 'react-countup';

export default function MainPage() {
  const [stats, setStats] = useState({ itemsFound: 0, happyUsers: 0, cities: 0, successRate: 0 });
  const [activeFeature, setActiveFeature] = useState(0);
  const [isLiveData, setIsLiveData] = useState(false);
  const statsRef = useRef(null);
  const isInView = useInView(statsRef, { once: true });
  
  // Simulate live data updates
  useEffect(() => {
    // Initial stats animation
    const timer = setTimeout(() => {
      setStats({
        itemsFound: 12789,
        happyUsers: 9562,
        cities: 243,
        successRate: 78.5
      });
    }, 1000);
    
    // Feature auto rotation
    const featureInterval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 4);
    }, 5000);
    
    // Simulate live data updates
    const liveDataInterval = setInterval(() => {
      if (isLiveData) {
        setStats(prev => ({
          itemsFound: prev.itemsFound + Math.floor(Math.random() * 3),
          happyUsers: prev.happyUsers + Math.floor(Math.random() * 2),
          cities: prev.cities,
          successRate: prev.successRate + (Math.random() - 0.5) * 0.1
        }));
      }
    }, 3000);
    
    return () => {
      clearTimeout(timer);
      clearInterval(featureInterval);
      clearInterval(liveDataInterval);
    };
  }, [isLiveData]);
  
  const features = [
    {
      icon: <Upload className="text-blue-600" size={24} />,
      title: "Algorithm based Item Reporting",
      description: "Advanced reporting system with algo based description generation",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      details: [
        "Algorithm based description suggestions",
        "Multiple photo upload with auto-categorization",
        "Real-time location mapping",
        "Smart category detection"
      ],
      stats: "Reports completed in under 2 minutes"
    },
    {
      icon: <Search className="text-emerald-600" size={24} />,
      title: "Algorithm based Matching",
      description: "Proprietary algorithm with 94% match accuracy",
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      details: [
        "Computer vision image analysis",
        "Natural language processing",
        "Geospatial pattern recognition",
        "Historical match learning"
      ],
      stats: "Processes 500+ matches per hour"
    },
    {
      icon: <Bell className="text-violet-600" size={24} />,
      title: "Real-time Notifications",
      description: "Multi-channel alert system with priority routing",
      color: "from-violet-500 to-violet-600",
      bgColor: "bg-violet-50",
      details: [
        "Smart priority notifications",
        "Multi-channel delivery (SMS/Email/Push)",
        "Status tracking dashboard",
        "Custom notification schedules"
      ],
      stats: "Average response time: 12 minutes"
    },
    {
      icon: <Shield className="text-amber-600" size={24} />,
      title: "Secure Verification",
      description: "Enterprise-grade security with blockchain verification",
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
      details: [
        "Two-factor authentication",
        "Encrypted communication channels",
        "Digital proof of ownership"
      ],
      stats: "Zero security incidents to date"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "CTO, TechCorp Inc.",
      content: "Lost my corporate laptop during a business trip. FynDR's geofencing feature pinpointed its location, and the verification process ensured secure return within 6 hours.",
      avatarColor: "bg-linear-to-br from-blue-500 to-cyan-500",
      rating: 5,
      company: "Fortune 500 Company",
      item: "Corporate Laptop",
      time: "Recovered in 6 hours"
    },
    {
      name: "Marcus Rodriguez",
      role: "University Professor",
      content: "A student found my research documents containing sensitive data. The encrypted return process and chain-of-custody tracking gave me complete peace of mind.",
      avatarColor: "bg-linear-to-br from-emerald-500 to-green-500",
      rating: 5,
      company: "Stanford University",
      item: "Research Documents",
      time: "Secure return in 24h"
    },
    {
      name: "Priya Sharma",
      role: "International Traveler",
      content: "Left my passport in a Dubai airport lounge. The international match network connected me with airport security, and I had it back before my connecting flight.",
      avatarColor: "bg-linear-to-br from-violet-500 to-purple-500",
      rating: 5,
      company: "Frequent Flyer",
      item: "Passport & Documents",
      time: "International recovery"
    }
  ];

  const processSteps = [
    { 
      step: 1, 
      title: "Reporting", 
      description: "Use our Algorithm to create detailed reports",
      icon: <Zap className="text-blue-600" size={24} />,
      time: "2 minutes avg.",
      accuracy: "98% detail accuracy"
    },
    { 
      step: 2, 
      title: "Algorithm Analysis", 
      description: "Our system processes and matches using multiple data points",
      icon: <Target className="text-emerald-600" size={24} />,
      time: "Instant matching",
      accuracy: "94% match rate"
    },
    { 
      step: 3, 
      title: "Secure Connect", 
      description: "Verified communication through our secure platform",
      icon: <MessageSquare className="text-violet-600" size={24} />,
      time: "Admin connect the users",
      accuracy: "Analyzes"
    },
    { 
      step: 4, 
      title: "Verified Transfer", 
      description: "Transfer with digital receipt",
      icon: <CheckCircle className="text-amber-600" size={24} />,
      time: "Delivery tracked by Admin",
      accuracy: "100% verification"
    },
  ];

  const partners = [
    { name: "Airport Security", count: "42 airports" },
    { name: "Hotel Chains", count: "150+ locations" },
    { name: "Ride Sharing", count: "3 major partners" },
    { name: "Public Transport", count: "18 cities" },
    { name: "Shopping Malls", count: "75+ centers" },
    { name: "Universities", count: "28 campuses" },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50/30 overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-linear-to-br from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-linear-to-br from-violet-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-linear-to-br from-emerald-200/20 to-green-200/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Navigation */}
      <header className="relative z-50 backdrop-blur-sm bg-white/90 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-linear-to-br from-blue-600 to-cyan-600 p-2 rounded-xl shadow-lg">
                <Search className="text-white" size={28} />
              </div>
              <div>
                <span className="text-2xl font-bold bg-linear-to-br from-blue-700 to-cyan-700 bg-clip-text text-transparent">
                  FynDR
                </span>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-500 font-medium">Live • 12 items recovered</span>
                </div>
              </div>
            </div>
            
            {/* <nav className="hidden lg:flex items-center space-x-8">
              <Link href="/enterprise" className="text-gray-700 hover:text-blue-600 font-medium transition-colors text-sm">
                Enterprise
              </Link>
              <Link href="/solutions" className="text-gray-700 hover:text-blue-600 font-medium transition-colors text-sm">
                Solutions
              </Link>
              <Link href="/api" className="text-gray-700 hover:text-blue-600 font-medium transition-colors text-sm">
                API
              </Link>
              <Link href="/pricing" className="text-gray-700 hover:text-blue-600 font-medium transition-colors text-sm">
                Pricing
              </Link>
              <Link href="/resources" className="text-gray-700 hover:text-blue-600 font-medium transition-colors text-sm">
                Resources
              </Link>
            </nav> */}
            
            <div className="flex items-center space-x-4">
              <Link 
                href="/demo"
                className="hidden md:inline-flex items-center text-sm text-gray-700 hover:text-blue-600 font-medium px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Eye size={16} className="mr-2" />
                View Demo
              </Link>
              <Link 
                href="/auth"
                className="text-blue-600 hover:text-blue-800 font-semibold transition-colors text-sm"
              >
                Sign In
              </Link>
              <Link 
                href="/auth"
                className="bg-linear-to-br from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold px-6 py-3 rounded-xl transition-all hover:shadow-lg text-sm shadow-md"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-16 pb-8 md:pt-20 md:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center space-x-2 bg-linear-to-br from-blue-50 to-cyan-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-full mb-8 shadow-sm"
            >
              <TrendingUp size={16} />
              <span className="font-semibold text-sm">92% recovery rate for reported items</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight tracking-tight"
            >
              Algorithm Based
              <br />
              <span className="bg-linear-to-br from-blue-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
                Lost & Found Platform
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Powered by Kathford Students. 
              The most advanced platform for recovering lost assets with military-grade security.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16"
            >
              <Link 
                href="/auth"
                className="group relative bg-linear-to-br from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold px-10 py-5 rounded-xl text-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 flex items-center shadow-lg"
              >
                <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative">Start Free Trial</span>
                <ArrowRight className="ml-3 relative group-hover:translate-x-2 transition-transform" size={20} />
              </Link>
              {/* <Link 
                href="/demo"
                className="group bg-white hover:bg-gray-50 text-gray-900 font-semibold px-10 py-5 rounded-xl text-lg border-2 border-gray-300 transition-all duration-300 hover:shadow-xl flex items-center shadow-md"
              >
                <div className="flex items-center">
                  <div className="flex -space-x-2 mr-3">
                    <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-cyan-500 rounded-full border-2 border-white"></div>
                    <div className="w-8 h-8 bg-linear-to-br from-emerald-500 to-green-500 rounded-full border-2 border-white"></div>
                    <div className="w-8 h-8 bg-linear-to-br from-violet-500 to-purple-500 rounded-full border-2 border-white"></div>
                  </div>
                  <span>Watch Enterprise Demo</span>
                </div>
                <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
              </Link> */}
            </motion.div>

            {/* Live Stats Ticker */}
            {/* <div ref={statsRef} className="mb-20">
              <div className="flex items-center justify-center mb-6">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-3"></div>
                <span className="text-sm font-medium text-gray-700">LIVE SYSTEM STATS</span>
                <button 
                  onClick={() => setIsLiveData(!isLiveData)}
                  className="ml-3 text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  {isLiveData ? 'Pause' : 'Resume'} updates
                </button>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
                <motion.div 
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-center w-14 h-14 bg-linear-to-br from-blue-100 to-blue-200 rounded-xl mb-4 mx-auto shadow-inner">
                    <Search className="text-blue-600" size={28} />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {isInView ? <CountUp end={stats.itemsFound} duration={2.5} separator="," /> : '0'}+
                  </div>
                  <div className="text-gray-600 text-sm">Items Recovered</div>
                  <div className="text-xs text-green-600 font-medium mt-2">
                    +12 this hour
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-center w-14 h-14 bg-linear-to-br from-emerald-100 to-emerald-200 rounded-xl mb-4 mx-auto shadow-inner">
                    <BarChart className="text-emerald-600" size={28} />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {isInView ? <CountUp end={stats.successRate} decimals={1} duration={3} suffix="%" /> : '0%'}
                  </div>
                  <div className="text-gray-600 text-sm">Success Rate</div>
                  <div className="text-xs text-green-600 font-medium mt-2">
                    Industry leader
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-center w-14 h-14 bg-linear-to-br from-violet-100 to-violet-200 rounded-xl mb-4 mx-auto shadow-inner">
                    <UsersIcon className="text-violet-600" size={28} />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {isInView ? <CountUp end={stats.happyUsers} duration={2.5} separator="," /> : '0'}+
                  </div>
                  <div className="text-gray-600 text-sm">Enterprise Users</div>
                  <div className="text-xs text-blue-600 font-medium mt-2">
                    42 countries
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-center w-14 h-14 bg-linear-to-br from-amber-100 to-amber-200 rounded-xl mb-4 mx-auto shadow-inner">
                    <MapPin className="text-amber-600" size={28} />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {isInView ? <CountUp end={stats.cities} duration={2.5} /> : '0'}+
                  </div>
                  <div className="text-gray-600 text-sm">Global Coverage</div>
                  <div className="text-xs text-blue-600 font-medium mt-2">
                    6 continents
                  </div>
                </motion.div>
              </div>
            </div> */}
          </div>
        </div>
      </section>

      {/* Partner Network */}
      {/* <section className="relative z-10 py-12 bg-linear-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">TRUSTED BY INDUSTRY LEADERS</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {partners.map((partner, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-4 shadow-md border border-gray-200"
                >
                  <div className="text-lg font-semibold text-gray-900">{partner.name}</div>
                  <div className="text-sm text-blue-600 font-medium">{partner.count}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section> */}

      {/* Process Flow */}
      <section className="relative z-10 py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Enterprise Recovery Workflow
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              From discovery to delivery - our certified process ensures maximum recovery rates
            </p>
          </div>
          
          <div className="relative">
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-linear-to-br from-blue-200 via-emerald-200 to-violet-200 transform -translate-y-1/2"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {processSteps.map((step, index) => (
                <motion.div 
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="relative bg-white rounded-2xl p-8 shadow-xl border border-gray-100 h-full hover:shadow-2xl transition-all duration-300 group">
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-linear-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                      {step.icon}
                    </div>
                    
                    <div className="pt-8">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                        <div className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                          Step {step.step}
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-6">{step.description}</p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock size={14} className="mr-2" />
                          {step.time}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Target size={14} className="mr-2" />
                          {step.accuracy}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="relative z-10 py-20 bg-linear-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Feature List */}
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Advanced Recovery Technology
              </h2>
              
              <div className="space-y-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`
                      relative bg-white rounded-xl p-6 border-l-4 transition-all duration-300
                      ${activeFeature === index 
                        ? 'border-blue-500 shadow-xl transform -translate-y-1' 
                        : 'border-gray-200 hover:shadow-lg'
                      }
                    `}
                    onMouseEnter={() => setActiveFeature(index)}
                  >
                    <div className="flex items-start">
                      <div className={`${feature.bgColor} w-12 h-12 rounded-lg flex items-center justify-center mr-4`}>
                        {feature.icon}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-gray-900">{feature.title}</h3>
                          {activeFeature === index && (
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                              <span className="text-xs font-semibold text-green-600">ACTIVE</span>
                            </div>
                          )}
                        </div>
                        
                        <p className="text-gray-600 mb-3">{feature.description}</p>
                        
                        <ul className="space-y-2">
                          {feature.details.map((detail, i) => (
                            <li key={i} className="flex items-center text-sm text-gray-500">
                              <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                              {detail}
                            </li>
                          ))}
                        </ul>
                        
                        <div className="mt-4 text-sm font-medium text-gray-700">
                          {feature.stats}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Feature Visualization */}
            <motion.div
              key={activeFeature}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-3xl p-10 shadow-2xl">
                <div className="text-white mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <div className={`${features[activeFeature].bgColor} w-12 h-12 rounded-lg flex items-center justify-center mr-4`}>
                        {features[activeFeature].icon}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">{features[activeFeature].title}</h3>
                        <div className="text-gray-300 text-sm mt-1">Real-time System Dashboard</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-400">PERFORMANCE</div>
                      <div className="text-xl font-bold text-green-400">94.2%</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-xl p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-gray-300">Active Processes</div>
                      <div className="text-green-400 text-sm font-medium">Optimal</div>
                    </div>
                    <div className="space-y-3">
                      {[75, 82, 68, 91].map((width, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">Process {i + 1}</span>
                            <span className="text-gray-300">{width}%</span>
                          </div>
                          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-linear-to-br from-blue-500 to-cyan-500"
                              initial={{ width: 0 }}
                              animate={{ width: `${width}%` }}
                              transition={{ duration: 1, delay: 0.2 }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-800/50 rounded-xl p-4">
                      <div className="text-gray-400 text-sm">Matches/Hour</div>
                      <div className="text-2xl font-bold text-white">512</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-xl p-4">
                      <div className="text-gray-400 text-sm">Avg. Response</div>
                      <div className="text-2xl font-bold text-white">12m</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-xl p-4">
                      <div className="text-gray-400 text-sm">Accuracy</div>
                      <div className="text-2xl font-bold text-green-400">94%</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-xl p-4">
                      <div className="text-gray-400 text-sm">Uptime</div>
                      <div className="text-2xl font-bold text-green-400">99.9%</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-linear-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enterprise Testimonials */}
      <section className="relative z-10 py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-linear-to-br from-blue-50 to-cyan-50 text-blue-700 px-4 py-2 rounded-full mb-4">
              <Award size={16} />
              <span className="font-semibold">Enterprise Case Studies</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Industry Leaders
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              See how major organizations leverage our platform for asset recovery
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-linear-to-br from-white to-gray-50 rounded-2xl p-8 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300"
              >
                <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4">
                  <div className="bg-linear-to-br from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-xl shadow-lg">
                    <div className="text-sm font-semibold">Case Study</div>
                  </div>
                </div>
                
                <div className="flex items-center mb-6">
                  <div className={`${testimonial.avatarColor} w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-xl mr-4 shadow-md`}>
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-blue-600 font-medium">{testimonial.role}</p>
                    <div className="text-sm text-gray-500">{testimonial.company}</div>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.content}"</p>
                
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} size={18} fill="currentColor" />
                      ))}
                    </div>
                    <div className="text-sm font-medium text-blue-600">{testimonial.item}</div>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock size={14} className="mr-2" />
                    {testimonial.time}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Compliance */}
      {/* <section className="relative z-10 py-20 bg-linear-to-br from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-full mb-6">
                <Lock size={18} className="mr-2" />
                <span className="font-semibold text-sm">ENTERPRISE SECURITY</span>
              </div>

              <h2 className="text-4xl font-bold text-white mb-6">
                Military-Grade Security Infrastructure
              </h2>

              <p className="text-gray-300 text-lg mb-10 leading-relaxed">
                Built with zero-trust architecture and end-to-end encryption. 
                SOC 2 Type II compliant with regular third-party security audits.
              </p>

              <div className="grid grid-cols-2 gap-6 mb-10">
                <div className="bg-gray-800/50 rounded-xl p-6">
                  <ShieldCheck className="mb-4 text-green-400" size={32} />
                  <h3 className="font-semibold text-white text-xl mb-2">GDPR & CCPA Compliant</h3>
                  <p className="text-gray-400 text-sm">Global data protection compliance</p>
                </div>

                <div className="bg-gray-800/50 rounded-xl p-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-lg mb-4">
                    <CheckCircle className="text-blue-400" size={24} />
                  </div>
                  <h3 className="font-semibold text-white text-xl mb-2">SOC 2 Type II</h3>
                  <p className="text-gray-400 text-sm">Enterprise security certification</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center text-gray-300">
                  <CheckCircle className="text-green-500 mr-3" size={20} />
                  <span>End-to-end AES-256 encryption</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <CheckCircle className="text-green-500 mr-3" size={20} />
                  <span>Zero-knowledge proof verification</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <CheckCircle className="text-green-500 mr-3" size={20} />
                  <span>Regular third-party security audits</span>
                </div>
              </div>
            </div>

            <div className="bg-linear-to-br from-blue-900/30 to-cyan-900/30 rounded-3xl p-10 border border-gray-700">
              <div className="text-center text-white">
                <div className="inline-flex items-center bg-linear-to-br from-blue-500/20 to-cyan-500/20 px-6 py-3 rounded-full mb-8">
                  <Globe className="mr-3" size={24} />
                  <span className="font-semibold">Global Compliance</span>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-10">
                  <div className="bg-gray-800/30 rounded-xl p-6">
                    <div className="text-3xl font-bold text-white mb-2">256-bit</div>
                    <div className="text-gray-300 text-sm">Encryption</div>
                  </div>
                  <div className="bg-gray-800/30 rounded-xl p-6">
                    <div className="text-3xl font-bold text-white mb-2">99.9%</div>
                    <div className="text-gray-300 text-sm">Uptime SLA</div>
                  </div>
                  <div className="bg-gray-800/30 rounded-xl p-6">
                    <div className="text-3xl font-bold text-white mb-2">24/7</div>
                    <div className="text-gray-300 text-sm">Security Monitoring</div>
                  </div>
                  <div className="bg-gray-800/30 rounded-xl p-6">
                    <div className="text-3xl font-bold text-green-400 mb-2">Zero</div>
                    <div className="text-gray-300 text-sm">Security Incidents</div>
                  </div>
                </div>

                <div className="bg-gray-900/50 rounded-xl p-6">
                  <h3 className="font-semibold text-xl mb-4">Certifications</h3>
                  <div className="flex flex-wrap justify-center gap-4">
                    <div className="bg-gray-800 px-4 py-2 rounded-lg text-sm">ISO 27001</div>
                    <div className="bg-gray-800 px-4 py-2 rounded-lg text-sm">SOC 2</div>
                    <div className="bg-gray-800 px-4 py-2 rounded-lg text-sm">GDPR</div>
                    <div className="bg-gray-800 px-4 py-2 rounded-lg text-sm">CCPA</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Final CTA */}
      {/* <section className="relative z-10 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-linear-to-br from-white to-gray-50 rounded-3xl p-12 shadow-2xl border border-gray-200 overflow-hidden"
          >
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-linear-to-br from-blue-500/10 to-cyan-500/10 rounded-full"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-linear-to-br from-emerald-500/10 to-green-500/10 rounded-full"></div>
            
            <div className="relative text-center">
              <div className="inline-flex items-center bg-linear-to-br from-blue-50 to-cyan-50 text-blue-700 px-6 py-3 rounded-full mb-8 shadow-sm">
                <Sparkles size={18} className="mr-3" />
                <span className="font-semibold">READY TO TRANSFORM YOUR RECOVERY PROCESS?</span>
              </div>
              
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Start Your 30-Day Enterprise Trial
              </h2>
              
              <p className="text-gray-600 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
                Experience the platform trusted by Fortune 500 companies. 
                Full features, dedicated support, and no credit card required.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
                <Link 
                  href="/enterprise-trial"
                  className="group relative bg-linear-to-br from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold px-10 py-5 rounded-xl text-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 flex items-center shadow-lg"
                >
                  <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="relative">Start Enterprise Trial</span>
                  <ArrowRight className="ml-3 relative group-hover:translate-x-2 transition-transform" size={20} />
                </Link>
                
                <Link 
                  href="/demo-request"
                  className="group bg-white hover:bg-gray-50 text-gray-900 font-semibold px-10 py-5 rounded-xl text-lg border-2 border-gray-300 transition-all duration-300 hover:shadow-xl flex items-center shadow-md"
                >
                  <Download className="mr-3" size={20} />
                  Download Whitepaper
                </Link>
              </div>
              
              <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500">
                <div className="flex items-center">
                  <CheckCircle className="text-green-500 mr-2" size={16} />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="text-green-500 mr-2" size={16} />
                  <span>Dedicated onboarding specialist</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="text-green-500 mr-2" size={16} />
                  <span>Priority support included</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="relative z-10 pt-16 pb-10 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-linear-to-br from-blue-600 to-cyan-600 p-2 rounded-xl">
                  <Search className="text-white" size={28} />
                </div>
                <div>
                  <span className="text-2xl font-bold">FynDR Enterprise</span>
                  <div className="text-gray-400 text-sm">Global Asset Recovery Platform</div>
                </div>
              </div>
              <p className="text-gray-400 max-w-md">
                The world's most advanced lost & found platform, 
                trusted by enterprises and organizations worldwide.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-6">Platform</h4>
              <ul className="space-y-3">
                <li><Link href="/features" className="text-gray-400 hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/security" className="text-gray-400 hover:text-white transition-colors">Security</Link></li>
                {/* <li><Link href="/api" className="text-gray-400 hover:text-white transition-colors">API Documentation</Link></li> */}
                <li><Link href="/status" className="text-gray-400 hover:text-white transition-colors">System Status</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-6">Solutions</h4>
              <ul className="space-y-3">
                <li><Link href="/airports" className="text-gray-400 hover:text-white transition-colors">Airports</Link></li>
                <li><Link href="/hotels" className="text-gray-400 hover:text-white transition-colors">Hotels</Link></li>
                <li><Link href="/universities" className="text-gray-400 hover:text-white transition-colors">Universities</Link></li>
                <li><Link href="/transportation" className="text-gray-400 hover:text-white transition-colors">Transportation</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-6">Company</h4>
              <ul className="space-y-3">
                <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About</Link></li>
                <li><Link href="/careers" className="text-gray-400 hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Sales</Link></li>
                <li><Link href="/press" className="text-gray-400 hover:text-white transition-colors">Press</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} FynDR Technologies Inc. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-6">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">
                Cookie Policy
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-400">All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}