"use client";

import Link from "next/link";
import {
  Search,
  Shield,
  CheckCircle,
  Database,
  ArrowRight,
  Menu,
  X,
  Terminal,
  Activity,
  FileText,
  Lock,
  EyeOff,
  FileKey,
  Server,
  Workflow,
  ChevronRight,
  UserCheck,
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
    },
    {
      id: "logic",
      icon: <Activity size={20} />,
      title: "Comparison Logic",
      description:
        "The backend algorithm compares new entries against existing records.",
      color: "indigo",
      specs: ["String Matching", "Date Filtering", "Location Radius"],
    },
  ];

  const workflowSteps = [
    {
      step: "01",
      title: "Data Ingestion",
      desc: "User submits a structured report (Lost or Found) into the SQL database.",
      icon: <Database size={20} />,
    },
    {
      step: "02",
      title: "Algorithmic Processing",
      desc: "System runs a query to identify overlapping parameters (Title, Category, Loc).",
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
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden scroll-smooth">
      {/* --- Technical Grid Background --- */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.4]"
        style={{
          backgroundImage:
            "linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* --- Navbar --- */}
      <nav
        className={`fixed w-full z-50 transition-all duration-200 ${
          scrolled
            ? "bg-white/90 backdrop-blur-sm border-b border-slate-200 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-900 rounded flex items-center justify-center text-white">
              <Terminal size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 leading-none">
                FynDR
              </span>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                System V1.0
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-8 text-sm font-medium font-mono text-slate-600">
            <a href="#workflow" className="hover:text-slate-900">
              /Workflow
            </a>
            <a href="#modules" className="hover:text-slate-900">
              /Architecture
            </a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/auth"
              className="text-sm font-semibold text-slate-600 hover:text-slate-900"
            >
              Login
            </Link>
            <Link
              href="/auth"
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded shadow-lg shadow-slate-900/20 transition-transform active:scale-95 flex items-center gap-2"
            >
              Get Started <ArrowRight size={14} />
            </Link>
          </div>

          <button
            className="md:hidden text-slate-900"
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
              className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
            >
              <div className="p-6 space-y-4 font-mono">
                <a
                  href="#workflow"
                  className="block text-slate-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  /Workflow
                </a>
                <a
                  href="#modules"
                  className="block text-slate-600"
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
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-bold uppercase tracking-wider mb-6">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              System Online
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
              Algorithm Based <br />
              <span className="text-blue-600">Lost & Found</span> Platform.
            </h1>

            <p className="text-lg text-slate-500 mb-8 max-w-xl leading-relaxed">
              An algorithm-driven platform for reporting and retrieving lost
              items. We utilize data matching to connect lost assets with their
              owners efficiently.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/auth"
                className="px-8 py-2 bg-blue-600 hover:bg-blue-500 text-white text-base font-bold rounded flex justify-center items-center gap-2 transition-all shadow-xl shadow-blue-500/20"
              >
                <FileText size={18} /> Submit Found
              </Link>
              <Link
                href="/auth"
                className="px-8 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-base font-bold rounded flex justify-center items-center gap-2 transition-all"
              >
                <Search size={18} /> Search Lost
              </Link>
            </div>
            {/* 
            <div className="mt-10 flex items-center gap-8 text-xs font-mono text-slate-500">
               <div>
                 <span className="block text-2xl font-bold text-slate-900">1.2k+</span>
                 RECORDS_LOGGED
               </div>
               <div className="h-8 w-px bg-slate-300" />
               <div>
                 <span className="block text-2xl font-bold text-slate-900">89%</span>
                 MATCH_RATE
               </div>
            </div> */}
          </motion.div>

          {/* System Console Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-slate-900 rounded-lg shadow-2xl overflow-hidden border border-slate-700 font-mono text-sm">
              <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex items-center justify-between">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500" />
                </div>
                <div className="text-slate-400 text-xs">fyndr_core.exe</div>
              </div>

              <div className="p-6 text-slate-300 space-y-3 h-80 overflow-hidden relative">
                <div className="opacity-50 text-xs border-b border-slate-700 pb-2 mb-4">
                  // INITIALIZING DATABASE CONNECTION...{" "}
                  <span className="text-green-400">OK</span>
                  <br />
                  // LOADING MATCHING ALGORITHM...{" "}
                  <span className="text-green-400">OK</span>
                </div>
                <div className="flex gap-3 items-start animate-pulse">
                  <span className="text-blue-400 shrink-0">[INPUT]</span>
                  <span>New Report: "Blue Wallet" at Library (ID: #4092)</span>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="text-purple-400 shrink-0">[QUERY]</span>
                  <span>Scanning found_items table for matches...</span>
                </div>
                <div className="flex gap-3 items-start bg-green-900/20 p-2 rounded border border-green-900/50">
                  <span className="text-green-400 shrink-0">[MATCH]</span>
                  <span>
                    Potential Match Found (Score: 92%)
                    <br />
                    <span className="text-slate-500 text-xs mt-1 block">
                      Ref: Leather Wallet found in Block A
                    </span>
                  </span>
                </div>
                <div className="flex gap-3 items-start opacity-70">
                  <span className="text-slate-500 shrink-0">[WAIT]</span>
                  <span>Awaiting User Verification...</span>
                </div>
                <div className="absolute bottom-4 left-6 flex items-center gap-2">
                  <span className="text-green-500">➜</span>
                  <span className="w-2 h-4 bg-green-500 animate-pulse" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- Operational Workflow --- */}
      <section
        id="workflow"
        className="py-24 bg-white border-t border-slate-200"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                Operational Workflow
              </h2>
              <p className="text-slate-500 max-w-lg">
                Standard Operating Procedure (SOP) for asset recovery.
              </p>
            </div>
            <div className="text-right hidden md:block">
              <span className="text-xs font-mono text-slate-400 border border-slate-200 px-2 py-1 rounded">
                SEQUENCE_V2
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {workflowSteps.map((item, i) => (
              <div key={i} className="relative group">
                {/* Connector Line */}
                {i !== workflowSteps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-px bg-slate-200 -z-10" />
                )}

                <div className="bg-white p-6 rounded border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300 h-full">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl font-mono font-bold text-slate-100 group-hover:text-blue-50 transition-colors">
                      {item.step}
                    </span>
                    <div className="w-10 h-10 rounded bg-slate-50 flex items-center justify-center text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      {item.icon}
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- System Modules (Tabs) --- */}
      <section
        id="modules"
        className="py-24 bg-slate-50 border-y border-slate-200"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              System Architecture
            </h2>
            <p className="text-slate-500">
              The platform operates on a three-stage pipeline to ensure data
              accuracy.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-12">
            {/* Tab Navigation */}
            <div className="lg:col-span-4 space-y-2">
              {modules.map((mod, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveModule(idx)}
                  className={`w-full text-left p-5 rounded border-l-4 transition-all duration-300 group ${
                    activeModule === idx
                      ? `bg-white border-${mod.color}-600 shadow-sm`
                      : "bg-transparent border-transparent hover:bg-white/50 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`font-bold ${activeModule === idx ? "text-slate-900" : "text-slate-600"}`}
                    >
                      {mod.title}
                    </span>
                    {activeModule === idx && (
                      <ArrowRight
                        size={16}
                        className={`text-${mod.color}-600`}
                      />
                    )}
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">
                    {mod.description}
                  </p>
                </button>
              ))}
            </div>

            {/* Tab Content Display */}
            <div className="lg:col-span-8">
              <div className="h-full bg-slate-900 rounded-lg border border-slate-800 p-8 md:p-12 relative overflow-hidden flex flex-col justify-center min-h-[400px]">
                {/* Background Grid inside card */}
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      "radial-gradient(#64748b 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                />

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeModule}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="relative z-10"
                  >
                    <div
                      className={`w-14 h-14 rounded bg-${modules[activeModule].color}-600 flex items-center justify-center text-white mb-6 shadow-lg shadow-${modules[activeModule].color}-900/50`}
                    >
                      {modules[activeModule].icon}
                    </div>

                    <h3 className="text-2xl font-mono font-bold text-white mb-4">
                      {modules[activeModule].title}
                    </h3>
                    <p className="text-slate-400 text-lg mb-8 max-w-xl">
                      {modules[activeModule].description}
                    </p>

                    <div className="grid sm:grid-cols-3 gap-4">
                      {modules[activeModule].specs.map((spec, i) => (
                        <div
                          key={i}
                          className="bg-slate-800/50 border border-slate-700 p-3 rounded text-sm text-slate-300 font-mono flex items-center gap-2"
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full bg-${modules[activeModule].color}-500`}
                          />
                          {spec}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Security Architecture --- */}
      <section
        id="security"
        className="py-24 bg-slate-900 text-white relative overflow-hidden"
      >
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[100px]" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-4">Security Protocols</h2>
            <p className="text-slate-400 max-w-2xl">
              We enforce strict data privacy and identity verification measures.
              Contact details are masked until a preliminary match is confirmed
              by the system.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Security Card 1 */}
            <div className="bg-slate-800/50 border border-slate-700 p-8 rounded hover:bg-slate-800 transition-colors">
              <div className="w-12 h-12 bg-emerald-500/10 rounded flex items-center justify-center text-emerald-500 mb-6 border border-emerald-500/20">
                <Lock size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">RBAC System</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Role-Based Access Control limits sensitive database operations
                to authorized administrators only. Students have read/write
                access only to their own reports.
              </p>
            </div>

            {/* Security Card 2 */}
            <div className="bg-slate-800/50 border border-slate-700 p-8 rounded hover:bg-slate-800 transition-colors">
              <div className="w-12 h-12 bg-blue-500/10 rounded flex items-center justify-center text-blue-500 mb-6 border border-blue-500/20">
                <EyeOff size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Data Masking</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Personally Identifiable Information (PII) such as phone numbers
                and email addresses are hidden from public search results to
                prevent scraping.
              </p>
            </div>

            {/* Security Card 3 */}
            <div className="bg-slate-800/50 border border-slate-700 p-8 rounded hover:bg-slate-800 transition-colors">
              <div className="w-12 h-12 bg-purple-500/10 rounded flex items-center justify-center text-purple-500 mb-6 border border-purple-500/20">
                <FileKey size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Audit Trails</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Every claim and status update creates an immutable log entry.
                This ensures accountability during the physical handover of
                assets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-slate-50 pt-16 pb-8 border-t border-slate-200 text-slate-600 text-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4 text-slate-900 font-bold">
                <Terminal size={20} /> FynDR
              </div>
              <p className="max-w-xs text-slate-500">
                Algorithm-based platform for efficient asset recovery and
                database management.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Database</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/auth"
                    className="hover:text-blue-600 hover:underline"
                  >
                    Lost Items
                  </a>
                </li>
                <li>
                  <a
                    href="/auth"
                    className="hover:text-blue-600 hover:underline"
                  >
                    Found Items
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Admin</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/auth"
                    className="hover:text-blue-600 hover:underline"
                  >
                    Dashboard Login
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 hover:underline">
                    System Status
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="font-mono text-xs text-slate-400">
              © {new Date().getFullYear()} FynDR System. All rights reserved.
            </div>
            <div className="font-mono text-xs text-slate-400">
              STATUS: <span className="text-green-600">OPERATIONAL</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
