import React, { useState, useMemo } from 'react';
import {
  FolderKanban,
  MapPin,
  Calendar,
  Users,
  Wallet,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Hash,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProjectsPage: React.FC = () => {
  const { language, currentPalette, projects, setActivePage } = useApp();
  const [statusFilter, setStatusFilter] = useState<'all' | 'ongoing' | 'completed' | 'upcoming'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const dynamicCategories = useMemo(() => {
    const map = new Map<string, string>();
    projects.forEach((p) => {
      if (p.category) map.set(p.category, p.categoryBn || p.category);
    });
    return Array.from(map.entries()).map(([id, bn]) => ({ id, bn }));
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchStatus = statusFilter === 'all' || p.status === statusFilter;
      const matchCat =
        categoryFilter === 'all' || (p.category || '').toLowerCase() === categoryFilter.toLowerCase();
      return matchStatus && matchCat;
    });
  }, [projects, statusFilter, categoryFilter]);

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider"
              style={{
                backgroundColor: `${currentPalette.primary}15`,
                color: currentPalette.primary,
              }}
            >
              <FolderKanban className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'প্রকল্প ও মাঠপর্যায়ের কাজ' : 'Field Projects & Impact'}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              {language === 'bn'
                ? 'আমাদের চলমান ও সমাপ্ত প্রকল্পসমূহ'
                : 'Our Humanitarian Projects Across Bangladesh'}
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {language === 'bn'
                ? 'প্রতিটি প্রকল্পের বাজেট, উপকারভোগীর সংখ্যা এবং অগ্রগতির সম্পূর্ণ স্বচ্ছ বিবরণ এখানে উপস্থাপিত।'
                : 'Transparent breakdown of every field operation, budget allocation, and community beneficiaries.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setActivePage('donate')}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-white font-semibold text-sm shadow-lg hover:opacity-95 transition self-start cursor-pointer"
            style={{ backgroundColor: currentPalette.primary }}
          >
            <span>{language === 'bn' ? 'প্রকল্পে অনুদান দিন' : 'Fund a Project'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                categoryFilter === 'all'
                  ? 'bg-[#04345c] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {language === 'bn' ? 'সকল বিভাগ' : 'All Categories'}
            </button>
            {dynamicCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  categoryFilter.toLowerCase() === cat.id.toLowerCase()
                    ? 'bg-[#04345c] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {language === 'bn' ? cat.bn : cat.id}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            {(['all', 'ongoing', 'completed', 'upcoming'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition cursor-pointer ${
                  statusFilter === status
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {status === 'all'
                  ? language === 'bn'
                    ? 'সব'
                    : 'All'
                  : status === 'ongoing'
                  ? language === 'bn'
                    ? 'চলমান'
                    : 'Ongoing'
                  : status === 'completed'
                  ? language === 'bn'
                    ? 'সমাপ্ত'
                    : 'Completed'
                  : language === 'bn'
                  ? 'আসন্ন'
                  : 'Upcoming'}
              </button>
            ))}
          </div>
        </div>

        {/* Project Cards Grid (Sorted by Priority) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, idx) => (
            <div
              key={project.id}
              className="group rounded-3xl bg-white border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-56 overflow-hidden bg-slate-100">
                  <img
                    src={project.image}
                    alt={language === 'bn' ? project.titleBn : project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="inline-flex items-center gap-0.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#04345c]/90 text-white backdrop-blur-md">
                      <Hash className="w-3 h-3 text-[#bad3e4]" />
                      {project.priority ?? idx + 1}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900/80 text-white backdrop-blur-md">
                      {language === 'bn' ? project.categoryBn : project.category}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    {project.status === 'ongoing' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500 text-slate-950 shadow-sm">
                        <Clock className="w-3 h-3" />
                        {language === 'bn' ? 'চলমান' : 'Ongoing'}
                      </span>
                    )}
                    {project.status === 'completed' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-sm">
                        <CheckCircle2 className="w-3 h-3" />
                        {language === 'bn' ? 'সমাপ্ত' : 'Completed'}
                      </span>
                    )}
                    {project.status === 'upcoming' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-sky-500 text-white shadow-sm">
                        <Sparkles className="w-3 h-3" />
                        {language === 'bn' ? 'আসন্ন' : 'Upcoming'}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-bold text-slate-900 leading-snug">
                    {language === 'bn' ? project.titleBn : project.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {language === 'bn' ? project.descriptionBn : project.description}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">
                      {language === 'bn' ? project.locationBn : project.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">
                      {language === 'bn' ? project.dateBn : project.date}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate font-semibold text-slate-800">
                      {language === 'bn' ? project.beneficiariesBn : project.beneficiaries}
                    </span>
                  </div>
                  {project.budget && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <Wallet className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate font-mono font-bold text-slate-800">
                        {project.budget}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
