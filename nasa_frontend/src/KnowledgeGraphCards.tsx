import React, { useEffect, useState } from 'react';
import { Calendar, Network, Sparkles, BookOpen, FileText, TrendingUp, BarChart3, CheckCircle, Clock, Beaker, User } from 'lucide-react';

interface PillInfo {
  id: number;
  article_id: number;
  study_subject: string;
  environment_type: string;
  duration: string;
  biological_focus: string;
  study_type: string;
  primary_finding: string;
  sample_info: string;
  intervention_treatment: string;
  statistical_evidence: boolean;
}

const KnowledgeGraphCards = ({ articleId }: { articleId: number }) => {
  const [pillInfo, setPillInfo] = useState<PillInfo | null>(null);
  useEffect(() => {
    if (articleId) {
      fetch(`http://127.0.0.1:8001/articles/${articleId}/pill_info`)
        .then(res => res.json())
        .then(data => setPillInfo(data))
        .catch(() => setPillInfo(null));
    }
  }, [articleId]);

  if (!pillInfo) {
    return (
      <div className="py-6 bg-gray-900 min-h-screen p-8">
        <h3 className="text-2xl font-bold text-blue-400 mb-6 flex items-center gap-2">
          <Network className="w-7 h-7" />
          Bilgi Grafiği
        </h3>
        <div className="text-gray-400">Bilgi grafiği verisi bulunamadı.</div>
      </div>
    );
  }

  return (
    <div className="py-6 bg-gray-900 min-h-screen p-8">
      <h3 className="text-2xl font-bold text-blue-400 mb-6 flex items-center gap-2">
        <Network className="w-7 h-7" />
        Knowledge Graph
      </h3>
      <div className="grid grid-cols-1 gap-6 mb-6">
        {/* Card 1: General Info */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-purple-500 hover:shadow-[0_0_20px_5px_rgba(168,85,247,0.5)] transition">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-white">General Information</h4>
            </div>
            <div className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-semibold text-gray-300">{pillInfo.duration}</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-emerald-900/20 border border-emerald-500/30 rounded-lg px-3 py-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-emerald-400 font-semibold">{pillInfo.statistical_evidence ? 'Statistical Evidence Present' : 'No Statistical Evidence'}</span>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-blue-400" />
                <p className="text-xs font-semibold text-gray-400">Study Type</p>
              </div>
              <p className="text-gray-200 text-sm">{pillInfo.study_type}</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4 text-blue-400" />
                <p className="text-xs font-semibold text-gray-400">Sample Info</p>
              </div>
              <p className="text-gray-200 text-sm">{pillInfo.sample_info}</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Beaker className="w-4 h-4 text-blue-400" />
                <p className="text-xs font-semibold text-gray-400">Intervention/Treatment</p>
              </div>
              <p className="text-gray-200 text-sm">{pillInfo.intervention_treatment}</p>
            </div>
          </div>
        </div>
        {/* Card 2: Study Details */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-purple-500 hover:shadow-[0_0_20px_5px_rgba(168,85,247,0.5)] transition">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
              <Network className="w-5 h-5 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-white">Study Details</h4>
          </div>
          <div className="space-y-3">
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-blue-400" />
                <p className="text-xs font-semibold text-gray-400">Study Subject</p>
              </div>
              <p className="text-gray-200 leading-relaxed text-sm">{pillInfo.study_subject}</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center gap-2 mb-3">
                <Network className="w-4 h-4 text-blue-400" />
                <p className="text-xs font-semibold text-gray-400">Environment Type</p>
              </div>
              <p className="text-gray-200 text-sm">{pillInfo.environment_type}</p>
            </div>
          </div>
        </div>
        {/* Card 3: Findings */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-purple-500 hover:shadow-[0_0_20px_5px_rgba(168,85,247,0.5)] transition">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-white">Findings</h4>
          </div>
          <div className="space-y-3">
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <p className="text-xs font-semibold text-gray-400">Biological Focus</p>
              </div>
              <p className="text-gray-200 leading-relaxed text-sm">{pillInfo.biological_focus}</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <p className="text-xs font-semibold text-gray-400">Primary Finding</p>
              </div>
              <p className="text-gray-200 text-sm">{pillInfo.primary_finding}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeGraphCards;
