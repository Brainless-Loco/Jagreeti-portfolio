import React from 'react';
import { ExternalLink, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';

// Add the constitution PDF URL here.
const MAGAZINE_PDF_URL = 'https://firebasestorage.googleapis.com/v0/b/jagreeti-portfolio.firebasestorage.app/o/jagreeti_media%2Fextra%2Fmagazine2026.pdf?alt=media&token=f1e2b12f-6496-40ad-b90e-188c3cb1330c';

export const MagazinePage: React.FC = () => {
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
            {isBangla ? 'জাগৃতি ম্যাগাজিন' : 'JAGREETI Magazine 2026'}
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
            {isBangla ? 'জাগৃতি ম্যাগাজিন' : 'JAGREETI Magazine 2026'}
          </h1>
          <p className="max-w-2xl mx-auto text-slate-600 leading-relaxed">
            {isBangla
              ? 'জাগৃতির কার্যক্রম, প্রভাব এবং গল্পগুলো জানতে নিচের নথিটি দেখুন।'
              : 'Read the document below to learn about JAGREETI’s activities, impact, and stories.'}
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
          {MAGAZINE_PDF_URL ? (
            <iframe
              src={MAGAZINE_PDF_URL}
              title={isBangla ? 'জাগৃতির ম্যাগাজিন' : 'JAGREETI Magazine 2026'}
              className="w-full h-[min(95vh,820px)] bg-white"
            />
          ) : (
            <div className="flex min-h-96 items-center justify-center p-8 text-center text-slate-500">
              {isBangla
                ? 'ম্যাগাজিনের PDF লিঙ্ক এখানে যুক্ত করা হবে।'
                : 'The Magazine PDF link will be added here.'}
            </div>
          )}
        </div>

        {MAGAZINE_PDF_URL && (
          <div className="text-center">
            <a
              href={MAGAZINE_PDF_URL}
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
