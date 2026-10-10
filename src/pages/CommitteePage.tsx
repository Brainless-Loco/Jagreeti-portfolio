import React, { useState, useMemo } from 'react';
import {
  Users,
  Award,
  Search,
  Phone,
  Mail,
  ShieldCheck,
  X,
  Tag,
  Layers,
  ListOrdered,
  Hash,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CommitteeMember } from '../types';

export const CommitteePage: React.FC = () => {
  const { language, committee, committeeGroups } = useApp();

  // Default to unified single list as requested, with option to view by optional groups
  const [viewMode, setViewMode] = useState<'single' | 'grouped'>('single');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMember, setSelectedMember] = useState<CommitteeMember | null>(null);

  // Collect all unique tags across committee members
  const allMemberTags = useMemo(() => {
    const tagSet = new Set<string>();
    committee.forEach((m) => {
      (m.tags || []).forEach((t) => tagSet.add(t));
    });
    return Array.from(tagSet);
  }, [committee]);

  const filteredMembers = useMemo(() => {
    return committee.filter((member) => {
      const memberTags = member.tags || [];
      const matchesTag = selectedTag === 'all' || memberTags.includes(selectedTag);
      const matchesGroup =
        selectedGroupFilter === 'all' || member.groupId === selectedGroupFilter;
      const matchesSearch =
        !searchQuery.trim() ||
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.nameBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.roleBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        memberTags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesTag && matchesGroup && matchesSearch;
    });
  }, [committee, selectedTag, selectedGroupFilter, searchQuery]);

  const getGroupTitle = (groupId?: string) => {
    if (!groupId) return null;
    const g = committeeGroups.find((grp) => grp.id === groupId);
    if (!g) return null;
    return language === 'bn' ? g.nameBn : g.name;
  };

  const renderMemberCard = (member: CommitteeMember, idx: number) => {
    const groupTitle = getGroupTitle(member.groupId);
    return (
      <div
        key={member.id}
        onClick={() => setSelectedMember(member)}
        className="group cursor-pointer rounded-3xl bg-white border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
      >
        <div>
          <div className="relative h-64 overflow-hidden bg-slate-100">
            <img
              src={member.image}
              alt={language === 'bn' ? member.nameBn : member.name}
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />

            {/* Top Badges: Priority & Optional Group */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-0.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#04345c]/90 text-white backdrop-blur-xs shadow-xs">
                <Hash className="w-3 h-3 text-[#bad3e4]" />
                {member.priority ?? idx + 1}
              </span>
              {groupTitle && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 text-[#04345c] backdrop-blur-xs shadow-xs truncate max-w-[160px]">
                  {groupTitle}
                </span>
              )}
            </div>

            <div className="absolute bottom-3 left-4 right-4 text-white">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-1.5 bg-[#10564f] text-white shadow-xs">
                {language === 'bn' ? member.roleBn : member.role}
              </span>
              <h3 className="text-lg font-bold leading-snug">
                {language === 'bn' ? member.nameBn : member.name}
              </h3>
            </div>
          </div>

          <div className="p-5 space-y-3">
            {/* Member Tags */}
            {(member.tags || []).length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                {(member.tags || []).map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#bad3e4]/35 text-[#04345c] border border-[#bad3e4] text-[10px] font-bold"
                  >
                    <Tag className="w-2.5 h-2.5 text-[#1e77bd]" />
                    {t}
                  </span>
                ))}
              </div>
            )}

            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
              {member.bio[language]}
            </p>
          </div>
        </div>

        <div className="px-5 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="font-bold text-[#04345c] group-hover:underline">
            {language === 'bn' ? 'বিস্তারিত প্রোফাইল' : 'View Profile'}
          </span>

          <div className="flex items-center gap-1.5">
            {member.phone && (
              <a
                href={`tel:${member.phone}`}
                onClick={(e) => e.stopPropagation()}
                className="w-8 h-8 rounded-lg bg-white hover:bg-slate-100 flex items-center justify-center text-slate-600 transition border border-slate-200/80"
                title={member.phone}
              >
                <Phone className="w-3.5 h-3.5" />
              </a>
            )}
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                onClick={(e) => e.stopPropagation()}
                className="w-8 h-8 rounded-lg bg-white hover:bg-slate-100 flex items-center justify-center text-slate-600 transition border border-slate-200/80"
                title={member.email}
              >
                <Mail className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="py-12 min-h-screen bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#04345c]/10 text-[#04345c]">
              <Users className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'নেতৃত্ব ও সদস্য ডিরেক্টরি' : 'Leadership & Member Directory'}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              {language === 'bn'
                ? 'জাগৃতি কার্যনির্বাহী ও সদস্য তালিকা'
                : 'JAGREETI Leadership & Member Directory'}
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {language === 'bn'
                ? 'সকল সদস্যের একক অগ্রাধিকার তালিকা (Single Priority List), ভূমিকা ট্যাগ এবং ঐচ্ছিক গ্রুপ অনুযায়ী আমাদের নিবেদিতপ্রাণ টিম।'
                : 'Explore our unified priority-ordered member directory with role tags and optional committee groupings.'}
            </p>
          </div>

          {/* View Mode Toggle: Single List vs Optional Groups */}
          <div className="inline-flex p-1.5 rounded-2xl bg-white border border-slate-200 shadow-xs self-start">
            <button
              type="button"
              onClick={() => setViewMode('single')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                viewMode === 'single'
                  ? 'bg-[#04345c] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ListOrdered className="w-4 h-4" />
              <span>{language === 'bn' ? 'একক তালিকা (Single List)' : 'Single List (Priority)'}</span>
            </button>
            {committeeGroups.length > 0 && (
              <button
                type="button"
                onClick={() => setViewMode('grouped')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  viewMode === 'grouped'
                    ? 'bg-[#04345c] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>{language === 'bn' ? 'গ্রুপ ভিউ (Groups)' : 'By Optional Groups'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Filters Bar: Tags + Optional Group Filter + Search */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Tag Filter Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1 mr-1">
                <Tag className="w-3.5 h-3.5 text-[#10564f]" />
                {language === 'bn' ? 'ট্যাগ ফিল্টার:' : 'Filter by Tag:'}
              </span>
              <button
                onClick={() => setSelectedTag('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedTag === 'all'
                    ? 'bg-[#04345c] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {language === 'bn' ? 'সকল সদস্য' : 'All Members'} ({committee.length})
              </button>
              {allMemberTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    selectedTag === tag
                      ? 'bg-[#10564f] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Search & Optional Group Dropdown */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              {committeeGroups.length > 0 && (
                <select
                  value={selectedGroupFilter}
                  onChange={(e) => setSelectedGroupFilter(e.target.value)}
                  className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1e77bd]"
                >
                  <option value="all">
                    {language === 'bn' ? 'সকল গ্রুপ (All Groups)' : 'All Optional Groups'}
                  </option>
                  {committeeGroups.map((grp) => (
                    <option key={grp.id} value={grp.id}>
                      {language === 'bn' ? grp.nameBn : grp.name}
                    </option>
                  ))}
                </select>
              )}

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    language === 'bn'
                      ? 'নাম, পদবি বা ট্যাগ খুঁজুন...'
                      : 'Search name, role, or tag...'
                  }
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1e77bd]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* VIEW 1: SINGLE UNIFIED LIST (Sorted by Priority) */}
        {viewMode === 'single' ? (
          filteredMembers.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-2">
              <Users className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">
                {language === 'bn' ? 'কোনো সদস্য পাওয়া যায়নি' : 'No committee members found'}
              </h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredMembers.map((member, idx) => renderMemberCard(member, idx))}
            </div>
          )
        ) : (
          /* VIEW 2: GROUPED BY OPTIONAL GROUPS (Sorted by Group Priority, then Member Priority) */
          <div className="space-y-12">
            {committeeGroups.map((group) => {
              const groupMembers = filteredMembers.filter((m) => m.groupId === group.id);
              if (groupMembers.length === 0) return null;
              return (
                <div key={group.id} className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-[#04345c] text-white text-[10px] font-bold">
                          Group #{group.priority}
                        </span>
                        <h2 className="text-xl font-extrabold text-slate-900">
                          {language === 'bn' ? group.nameBn : group.name}
                        </h2>
                      </div>
                      {(group.description || group.descriptionBn) && (
                        <p className="text-xs text-slate-500 mt-1">
                          {language === 'bn' ? group.descriptionBn : group.description}
                        </p>
                      )}
                    </div>
                    <span className="text-xs font-bold text-[#10564f]">
                      {groupMembers.length} {language === 'bn' ? 'জন সদস্য' : 'Members'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {groupMembers.map((m, i) => renderMemberCard(m, i))}
                  </div>
                </div>
              );
            })}

            {/* Ungrouped Members */}
            {filteredMembers.some((m) => !m.groupId) && (
              <div className="space-y-5">
                <div className="pb-3 border-b border-slate-200">
                  <h2 className="text-xl font-extrabold text-slate-900">
                    {language === 'bn' ? 'সাধারণ সদস্যবৃন্দ' : 'General Members'}
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredMembers
                    .filter((m) => !m.groupId)
                    .map((m, i) => renderMemberCard(m, i))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Governance Charter Note */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4 max-w-2xl">
            <div className="w-12 h-12 rounded-2xl bg-[#04345c]/10 flex items-center justify-center shrink-0 mt-1">
              <ShieldCheck className="w-6 h-6 text-[#04345c]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {language === 'bn'
                  ? 'গঠনতন্ত্র ও গণতান্ত্রিক জবাবদিহিতা'
                  : 'Constitutional Governance & Accountability'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                {language === 'bn'
                  ? 'জাগৃতির সকল সদস্য সম্পূর্ণ অবৈতনিক ও স্বেচ্ছাসেবী হিসেবে দায়িত্ব পালন করেন। সংগঠনের প্রতিটি আর্থিক লেনদেন বার্ষিক সাধারণ সভায় (AGM) নিরীক্ষিত হয়।'
                  : 'All JAGREETI members serve strictly on a voluntary, non-remunerated basis. All financial operations undergo annual audit review.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>{language === 'bn' ? '১০০% স্বেচ্ছাসেবী নেতৃত্ব' : '100% Voluntary Leadership'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Member Detail Modal */}
      {selectedMember && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="relative w-full max-w-lg rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-2xl space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedMember(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              <img
                src={selectedMember.image}
                alt={selectedMember.name}
                className="w-24 h-24 rounded-2xl object-cover ring-4 ring-slate-100"
                referrerPolicy="no-referrer"
              />
              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-2 flex-wrap">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#04345c] text-white">
                    {language === 'bn' ? selectedMember.roleBn : selectedMember.role}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                    Priority #{selectedMember.priority}
                  </span>
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900">
                  {language === 'bn' ? selectedMember.nameBn : selectedMember.name}
                </h3>
                {getGroupTitle(selectedMember.groupId) && (
                  <p className="text-xs font-semibold text-[#10564f] mt-1">
                    {getGroupTitle(selectedMember.groupId)}
                  </p>
                )}
              </div>
            </div>

            {/* Member Tags */}
            {(selectedMember.tags || []).length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                {(selectedMember.tags || []).map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-[#bad3e4]/35 text-[#04345c] border border-[#bad3e4] text-xs font-bold"
                  >
                    <Tag className="w-3 h-3 text-[#1e77bd]" />
                    {t}
                  </span>
                ))}
              </div>
            )}

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                {language === 'bn' ? 'সংক্ষিপ্ত পরিচিতি ও দায়িত্ব' : 'Biography & Responsibilities'}
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed">
                {selectedMember.bio[language]}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {selectedMember.phone && (
                <a
                  href={`tel:${selectedMember.phone}`}
                  className="p-3 rounded-xl bg-slate-100 flex items-center gap-2.5 text-slate-700 font-semibold hover:bg-slate-200 transition"
                >
                  <Phone className="w-4 h-4 text-[#04345c] shrink-0" />
                  <span>{selectedMember.phone}</span>
                </a>
              )}
              {selectedMember.email && (
                <a
                  href={`mailto:${selectedMember.email}`}
                  className="p-3 rounded-xl bg-slate-100 flex items-center gap-2.5 text-slate-700 font-semibold hover:bg-slate-200 transition truncate"
                >
                  <Mail className="w-4 h-4 text-[#04345c] shrink-0" />
                  <span className="truncate">{selectedMember.email}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
