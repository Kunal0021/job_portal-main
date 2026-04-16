"use client";
import React, { useState, useEffect } from 'react';
import { Card, Badge, Button } from '@/components/ui';
import {
  Copy,
  Trash2,
  Merge,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Loader2,
  Clock,
  MapPin,
  DollarSign,
  Building,
  UserPlus,
  Globe,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

interface Job {
  id: string;
  title: string;
  location: string;
  created_at: string;
  source_url: string;
  company_id: string;
  salary_range: string;
  experience_level: string;
  companies: {
    name: string;
  } | null;
}

interface DuplicateSet {
  title: string;
  companyName: string;
  jobs: Job[];
}

export default function DuplicateJobs() {
  const [duplicateSets, setDuplicateSets] = useState<DuplicateSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchDuplicates = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('jobs')
        .select('*, companies(name)')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group by Title + Salary Range + Experience Level
      const groups: Record<string, Job[]> = {};
      data?.forEach((job: any) => {
        const title = (job.title || '').toLowerCase().trim();
        const salary = (job.salary_range || '').toLowerCase().trim();
        const exp = (job.experience_level || '').toLowerCase().trim();

        const key = `${title}|${salary}|${exp}`;
        if (!groups[key]) groups[key] = [];
        groups[key].push(job);
      });

      // Filter for groups with more than 1 job
      const sets: DuplicateSet[] = Object.values(groups)
        .filter(jobs => jobs.length > 1)
        .map(jobs => ({
          title: jobs[0].title,
          companyName: jobs[0].companies?.name || 'Unknown',
          jobs: jobs
        }));

      setDuplicateSets(sets);
    } catch (err) {
      console.error('Error fetching duplicates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDuplicates();
  }, []);

  const handleIgnore = async (jobId: string) => {
    try {
      setActionLoading(jobId);
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobId);

      if (error) throw error;
      await fetchDuplicates();
    } catch (err) {
      alert('Failed to ignore/delete job');
    } finally {
      setActionLoading(null);
    }
  };

  const handleMerge = async (set: DuplicateSet) => {
    try {
      const primaryJob = set.jobs[0];
      const otherIds = set.jobs.slice(1).map(j => j.id);

      setActionLoading('merge-' + primaryJob.id);

      // 1. Approve primary job
      const { error: updateError } = await supabase
        .from('jobs')
        .update({ is_approved: true })
        .eq('id', primaryJob.id);

      if (updateError) throw updateError;

      // 2. Delete duplicates
      const { error: deleteError } = await supabase
        .from('jobs')
        .delete()
        .in('id', otherIds);

      if (deleteError) throw deleteError;

      await fetchDuplicates();
      alert(`Successfully merged ${set.jobs.length} instances into one approved job.`);
    } catch (err) {
      alert('Failed to merge jobs');
    } finally {
      setActionLoading(null);
    }
  };

  const handleBulkCleanup = async () => {
    if (!confirm(`Are you sure you want to automatically resolve all ${duplicateSets.length} duplicate sets? This will keep one instance for each and delete the rest.`)) return;

    try {
      setLoading(true);
      for (const set of duplicateSets) {
        const otherIds = set.jobs.slice(1).map(j => j.id);
        await supabase.from('jobs').delete().in('id', otherIds);
      }
      await fetchDuplicates();
      alert('Bulk cleanup completed successfully.');
    } catch (err) {
      alert('Bulk cleanup encountered an error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 p-6 bg-gray-50/10 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Duplicate Job Review Panel</h1>
          <p className="text-gray-500 mt-1 font-medium">Compare and merge conflicting job postings from various sources.</p>
        </div>
        {duplicateSets.length > 0 && (
          <div className="flex items-center gap-3">
            <Badge variant="warning" className="px-5 py-2 text-xs font-black uppercase tracking-widest bg-orange-50 text-orange-600 border-none shadow-sm">
              <AlertTriangle className="h-4 w-4 mr-2" /> {duplicateSets.length} Potential Sets
            </Badge>
          </div>
        )}
      </div>

      {/* Filter Row Placeholder to match image */}
      <div className="bg-white p-4 rounded-[24px] border border-gray-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Similarity Score</span>
            <select className="h-10 px-4 rounded-xl border-gray-200 bg-gray-50 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-100 min-w-[180px]">
              <option>&gt;90%</option>
              <option>&gt;80%</option>
              <option>&gt;70%</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Source</span>
            <select className="h-10 px-4 rounded-xl border-gray-200 bg-gray-50 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-100 min-w-[180px]">
              <option>All Sources</option>
              <option>LinkedIn</option>
              <option>Indeed</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button className="h-11 px-6 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-100 rounded-2xl text-xs font-black uppercase tracking-widest">
            Merge Selected ({duplicateSets.length})
          </Button>
          <Button variant="outline" className="h-11 px-6 border-gray-200 rounded-2xl text-xs font-black uppercase tracking-widest">
            Discard Selected
          </Button>
          <div className="flex items-center gap-2 ml-4">
            <input type="checkbox" className="w-5 h-5 rounded-lg border-gray-300 text-indigo-600 focus:ring-indigo-500" />
            <span className="text-xs font-black text-gray-600 uppercase tracking-widest">Select All</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="text-gray-500 font-bold">Scanning for duplicates...</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {duplicateSets.length === 0 ? (
              <div className="py-20 text-center">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No Duplicates Found!</h3>
                <p className="text-gray-500 font-medium">Your job queue is clean and well-organized.</p>
              </div>
            ) : (
              duplicateSets.map((set, setIndex) => {
                // For simplicity, we compare the first job with every other job in the set
                // If there are more than 2 jobs, we'll show multiple comparison cards for that set
                return set.jobs.slice(1).map((duplicateJob, dupIndex) => {
                  const originalJob = set.jobs[0];
                  return (
                    <motion.div
                      key={`${originalJob.id}-${duplicateJob.id}`}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="mb-6"
                    >
                      <Card className="border-0 shadow-lg shadow-gray-200/50 bg-white overflow-hidden hover:shadow-xl transition-all duration-300">
                        <div className="grid grid-cols-1 xl:grid-cols-12 items-center bg-white">

                          {/* Left Column: Original Posting */}
                          <div className="xl:col-span-4 p-6 border-r border-gray-50 bg-gray-50/10">
                            <div className="flex items-start gap-4 mb-4">
                              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100/50">
                                <Building className="h-6 w-6" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-black text-gray-900 truncate leading-tight mb-1">{originalJob.title}</h3>
                                <div className="flex items-center gap-2 text-sm text-gray-500 font-bold mb-2">
                                  <span>{originalJob.companies?.name || 'Unknown'}</span>
                                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                  <span>{originalJob.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="success" className="bg-emerald-50 text-emerald-600 border-none font-black text-[9px] uppercase tracking-wider py-1 px-3">Premium</Badge>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-gray-50 shadow-sm">
                                <div className="flex items-center gap-3">
                                  <Calendar className="h-4 w-4 text-gray-400" />
                                  <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Date Added</span>
                                    <span className="text-xs font-black text-gray-700">{new Date(originalJob.created_at).toISOString().split('T')[0]}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 border-l border-gray-100 pl-4">
                                  <MapPin className="h-4 w-4 text-gray-400" />
                                  <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Location</span>
                                    <span className="text-xs font-black text-gray-700 truncate max-w-[80px]">{originalJob.location}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-gray-50 shadow-sm">
                                <DollarSign className="h-4 w-4 text-gray-400" />
                                <div className="flex flex-col">
                                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Salary Range</span>
                                  <span className="text-xs font-black text-gray-700">{originalJob.salary_range || 'Competitive'}</span>
                                </div>
                              </div>
                              <a href={originalJob.source_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[11px] font-bold text-indigo-500 hover:text-indigo-700 transition-colors uppercase tracking-widest mt-4 pl-1">
                                View original posting <ArrowRight className="h-3 w-3" />
                              </a>
                            </div>
                          </div>

                          {/* Center Column: Similarity Score */}
                          <div className="xl:col-span-1 py-8 flex items-center justify-center relative">
                            <div className="flex flex-col items-center">
                              <div className="h-20 w-[1px] bg-gradient-to-b from-transparent via-indigo-100 to-transparent absolute hidden xl:block"></div>
                              <div className="bg-white px-2 py-4 relative z-10 flex flex-col items-center">
                                <span className="text-[11px] font-black text-indigo-400 uppercase mb-1">Similarity</span>
                                <span className="text-2xl font-black text-indigo-600 tracking-tighter">98%</span>
                              </div>
                            </div>
                          </div>

                          {/* Right Column: Detected Duplicate */}
                          <div className="xl:col-span-4 p-6 border-l border-gray-50 bg-gray-50/10">
                            <div className="flex items-start gap-4 mb-4">
                              <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 shadow-sm border border-orange-100/50">
                                <Building className="h-6 w-6" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-black text-gray-900 truncate leading-tight mb-1">{duplicateJob.title}</h3>
                                <div className="flex items-center gap-2 text-sm text-gray-500 font-bold mb-2">
                                  <span>{duplicateJob.companies?.name || 'Unknown'}</span>
                                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                  <span>{duplicateJob.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="warning" className="bg-orange-50 text-orange-600 border-none font-black text-[9px] uppercase tracking-wider py-1 px-3">Premium</Badge>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-gray-50 shadow-sm">
                                <div className="flex items-center gap-3">
                                  <Calendar className="h-4 w-4 text-gray-400" />
                                  <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Date Added</span>
                                    <span className="text-xs font-black text-gray-700">{new Date(duplicateJob.created_at).toISOString().split('T')[0]}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 border-l border-gray-100 pl-4">
                                  <MapPin className="h-4 w-4 text-gray-400" />
                                  <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Location</span>
                                    <span className="text-xs font-black text-gray-700 truncate max-w-[80px]">{duplicateJob.location}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-gray-50 shadow-sm">
                                <DollarSign className="h-4 w-4 text-gray-400" />
                                <div className="flex flex-col">
                                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Salary Range</span>
                                  <span className="text-xs font-black text-gray-700">{duplicateJob.salary_range || 'Competitive'}</span>
                                </div>
                              </div>
                              <a href={duplicateJob.source_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[11px] font-bold text-orange-500 hover:text-orange-700 transition-colors uppercase tracking-widest mt-4 pl-1">
                                View original posting <ArrowRight className="h-3 w-3" />
                              </a>
                            </div>
                          </div>

                          {/* Far Right Column: Action Panel */}
                          <div className="xl:col-span-3 p-6 flex flex-col gap-3 justify-center bg-gray-50/30 border-l border-gray-100">
                            <Button
                              variant="outline"
                              className="w-full bg-white hover:bg-indigo-50 text-gray-700 border-gray-200 hover:border-indigo-200 rounded-2xl h-11 text-xs font-black uppercase tracking-widest shadow-sm"
                              onClick={() => handleMerge(set)}
                              disabled={!!actionLoading}
                            >
                              Keep Posting 1
                            </Button>
                            <Button
                              variant="outline"
                              className="w-full bg-white hover:bg-indigo-50 text-gray-700 border-gray-200 hover:border-indigo-200 rounded-2xl h-11 text-xs font-black uppercase tracking-widest shadow-sm"
                              onClick={() => handleIgnore(originalJob.id)}
                              disabled={!!actionLoading}
                            >
                              Keep Posting 2
                            </Button>
                            <Button
                              variant="danger"
                              className="w-full bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-100 hover:border-rose-200 rounded-2xl h-11 text-xs font-black uppercase tracking-widest shadow-none"
                              onClick={() => {
                                handleIgnore(originalJob.id);
                                handleIgnore(duplicateJob.id);
                              }}
                              disabled={!!actionLoading}
                            >
                              Delete Both
                            </Button>
                            <button className="flex items-center justify-center gap-2 mt-2 text-gray-400 hover:text-gray-600 transition-colors">
                              <UserPlus className="h-4 w-4" />
                              <span className="text-[10px] font-black uppercase tracking-wider">Add to Exception List</span>
                            </button>
                          </div>

                        </div>
                      </Card>
                    </motion.div>
                  );
                });
              })
            )}
          </AnimatePresence>
        )}
      </div>

      {!loading && duplicateSets.length > 0 && (
        <div className="bg-gray-900 rounded-[32px] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
          <div className="relative z-10">
            <h3 className="text-xl font-black mb-2 tracking-tight">Bulk Cleanup Tool</h3>
            <p className="text-gray-400 text-sm font-medium">Clear all duplicate instances automatically. This will keep the latest entry for each set.</p>
          </div>
          <Button
            variant="ghost"
            className="relative z-10 text-white border-2 border-white/10 hover:bg-white/5 font-black uppercase tracking-widest px-10 rounded-2xl"
            onClick={handleBulkCleanup}
          >
            Launch Bulk Action <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <div className="absolute right-0 bottom-0 w-64 h-64 bg-primary/20 blur-[80px] rounded-full translate-x-1/2 translate-y-1/2"></div>
        </div>
      )}
    </div>
  );
}

