"use client";

import React from 'react';
import { 
  FileText, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Layout, 
  ArrowRight,
  Download,
  Wand2,
  RefreshCcw,
  CheckCircle2,
  Rocket
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, Button, Badge } from '@/components/ui';

const features = [
  {
    icon: Wand2,
    title: "AI Resume Enhancement",
    description: "Our AI analyzes your experience and suggests high-impact keywords to beat the ATS filters."
  },
  {
    icon: Layout,
    title: "Premium Templates",
    description: "Choose from dozens of recruiter-approved templates designed for modern tech and creative roles."
  },
  {
    icon: Download,
    title: "Instant PDF Export",
    description: "Download your perfectly formatted resume in high-quality PDF format with just one click."
  }
];

export default function ResumeBuilderPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-gray-900 py-32 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center lg:text-left">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-10"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white text-[10px] font-black uppercase tracking-widest border border-white/10">
                <Sparkles className="w-3 h-3 text-primary fill-primary" /> AI Powered
              </div>
              <h1 className="text-6xl md:text-[80px] font-black tracking-tighter leading-none">
                Build a <span className="text-primary italic">resume</span> that lands jobs.
              </h1>
              <p className="text-gray-400 text-xl font-medium leading-relaxed max-w-xl">
                The only AI-integrated resume builder that is specifically optimized for today's high-tech job market.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" className="h-16 px-10 rounded-2xl font-black text-lg shadow-2xl shadow-primary/30">
                  Build My Resume <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button variant="ghost" className="h-16 px-10 rounded-2xl font-black text-lg text-white hover:bg-white/10">
                  View Templates
                </Button>
              </div>
            </motion.div>

            {/* Resume Preview Mockup */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              className="relative hidden lg:block"
            >
               <div className="bg-white rounded-[40px] p-10 shadow-[0_50px_100px_-20px_rgba(37,99,235,0.3)] border border-white/20 transform rotate-2 hover:rotate-0 transition-transform duration-700">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center font-black text-2xl text-primary">JD</div>
                    <div>
                      <div className="h-4 w-40 bg-gray-900 rounded-full mb-3" />
                      <div className="h-3 w-24 bg-gray-200 rounded-full" />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">AI Suggestion</span>
                      </div>
                      <div className="h-2 w-full bg-primary/20 rounded-full mb-2" />
                      <div className="h-2 w-3/4 bg-primary/20 rounded-full" />
                    </div>
                    <div className="h-3 w-full bg-gray-50 rounded-full" />
                    <div className="h-3 w-full bg-gray-50 rounded-full" />
                    <div className="h-3 w-4/5 bg-gray-50 rounded-full" />
                    <div className="pt-4 flex flex-wrap gap-2">
                       <Badge className="bg-gray-100 text-gray-500 border-0 rounded-lg">React.js</Badge>
                       <Badge className="bg-gray-100 text-gray-500 border-0 rounded-lg">Next.js</Badge>
                       <Badge className="bg-gray-100 text-gray-500 border-0 rounded-lg">TypeScript</Badge>
                    </div>
                  </div>
               </div>
               <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary rounded-full blur-[80px] opacity-20" />
            </motion.div>
          </div>
        </div>
        {/* Background glow */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      </section>

      {/* Features Grid */}
      <section className="py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24">
           <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mb-4">Everything you need to <span className="text-primary italic">stand out</span>.</h2>
           <p className="text-gray-500 font-medium max-w-2xl mx-auto">Our resume builder is packed with features designed to give you an unfair advantage in your job search.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((f, i) => (
            <Card key={i} className="p-10 border-gray-100 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/10 transition-all group rounded-[40px]">
              <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 mb-8">
                <f.icon className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-black text-gray-900 mb-4 tracking-tight">{f.title}</h4>
              <p className="text-gray-500 font-medium leading-relaxed text-sm">{f.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Steps Section */}
      <section className="bg-gray-50 py-32 rounded-[60px] mx-4 lg:mx-8 mb-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="relative">
                 <div className="absolute inset-0 bg-primary/10 blur-[100px] rounded-full" />
                 <div className="relative space-y-4">
                    {[
                      { step: '01', title: 'Pick a Template', desc: 'Select from our library of high-converting templates.' },
                      { step: '02', title: 'Import or Type', desc: 'Sync with LinkedIn or start from scratch.' },
                      { step: '03', title: 'AI Refinement', desc: 'Let our AI rewrite your bullets for maximum impact.' },
                      { step: '04', title: 'Download & Apply', desc: 'Get your professional PDF and start landing interviews.' }
                    ].map((s, i) => (
                      <div key={i} className="flex items-center gap-6 p-6 bg-white rounded-3xl shadow-sm border border-gray-100">
                        <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-sm">{s.step}</div>
                        <div>
                          <h4 className="font-black text-gray-900 leading-none mb-2">{s.title}</h4>
                          <p className="text-xs text-gray-500 font-medium">{s.desc}</p>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
              <div className="space-y-8">
                 <h2 className="text-5xl font-black text-gray-900 tracking-tighter leading-none">Your <span className="text-primary italic">dream job</span> is just one resume away.</h2>
                 <p className="text-lg text-gray-500 font-medium leading-relaxed">
                   Stop guessing what recruiters want. Our platform is built on real-world hiring data from 10,000+ successful tech hires.
                 </p>
                 <div className="flex items-center gap-6 pt-4">
                    <div className="flex -space-x-3">
                       {[1,2,3,4].map(i => (
                         <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-gray-200" />
                       ))}
                    </div>
                    <p className="text-sm font-bold text-gray-600">Joined by <span className="text-primary">25,000+</span> professionals this month.</p>
                 </div>
                 <Button size="lg" className="rounded-2xl h-14 px-10 font-black shadow-xl shadow-primary/20">Try It For Free</Button>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
}
