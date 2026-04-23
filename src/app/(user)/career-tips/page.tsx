"use client";

import React from 'react';
import { 
  Lightbulb, 
  Search, 
  FileText, 
  MessageSquare, 
  TrendingUp, 
  Award,
  ArrowRight,
  Clock,
  User,
  Star,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, Badge, Button } from '@/components/ui';

const articles = [
  {
    title: "How to Build a High-Performance Resume in 2026",
    category: "Resume Building",
    description: "Learn how to optimize your resume for AI-driven applicant tracking systems (ATS) while still wowing human recruiters.",
    image: "/tips-1.jpg",
    readTime: "8 min read",
    author: "Elena Rodriguez",
  },
  {
    title: "Mastering the Art of Remote Technical Interviews",
    category: "Interviewing",
    description: "From setting up your background to handling complex coding challenges in real-time, we cover it all.",
    image: "/tips-2.jpg",
    readTime: "12 min read",
    author: "Marcus Chen",
  },
  {
    title: "Networking Without the Cringe: A Guide for Introverts",
    category: "Networking",
    description: "Discover how to build meaningful professional connections through platform engagement and subtle outreach.",
    image: "/tips-3.jpg",
    readTime: "6 min read",
    author: "Sarah Jenkins",
  },
  {
    title: "Negotiating Your Salary: 5 Phrases to Use (And 3 to Avoid)",
    category: "Career Growth",
    description: "Confidently ask for what you're worth with these proven negotiation strategies and response templates.",
    image: "/tips-4.jpg",
    readTime: "10 min read",
    author: "David Thorne",
  }
];

const quickTips = [
  { icon: Clock, text: "The average recruiter spends only 7 seconds looking at a resume." },
  { icon: Star, text: "Active LinkedIn profiles get 14x more profile views by recruiters." },
  { icon: TrendingUp, text: "Referrals are 4x more likely to be hired than regular applicants." }
];

export default function CareerTipsPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Header Section */}
      <section className="bg-gray-900 py-32 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white text-[10px] font-black uppercase tracking-widest border border-white/10 mb-8">
              <Lightbulb className="w-3 h-3 text-primary fill-primary" /> Career Hub
            </div>
            <h1 className="text-6xl md:text-[90px] font-black tracking-tighter leading-none mb-10">
               Master your <span className="text-primary italic">career</span> path.
            </h1>
            <p className="text-gray-400 text-xl font-medium leading-relaxed max-w-2xl">
              Expert advice, tactical strategies, and industry insights to help you land your dream role and grow as a professional.
            </p>
          </motion.div>
        </div>
        {/* Background glow */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      </section>

      {/* Quick Stats Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 z-20 relative">
        <Card className="bg-white border-0 shadow-2xl shadow-gray-200 p-8 rounded-[32px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {quickTips.map((tip, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary shrink-0">
                  <tip.icon className="w-5 h-5" />
                </div>
                <p className="text-sm font-bold text-gray-600 leading-snug">{tip.text}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Featured Tips Grid */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-16">
          <h2 className="text-4xl font-black text-gray-900 tracking-tighter">Essential Reading</h2>
          <Button variant="ghost" className="font-bold text-primary hover:bg-primary/5 rounded-xl">View All Articles</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {articles.map((article, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -8 }}
              className="group cursor-pointer"
            >
              <Card className="flex flex-col md:flex-row h-full rounded-[32px] overflow-hidden border-gray-100 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 overflow-hidden">
                <div className="w-full md:w-2/5 relative h-48 md:h-auto overflow-hidden">
                  <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-400">
                    <FileText className="w-10 h-10 opacity-20" />
                  </div>
                  <Badge className="absolute top-4 left-4 bg-white/90 backdrop-blur shadow-sm border-0 text-primary uppercase text-[8px] font-black tracking-widest">{article.category}</Badge>
                </div>
                <div className="p-8 w-full md:w-3/5 space-y-4">
                   <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                     <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {article.readTime}</span>
                     <span>•</span>
                     <span className="flex items-center gap-1.5"><User className="w-3 h-3" /> {article.author}</span>
                   </div>
                   <h3 className="text-2xl font-black text-gray-900 leading-tight group-hover:text-primary transition-colors">
                     {article.title}
                   </h3>
                   <p className="text-gray-500 text-sm font-medium leading-relaxed line-clamp-3">
                     {article.description}
                   </p>
                   <div className="pt-4">
                     <div className="inline-flex items-center gap-2 text-sm font-black text-primary group-hover:gap-3 transition-all">
                       Read Article <ArrowRight className="w-4 h-4" />
                     </div>
                   </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Newsletter / Guide Download CTA */}
      <section className="pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-900 rounded-[50px] p-12 md:p-20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12 shadow-2xl">
          <div className="relative z-10 text-center md:text-left max-w-xl space-y-6">
             <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">
               Get our <span className="text-primary underline decoration-primary/30 underline-offset-8">2026 Salary Guide</span> free.
             </h2>
             <p className="text-gray-400 text-lg font-medium">
               Join 50,000+ professionals getting weekly career insights and salary benchmarks delivered straight to their inbox.
             </p>
             <div className="pt-4 flex flex-col sm:flex-row gap-4">
               <input 
                 type="email" 
                 placeholder="your@email.com" 
                 className="bg-white/10 border-0 h-14 rounded-2xl px-6 text-white font-bold placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary w-full md:w-64"
               />
               <Button size="lg" className="h-14 px-8 rounded-2xl font-black shadow-lg shadow-primary/20">Send me the guide</Button>
             </div>
          </div>
          <div className="relative z-10 hidden lg:block">
            <div className="w-64 h-80 bg-white/5 border border-white/10 rounded-3xl p-6 rotate-12 flex flex-col items-center justify-center text-center shadow-2xl">
                <FileText className="w-20 h-20 text-primary mb-6" />
                <h4 className="text-white font-black text-xl mb-2 italic">Salary Insight Report v2.0</h4>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Available Exclusively for Members</p>
            </div>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
        </div>
      </section>
    </div>
  );
}
