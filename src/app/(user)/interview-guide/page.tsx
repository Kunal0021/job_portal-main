"use client";

import React from 'react';
import { 
  MessageCircle, 
  Video, 
  Terminal, 
  Lightbulb, 
  FileText, 
  Users, 
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  Mic,
  PlayCircle,
  HelpCircle,
  Award
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, Button, Badge } from '@/components/ui';

const guides = [
  {
    icon: BrainCircuit,
    title: "Behavioral Masterclass",
    description: "Master the STAR method and learn to answer 'Tell me about a time...' questions like a pro.",
    lessons: "12 Lessons",
    level: "All Levels"
  },
  {
    icon: Technical,
    title: "System Design Prep",
    description: "Deep dive into architecture, scalability, and distributed systems for senior engineering roles.",
    lessons: "24 Lessons",
    level: "Advanced"
  },
  {
    icon: Mic,
    title: "Soft Skills & Confidence",
    description: "Improve your delivery, body language, and storytelling to leave a lasting impression.",
    lessons: "8 Lessons",
    level: "Intermediate"
  },
  {
    icon: Terminal,
    title: "Live Coding Survival",
    description: "Tactical advice for whiteboard interviews, pair programming, and data structure challenges.",
    lessons: "15 Lessons",
    level: "Intermediate"
  }
];

function Technical(props: any) {
    return <Terminal {...props} />
}

export default function InterviewGuidePage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-gray-900 py-32 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white text-[10px] font-black uppercase tracking-widest border border-white/10 mb-10">
              <MessageCircle className="w-3 h-3 text-primary fill-primary" /> Success Playbook
            </div>
            <h1 className="text-6xl md:text-[90px] font-black tracking-tighter leading-none mb-10">
              Ace your next <span className="text-primary italic">interview</span>.
            </h1>
            <p className="text-gray-400 text-xl font-medium leading-relaxed max-w-2xl mb-12">
              From whiteboard challenges to executive behavioral rounds, we provide the blueprints you need to convert interviews into offers.
            </p>
            <div className="flex flex-wrap gap-6 pt-4">
               <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary transition-all">
                    <Video className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold">50+ Video Lessons</span>
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold">Mock Question Bank</span>
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold">Expert Community</span>
               </div>
            </div>
          </motion.div>
        </div>
        {/* Background glow */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      </section>

      {/* Main Content Guide Grid */}
      <section className="py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
           {guides.map((guide, i) => (
             <motion.div
               key={i}
               whileHover={{ y: -10 }}
               className="group"
             >
               <Card className="p-10 rounded-[40px] border-gray-100 hover:border-primary/20 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 relative overflow-hidden h-full">
                  <div className="relative z-10 space-y-8">
                    <div className="flex justify-between items-start">
                       <div className="w-16 h-16 rounded-[24px] bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                          <guide.icon className="w-8 h-8" />
                       </div>
                       <Badge variant="info" className="text-[10px] font-black uppercase tracking-widest border-gray-100 text-gray-400 group-hover:border-primary/20 group-hover:text-primary transition-colors">{guide.level}</Badge>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-3xl font-black text-gray-900 tracking-tight group-hover:text-primary transition-colors">{guide.title}</h3>
                      <p className="text-gray-500 font-medium leading-relaxed">{guide.description}</p>
                    </div>
                    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                       <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{guide.lessons}</span>
                       <div className="flex items-center gap-2 text-primary font-black text-sm group-hover:gap-3 transition-all cursor-pointer">
                          Start Learning <ArrowRight className="w-4 h-4" />
                       </div>
                    </div>
                  </div>
                  {/* Decorative faint icon in background */}
                  <guide.icon className="absolute -bottom-10 -right-10 w-48 h-48 text-gray-50 opacity-5 group-hover:text-primary/10 group-hover:opacity-10 transition-all duration-700 -rotate-12" />
               </Card>
             </motion.div>
           ))}
        </div>
      </section>

      {/* Testimonial / Success CTA */}
      <section className="pb-32 px-4">
         <Card className="max-w-5xl mx-auto p-12 md:p-20 rounded-[50px] bg-gray-900 border-0 shadow-2xl relative overflow-hidden text-center space-y-10">
            <div className="relative z-10 flex flex-col items-center">
               <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-10 border border-primary/20">
                  <Award className="w-8 h-8" />
               </div>
               <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none mb-8">
                 Get offer-ready in <span className="text-primary italic">30 days</span>.
               </h2>
               <p className="text-gray-400 text-xl font-medium max-w-2xl mx-auto leading-relaxed mb-12">
                 Join thousands of candidates who used our Success Playbook to land roles at Google, Meta, and Amazon.
               </p>
               <Button size="lg" className="h-16 px-12 rounded-2xl font-black text-lg bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20">
                  Unlock The Playbook <PlayCircle className="w-5 h-5 ml-2" />
               </Button>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
         </Card>
      </section>
    </div>
  );
}
