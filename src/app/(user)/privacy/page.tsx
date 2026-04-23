"use client";

import React from 'react';
import { 
  Shield, 
  Lock, 
  Eye, 
  FileText, 
  Users, 
  Server,
  Mail,
  ChevronRight,
  Info
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui';

const sections = [
  {
    icon: Eye,
    title: "1. Information We Collect",
    content: "We collect information you provide directly to us, such as when you create an account, post a job, or submit a message through our contact form. This includes your name, email address, company details, and professional information."
  },
  {
    icon: Lock,
    title: "2. How We Use Your Data",
    content: "Your data is used to provide and maintain our services, notify you about changes, and allow you to participate in interactive features. We process your data to match job seekers with relevant opportunities and to detect, prevent, and address technical issues."
  },
  {
    icon: Shield,
    title: "3. Data Security",
    content: "The security of your data is important to us. We use standard administrative, technical, and physical security measures to protect your personal information from unauthorized access, loss, or disclosure."
  },
  {
    icon: Users,
    title: "4. Third-Party Sharing",
    content: "We do not sell your personal data. We may share information with service providers (like Supabase for database hosting) who help us operate our platform, subject to strict confidentiality agreements."
  },
  {
    icon: Server,
    title: "5. Cookies & Tracking",
    content: "We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent."
  }
];

export default function PrivacyPage() {
  const lastUpdated = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="bg-white min-h-screen">
      {/* Header Section */}
      <section className="bg-gray-900 py-24 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 text-white text-[10px] font-black uppercase tracking-widest border border-white/10 mb-8">
              <Shield className="w-3 h-3" /> Security & Trust
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-6">
              Privacy <span className="text-primary italic">matters</span>.
            </h1>
            <p className="text-gray-400 text-xl font-medium leading-relaxed mb-12">
              We believe in being transparent about how we handle your data. This policy explains what happens to your information when you use our platform.
            </p>
            <div className="flex items-center gap-4 text-sm font-bold text-gray-500">
                <span className="flex items-center gap-2">
                    <Info className="w-4 h-4" /> Last Updated: {lastUpdated}
                </span>
            </div>
          </motion.div>
        </div>
        {/* Background glow */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full"></div>
      </section>

      {/* Main Content */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          
          {/* Navigation Sidebar (Desktop) */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-32 h-fit space-y-4">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest pl-4 mb-6">Quick Navigation</h4>
            {sections.map((section, i) => (
              <a 
                key={i} 
                href={`#section-${i}`}
                className="group flex items-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100"
              >
                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-gray-400 group-hover:text-primary transition-colors">
                  <section.icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-black text-gray-600 group-hover:text-gray-900 transition-colors">{section.title.split('. ')[1]}</span>
              </a>
            ))}
          </aside>

          {/* Policy Text */}
          <div className="lg:col-span-9 space-y-24">
            {sections.map((section, i) => (
              <motion.div 
                key={section.title}
                id={`section-${i}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary shadow-lg shadow-primary/20 flex items-center justify-center text-white">
                    <section.icon className="w-6 h-6" />
                  </div>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">{section.title}</h2>
                </div>
                <p className="text-lg text-gray-500 font-medium leading-relaxed pl-16">
                  {section.content}
                </p>
                <div className="pl-16 pt-4">
                    <div className="h-0.5 w-12 bg-gray-100" />
                </div>
              </motion.div>
            ))}

            {/* Bottom Contact CTA */}
            <Card className="p-10 border-0 shadow-2xl shadow-gray-200 bg-gray-900 rounded-[40px] text-center space-y-8 relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="text-2xl font-black text-white tracking-tight">Still have questions?</h3>
                    <p className="text-gray-400 font-medium max-w-lg mx-auto">
                        If you need more information about our privacy practices, please don't hesitate to reach out to our legal team.
                    </p>
                    <div className="pt-6">
                        <motion.a 
                            href="/contact"
                            whileHover={{ scale: 1.05 }}
                            className="inline-flex items-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-white/5"
                        >
                            <Mail className="w-4 h-4" /> Contact Support <ChevronRight className="w-4 h-4" />
                        </motion.a>
                    </div>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
