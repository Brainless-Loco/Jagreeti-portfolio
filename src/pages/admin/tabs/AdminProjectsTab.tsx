import React, { useState } from 'react';
import {
  FolderKanban,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Calendar,
  MapPin,
  Users,
  ArrowUp,
  ArrowDown,
  Hash,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { ProjectItem } from '../../../types';
import { MediaUploadField } from '../../../components/admin/MediaUploadField';
import { CategoryAutocomplete } from '../../../components/admin/CategoryAutocomplete';

export const AdminProjectsTab: React.FC = () => {
  const {
    language,
    projects,
    addProject,
    updateProject,
    deleteProject,
    reorderProject,
    customCategories,
    addCustomCategory,
    showToast,
  } = useApp();

  const [editingItem, setEditingItem] = useState<ProjectItem | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const [formData, setFormData] = useState<Partial<ProjectItem>>({
    title: '',
    titleBn: '',
    category: 'Relief',
    categoryBn: 'ত্রাণ ও পুনর্বাসন',
    description: '',
    descriptionBn: '',
    date: 'March 2025',
    dateBn: 'মার্চ ২০২৫',
    location: 'Cox’s Bazar',
    locationBn: 'কক্সবাজার',
    beneficiaries: '500+ Families',
    beneficiariesBn: '৫০০+ পরিবার',
    budget: '৳ 2,50,000',
    status: 'ongoing',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80',
    storagePath: '',
    priority: projects.length + 1,
  });

  const handleOpenCreate = () => {
    setFormData({
      title: '',
      titleBn: '',
      category: 'Relief',
      categoryBn: 'ত্রাণ ও পুনর্বাসন',
      description: '',
      descriptionBn: '',
      date: 'March 2025',
      dateBn: 'মার্চ ২০২৫',
      location: 'Cox’s Bazar',
      locationBn: 'কক্সবাজার',
      beneficiaries: '500+ Families',
      beneficiariesBn: '৫০০+ পরিবার',
      budget: '৳ 2,50,000',
      status: 'ongoing',
      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80',
      storagePath: '',
      priority: projects.length + 1,
    });
    setIsCreating(true);
    setEditingItem(null);
  };

  const handleOpenEdit = (item: ProjectItem) => {
    setEditingItem(item);
    setFormData({
      ...item,
      priority: item.priority || 1,
    });
    setIsCreating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title && !formData.titleBn) return;

    if (formData.category) {
      addCustomCategory('projectCategories', formData.category);
    }

    const payload = {
      title: formData.title || formData.titleBn || 'New Project',
      titleBn: formData.titleBn || formData.title || 'নতুন প্রকল্প',
      category: formData.category || 'Relief',
      categoryBn: formData.categoryBn || formData.category || 'ত্রাণ',
      description: formData.description || '',
      descriptionBn: formData.descriptionBn || '',
      date: formData.date || '2025',
      dateBn: formData.dateBn || '২০২৫',
      location: formData.location || 'Bangladesh',
      locationBn: formData.locationBn || 'বাংলাদেশ',
      beneficiaries: formData.beneficiaries || '500+',
      beneficiariesBn: formData.beneficiariesBn || '৫০০+',
      budget: formData.budget || '৳ 1,00,000',
      status: (formData.status as 'completed' | 'ongoing' | 'upcoming') || 'ongoing',
      image:
        formData.image ||
        'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80',
      storagePath: formData.storagePath,
      priority: Number(formData.priority) || projects.length + 1,
    };

    if (editingItem) {
      updateProject(editingItem.id, payload);
      showToast(
        language === 'bn' ? 'প্রকল্পের তথ্য সফলভাবে হালনাগাদ হয়েছে' : 'Project updated successfully',
        'success'
      );
      setEditingItem(null);
    } else if (isCreating) {
      addProject(payload);
      showToast(
        language === 'bn' ? 'নতুন প্রকল্প যুক্ত করা হয়েছে' : 'New project created successfully',
        'success'
      );
      setIsCreating(false);
    }
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(language === 'bn' ? `আপনি কি নিশ্চিত যে "${title}" প্রকল্পটি মুছে ফেলতে চান?` : `Are you sure you want to delete ${title}?`)) {
      deleteProject(id);
      showToast(
        language === 'bn' ? 'প্রকল্পটি মুছে ফেলা হয়েছে' : 'Project deleted',
        'info'
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-amber-600" />
              <span>{language === 'bn' ? 'প্রকল্প ও মাঠপর্যায়ের কার্যক্রম' : 'Projects & Field Operations'}</span>
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 text-slate-600 border border-slate-200">
              projects
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'bn'
              ? 'প্রকল্পের ছবি আপলোড বা লিঙ্ক, নতুন ক্যাটাগরি যোগ এবং অগ্রাধিকার ক্রম (Priority) নিয়ন্ত্রণ করুন।'
              : 'Upload project photos or paste URLs, auto-complete categories, and serialize project display order.'}
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#04345c] text-white text-xs font-bold hover:bg-[#04345c]/90 transition shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'bn' ? 'নতুন প্রকল্প যোগ করুন' : 'Create Project'}</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {projects.map((project, idx) => (
          <div
            key={project.id}
            className="rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition overflow-hidden flex flex-col justify-between"
          >
            <div>
              {/* Priority Bar */}
              <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#04345c]/10 text-[#04345c] text-[10px] font-bold">
                  <Hash className="w-3 h-3" />
                  Order #{project.priority ?? idx + 1}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => reorderProject(project.id, 'up')}
                    className="p-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-30 text-slate-700 transition cursor-pointer"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === projects.length - 1}
                    onClick={() => reorderProject(project.id, 'down')}
                    className="p-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-30 text-slate-700 transition cursor-pointer"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="relative h-44 bg-slate-100 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      project.status === 'completed'
                        ? 'bg-emerald-600 text-white'
                        : project.status === 'ongoing'
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-sky-600 text-white'
                    }`}
                  >
                    {project.status}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/60 text-white backdrop-blur-xs">
                    {language === 'bn' ? project.categoryBn || project.category : project.category}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-2.5">
                <h3 className="text-base font-bold text-slate-900">
                  {language === 'bn' ? project.titleBn || project.title : project.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2">
                  {language === 'bn' ? project.descriptionBn || project.description : project.description}
                </p>

                <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] text-slate-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{language === 'bn' ? project.dateBn : project.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{language === 'bn' ? project.locationBn : project.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{language === 'bn' ? project.beneficiariesBn : project.beneficiaries}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-bold text-[#04345c]">
                {project.budget || '৳ N/A'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(project)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-semibold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5 text-[#1e77bd]" />
                  <span>{language === 'bn' ? 'সম্পাদনা' : 'Edit'}</span>
                </button>
                <button
                  onClick={() => handleDelete(project.id, project.title)}
                  className="px-3 py-1.5 rounded-lg border border-rose-200 bg-white hover:bg-rose-50 text-rose-700 font-semibold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                  <span>{language === 'bn' ? 'মুছুন' : 'Delete'}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Modal */}
      {(editingItem || isCreating) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
            <div className="p-5 bg-[#04345c] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderKanban className="w-5 h-5 text-[#bad3e4]" />
                <h3 className="font-bold text-base">
                  {editingItem
                    ? (language === 'bn' ? 'প্রকল্প সম্পাদনা' : 'Edit Project')
                    : (language === 'bn' ? 'নতুন প্রকল্প তৈরি করুন' : 'Create New Project')}
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
              <MediaUploadField
                label={language === 'bn' ? 'প্রকল্পের কভার ছবি (Upload বা Link)' : 'Project Cover Photo (Upload or URL Link)'}
                value={formData.image || ''}
                onChange={(url, meta) =>
                  setFormData({
                    ...formData,
                    image: url,
                    storagePath: meta?.storagePath || formData.storagePath,
                  })
                }
                folder="projects"
                accept="image/*"
                mediaKind="image"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">প্রকল্পের শিরোনাম (বাংলা) *</label>
                  <input
                    type="text"
                    required
                    value={formData.titleBn}
                    onChange={(e) => setFormData({ ...formData, titleBn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1e77bd]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">প্রকল্পের শিরোনাম (English) *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1e77bd]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">অবস্থা (Status)</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 font-semibold focus:bg-white focus:ring-2 focus:ring-[#1e77bd]"
                  >
                    <option value="ongoing">Ongoing (চলমান)</option>
                    <option value="completed">Completed (সম্পন্ন)</option>
                    <option value="upcoming">Upcoming (আসন্ন)</option>
                  </select>
                </div>

                <CategoryAutocomplete
                  label={language === 'bn' ? 'ক্যাটাগরি (English / Auto-complete)' : 'Category (Auto-complete / Add New)'}
                  value={formData.category || ''}
                  onChange={(val) => setFormData({ ...formData, category: val })}
                  options={customCategories.projectCategories}
                  onAddNewOption={(newCat) => addCustomCategory('projectCategories', newCat)}
                  placeholder="Select or add category..."
                />

                <div>
                  <label className="block font-bold text-slate-700 mb-1">ক্যাটাগরি (বাংলা)</label>
                  <input
                    type="text"
                    value={formData.categoryBn}
                    onChange={(e) => setFormData({ ...formData, categoryBn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1e77bd]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">বিস্তারিত বিবরণ (বাংলা)</label>
                <textarea
                  rows={2}
                  required
                  value={formData.descriptionBn}
                  onChange={(e) => setFormData({ ...formData, descriptionBn: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1e77bd]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">বিস্তারিত বিবরণ (English)</label>
                <textarea
                  rows={2}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1e77bd]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">স্থান (বাংলা)</label>
                  <input
                    type="text"
                    value={formData.locationBn}
                    onChange={(e) => setFormData({ ...formData, locationBn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">স্থান (English)</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">প্রাক্কলিত বাজেট</label>
                  <input
                    type="text"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">উপকারভোগী (বাংলা)</label>
                  <input
                    type="text"
                    value={formData.beneficiariesBn}
                    onChange={(e) => setFormData({ ...formData, beneficiariesBn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">তারিখ / সময়কাল (বাংলা)</label>
                  <input
                    type="text"
                    value={formData.dateBn}
                    onChange={(e) => setFormData({ ...formData, dateBn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {language === 'bn' ? 'ক্রম / সিরিয়াল (Priority)' : 'Priority Order'}
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.priority || 1}
                    onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) })}
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
                  <span>{language === 'bn' ? 'প্রকল্প সংরক্ষণ' : 'Save Project'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
