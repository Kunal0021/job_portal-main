import React from 'react';
import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { Card, Badge, Button } from '@/components/ui';
import { 
  MapPin, 
  Briefcase, 
  Clock, 
  Share2, 
  Bookmark, 
  ChevronRight, 
  Zap, 
  Star,
  Building2,
  ExternalLink,
  Info,
  HelpCircle,
  TrendingUp,
  HandshakeIcon,
  Banknote,
  Users,
  Layers,
  GraduationCap,
  Calendar
} from 'lucide-react';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface Props {
  params: Promise<{ slug: string }>;
}

// Utility to check if string is UUID
const isUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

async function getData(slug: string) {
  const decodedSlug = decodeURIComponent(slug);

  // 1. Try to find by ID
  if (isUUID(decodedSlug)) {
    const { data: job } = await supabase
      .from('jobs')
      .select('*, companies(*)')
      .eq('id', decodedSlug)
      .single();
    if (job) return { type: 'job', data: job };
  }

  // 2. Try to find by url_slug
  const { data: jobBySlug } = await supabase
    .from('jobs')
    .select('*, companies(*)')
    .eq('url_slug', decodedSlug)
    .single();

  if (jobBySlug) return { type: 'job', data: jobBySlug };

  // Try original slug just in case
  if (decodedSlug !== slug) {
    const { data: jobByOriginalSlug } = await supabase
      .from('jobs')
      .select('*, companies(*)')
      .eq('url_slug', slug)
      .single();
    if (jobByOriginalSlug) return { type: 'job', data: jobByOriginalSlug };
  }

  // 3. Try to find by Category
  const categoryName = decodedSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const { data: categoryJobs } = await supabase
    .from('jobs')
    .select('*, companies(*)')
    .ilike('category', `%${categoryName}%`)
    .eq('is_approved', true)
    .limit(20);

  if (categoryJobs && categoryJobs.length > 0) {
    return { type: 'category', data: categoryJobs, name: categoryName, slug: decodedSlug };
  }

  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;
  const result = await getData(slug);

  if (!result) return { title: 'Not Found' };

  if (result.type === 'job') {
    const job = result.data;
    const city = job.location?.split(',')[0] || 'India';
    const year = new Date().getFullYear();
    const title = `${job.title} Jobs in ${city} | ${job.companies?.name || 'Gethyrd'} Hiring ${year}`;
    const description = job.meta_description || job.description?.slice(0, 160);
    return { title, description };
  } else {
    const categoryName = result.name;
    const title = `${categoryName} Jobs in India — ${result.data.length} Active Openings`;
    const description = `Find the best ${categoryName} jobs in India. Verified manufacturing and industrial job openings with salary details.`;
    return { title, description };
  }
}

import { ApplyButton } from '@/components/ApplyButton';

export default async function SlugPage({ params }: Props) {
  const slug = (await params).slug;
  const result = await getData(slug);

  if (!result) {
    notFound();
  }

  if (result.type === 'job') {
    const job = result.data;
    const city = job.location?.split(',')[0] || 'India';
    const year = new Date().getFullYear();

    // Fetch related jobs
    const { data: relatedJobs } = await supabase
        .from('jobs')
        .select('*, companies(*)')
        .eq('category', job.category)
        .neq('id', job.id)
        .eq('is_approved', true)
        .limit(3);

    // Schema.org JSON-LD
    const jsonLd = {
      "@context": "https://schema.org/",
      "@type": "JobPosting",
      "title": job.title,
      "description": job.description,
      "datePosted": job.created_at,
      "validThrough": job.valid_through || new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      "hiringOrganization": {
        "@type": "Organization",
        "name": job.companies?.name,
        "sameAs": job.companies?.website,
        "logo": job.companies?.logo_url
      },
      "jobLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": job.location,
          "addressLocality": city,
          "addressCountry": "IN"
        }
      },
      "baseSalary": job.salary_range ? {
        "@type": "MonetaryAmount",
        "currency": "INR",
        "value": {
          "@type": "QuantitativeValue",
          "value": job.salary_range,
          "unitText": "MONTH"
        }
      } : undefined,
      "employmentType": job.job_type?.toUpperCase().replace('-', '_') || "FULL_TIME"
    };

    // Helper to extract or fallback data for the new sections
    const getDetail = (text: string, pattern: RegExp, fallback: string) => {
      const match = text?.match(pattern);
      return match ? match[0] : fallback;
    };

    const description = job.description || "";
    const highlights = {
      urgency: "Urgently hiring",
      applicants: `${Math.floor(Math.random() * 400) + 100}+ applicants`,
      benefits: getDetail(description, /(Flexible Working Hours|Health Insurance|PF & ESIC|Performance Bonus)/i, "Standard Statutory Benefits")
    };

    const jobRole = {
      department: job.category || "Operations",
      role: job.title?.split(' ')[0] + " Support",
      employmentType: job.job_type || "Full Time",
      shift: getDetail(description, /(Day Shift|Night Shift|Rotational Shift)/i, "Day Shift")
    };

    const requirements = {
      experience: job.experience_level || "Any experience",
      education: getDetail(description, /(Graduate|Post Graduate|Diploma|B\.Tech|10th\/12th)/i, "Graduate"),
      skills: getDetail(description, /Skills:? ([^.\n]+)/i, "Basic Communication, Teamwork")?.replace(/Skills:? /i, ""),
      english: getDetail(description, /(No English|Basic English|Good English|Fluent English)/i, "Basic English"),
      ageLimit: "18 - 45 years",
      gender: "Any gender"
    };

    return (
      <div className="bg-[#f3f4f6] min-h-screen pb-12">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        {/* Simple Breadcrumbs */}
        <nav className="max-w-4xl mx-auto px-4 py-4 text-[13px] font-medium text-gray-400 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-600">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/jobs" className="hover:text-gray-600">Jobs</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-600 truncate">{job.title}</span>
        </nav>

        <div className="max-w-4xl mx-auto px-4">
          <Card className="overflow-hidden border-0 shadow-sm rounded-2xl bg-white p-0">
            {/* MAIN HEADER SECTION */}
            <div className="p-6 md:p-8 space-y-6">
              <div className="flex gap-4 items-start">
                <div className="w-16 h-16 rounded-xl bg-gray-50 flex items-center justify-center p-2 shrink-0 border border-gray-100">
                  {job.companies?.logo_url ? (
                    <img 
                      src={job.companies.logo_url} 
                      alt={job.companies.name} 
                      className="w-full h-full object-contain" 
                    />
                  ) : (
                    <Building2 className="w-8 h-8 text-gray-300" />
                  )}
                </div>
                <div className="space-y-1">
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
                    {job.title}
                  </h1>
                  <p className="text-[15px] font-medium text-gray-500">
                    {job.companies?.name}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-[15px] font-medium text-gray-500">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span>{job.location || 'Work from home'}</span>
                </div>
                <div className="flex items-center gap-3 text-[15px] font-medium text-gray-500">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <Banknote className="w-5 h-5" />
                  </div>
                  <span>{(!job.salary_range || job.salary_range.toLowerCase() === 'not available') ? 'To be Discussed' : `${job.salary_range} monthly`}</span>
                </div>
              </div>

              <div className="bg-gray-50/80 rounded-xl p-5 grid grid-cols-2 gap-8 border border-gray-100">
                <div className="space-y-1">
                  <p className="text-[12px] font-medium text-gray-400 uppercase tracking-wide">Fixed</p>
                  <p className="text-base font-bold text-gray-700">
                    {(!job.salary_range || job.salary_range.toLowerCase() === 'not available') ? 'To be Discussed' : job.salary_range}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[12px] font-medium text-gray-400 uppercase tracking-wide">Earning Potential</p>
                  <p className="text-base font-bold text-gray-700">
                    {job.salary_range?.split('-')[1]?.trim() || job.salary_range || 'To be Discussed'}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100/80 rounded-md text-[13px] font-bold text-gray-600">
                   <div className="w-5 h-5 rounded-full bg-gray-400 flex items-center justify-center text-[10px] text-white font-black">P</div>
                   Part Time
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100/80 rounded-md text-[13px] font-bold text-gray-600">
                   <div className="w-5 h-5 rounded-full bg-gray-400 flex items-center justify-center text-[10px] text-white font-black">F</div>
                   Full Time
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100/80 rounded-md text-[13px] font-bold text-gray-600">
                   <Briefcase className="w-4 h-4 text-gray-400" />
                   {requirements.experience}
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100/80 rounded-md text-[13px] font-bold text-gray-600">
                   <div className="w-5 h-5 rounded-full bg-gray-400 flex items-center justify-center text-[8px] text-white font-black">ENG</div>
                   {requirements.english}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <div className="flex-1">
                  <ApplyButton 
                    jobId={job.id}
                    jobTitle={job.title}
                    companyId={job.companies?.id}
                    companyName={job.companies?.name}
                    applyLink={job.apply_link || '#'}
                    className="w-full h-14 bg-[#1d8363] hover:bg-[#16664d] text-white font-bold text-lg rounded-xl border-0 shadow-none normal-case"
                  />
                </div>
                <Button variant="outline" className="h-14 px-6 flex items-center gap-2 border-2 border-gray-200 rounded-xl text-gray-700 font-bold">
                  <Share2 className="w-5 h-5" />
                  Share
                </Button>
              </div>
            </div>

            {/* JOB HIGHLIGHTS SECTION */}
            <div className="h-2 bg-gray-50" />
            <div className="p-6 md:p-8 space-y-6 bg-blue-50/30">
              <h2 className="text-lg font-bold text-gray-900">Job highlights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                <div className="flex items-center gap-3 text-[15px] font-medium text-gray-700">
                  <Zap className="w-5 h-5 text-orange-500 fill-orange-500" />
                  {highlights.urgency}
                </div>
                <div className="flex items-center gap-3 text-[15px] font-medium text-gray-700">
                  <Users className="w-5 h-5 text-blue-500" />
                  {highlights.applicants}
                </div>
                <div className="flex items-center gap-3 text-[15px] font-medium text-gray-700">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <svg className="w-4 h-4 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  Benefits include: {highlights.benefits}
                </div>
              </div>
            </div>

            {/* JOB DESCRIPTION SECTION */}
            <div className="h-2 bg-gray-50" />
            <div className="p-6 md:p-8 space-y-6">
              <h2 className="text-lg font-bold text-gray-900">Job Description</h2>
              <div 
                className="text-gray-600 leading-relaxed font-medium prose-p:my-4 html-content"
                dangerouslySetInnerHTML={{ __html: job.description }}
              />
            </div>

            {/* JOB ROLE SECTION */}
            <div className="h-2 bg-gray-50" />
            <div className="p-6 md:p-8 space-y-8">
              <h2 className="text-lg font-bold text-gray-900">Job role</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                <div className="flex gap-4">
                  <div className="p-2 bg-gray-100 rounded-lg h-fit text-gray-400">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[13px] font-medium text-gray-400">Department</p>
                    <p className="text-[15px] font-bold text-gray-700">{jobRole.department}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="p-2 bg-gray-100 rounded-lg h-fit text-gray-400">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[13px] font-medium text-gray-400">Role / Category</p>
                    <p className="text-[15px] font-bold text-gray-700">{jobRole.role}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="p-2 bg-gray-100 rounded-lg h-fit text-gray-400">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[13px] font-medium text-gray-400">Employment type</p>
                    <p className="text-[15px] font-bold text-gray-700">{jobRole.employmentType}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="p-2 bg-gray-100 rounded-lg h-fit text-gray-400">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[13px] font-medium text-gray-400">Shift</p>
                    <p className="text-[15px] font-bold text-gray-700">{jobRole.shift}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* JOB REQUIREMENTS SECTION */}
            <div className="h-2 bg-gray-50" />
            <div className="p-6 md:p-8 space-y-8">
              <h2 className="text-lg font-bold text-gray-900">Job requirements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                <div className="flex gap-4">
                  <div className="p-2 bg-gray-100 rounded-lg h-fit text-gray-400">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[13px] font-medium text-gray-400">Experience</p>
                    <p className="text-[15px] font-bold text-gray-700">{requirements.experience}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="p-2 bg-gray-100 rounded-lg h-fit text-gray-400">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[13px] font-medium text-gray-400">Education</p>
                    <p className="text-[15px] font-bold text-gray-700">{requirements.education}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="p-2 bg-gray-100 rounded-lg h-fit text-gray-400">
                    <Info className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[13px] font-medium text-gray-400">Skills</p>
                    <p className="text-[15px] font-bold text-gray-700">{requirements.skills}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="p-2 bg-gray-100 rounded-lg h-fit text-gray-400">
                    <div className="w-5 h-5 flex items-center justify-center font-black text-[10px]">EN</div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[13px] font-medium text-gray-400">English level</p>
                    <p className="text-[15px] font-bold text-gray-700">{requirements.english}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="p-2 bg-gray-100 rounded-lg h-fit text-gray-400">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[13px] font-medium text-gray-400">Age limit</p>
                    <p className="text-[15px] font-bold text-gray-700">{requirements.ageLimit}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="p-2 bg-gray-100 rounded-lg h-fit text-gray-400">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[13px] font-medium text-gray-400">Gender</p>
                    <p className="text-[15px] font-bold text-gray-700">{requirements.gender}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ABOUT COMPANY SECTION */}
            <div className="h-2 bg-gray-50" />
            <div className="p-6 md:p-8 space-y-6">
              <h2 className="text-lg font-bold text-gray-900">About company</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center p-2 border border-gray-100 shrink-0">
                    {job.companies?.logo_url ? (
                      <img src={job.companies.logo_url} alt="" className="w-full h-full object-contain" />
                    ) : (
                      <Building2 className="w-6 h-6 text-gray-300" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-[13px] font-medium text-gray-400">Name</p>
                    <p className="text-[15px] font-bold text-gray-700">{job.companies?.name}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="p-2 bg-gray-100 rounded-lg h-fit text-gray-400 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[13px] font-medium text-gray-400">Address</p>
                    <p className="text-[15px] font-bold text-gray-700 leading-relaxed">
                      {job.companies?.location || job.location}
                    </p>
                  </div>
                </div>
              </div>
              <div className="pt-6 border-t border-gray-100">
                <p className="text-[13px] font-medium text-gray-400">
                  Job posted by <span className="text-gray-900 font-bold">{job.companies?.name}</span>
                </p>
              </div>
            </div>
          </Card>

          {/* Related Jobs */}
          {relatedJobs && relatedJobs.length > 0 && (
            <div className="mt-12 space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Similar Jobs</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedJobs.map((rj) => (
                  <Card key={rj.id} className="p-5 border-0 shadow-sm bg-white rounded-2xl hover:bg-gray-50 transition-all cursor-pointer">
                    <Link href={`/jobs/${rj.url_slug || rj.id}`}>
                      <h4 className="font-bold text-gray-900 mb-1">{rj.title}</h4>
                      <p className="text-[13px] text-gray-500 font-medium">{rj.companies?.name} • {rj.location}</p>
                    </Link>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  } else {
    // CATEGORY VIEW
    const jobs = result.data;
    const categoryName = result.name;
    const citiesInCat = Array.from(new Set(jobs.map((j: any) => j.location?.split(',')[0]))).slice(0, 5);

    const itemListSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": jobs.slice(0, 10).map((job: any, index: number) => ({
            "@type": "ListItem",
            "position": index + 1,
            "url": `https://gethyrd.in/jobs/${job.url_slug || job.id}`,
            "name": job.title
        }))
    };

    return (
      <div className="bg-gray-50 min-h-screen">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />

        <div className="bg-white border-b border-gray-100 py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-indigo-50/30"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <Badge className="mb-4 bg-indigo-600 text-white border-0 font-bold px-4 py-1">Career Category</Badge>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tighter">
              {categoryName} Jobs in India — {jobs.length} Active Openings
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-medium leading-relaxed">
              Explore {jobs.length} active opportunities for {categoryName} roles across India's industrial hubs.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
                <Card className="p-10 border-0 shadow-2xl shadow-gray-100 bg-white rounded-[40px] prose prose-slate max-w-none">
                    <h2 className="text-2xl font-black text-gray-900 mb-6">{categoryName} Careers Overview</h2>
                    <p className="text-gray-600 font-medium">
                        There are currently {jobs.length} verified openings for {categoryName} positions. These roles are essential for the manufacturing and industrial sectors, offering diverse opportunities in production, maintenance, and quality control.
                    </p>
                </Card>

                <div className="space-y-6">
                    <h2 className="text-2xl font-black text-gray-900 px-2">Recent Openings</h2>
                    <div className="grid grid-cols-1 gap-6">
                        {jobs.map((job: any) => (
                            <Card key={job.id} className="p-8 border-0 shadow-sm hover:shadow-2xl hover:shadow-indigo-100/30 transition-all bg-white group rounded-[32px] overflow-hidden">
                                <div className="flex items-start gap-6">
                                    <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-2xl font-black text-indigo-600 border border-gray-100 group-hover:bg-indigo-600 group-hover:text-white transition-all shrink-0">
                                        {job.companies?.logo_url ? (
                                            <img src={job.companies.logo_url} alt={job.companies.name} className="w-full h-full object-contain" />
                                        ) : (
                                            job.companies?.name?.charAt(0) || 'J'
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <h3 className="text-xl font-black text-gray-900 group-hover:text-indigo-600">
                                            <a href={`/jobs/${job.url_slug || job.id}`}>{job.title}</a>
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500 font-bold">
                                            <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> {job.companies?.name}</span>
                                            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {job.location}</span>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="rounded-xl group-hover:bg-indigo-50 group-hover:text-indigo-600">
                                        <ChevronRight className="w-6 h-6" />
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            <aside className="space-y-8">
              {citiesInCat.length > 0 && (
                <Card className="p-8 border-0 shadow-2xl shadow-indigo-100/20 bg-white rounded-[40px]">
                  <h3 className="text-xl font-black text-gray-900 mb-8 tracking-tight">Cities with {categoryName} Jobs</h3>
                  <div className="space-y-3">
                      {(citiesInCat as string[]).map((city: string) => (
                          <a 
                              key={city} 
                              href={`/jobs-in/${city.toLowerCase()}`}
                              className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 hover:bg-indigo-600 hover:text-white transition-all font-bold text-gray-600"
                          >
                              {city} <ChevronRight className="w-4 h-4" />
                          </a>
                      ))}
                  </div>
                </Card>
              )}

              <Card className="p-8 border-0 shadow-2xl shadow-indigo-100 bg-indigo-600 text-white rounded-[40px]">
                  <TrendingUp className="w-10 h-10 mb-4 fill-white animate-pulse" />
                  <h3 className="text-xl font-black mb-2 leading-tight">Apply for {categoryName} Jobs</h3>
                  <p className="text-sm font-medium opacity-80 mb-6">Stay updated with the latest industrial career opportunities.</p>
                  <Button className="w-full h-12 rounded-2xl bg-white text-indigo-600 font-black hover:bg-gray-100 border-0">Get Alerts</Button>
              </Card>
            </aside>
          </div>
        </div>
      </div>
    );
  }
}
