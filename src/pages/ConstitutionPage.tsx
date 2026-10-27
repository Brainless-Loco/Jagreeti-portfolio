import React from 'react';
import { ExternalLink, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';

// Add the constitution PDF URL here.
const CONSTITUTION_PDF_URL = '';

export const ConstitutionPage: React.FC = () => {
  const { language, currentPalette } = useApp();
  const isBangla = language === 'bn';

  return (
    <div className="py-12 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold"
            style={{
              backgroundColor: `${currentPalette.primary}15`,
              color: currentPalette.primary,
            }}
          >
            <FileText className="w-4 h-4" />
            {isBangla ? 'জাগৃতির সংবিধান' : 'JAGREETI Constitution'}
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
            {isBangla ? 'সংগঠনের সংবিধান' : 'Our Constitution'}
          </h1>
          <p className="max-w-2xl mx-auto text-slate-600 leading-relaxed">
            {isBangla
              ? 'জাগৃতির উদ্দেশ্য, নীতিমালা ও পরিচালনার কাঠামো সম্পর্কে বিস্তারিত জানতে নিচের নথিটি দেখুন।'
              : 'Read the document below to learn about JAGREETI’s purpose, principles, and governing structure.'}
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
          {CONSTITUTION_PDF_URL ? (
            <iframe
              src={CONSTITUTION_PDF_URL}
              title={isBangla ? 'জাগৃতির সংবিধান' : 'JAGREETI Constitution'}
              className="w-full h-[min(75vh,820px)] bg-white"
            />
          ) : (
            <div className="flex min-h-96 items-center justify-center p-8 text-center text-slate-500">
              {isBangla
                ? 'সংবিধানের PDF লিঙ্ক এখানে যুক্ত করা হবে।'
                : 'The constitution PDF link will be added here.'}
            </div>
          )}
        </div>

        {CONSTITUTION_PDF_URL && (
          <div className="text-center">
            <a
              href={CONSTITUTION_PDF_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:opacity-90"
              style={{ backgroundColor: currentPalette.primary }}
            >
              <ExternalLink className="w-4 h-4" />
              {isBangla ? 'নতুন পেজে PDF খুলুন' : 'Open PDF in a new tab'}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
