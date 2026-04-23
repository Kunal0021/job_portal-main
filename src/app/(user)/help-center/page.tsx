"use client";

import React from 'react';
import { 
  Search, 
  HelpCircle, 
  MessageCircle, 
  Mail, 
  User, 
  Briefcase, 
  ShieldCheck, 
  Zap,
  ArrowRight,
  LifeBuoy,
  FileText,
  Settings,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, Button, Input } from '@/components/ui';

const categories = [
  {
    icon: User,
    title: "Account & Profile",
    description: "Manage your personal information, login credentials, and account settings."
  },
  {
    icon: Briefcase,
    title: "Job Applications",
    description: "Tracking your applications, understanding job statuses, and interviews."
  },
  {
    icon: ShieldCheck,
    title: "Safety & Privacy",
    description: "Reporting suspicious postings, managing data privacy, and trust."
  },
  {
    icon: Settings,
    title: "Employer Tools",
    description: "Posting jobs, managing candidates, and company profile verification."
  }
];

const faqs = [
  "How do I reset my password if I forget it?",
  "What should I do if a company doesn't respond to my application?",
  "How can I report a fraudulent job listing?",
  "Can I delete my profile permanently?",
  "Does JobPortal check every company before they post?"
];

export default function HelpCenterPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Search Header Section */}
      <section className="bg-gray-900 py-32 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white text-[10px] font-black uppercase tracking-widest border border-white/10">
              <LifeBuoy className="w-3 h-3 text-primary animate-pulse" /> Support Portal
            </div>
            <h1 className="text-6xl md:text-[90px] font-black tracking-tighter leading-none">
              How can we <span className="text-primary italic">help</span> you?
            </h1>
            
            {/* Search Input */}
            <div className="relative max-w-2xl mx-auto group">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500 group-focus-within:text-primary transition-colors" />
               <input 
                 type="text" 
                 placeholder="Search for articles, guides, or troubleshooting..." 
                 className="w-full h-20 bg-white/5 border-white/10 border-2 rounded-3xl pl-16 pr-8 text-white font-black text-lg focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all placeholder:text-gray-500"
               />
            </div>

            <div className="flex justify-center flex-wrap gap-4 pt-4">
               {['Reset Password', 'Scam Alerts', 'Post a Job', 'ATS Score'].map(tag => (
                 <button key={tag} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-gray-400 hover:text-white hover:bg-white/10 transition-all">{tag}</button>
               ))}
            </div>
          </motion.div>
        </div>
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />
      </section>

      {/* Categories Grid */}
      <section className="py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -8 }}
            >
              <Card className="p-8 rounded-[32px] border-gray-100 hover:shadow-2xl hover:shadow-primary/10 transition-all h-full flex flex-col group">
                <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 mb-6">
                  <cat.icon className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-black text-gray-900 mb-2 tracking-tight">{cat.title}</h4>
                <p className="text-gray-500 font-medium text-xs leading-relaxed mb-8 flex-grow">{cat.description}</p>
                <div className="flex items-center gap-2 text-primary font-black text-xs group-hover:gap-3 transition-all cursor-pointer">
                  Browse Docs <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ & Contact Section */}
      <section className="bg-gray-50 py-32 rounded-[60px] mx-4 lg:mx-8 mb-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
             
             {/* FAQs */}
             <div className="space-y-10">
                <h2 className="text-4xl font-black text-gray-900 tracking-tighter">Popular Questions</h2>
                <div className="space-y-4">
                   {faqs.map((faq, i) => (
                     <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center justify-between group hover:border-primary/20 transition-all cursor-pointer">
                        <span className="font-bold text-gray-700 group-hover:text-gray-900 transition-colors">{faq}</span>
                        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
                     </div>
                   ))}
                </div>
             </div>

             {/* Contact Options */}
             <div className="space-y-10">
                <h2 className="text-4xl font-black text-gray-900 tracking-tighter">Still Stuck?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <Card className="p-8 rounded-[32px] border-0 shadow-lg text-center space-y-6 flex flex-col items-center">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                         <Mail className="w-6 h-6" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-black text-gray-900">Email Support</h4>
                        <p className="text-xs text-gray-500 font-medium leading-relaxed">Response within 24 hours</p>
                      </div>
                      <Button className="w-full rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700">Contact via Email</Button>
                   </Card>
                   <Card className="p-8 rounded-[32px] border-0 shadow-lg text-center space-y-6 flex flex-col items-center">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                         <MessageCircle className="w-6 h-6" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-black text-gray-900">Live Chat</h4>
                        <p className="text-xs text-gray-500 font-medium leading-relaxed">Average wait: 2 mins</p>
                      </div>
                      <Button className="w-full rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700">Start Live Chat</Button>
                   </Card>
                </div>
                
                <div className="p-8 bg-amber-50 border border-amber-100 rounded-[32px] flex items-start gap-4">
                   <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
                   <p className="text-sm font-bold text-amber-800 leading-relaxed">
                     Are you looking for the Status Page? Check our <a href="#" className="underline decoration-2 underline-offset-2">Service Health</a> for real-time system updates.
                   </p>
                </div>
             </div>

          </div>
        </div>
      </section>
    </div>
  );
}
