import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Plus, Check } from 'lucide-react';

interface CategoryAutocompleteProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  onAddOption?: (newValue: string) => void;
  placeholder?: string;
  language?: 'en' | 'bn';
}

export const CategoryAutocomplete: React.FC<CategoryAutocompleteProps> = ({
  label,
  value,
  onChange,
  options,
  onAddOption,
  placeholder = 'Select or type new category...',
  language = 'en',
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>(value || '');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputText(value || '');
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const trimmed = inputText.trim();
  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(trimmed.toLowerCase())
  );
  const exactMatch = options.find(
    (opt) => opt.toLowerCase() === trimmed.toLowerCase()
  );

  const handleSelectOption = (opt: string) => {
    setInputText(opt);
    onChange(opt);
    setOpen(false);
  };

  const handleAddNew = () => {
    if (!trimmed) return;
    if (exactMatch) {
      handleSelectOption(exactMatch);
      return;
    }
    if (onAddOption) {
      onAddOption(trimmed);
    }
    onChange(trimmed);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <label className="block font-bold text-slate-700 mb-1 text-xs">{label}</label>
      <div className="relative">
        <input
          type="text"
          value={inputText}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            const val = e.target.value;
            setInputText(val);
            onChange(val);
            setOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && trimmed) {
              e.preventDefault();
              handleAddNew();
            }
          }}
          placeholder={placeholder}
          className="w-full pl-3 pr-8 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1e77bd]"
        />
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {open && (
        <div className="absolute z-40 left-0 right-0 mt-1 bg-white rounded-xl border border-slate-200 shadow-xl max-h-52 overflow-y-auto py-1 text-xs">
          {filteredOptions.map((opt) => {
            const isSelected = opt.toLowerCase() === value?.toLowerCase();
            return (
              <button
                key={opt}
                type="button"
                onClick={() => handleSelectOption(opt)}
                className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-100 transition cursor-pointer ${
                  isSelected ? 'bg-[#bad3e4]/25 font-bold text-[#04345c]' : 'text-slate-700'
                }`}
              >
                <span>{opt}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#10564f]" />}
              </button>
            );
          })}

          {trimmed && !exactMatch && (
            <button
              type="button"
              onClick={handleAddNew}
              className="w-full px-3 py-2 text-left flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border-t border-slate-100 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>
                {language === 'bn'
                  ? `নতুন ক্যাটাগরি যোগ করুন: "${trimmed}"`
                  : `Add new category: "${trimmed}"`}
              </span>
            </button>
          )}

          {filteredOptions.length === 0 && !trimmed && (
            <div className="px-3 py-2 text-slate-400">
              {language === 'bn' ? 'ক্যাটাগরি লিখুন...' : 'Type a category name...'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
