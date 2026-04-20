"use client";

import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Zap, 
  Brain, 
  Target, 
  BarChart3, 
  ArrowRight,
  RefreshCcw,
  Sparkles,
  ShieldCheck,
  Search,
  Layout,
  Briefcase,
  GraduationCap,
  X
} from 'lucide-react';

// Simplified Badge component
const Badge = ({ children, variant = 'info', className = '' }: { children: React.ReactNode, variant?: string, className?: string }) => {
  const variants: Record<string, string> = {
    info: 'bg-blue-100 text-blue-700 border-blue-200',
    success: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    danger: 'bg-rose-100 text-rose-700 border-rose-200',
    warning: 'bg-amber-100 text-amber-700 border-amber-200',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${variants[variant] || variants.info} ${className}`}>
      {children}
    </span>
  );
};

export default function ATSScorePage() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDesc, setJobDesc] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const startScan = async () => {
    if (!file) {
      setError("Please upload a resume.");
      return;
    }

    setError(null);
    setIsScanning(true);
    setScanProgress(0);
    
    // Start simulation of progress for UI "vibe"
    const progressInterval = setInterval(() => {
      setScanProgress((prev) => (prev >= 95 ? prev : prev + 5));
    }, 150);

    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("jobDescription", jobDesc);

      const res = await fetch("http://127.0.0.1:5000/ats-score", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to analyze resume.");
      }
      
      // Complete the progress bar
      clearInterval(progressInterval);
      setScanProgress(100);
      
      setTimeout(() => {
        setResult(data);
        setIsScanning(false);
        setShowResults(true);
      }, 800);

    } catch (err: any) {
      clearInterval(progressInterval);
      setIsScanning(false);
      setError(err.message || "An unexpected error occurred.");
    }
  };

  const reset = () => {
    setFile(null);
    setJobDesc("");
    setShowResults(false);
    setIsScanning(false);
    setScanProgress(0);
    setResult(null);
    setError(null);
  };

  const downloadPDF = () => {
    if (!result) return;
    setIsDownloading(true);
    try {
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 15;
      const contentWidth = pageWidth - margin * 2;
      let y = 20;

      const addText = (text: string, size: number, style: string = 'normal', color: [number, number, number] = [30, 30, 30]) => {
        pdf.setFontSize(size);
        pdf.setFont('helvetica', style);
        pdf.setTextColor(...color);
        const lines = pdf.splitTextToSize(text, contentWidth);
        pdf.text(lines, margin, y);
        y += lines.length * (size * 0.4) + 3;
      };

      const addLine = (color: [number, number, number] = [220, 220, 220]) => {
        pdf.setDrawColor(...color);
        pdf.line(margin, y, pageWidth - margin, y);
        y += 6;
      };

      const checkPageBreak = (needed: number = 20) => {
        if (y + needed > 275) { pdf.addPage(); y = 20; }
      };

      // --- HEADER ---
      pdf.setFillColor(17, 24, 39); // gray-900
      pdf.roundedRect(0, 0, pageWidth, 48, 0, 0, 'F');
      pdf.setFontSize(22);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(255, 255, 255);
      pdf.text('ATS Score Report', margin, 20);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(156, 163, 175);
      pdf.text(`Generated: ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}`, margin, 30);
      pdf.text(`Analysis Type: ${result.analysisType || 'Match Score'}`, margin, 38);
      y = 60;

      // --- SCORE CIRCLE (drawn) ---
      const score = result.score || 0;
      const scoreColor: [number, number, number] = score >= 70 ? [16, 185, 129] : score >= 45 ? [245, 158, 11] : [239, 68, 68];
      pdf.setDrawColor(230, 230, 250);
      pdf.setLineWidth(3);
      pdf.circle(pageWidth / 2, y + 18, 18);
      pdf.setDrawColor(...scoreColor);
      pdf.setLineWidth(3);
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...scoreColor);
      pdf.text(`${score}%`, pageWidth / 2, y + 20, { align: 'center' });
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(107, 114, 128);
      pdf.text('ATS SCORE', pageWidth / 2, y + 28, { align: 'center' });
      y += 50;

      // --- SUMMARY BAR ---
      const summaryText = result.analysisType === 'Profile Strength'
        ? `Your resume contains ${result.resumeSkills?.length || 0} recognized technical skills.`
        : `You matched ${result.resumeSkills?.length || 0} of ${result.jobSkills?.length || 0} required skills for this role.`;
      pdf.setFillColor(239, 246, 255);
      pdf.roundedRect(margin, y, contentWidth, 14, 3, 3, 'F');
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(37, 99, 235);
      pdf.text(summaryText, margin + 4, y + 9);
      y += 22;

      // --- MATCHED SKILLS ---
      checkPageBreak(30);
      addLine();
      addText('✅  Matched / Found Skills', 13, 'bold', [16, 185, 129]);
      if (result.resumeSkills?.length > 0) {
        const skillChunks: string[][] = [];
        for (let i = 0; i < result.resumeSkills.length; i += 4) {
          skillChunks.push(result.resumeSkills.slice(i, i + 4));
        }
        skillChunks.forEach(row => {
          checkPageBreak(10);
          row.forEach((skill: string, idx: number) => {
            const x = margin + idx * (contentWidth / 4);
            pdf.setFillColor(209, 250, 229);
            pdf.roundedRect(x, y, contentWidth / 4 - 3, 9, 2, 2, 'F');
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(6, 95, 70);
            pdf.text(skill.toUpperCase(), x + 3, y + 6);
          });
          y += 12;
        });
      } else {
        addText('No skills detected.', 10, 'normal', [156, 163, 175]);
      }

      // --- MISSING SKILLS (only for match mode) ---
      if (result.analysisType !== 'Profile Strength') {
        y += 4;
        checkPageBreak(30);
        addLine();
        addText('❌  Missing Skills', 13, 'bold', [239, 68, 68]);
        if (result.missingSkills?.length > 0) {
          const skillChunks: string[][] = [];
          for (let i = 0; i < result.missingSkills.length; i += 4) {
            skillChunks.push(result.missingSkills.slice(i, i + 4));
          }
          skillChunks.forEach(row => {
            checkPageBreak(10);
            row.forEach((skill: string, idx: number) => {
              const x = margin + idx * (contentWidth / 4);
              pdf.setFillColor(254, 226, 226);
              pdf.roundedRect(x, y, contentWidth / 4 - 3, 9, 2, 2, 'F');
              pdf.setFontSize(9);
              pdf.setFont('helvetica', 'bold');
              pdf.setTextColor(127, 29, 29);
              pdf.text(skill.toUpperCase(), x + 3, y + 6);
            });
            y += 12;
          });
        } else {
          addText('All required skills found! Great job.', 10, 'normal', [16, 185, 129]);
        }
      }

      // --- TIP ---
      y += 6;
      checkPageBreak(25);
      addLine();
      pdf.setFillColor(255, 251, 235);
      pdf.roundedRect(margin, y, contentWidth, 22, 3, 3, 'F');
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(180, 83, 9);
      pdf.text('💡 Optimization Tip', margin + 4, y + 7);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(92, 45, 0);
      const tip = 'Incorporate missing skills organically into your Skills section or work experience bullets to increase your ATS score.';
      const tipLines = pdf.splitTextToSize(tip, contentWidth - 8);
      pdf.text(tipLines, margin + 4, y + 13);
      y += 28;

      // --- FOOTER ---
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(156, 163, 175);
      pdf.text('Generated by ATS Score Optimizer — Powered by AI', pageWidth / 2, 290, { align: 'center' });

      const fileName = result.analysisType === 'Profile Strength'
        ? 'ATS_Profile_Strength_Report.pdf'
        : 'ATS_Match_Score_Report.pdf';
      pdf.save(fileName);
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-24 pt-12 font-sans overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!showResults && !isScanning ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto text-center"
          >
            <div className="flex justify-center mb-6">
                <Badge variant="info" className="px-4 py-1 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-500 fill-blue-500" /> AI-Powered Analysis
                </Badge>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter mb-6 leading-tight">
              Optimize your resume <br/>for <span className="text-blue-600 italic">maximum impact</span>.
            </h1>
            <p className="text-xl text-gray-500 font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
              Upload your resume and the job description to see how you match up. 
              Our AI analyzes keywords, skills, and formatting.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {/* File Upload Section */}
                <div className={`p-8 rounded-[32px] border-2 border-dashed transition-all relative overflow-hidden flex flex-col items-center justify-center min-h-[300px] ${file ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200 hover:border-blue-300'}`}>
                    <input 
                      type="file" 
                      className="hidden" 
                      ref={fileInputRef} 
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                    />
                    
                    <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                        {file ? <FileText className="w-10 h-10" /> : <Upload className="w-10 h-10" />}
                    </div>

                    <div className="text-center">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {file ? file.name : "Upload Resume"}
                        </h3>
                        <p className="text-sm text-gray-400 font-medium mb-6">
                            {file ? `${(file.size / 1024).toFixed(1)} KB` : "Supports PDF & Word"}
                        </p>
                    </div>

                    {!file ? (
                        <button 
                            className="bg-gray-900 text-white font-bold py-3 px-8 rounded-2xl hover:bg-gray-800 transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            Select File
                        </button>
                    ) : (
                        <button 
                            className="text-gray-400 hover:text-rose-500 font-bold flex items-center gap-2 mt-2"
                            onClick={() => setFile(null)}
                        >
                            <X className="w-4 h-4" /> Remove file
                        </button>
                    )}
                </div>

                {/* Job Description Section */}
                <div className="p-8 rounded-[32px] bg-gray-50 border border-gray-100 text-left flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-gray-400" /> Job Description
                    </h3>
                    <textarea
                        value={jobDesc}
                        onChange={(e) => setJobDesc(e.target.value)}
                        placeholder="Paste the target job description here..."
                        className="w-full flex-grow bg-white border border-gray-200 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none min-h-[200px]"
                    />
                </div>
            </div>

            {error && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl font-bold flex items-center justify-center gap-3"
                >
                    <AlertCircle className="w-5 h-5" /> {error}
                </motion.div>
            )}

            <div className="flex justify-center">
                <button 
                    disabled={!file}
                    onClick={startScan}
                    className={`w-full max-w-sm py-5 rounded-3xl font-black text-xl shadow-2xl transition-all flex items-center justify-center gap-3 ${!file ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/25 active:scale-95'}`}
                >
                    <Zap className={`w-6 h-6 ${!file ? 'text-gray-400' : 'text-yellow-400 fill-yellow-400'}`} /> Analyze Now
                </button>
            </div>

            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                {[
                    { icon: ShieldCheck, title: "ATS Check", desc: "Ensure your resume passes 99% of modern industrial ATS filters." },
                    { icon: Target, title: "Keyword Match", desc: "Identify missing critical keywords for your target role." },
                    { icon: BarChart3, title: "Score Report", desc: "Get a detailed breakdown of your resume's competitive edge." },
                ].map((feature, i) => (
                    <div key={i} className="group p-6 rounded-3xl hover:bg-gray-50 transition-colors">
                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all">
                            <feature.icon className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-gray-900 mb-2">{feature.title}</h4>
                        <p className="text-sm text-gray-500 leading-relaxed font-medium">{feature.desc}</p>
                    </div>
                ))}
            </div>
          </motion.div>
        ) : isScanning ? (
          <div className="max-w-xl mx-auto py-32 text-center">
            <div className="mb-12 relative inline-block">
                <div className="w-32 h-32 rounded-3xl border-4 border-blue-100 flex items-center justify-center">
                    <motion.div
                        animate={{ 
                            rotate: 360,
                            scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                            scale: { duration: 1, repeat: Infinity }
                        }}
                        className="text-blue-600"
                    >
                        <RefreshCcw className="w-12 h-12" />
                    </motion.div>
                </div>
                <div className="absolute -top-4 -right-4 bg-blue-600 text-white p-3 rounded-2xl shadow-xl">
                    <Brain className="w-6 h-6" />
                </div>
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight uppercase">Scanning your CV...</h2>
            <p className="text-gray-400 font-bold mb-10 uppercase text-xs tracking-[0.2em]">AI core processing algorithms</p>
            
            <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden mb-4 p-1">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${scanProgress}%` }}
                    className="h-full bg-blue-600 rounded-full"
                ></motion.div>
            </div>
            <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                <span>{scanProgress}% Extracted</span>
                <span>Security Verified</span>
            </div>

            <div className="mt-16 space-y-4">
                <AnimatePresence>
                    {scanProgress > 20 && (
                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 text-sm text-gray-600 font-bold bg-gray-50 p-3 rounded-xl border border-gray-100 text-left">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Parsing document architecture...
                        </motion.div>
                    )}
                    {scanProgress > 50 && (
                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 text-sm text-gray-600 font-bold bg-gray-50 p-3 rounded-xl border border-gray-100 text-left">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Extracting industry-standard keywords...
                        </motion.div>
                    )}
                    {scanProgress > 80 && (
                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 text-sm text-gray-600 font-bold bg-gray-50 p-3 rounded-xl border border-gray-100 text-left">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Finalizing match-score matrix...
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-12 max-w-6xl mx-auto"
          >
            {/* Results Header */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 bg-gray-900 rounded-[48px] p-12 text-white overflow-hidden relative border border-white/5">
                <div className="lg:col-span-2 relative z-10">
                    <Badge variant="success" className="mb-6 bg-emerald-500/20 text-emerald-400 border-0 px-4 py-1.5 text-sm uppercase tracking-widest">Analysis Finished</Badge>
                    <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-6 leading-none italic">{result?.analysisType || "Match Analysis"}</h2>
                    <p className="text-gray-400 font-medium text-lg leading-relaxed max-w-xl">
                        {result?.analysisType === "Profile Strength" 
                          ? "We have analyzed your resume against modern industry standards to measure your total technical impact."
                          : "Your profile shows a strong alignment with the target role. We've identified key strengths and a few missing areas to optimize."}
                    </p>
                    <div className="mt-10 flex flex-wrap gap-4">
                        <button
                          onClick={downloadPDF}
                          disabled={isDownloading}
                          className={`font-bold py-4 px-10 rounded-2xl transition-all shadow-xl active:scale-95 flex items-center gap-2 ${
                            isDownloading
                              ? 'bg-blue-400 text-white cursor-not-allowed shadow-none'
                              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                          }`}
                        >
                          {isDownloading ? (
                            <><RefreshCcw className="w-4 h-4 animate-spin" /> Generating...</>
                          ) : (
                            <><FileText className="w-4 h-4" /> Download PDF Report</>
                          )}
                        </button>
                        <button 
                            className="bg-white/5 hover:bg-white/10 text-white font-bold py-4 px-8 rounded-2xl transition-all flex items-center gap-2 border border-white/10" 
                            onClick={reset}
                        >
                            <RefreshCcw className="w-5 h-5" /> Start New Scan
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-center relative z-10">
                    <div className="w-64 h-64 md:w-72 md:h-72 rounded-full border-[16px] border-white/5 flex items-center justify-center relative bg-gray-800/50 backdrop-blur-3xl shadow-2xl">
                        <svg className="absolute inset-0 w-full h-full -rotate-90">
                            <circle 
                                cx="50%" cy="50%" r="44%" 
                                stroke="currentColor" strokeWidth="16" fill="transparent"
                                className="text-white/5"
                            />
                            <motion.circle 
                                initial={{ strokeDasharray: "0 1000" }}
                                animate={{ strokeDasharray: `${((result?.score || 0) / 100) * 880} 1000` }}
                                transition={{ duration: 2, ease: "easeOut" }}
                                cx="50%" cy="50%" r="44%" 
                                stroke="currentColor" strokeWidth="16" fill="transparent"
                                className="text-blue-500"
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="text-center relative">
                            <motion.span 
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5, type: 'spring' }}
                                className="text-7xl md:text-8xl font-black leading-none block tracking-tighter"
                            >
                                {result?.score || 0}
                            </motion.span>
                            <span className="text-xs md:text-sm font-black text-blue-500 uppercase tracking-[0.3em]">Score %</span>
                        </div>
                    </div>
                </div>

                {/* Decorative background gradients */}
                <div className="absolute -top-24 -right-24 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full"></div>
            </div>

            {/* Detailed Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Matched Skills */}
                <div className="bg-white border-2 border-gray-50 rounded-[40px] p-10 shadow-sm">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 border border-emerald-100">
                            <ShieldCheck className="w-7 h-7" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-gray-900 tracking-tight">Matched Keywords</h3>
                            <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">Identified in your CV</p>
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                        {result?.resumeSkills?.length > 0 ? (
                            result.resumeSkills.map((skill: string, i: number) => (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    key={i}
                                    className="px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-700 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-all cursor-default"
                                >
                                    {skill}
                                </motion.div>
                            ))
                        ) : (
                            <div className="w-full py-12 text-center text-gray-400 font-medium">No matching skills detected.</div>
                        )}
                    </div>
                </div>

                {/* Missing Skills */}
                <div className="bg-gray-50 rounded-[40px] p-10 border border-gray-100">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 border border-rose-100">
                            <AlertCircle className="w-7 h-7" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-gray-900 tracking-tight">{result?.analysisType === "Profile Strength" ? "Technical Presence" : "Missing Optimization"}</h3>
                            <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">{result?.analysisType === "Profile Strength" ? "Industry Skills Found" : "Required by Job Role"}</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {result?.missingSkills?.length > 0 ? (
                            result.missingSkills.map((skill: string, i: number) => (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    key={i}
                                    className="px-5 py-3 bg-white border border-rose-100 rounded-2xl font-bold text-rose-600/70 hover:bg-rose-600 hover:text-white transition-all cursor-default"
                                >
                                    {skill}
                                </motion.div>
                            ))
                        ) : (
                            <div className="w-full py-12 text-center text-emerald-600 font-bold flex items-center justify-center gap-2">
                                <CheckCircle2 className="w-5 h-5" /> All required skills found!
                            </div>
                        )}
                    </div>

                    <div className="mt-8 p-6 bg-white rounded-3xl border border-gray-100">
                        <p className="text-sm text-gray-500 font-medium leading-relaxed">
                            <Sparkles className="w-4 h-4 text-amber-500 inline mr-2" />
                            <b>AI Tip:</b> Incorporate the missing skills organically into your "Skills" section or work experience bullets to increase your match score.
                        </p>
                    </div>
                </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}