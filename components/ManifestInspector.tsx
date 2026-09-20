'use client';

import React, { useState } from 'react';
import { Code2, Copy, Check, ChevronDown, ChevronRight } from 'lucide-react';
import { Language } from '@/lib/types';
import { getTranslation } from '@/lib/i18n';

interface ManifestInspectorProps {
  manifestJson: Record<string, any> | null;
  currentLang: Language;
}

export default function ManifestInspector({
  manifestJson,
  currentLang,
}: ManifestInspectorProps) {
  const t = getTranslation(currentLang);
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  if (!manifestJson) return null;

  const jsonString = JSON.stringify(manifestJson, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-left cursor-pointer group"
        >
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-white" />
          ) : (
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-white" />
          )}
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Code2 className="w-5 h-5 text-amber-400" />
              {t.jsonTitle}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {t.jsonSubtitle}
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Disalin!' : 'Salin JSON'}</span>
        </button>
      </div>

      {isExpanded && (
        <div className="relative bg-slate-950 border border-slate-800 rounded-xl p-4 overflow-x-auto max-h-96">
          <pre className="text-amber-300 font-mono text-xs whitespace-pre-wrap break-all leading-relaxed">
            {jsonString}
          </pre>
        </div>
      )}
    </div>
  );
}
