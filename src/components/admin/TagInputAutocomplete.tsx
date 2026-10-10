import React, { useState, useRef, useEffect } from 'react';
import { Plus, X, Tag } from 'lucide-react';

interface TagInputAutocompleteProps {
  label: string;
  tags: string[];
  onChange: (newTags: string[]) => void;
  availableTags: string[];
  onRegisterNewTag?: (tag: string) => void;
  language?: 'en' | 'bn';
}

export const TagInputAutocomplete: React.FC<TagInputAutocompleteProps> = ({
  label,
  tags,
  onChange,
  availableTags,
  onRegisterNewTag,
  language = 'en',
}) => {
  const [inputVal, setInputVal] = useState<string>('');
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const trimmed = inputVal.trim();

  const handleAddTag = (tagToAdd: string) => {
    const clean = tagToAdd.trim();
    if (!clean) return;
    const alreadyInMember = tags.some((t) => t.toLowerCase() === clean.toLowerCase());
    if (!alreadyInMember) {
      onChange([...tags, clean]);
    }
    if (onRegisterNewTag) {
      onRegisterNewTag(clean);
    }
    setInputVal('');
    setDropdownOpen(false);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onChange(tags.filter((t) => t !== tagToRemove));
  };

  const suggestions = availableTags.filter(
    (t) =>
      !tags.some((selected) => selected.toLowerCase() === t.toLowerCase()) &&
      t.toLowerCase().includes(trimmed.toLowerCase())
  );

  const exactExistsInSuggestions = availableTags.some(
    (t) => t.toLowerCase() === trimmed.toLowerCase()
  );

  return (
    <div ref={containerRef} className="relative space-y-1.5">
      <label className="block font-bold text-slate-700 text-xs flex items-center gap-1.5">
        <Tag className="w-3.5 h-3.5 text-[#10564f]" />
        <span>{label}</span>
      </label>

      <div className="p-2 rounded-xl border border-slate-300 bg-slate-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#1e77bd] flex flex-wrap items-center gap-1.5">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#04345c] text-white text-[11px] font-semibold"
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => handleRemoveTag(tag)}
              className="text-white/75 hover:text-white cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        <input
          type="text"
          value={inputVal}
          onFocus={() => setDropdownOpen(true)}
          onChange={(e) => {
            setInputVal(e.target.value);
            setDropdownOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && trimmed) {
              e.preventDefault();
              handleAddTag(trimmed);
            }
          }}
          placeholder={
            language === 'bn'
              ? 'ট্যাগ নির্বাচন করুন বা নতুন লিখুন...'
              : 'Select or type new member tag...'
          }
          className="flex-1 min-w-[140px] bg-transparent text-xs py-1 px-1.5 focus:outline-none"
        />
      </div>

      {/* Autocomplete Suggestions Dropdown */}
      {dropdownOpen && (suggestions.length > 0 || (trimmed && !exactExistsInSuggestions)) && (
        <div className="absolute z-40 left-0 right-0 mt-1 bg-white rounded-xl border border-slate-200 shadow-xl max-h-48 overflow-y-auto py-1 text-xs">
          {suggestions.map((sug) => (
            <button
              key={sug}
              type="button"
              onClick={() => handleAddTag(sug)}
              className="w-full px-3 py-2 text-left hover:bg-slate-100 text-slate-700 font-medium flex items-center justify-between cursor-pointer"
            >
              <span>{sug}</span>
              <span className="text-[10px] text-slate-400">
                {language === 'bn' ? 'যুক্ত করুন' : 'Select'}
              </span>
            </button>
          ))}

          {trimmed && !exactExistsInSuggestions && (
            <button
              type="button"
              onClick={() => handleAddTag(trimmed)}
              className="w-full px-3 py-2 text-left bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border-t border-slate-100 flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                {language === 'bn'
                  ? `নতুন ট্যাগ তৈরি ও যুক্ত করুন: "${trimmed}"`
                  : `Create & add new tag: "${trimmed}"`}
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
