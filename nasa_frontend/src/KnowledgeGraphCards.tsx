import React from 'react';
import { Calendar, Network, Sparkles, BookOpen, FileText, TrendingUp, BarChart3, CheckCircle, Clock, Beaker, User } from 'lucide-react';

const KnowledgeGraphCards = () => {
  return (
    <div className="py-6 bg-gray-900 min-h-screen p-8">
      <h3 className="text-2xl font-bold text-blue-400 mb-6 flex items-center gap-2">
        <Network className="w-7 h-7" />
        Bilgi Grafiği
      </h3>
      {/* Üç Ana Kutucuk */}
      <div className="grid grid-cols-1 gap-6 mb-6">
        {/* Kutucuk 1: Genel Bilgiler */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-purple-500 hover:shadow-[0_0_20px_5px_rgba(168,85,247,0.5)] transition">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-white">Genel Bilgiler</h4>
            </div>
            {/* Süre - Sağ Üst Köşe */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-semibold text-gray-300">101 gün</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {/* İstatistiksel Kanıt - Kompakt */}
            <div className="inline-flex items-center gap-2 bg-emerald-900/20 border border-emerald-500/30 rounded-lg px-3 py-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-emerald-400 font-semibold">İstatistiksel Kanıt Var</span>
            </div>
            {/* Çalışma Tipi */}
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-blue-400" />
                <p className="text-xs font-semibold text-gray-400">Çalışma Tipi</p>
              </div>
              <p className="text-gray-200 text-sm">Comparative experimental study (in vivo)</p>
            </div>
            {/* Örnek Bilgisi */}
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4 text-blue-400" />
                <p className="text-xs font-semibold text-gray-400">Örnek Bilgisi</p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-200 text-sm">• 100 kernels (space-grown)</p>
                <p className="text-gray-200 text-sm">• 85 kernels (terrestrial)</p>
              </div>
            </div>
            {/* Müdahale/Tedavi */}
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Beaker className="w-4 h-4 text-blue-400" />
                <p className="text-xs font-semibold text-gray-400">Müdahale/Tedavi</p>
              </div>
              <p className="text-gray-200 text-sm">Microgravity conditions (ISS Lada chamber)</p>
            </div>
          </div>
        </div>
        {/* Kutucuk 2: Çalışma Detayları */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-purple-500 hover:shadow-[0_0_20px_5px_rgba(168,85,247,0.5)] transition">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
              <Network className="w-5 h-5 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-white">Çalışma Detayları</h4>
          </div>
          <div className="space-y-3">
            {/* Çalışma Konusu */}
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-blue-400" />
                <p className="text-xs font-semibold text-gray-400">Çalışma Konusu</p>
              </div>
              <p className="text-gray-200 leading-relaxed text-sm">Super Dwarf cultivar wheat (Triticum aestivum L.) kernels</p>
            </div>
            {/* Ortam Tipi */}
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center gap-2 mb-3">
                <Network className="w-4 h-4 text-blue-400" />
                <p className="text-xs font-semibold text-gray-400">Ortam Tipi</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-1.5"></div>
                  <div>
                    <p className="text-gray-200 text-sm font-medium">Space Environment</p>
                    <p className="text-xs text-gray-400 mt-0.5">International Space Station</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-1.5"></div>
                  <div>
                    <p className="text-gray-200 text-sm font-medium">Terrestrial Control</p>
                    <p className="text-xs text-gray-400 mt-0.5">Lada growth chamber</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Kutucuk 3: Bulgular */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-purple-500 hover:shadow-[0_0_20px_5px_rgba(168,85,247,0.5)] transition">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-white">Bulgular</h4>
          </div>
          <div className="space-y-3">
            {/* Biyolojik Odak */}
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <p className="text-xs font-semibold text-gray-400">Biyolojik Odak</p>
              </div>
              <p className="text-gray-200 leading-relaxed text-sm">Impact of microgravity on wheat kernel quality: physical parameters, starch granules, and aleurone layer morphology.</p>
            </div>
            {/* Ana Bulgu */}
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <p className="text-xs font-semibold text-gray-400">Ana Bulgular</p>
              </div>
              <div className="space-y-2.5 text-sm text-gray-200 leading-relaxed">
                <div className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <p><span className="text-blue-400 font-medium">Küçülme:</span> ISS kernels significantly smaller in weight, area, length, width</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <p><span className="text-blue-400 font-medium">Starch:</span> Longer Type A granules, 5-8% less Type B ratio</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <p><span className="text-blue-400 font-medium">Aleurone:</span> Smaller cell width</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <p><span className="text-blue-400 font-medium">Impact:</span> Potential differences in baking quality and protein content</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeGraphCards;
