"use client";

import React, { useState } from 'react';
import { Card, Badge, Button, Input, Textarea } from '@/components/ui';
import { 
  Building2, 
  MapPin, 
  Globe, 
  Search, 
  Briefcase, 
  Star, 
  Users, 
  ArrowRight,
  TrendingUp,
  Mail,
  Phone,
  MessageSquare,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Something went wrong');

      setStatus({ type: 'success', message: 'Message sent successfully! We will get back to you soon.' });
      setFormData({ full_name: '', email: '', subject: 'General Inquiry', message: '' });
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Header */}
      <section className="bg-gray-50 border-b border-gray-100 py-24 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-4xl mx-auto"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/10 mb-8">
                    <MessageSquare className="w-3 h-3 fill-primary" /> Reach Out
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-none mb-8">
                    Let's <span className="text-primary italic">connect</span>.
                </h1>
                <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed mb-12">
                    Have questions about the platform or need support with your hiring needs? We're here to help.
                </p>
            </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 z-20 relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <aside className="lg:col-span-1 space-y-8">
                <Card className="p-10 border-0 shadow-2xl shadow-gray-200 bg-white space-y-12">
                    {[
                        { icon: Mail, label: 'Email Support', value: 'hello@jobportal.com' },
                        { icon: Phone, label: 'Phone Support', value: '+1 (555) 000-0000' },
                        { icon: MapPin, label: 'Headquarters', value: '123 Tech Lane, San Francisco, CA' },
                    ].map((item, i) => (
                        <div key={i} className="space-y-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-sm shadow-primary/10">
                                <item.icon className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none mb-2">{item.label}</h4>
                                <p className="text-lg font-black text-gray-900 leading-tight">{item.value}</p>
                            </div>
                        </div>
                    ))}
                </Card>
            </aside>

            {/* Contact Form */}
            <div className="lg:col-span-2 space-y-8">
                <Card className="p-10 md:p-16 border-0 shadow-sm bg-gray-50/50">
                    <h3 className="text-2xl font-black text-gray-900 mb-10 tracking-tight leading-none">Drop us a message</h3>
                    
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <AnimatePresence>
                            {status && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className={`p-4 rounded-xl flex items-center gap-3 font-bold text-sm ${
                                        status.type === 'success' ? 'bg-secondary/10 text-secondary border border-secondary/20' : 'bg-danger/10 text-danger border border-danger/20'
                                    }`}
                                >
                                    {status.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                    {status.message}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Full Name</label>
                                <Input 
                                    required
                                    placeholder="John Doe" 
                                    className="bg-white" 
                                    value={formData.full_name}
                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Email Address</label>
                                <Input 
                                    required
                                    type="email" 
                                    placeholder="john@example.com" 
                                    className="bg-white" 
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                             <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Subject</label>
                             <select 
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                className="flex h-11 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-all outline-none"
                             >
                                 <option>General Inquiry</option>
                                 <option>Hiring Support</option>
                                 <option>Technical Issue</option>
                                 <option>Billing Question</option>
                             </select>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Message</label>
                            <Textarea 
                                required
                                className="min-h-[160px] bg-white pt-3" 
                                placeholder="How can we help you today?"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            />
                        </div>

                        <Button 
                            type="submit"
                            size="lg" 
                            loading={loading}
                            className="h-14 px-12 font-black text-lg rounded-2xl shadow-2xl shadow-primary/30 w-full md:w-auto transition-all transform hover:scale-[1.02]"
                        >
                            Send Message <ArrowRight className="h-5 w-5 ml-2" />
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
      </div>
    </div>
  );
}
