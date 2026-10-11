import React, { useState } from 'react';
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Search,
  ArrowUp,
  ArrowDown,
  Hash,
  FolderKanban,
  Tag,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { CommitteeMember, CommitteeGroup } from '../../../types';
import { MediaUploadField } from '../../../components/admin/MediaUploadField';
import { CategoryAutocomplete } from '../../../components/admin/CategoryAutocomplete';
import { TagInputAutocomplete } from '../../../components/admin/TagInputAutocomplete';

export const AdminCommitteeTab: React.FC = () => {
  const {
    language,
    committee,
    addCommitteeMember,
    updateCommitteeMember,
    deleteCommitteeMember,
    reorderCommitteeMember,
    committeeGroups,
    addCommitteeGroup,
    updateCommitteeGroup,
    deleteCommitteeGroup,
    reorderCommitteeGroup,
    customCategories,
    addCustomCategory,
    showToast,
  } = useApp();

  const [activeSubView, setActiveSubView] = useState<'members' | 'groups'>('members');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterTag, setFilterTag] = useState<string>('all');
  const [editingItem, setEditingItem] = useState<CommitteeMember | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  // Optional Group Modal State
  const [editingGroup, setEditingGroup] = useState<CommitteeGroup | null>(null);
  const [isCreatingGroup, setIsCreatingGroup] = useState<boolean>(false);
  const [groupForm, setGroupForm] = useState({
    name: '',
    nameBn: '',
    description: '',
    descriptionBn: '',
    priority: committeeGroups.length + 1,
  });

  const [formData, setFormData] = useState({
    name: '',
    nameBn: '',
    role: '',
    roleBn: '',
    priority: committee.length + 1,
    groupId: '',
    tags: ['Executive Council'] as string[],
    image: '',
    storagePath: '',
    term: '2025-2027',
    institution: '',
    phone: '',
    email: '',
    bioEn: '',
    bioBn: '',
  });

  const handleOpenCreate = () => {
    setFormData({
      name: '',
      nameBn: '',
      role: '',
      roleBn: '',
      priority: committee.length + 1,
      groupId: '',
      tags: ['Executive Council'],
      image:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
      storagePath: '',
      term: '2025-2027',
      institution: '',
      phone: '',
      email: '',
      bioEn: '',
      bioBn: '',
    });
    setIsCreating(true);
    setEditingItem(null);
  };

  const handleOpenEdit = (item: CommitteeMember) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      nameBn: item.nameBn,
      role: item.role,
      roleBn: item.roleBn,
      priority: item.priority ?? 1,
      groupId: item.groupId || '',
      tags: item.tags && item.tags.length > 0 ? item.tags : ['Executive Council'],
      image: item.image,
      storagePath: item.storagePath || '',
      term: item.term || '2025-2027',
      institution: item.institution || '',
      phone: item.phone || '',
      email: item.email || '',
      bioEn: item.bio?.en || '',
      bioBn: item.bio?.bn || '',
    });
    setIsCreating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nameBn && !formData.name) return;

    const payload: Omit<CommitteeMember, 'id'> = {
      name: formData.name || formData.nameBn,
      nameBn: formData.nameBn || formData.name,
      role: formData.role || formData.roleBn,
      roleBn: formData.roleBn || formData.role,
      priority: Number(formData.priority) || committee.length + 1,
      groupId: formData.groupId || '',
      tags: formData.tags.length > 0 ? formData.tags : ['Committee Member'],
      category: formData.tags[0]?.toLowerCase() || 'executive',
      image:
        formData.image ||
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
      storagePath: formData.storagePath || '',
      term: formData.term,
      institution: formData.institution,
      phone: formData.phone,
      email: formData.email,
      bio: {
        en: formData.bioEn || formData.bioBn,
        bn: formData.bioBn || formData.bioEn,
      },
    };

    if (editingItem) {
      updateCommitteeMember(editingItem.id, payload);
      showToast(
        language === 'bn'
          ? 'সদস্যের তথ্য সফলভাবে হালনাগাদ হয়েছে'
          : 'Member updated in Firestore collection',
        'success'
      );
      setEditingItem(null);
    } else if (isCreating) {
      addCommitteeMember(payload);
      showToast(
        language === 'bn'
          ? 'নতুন সদস্য সফলভাবে অন্তর্ভুক্ত হয়েছে'
          : 'New member saved to Firestore collection',
        'success'
      );
      setIsCreating(false);
    }
    if (formData.role) addCustomCategory('committeeRoles', formData.role);
    if (formData.roleBn) addCustomCategory('committeeRoles', formData.roleBn);
  };

  const handleDelete = (id: string, name: string) => {
    if (
      window.confirm(
        language === 'bn'
          ? `আপনি কি নিশ্চিত যে "${name}"-কে তালিকা থেকে মুছে ফেলতে চান?`
          : `Are you sure you want to remove ${name}?`
      )
    ) {
      deleteCommitteeMember(id);
      showToast(
        language === 'bn'
          ? 'সদস্য তালিকা থেকে অপসারিত হয়েছেন'
          : 'Member removed successfully',
        'info'
      );
    }
  };

  // Optional Group Handlers
  const handleOpenCreateGroup = () => {
    setGroupForm({
      name: '',
      nameBn: '',
      description: '',
      descriptionBn: '',
      priority: committeeGroups.length + 1,
    });
    setIsCreatingGroup(true);
    setEditingGroup(null);
  };

  const handleOpenEditGroup = (grp: CommitteeGroup) => {
    setEditingGroup(grp);
    setGroupForm({
      name: grp.name,
      nameBn: grp.nameBn,
      description: grp.description || '',
      descriptionBn: grp.descriptionBn || '',
      priority: grp.priority,
    });
    setIsCreatingGroup(false);
  };

  const handleGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupForm.name && !groupForm.nameBn) return;

    const payload = {
      name: groupForm.name || groupForm.nameBn,
      nameBn: groupForm.nameBn || groupForm.name,
      description: groupForm.description,
      descriptionBn: groupForm.descriptionBn,
      priority: Number(groupForm.priority) || committeeGroups.length + 1,
    };

    if (editingGroup) {
      updateCommitteeGroup(editingGroup.id, payload);
      showToast(
        language === 'bn' ? 'গ্রুপ হালনাগাদ করা হয়েছে' : 'Optional group updated',
        'success'
      );
      setEditingGroup(null);
    } else if (isCreatingGroup) {
      addCommitteeGroup(payload);
      showToast(
        language === 'bn' ? 'নতুন ঐচ্ছিক গ্রুপ তৈরি হয়েছে' : 'New optional group created',
        'success'
      );
      setIsCreatingGroup(false);
    }
  };

  // All unique tags used across members
  const allMemberTags = Array.from(
    new Set([
      ...(customCategories.committeeTags || []),
      ...committee.flatMap((m) => m.tags || []),
    ])
  );
  const allMemberRoles = Array.from(
    new Set([
      ...(customCategories.committeeRoles || []),
      ...committee.flatMap((member) => [member.role, member.roleBn].filter(Boolean)),
    ])
  );

  const filteredMembers = committee.filter((m) => {
    const matchesSearch =
      (m.nameBn || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.roleBn || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.role || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.tags || []).some((t) => (t || '').toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTag =
      filterTag === 'all' ||
      (m.tags || []).some((t) => t.toLowerCase() === filterTag.toLowerCase()) ||
      m.groupId === filterTag;
    return matchesSearch && matchesTag;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#04345c]" />
            <span>
              {language === 'bn'
                ? 'কমিটি ও নেতৃত্ব ডিরেক্টরি (একক তালিকা, ট্যাগ ও সিরিয়াল)'
                : 'Committee & Leadership Directory (Unified List, Tags & Priority)'}
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'bn'
              ? 'একক তালিকায় সকল সদস্যের প্রায়োরিটি সিরিয়াল, একাধিক ট্যাগ এবং ঐচ্ছিক গ্রুপ (Optional Groups) পরিচালনা করুন।'
              : 'Manage a single serialized member directory with multi-tag support, Firebase photo uploads, and optional serialized groups.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Sub-view Switcher: Unified Members List vs Optional Groups */}
          <div className="inline-flex p-1 rounded-xl bg-slate-200/80 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveSubView('members')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
                activeSubView === 'members'
                  ? 'bg-white text-[#04345c] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>
                {language === 'bn'
                  ? `একক সদস্য তালিকা (${committee.length})`
                  : `Unified Members (${committee.length})`}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSubView('groups')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
                activeSubView === 'groups'
                  ? 'bg-white text-[#04345c] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FolderKanban className="w-3.5 h-3.5" />
              <span>
                {language === 'bn'
                  ? `ঐচ্ছিক গ্রুপসমূহ (${committeeGroups.length})`
                  : `Optional Groups (${committeeGroups.length})`}
              </span>
            </button>
          </div>

          {activeSubView === 'members' ? (
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#04345c] text-white text-xs font-bold hover:bg-[#04345c]/90 transition shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'bn' ? 'নতুন সদস্য যুক্ত করুন' : 'Add Member'}</span>
            </button>
          ) : (
            <button
              onClick={handleOpenCreateGroup}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#10564f] text-white text-xs font-bold hover:bg-[#10564f]/90 transition shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'bn' ? 'ঐচ্ছিক গ্রুপ তৈরি করুন' : 'Create Optional Group'}</span>
            </button>
          )}
        </div>
      </div>

      {activeSubView === 'members' ? (
        <>
          {/* Filter and Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={
                  language === 'bn'
                    ? 'নাম, পদবী বা ট্যাগ দিয়ে খুঁজুন...'
                    : 'Search by name, role, or tag...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 bg-white text-xs focus:ring-2 focus:ring-[#1e77bd] focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setFilterTag('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  filterTag === 'all'
                    ? 'bg-[#04345c] text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {language === 'bn' ? 'সকল সদস্য (All)' : 'All Members'}
              </button>
              {allMemberTags.slice(0, 6).map((tag) => (
                <button
                  key={tag}
                  onClick={() => setFilterTag(tag)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    filterTag === tag
                      ? 'bg-[#04345c] text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Unified Serialized Member Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMembers.map((member, idx) => {
              const assignedGroup = committeeGroups.find((g) => g.id === member.groupId);
              return (
                <div
                  key={member.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-3 min-w-0">
                        <img
                          src={member.image}
                          alt={member.nameBn || member.name}
                          referrerPolicy="no-referrer"
                          className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-xs shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-0.5">
                            <span className="font-bold text-[#04345c]">
                              #{member.priority ?? idx + 1}
                            </span>
                            {assignedGroup && (
                              <>
                                <span>·</span>
                                <span className="truncate text-[#10564f] font-medium">
                                  {language === 'bn' ? assignedGroup.nameBn : assignedGroup.name}
                                </span>
                              </>
                            )}
                          </div>
                          <h3 className="text-sm font-bold text-slate-900 truncate">
                            {language === 'bn' ? member.nameBn : member.name}
                          </h3>
                          <p className="text-xs font-semibold text-[#1e77bd] truncate">
                            {language === 'bn' ? member.roleBn : member.role}
                          </p>
                        </div>
                      </div>

                      {/* Priority Serialization Buttons */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => reorderCommitteeMember(member.id, 'up')}
                          className="p-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition cursor-pointer"
                          title="Move Up Priority"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => reorderCommitteeMember(member.id, 'down')}
                          className="p-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition cursor-pointer"
                          title="Move Down Priority"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Member Tags */}
                    {member.tags && member.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-600">
                        <Tag className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{member.tags.join(' · ')}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-xs">
                    <div className="text-[11px] text-slate-400 truncate">
                      {member.institution || member.phone || member.term}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleOpenEdit(member)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition cursor-pointer"
                        title="Edit"
                      >
                        <Edit className="w-3.5 h-3.5 text-[#1e77bd]" />
                      </button>
                      <button
                        onClick={() => handleDelete(member.id, member.nameBn || member.name)}
                        className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-700 transition cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* Sub-View 2: Optional Committee Groups & Group Priority Serialization */
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#bad3e4]/20 border border-[#bad3e4]/60 text-xs text-[#04345c]">
            <strong>
              {language === 'bn' ? 'ঐচ্ছিক গ্রুপ (Optional Groups):' : 'Optional Groups:'}
            </strong>{' '}
            {language === 'bn'
              ? 'কমিটির সদস্যরা মূলত একক সিরিয়াল তালিকায় প্রদর্শিত হন। তবে আপনি চাইলে ঐচ্ছিক গ্রুপ তৈরি ও সিরিয়াল করতে পারেন এবং সদস্যদের সেই গ্রুপে যুক্ত করতে পারেন।'
              : 'Committee members appear in a single unified list by default, with tags. You can optionally create groups here, serialize their priority order, and assign members to them.'}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {committeeGroups.map((grp, idx) => {
              const memberCount = committee.filter((m) => m.groupId === grp.id).length;
              return (
                <div
                  key={grp.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between gap-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-bold text-[#10564f]">
                        Priority #{grp.priority ?? idx + 1} · {memberCount}{' '}
                        {language === 'bn' ? 'জন সদস্য' : 'Members'}
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-0.5">
                        {language === 'bn' ? grp.nameBn : grp.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        {language === 'bn' ? grp.descriptionBn : grp.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => reorderCommitteeGroup(grp.id, 'up')}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-30 text-slate-600 cursor-pointer"
                        title="Move Group Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === committeeGroups.length - 1}
                        onClick={() => reorderCommitteeGroup(grp.id, 'down')}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-30 text-slate-600 cursor-pointer"
                        title="Move Group Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 text-xs">
                    <button
                      onClick={() => handleOpenEditGroup(grp)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 font-semibold text-slate-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5 text-[#1e77bd]" />
                      <span>{language === 'bn' ? 'সম্পাদনা' : 'Edit Group'}</span>
                    </button>
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            language === 'bn'
                              ? 'গ্রুপটি মুছে ফেললে সদস্যরা একক তালিকায় অক্ষত থাকবেন। নিশ্চিত?'
                              : 'Delete this optional group? Members will remain in the unified list.'
                          )
                        ) {
                          deleteCommitteeGroup(grp.id);
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 font-semibold text-rose-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                      <span>{language === 'bn' ? 'মুছুন' : 'Delete'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Member Edit / Create Modal */}
      {(editingItem || isCreating) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-2xl max-h-[92vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
            <div className="p-5 bg-[#04345c] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#bad3e4]" />
                <h3 className="font-bold text-base">
                  {editingItem
                    ? language === 'bn'
                      ? 'সদস্যের তথ্য সম্পাদনা'
                      : 'Edit Committee Member'
                    : language === 'bn'
                    ? 'নতুন সদস্য যুক্ত করুন'
                    : 'Add New Committee Member'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setEditingItem(null);
                  setIsCreating(false);
                }}
                className="text-white/70 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Row 1: Priority Serialization, Optional Group, Term */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Hash className="w-3.5 h-3.5 text-[#10564f]" />
                    <span>
                      {language === 'bn' ? 'সিরিয়াল / প্রায়োরিটি (Priority)' : 'Priority Order (#)'}
                    </span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 font-bold focus:bg-white focus:ring-2 focus:ring-[#1e77bd]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {language === 'bn' ? 'ঐচ্ছিক গ্রুপ (Optional Group)' : 'Optional Group'}
                  </label>
                  <select
                    value={formData.groupId}
                    onChange={(e) => setFormData({ ...formData, groupId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 font-semibold focus:bg-white focus:ring-2 focus:ring-[#1e77bd]"
                  >
                    <option value="">
                      {language === 'bn'
                        ? 'গ্রুপ ছাড়া (শুধু একক তালিকা)'
                        : 'None (Unified Single List Only)'}
                    </option>
                    {committeeGroups.map((grp) => (
                      <option key={grp.id} value={grp.id}>
                        #{grp.priority} — {language === 'bn' ? grp.nameBn : grp.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {language === 'bn' ? 'মেয়াদ (Term)' : 'Session Term'}
                  </label>
                  <input
                    type="text"
                    value={formData.term}
                    onChange={(e) => setFormData({ ...formData, term: e.target.value })}
                    placeholder="2025-2027"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1e77bd]"
                  />
                </div>
              </div>

              {/* Row 2: Multi-Tag Input with Autocomplete */}
              <TagInputAutocomplete
                label={
                  language === 'bn'
                    ? 'সদস্যের ট্যাগসমূহ (একাধিক ট্যাগ যোগ বা নতুন তৈরি করুন)'
                    : 'Member Tags (Select existing or type to add new tags)'
                }
                tags={formData.tags}
                onChange={(newTags) => setFormData({ ...formData, tags: newTags })}
                availableTags={allMemberTags}
                onRegisterNewTag={(newTag) => addCustomCategory('committeeTags', newTag)}
                language={language}
              />

              {/* Row 3: Names */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {language === 'bn' ? 'নাম (বাংলা) *' : 'Full Name (Bangla) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nameBn}
                    onChange={(e) => setFormData({ ...formData, nameBn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1e77bd]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {language === 'bn' ? 'নাম (English) *' : 'Full Name (English) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1e77bd]"
                  />
                </div>
              </div>

              {/* Row 4: Designations / Roles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <CategoryAutocomplete
                  label={language === 'bn' ? 'পদবী (বাংলা) *' : 'Role / Designation (Bangla) *'}
                  value={formData.roleBn}
                  onChange={(value) => setFormData({ ...formData, roleBn: value })}
                  options={allMemberRoles}
                  onAddOption={(value) => addCustomCategory('committeeRoles', value)}
                  placeholder={language === 'bn' ? 'পদবী নির্বাচন বা নতুন লিখুন...' : 'Select or type Bangla role...'}
                  language={language}
                />

                <CategoryAutocomplete
                  label={language === 'bn' ? 'পদবী (English) *' : 'Role / Designation (English) *'}
                  value={formData.role}
                  onChange={(value) => setFormData({ ...formData, role: value })}
                  options={allMemberRoles}
                  onAddOption={(value) => addCustomCategory('committeeRoles', value)}
                  placeholder={language === 'bn' ? 'পদবী নির্বাচন বা নতুন লিখুন...' : 'Select or type English role...'}
                  language={language}
                />
              </div>

              {/* Dual Photo Upload (Firebase Storage) or Direct URL */}
              <MediaUploadField
                label={
                  language === 'bn'
                    ? 'সদস্যের ছবি (Firebase Storage আপলোড অথবা লিঙ্ক)'
                    : 'Member Portrait Photo (Upload to Firebase Storage or Link)'
                }
                value={formData.image}
                storagePath={formData.storagePath}
                storageFolder="committee"
                mediaType="image"
                required
                language={language}
                onChange={(url, path) =>
                  setFormData({ ...formData, image: url, storagePath: path || '' })
                }
              />

              {/* Institution, Phone, Email */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {language === 'bn' ? 'প্রতিষ্ঠান / কর্মস্থল' : 'Institution / Workplace'}
                  </label>
                  <input
                    type="text"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {language === 'bn' ? 'ফোন নম্বর' : 'Phone Number'}
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {language === 'bn' ? 'ইমেইল' : 'Email Address'}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {language === 'bn' ? 'সংক্ষিপ্ত পরিচিতি (বাংলা)' : 'Short Bio (Bangla)'}
                  </label>
                  <textarea
                    rows={2}
                    value={formData.bioBn}
                    onChange={(e) => setFormData({ ...formData, bioBn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {language === 'bn' ? 'সংক্ষিপ্ত পরিচিতি (English)' : 'Short Bio (English)'}
                  </label>
                  <textarea
                    rows={2}
                    value={formData.bioEn}
                    onChange={(e) => setFormData({ ...formData, bioEn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setEditingItem(null);
                    setIsCreating(false);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
                >
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#04345c] text-white font-bold hover:bg-[#04345c]/90 shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{language === 'bn' ? 'সংরক্ষণ করুন' : 'Save Member'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Optional Group Create / Edit Modal */}
      {(editingGroup || isCreatingGroup) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 bg-[#10564f] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderKanban className="w-5 h-5 text-[#bad3e4]" />
                <h3 className="font-bold text-base">
                  {editingGroup
                    ? language === 'bn'
                      ? 'ঐচ্ছিক গ্রুপ সম্পাদনা'
                      : 'Edit Optional Group'
                    : language === 'bn'
                    ? 'নতুন ঐচ্ছিক গ্রুপ তৈরি করুন'
                    : 'Create Optional Committee Group'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setEditingGroup(null);
                  setIsCreatingGroup(false);
                }}
                className="text-white/70 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGroupSubmit} className="p-6 space-y-3.5 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {language === 'bn' ? 'গ্রুপের নাম (বাংলা) *' : 'Group Name (Bangla) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={groupForm.nameBn}
                    onChange={(e) => setGroupForm({ ...groupForm, nameBn: e.target.value })}
                    placeholder="যেমন: কেন্দ্রীয় কার্যনির্বাহী পরিষদ"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {language === 'bn' ? 'গ্রুপের নাম (English) *' : 'Group Name (English) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={groupForm.name}
                    onChange={(e) => setGroupForm({ ...groupForm, name: e.target.value })}
                    placeholder="e.g. Central Executive Council"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {language === 'bn' ? 'গ্রুপ প্রায়োরিটি সিরিয়াল (#)' : 'Group Priority Order (#)'}
                </label>
                <input
                  type="number"
                  min={1}
                  value={groupForm.priority}
                  onChange={(e) =>
                    setGroupForm({ ...groupForm, priority: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 font-bold focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {language === 'bn' ? 'সংক্ষিপ্ত বিবরণ (বাংলা)' : 'Description (Bangla)'}
                </label>
                <input
                  type="text"
                  value={groupForm.descriptionBn}
                  onChange={(e) =>
                    setGroupForm({ ...groupForm, descriptionBn: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {language === 'bn' ? 'সংক্ষিপ্ত বিবরণ (English)' : 'Description (English)'}
                </label>
                <input
                  type="text"
                  value={groupForm.description}
                  onChange={(e) => setGroupForm({ ...groupForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setEditingGroup(null);
                    setIsCreatingGroup(false);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold cursor-pointer"
                >
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#10564f] text-white font-bold hover:bg-[#10564f]/90 cursor-pointer"
                >
                  {language === 'bn' ? 'গ্রুপ সংরক্ষণ করুন' : 'Save Group'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
