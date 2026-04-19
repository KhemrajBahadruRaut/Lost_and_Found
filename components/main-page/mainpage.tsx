"use client";

import Link from "next/link";
import {
  Search,
  Database,
  ArrowRight,
  Menu,
  X,
  Terminal,
  Activity,
  FileText,
  Workflow,
  ChevronRight,
  UserCheck,
  Cpu,
  Zap,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function MainPage() {
  const [activeModule, setActiveModule] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll for navbar styling
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const modules = [
    {
      id: "input",
      icon: <FileText size={20} />,
      title: "Data Entry Module",
      description: "Structured forms for logging lost or found item metadata.",
      color: "blue",
      specs: ["Image Upload", "Categorization", "Timestamping"],
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: "logic",
      icon: <Activity size={20} />,
      title: "Comparison Logic",
      description:
        "The backend algorithm compares new entries against existing records.",
      color: "indigo",
      specs: ["String Matching", "Date Filtering", "Location Radius"],
      gradient: "from-indigo-500 to-purple-500",
    },
  ];

  const workflowSteps = [
    {
      step: "01",
      title: "Data Ingestion",
      desc: "User submits a structured report (Lost or Found) into form of the website.",
      icon: <Database size={20} />,
    },
    {
      step: "02",
      title: "Algorithmic Processing",
      desc: "System runs a query to identify overlapping parameters (Title, Description, Category, Loc).",
      icon: <Activity size={20} />,
    },
    {
      step: "03",
      title: "Notification Trigger",
      desc: "If Similarity Index > 30%, both parties receive a potential match alert.",
      icon: <Workflow size={20} />,
    },
    {
      step: "04",
      title: "Physical Handover",
      desc: "Identity is verified at the admin desk and item status is updated to 'Resolved'.",
      icon: <UserCheck size={20} />,
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 font-sans text-slate-900 overflow-x-hidden scroll-smooth">
      {/* --- Animated Gradient Orbs --- */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-0 -right-40 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-40 left-20 w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* --- Grid Pattern Overlay --- */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "30px 30px",
        }}
      />

      {/* --- Navbar --- */}
      <nav
        className={`fixed w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm py-3"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-40 h-8 flex items-center justify-center">
              <img src="/logo.png" alt="Logo" className="h-8 object-contain" />
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
            <a href="#workflow" className="hover:text-slate-900 transition-colors relative group">
              /Workflow
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-blue-500 to-indigo-500 group-hover:w-full transition-all duration-300" />
            </a>
            <a href="#modules" className="hover:text-slate-900 transition-colors relative group">
              /Architecture
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-blue-500 to-indigo-500 group-hover:w-full transition-all duration-300" />
            </a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/auth"
              className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/auth"
              className="px-6 py-2.5 bg-linear-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white text-sm font-semibold rounded-full shadow-lg shadow-slate-900/20 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              Get Started <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <button
            className="md:hidden text-slate-900 p-2 rounded-lg bg-white/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-white/95 backdrop-blur-xl border-b border-slate-200 overflow-hidden"
            >
              <div className="p-6 space-y-4 font-medium">
                <a
                  href="#workflow"
                  className="block text-slate-600 hover:text-slate-900 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  /Workflow
                </a>
                <a
                  href="#modules"
                  className="block text-slate-600 hover:text-slate-900 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  /Architecture
                </a>
                <Link href="/auth" className="block text-blue-600 font-bold">
                  Get Started
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* --- Hero Section --- */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 z-10">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-6 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
              </span>
              System Online
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
              Algorithm Based <br />
              <span className="bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Lost & Found
              </span>{" "}
              Platform.
            </h1>

            <p className="text-lg text-slate-500 mb-10 max-w-xl leading-relaxed">
              An algorithm-driven platform for reporting and retrieving lost
              items. We utilize data matching to connect lost assets with their
              owners efficiently.
            </p>

            <div className="flex flex-col sm:flex-row gap-5">
              <Link
                href="/auth"
                className="group px-8 py-3 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-base font-semibold rounded-full flex justify-center items-center gap-2 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transform hover:scale-105 active:scale-95"
              >
                <FileText size={18} /> Submit Found
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/auth"
                className="px-8 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300 text-base font-semibold rounded-full flex justify-center items-center gap-2 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <Search size={18} /> Search Lost
              </Link>
            </div>
          </motion.div>

          {/* System Console Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, rotateY: -10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="relative perspective-1000"
          >
            <div className="bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-700/50 font-mono text-sm transform transition-all duration-500 hover:shadow-blue-500/10 hover:border-slate-600">
              <div className="bg-linear-to-r from-slate-800 to-slate-900 px-5 py-3.5 border-b border-slate-700 flex items-center justify-between">
                <div className="flex gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm" />
                  <div className="w-3 h-3 rounded-full bg-amber-500 shadow-sm" />
                  <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm" />
                </div>
                <div className="text-slate-400 text-xs tracking-wider">fyndr_core.exe</div>
                <div className="w-16" />
              </div>

              <div className="p-6 text-slate-300 space-y-3 h-80 overflow-hidden relative bg-linear-to-b from-slate-900 to-slate-950">
                <div className="opacity-60 text-xs border-b border-slate-800 pb-2 mb-4 font-mono">
                  <span className="text-green-400">$</span> INITIALIZING DATABASE CONNECTION...{" "}
                  <span className="text-green-400 font-bold">[ OK ]</span>
                  <br />
                  <span className="text-green-400">$</span> LOADING MATCHING ALGORITHM...{" "}
                  <span className="text-green-400 font-bold">[ OK ]</span>
                </div>
                <div className="flex gap-3 items-start animate-pulse">
                  <span className="text-blue-400 shrink-0 font-bold">[INPUT]</span>
                  <span>New Report: "Blue Wallet" at Library (ID: #4092)</span>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="text-purple-400 shrink-0 font-bold">[QUERY]</span>
                  <span>Scanning found_items table for matches...</span>
                </div>
                <div className="flex gap-3 items-start bg-linear-to-r from-green-900/30 to-emerald-900/20 p-3 rounded-xl border border-green-500/20 backdrop-blur-sm">
                  <span className="text-green-400 shrink-0 font-bold animate-pulse">[MATCH]</span>
                  <span>
                    Potential Match Found <span className="text-green-400 font-bold">(Score: 92%)</span>
                    <br />
                    <span className="text-slate-500 text-xs mt-1 block font-mono">
                      Ref: Leather Wallet found in Block A
                    </span>
                  </span>
                </div>
                <div className="flex gap-3 items-start opacity-70">
                  <span className="text-slate-500 shrink-0 font-bold">[WAIT]</span>
                  <span>Awaiting User Verification...</span>
                </div>
                <div className="absolute bottom-5 left-6 flex items-center gap-2">
                  <span className="text-green-500 font-bold">➜</span>
                  <span className="w-2 h-4 bg-green-500 animate-pulse rounded-sm" />
                </div>
                {/* Terminal scan line effect */}
                <div className="absolute inset-0 pointer-events-none bg-linear-to-b from-transparent via-blue-500/5 to-transparent animate-scan" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- Operational Workflow --- */}
      <section
        id="workflow"
        className="py-28 bg-white border-y border-slate-100 relative z-10"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-4">
                <Zap size={12} />
                Process Flow
              </div>
              <h2 className="text-4xl font-bold text-slate-900 mb-3 tracking-tight">
                Operational Workflow
              </h2>
              <p className="text-slate-500 text-lg max-w-lg">
                Standard Operating Procedure (SOP) for asset recovery.
              </p>
            </div>
            <div className="text-right hidden md:block">
              <span className="text-xs font-mono text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                SEQUENCE_V2
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {workflowSteps.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="relative group"
              >
                {/* Connector Line */}
                {i !== workflowSteps.length - 1 && (
                  <div className="hidden md:block absolute top-20 left-1/2 w-full h-0.5 bg-linear-to-r from-slate-200 to-transparent -z-10 group-last:hidden" />
                )}

                <div className="bg-white p-8 rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-xl transition-all duration-500 h-full group-hover:transform group-hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-5xl font-mono font-bold bg-linear-to-br from-slate-300 to-slate-200 bg-clip-text text-transparent group-hover:from-blue-400 group-hover:to-indigo-400 transition-all">
                      {item.step}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-slate-100 to-slate-50 flex items-center justify-center text-slate-600 group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-lg">
                      {item.icon}
                    </div>
                  </div>
                  <h3 className="font-bold text-xl text-slate-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- System Modules (Tabs) --- */}
      <section
        id="modules"
        className="py-28 bg-linear-to-b from-slate-50 to-white relative z-10"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-4">
              <Cpu size={12} />
              Core Components
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              System Architecture
            </h2>
            <p className="text-slate-500 text-lg">
              The platform operates on a three-stage pipeline to ensure data
              accuracy.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-12">
            {/* Tab Navigation */}
            <div className="lg:col-span-4 space-y-3">
              {modules.map((mod, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveModule(idx)}
                  className={`w-full text-left p-5 rounded-xl border transition-all duration-300 group ${
                    activeModule === idx
                      ? `bg-white border-${mod.color}-200 shadow-lg shadow-${mod.color}-100/50`
                      : "bg-transparent border-slate-200 hover:border-slate-300 hover:bg-white/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg bg-linear-to-br ${mod.gradient} flex items-center justify-center text-white`}>
                        {mod.icon}
                      </div>
                      <span
                        className={`font-bold ${activeModule === idx ? "text-slate-900" : "text-slate-600"}`}
                      >
                        {mod.title}
                      </span>
                    </div>
                    {activeModule === idx && (
                      <ChevronRight size={18} className={`text-${mod.color}-500`} />
                    )}
                  </div>
                  <p className="text-sm text-slate-500 line-clamp-2 pl-11">
                    {mod.description}
                  </p>
                </button>
              ))}
            </div>

            {/* Tab Content Display */}
            <div className="lg:col-span-8">
              <div className="h-full bg-linear-to-br from-slate-900 to-slate-950 rounded-2xl border border-slate-800 p-8 md:p-12 relative overflow-hidden flex flex-col justify-center min-h-[450px] shadow-2xl">
                {/* Animated Background Grid */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 2px 2px, #64748b 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                  }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent" />

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeModule}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="relative z-10"
                  >
                    <div
                      className={`w-16 h-16 rounded-2xl bg-linear-to-br ${modules[activeModule].gradient} flex items-center justify-center text-white mb-6 shadow-xl`}
                    >
                      {modules[activeModule].icon}
                    </div>

                    <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">
                      {modules[activeModule].title}
                    </h3>
                    <p className="text-slate-400 text-lg mb-10 max-w-xl leading-relaxed">
                      {modules[activeModule].description}
                    </p>

                    <div className="grid sm:grid-cols-3 gap-4">
                      {modules[activeModule].specs.map((spec, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-4 rounded-xl text-sm text-slate-300 font-mono flex items-center gap-3 group-hover:border-slate-600 transition-colors"
                        >
                          <div
                            className={`w-2 h-2 rounded-full bg-linear-to-r ${modules[activeModule].gradient}`}
                          />
                          {spec}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Decorative corner glow */}
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full filter blur-3xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-white pt-20 pb-10 border-t border-slate-100 text-slate-600 text-sm relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-5 text-slate-900 font-bold text-xl">
                <Terminal size={22} className="text-indigo-500" /> FynDR
              </div>
              <p className="max-w-xs text-slate-500 leading-relaxed">
                Algorithm-based platform for efficient asset recovery and
                database management.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-5 text-sm uppercase tracking-wider">Database</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="/auth"
                    className="text-slate-500 hover:text-blue-600 transition-colors"
                  >
                    Lost Items
                  </a>
                </li>
                <li>
                  <a
                    href="/auth"
                    className="text-slate-500 hover:text-blue-600 transition-colors"
                  >
                    Found Items
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-5 text-sm uppercase tracking-wider">Admin</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="/auth"
                    className="text-slate-500 hover:text-blue-600 transition-colors"
                  >
                    Dashboard Login
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-500 hover:text-blue-600 transition-colors">
                    System Status
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="font-mono text-xs text-slate-400">
              © {new Date().getFullYear()} FynDR System. All rights reserved.
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-slate-400">STATUS:</span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-green-600 font-semibold">OPERATIONAL</span>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-scan {
          animation: scan 4s linear infinite;
        }
      `}</style>
    </div>
  );
}