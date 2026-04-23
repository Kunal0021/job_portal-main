"use client";

import React from 'react';
import { 
  Users, 
  Target, 
  Award, 
  Globe, 
  ArrowRight,
  CheckCircle2,
  Rocket,
  ShieldCheck,
  Zap,
  Briefcase
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, Badge, Button } from '@/components/ui';

const stats = [
  { label: 'Active Monthly Users', value: '1.2M+' },
  { label: 'Successful Placements', value: '85k+' },
  { label: 'Global Companies', value: '12k+' },
  { label: 'User Satisfaction', value: '4.9/5' },
];

const values = [
  {
    icon: Rocket,
    title: 'Innovation First',
    description: 'We leverage AI and cutting-edge technology to simplify the hiring process for everyone.'
  },
  {
    icon: ShieldCheck,
    title: 'Trust & Transparency',
    description: 'Every job and company on our platform is verified to ensure a safe experience for seekers.'
  },
  {
    icon: Users,
    title: 'Community Driven',
    description: 'We build features based on real feedback from our community of professionals and recruiters.'
  }
];

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-gray-900 py-32 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white text-[10px] font-black uppercase tracking-widest border border-white/10 mb-8">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" /> Our Story
            </div>
            <h1 className="text-6xl md:text-[90px] font-black tracking-tighter leading-none mb-10">
              We make <span className="text-primary italic">hiring</span> personal.
            </h1>
            <p className="text-xl text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed">
              JobPortal started with a simple belief: every professional deserves an opportunity that truly fits their life and goals.
            </p>
          </motion.div>
        </div>
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />
      </section>

      {/* Stats Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 z-20 relative">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <Card key={i} className="p-8 border-0 shadow-2xl shadow-gray-200 bg-white text-center transform hover:-translate-y-1 transition-all duration-300">
              <h4 className="text-4xl font-black text-gray-900 mb-2 tracking-tighter">{stat.value}</h4>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">{stat.label}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <h2 className="text-5xl font-black text-gray-900 tracking-tighter leading-none">
                Empowering the next generation of <span className="text-primary underline decoration-4 underline-offset-8">global talent</span>.
              </h2>
              <p className="text-lg text-gray-500 font-medium leading-relaxed">
                Traditional job boards are noisy and disconnected. We've built a ecosystem where data meets human insight, ensuring that companies find the right cultural fit and individuals find a place to thrive.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                {[
                  'Verified Salaries & Benefits',
                  'Direct Recruiter Interaction',
                  'AI-Powered ATS Optimization',
                  'Skill-Based Opportunity Matching'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-gray-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="w-full aspect-square rounded-[60px] bg-primary/5 border-2 border-dashed border-primary/20 flex items-center justify-center p-12">
                <div className="w-full h-full bg-white rounded-[40px] shadow-2xl flex items-center justify-center overflow-hidden border border-gray-100">
                  <Globe className="w-40 h-40 text-primary opacity-20 animate-[spin_10s_linear_infinite]" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Zap className="w-20 h-20 text-primary fill-primary shadow-2xl shadow-primary/40" />
                  </div>
                </div>
              </div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white p-6 rounded-[24px] shadow-2xl border border-gray-50 flex flex-col items-center justify-center text-center rotate-12">
                <Briefcase className="w-8 h-8 text-primary mb-3" />
                <h4 className="text-lg font-black text-gray-900">12k+</h4>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Companies</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gray-900 py-32 rounded-[60px] mx-4 lg:mx-8 mb-24 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black text-white tracking-tighter mb-4">Our Core Values</h2>
            <p className="text-gray-400 font-medium">The principles that guide every decision we make.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {values.map((v, i) => (
              <div key={i} className="group space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-lg">
                  <v.icon className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-black text-white">{v.title}</h4>
                <p className="text-gray-400 leading-relaxed text-sm font-medium">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="bg-primary/5 border border-primary/10 rounded-[40px] p-12 md:p-20 text-center">
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter mb-8 leading-none">
            Ready to build your <span className="text-primary">future</span>?
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button size="lg" className="h-16 px-12 rounded-2xl font-black text-lg shadow-2xl shadow-primary/30">
              Browse All Jobs <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="h-16 px-12 rounded-2xl font-black text-lg bg-transparent border-gray-200">
              Post a Job
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
