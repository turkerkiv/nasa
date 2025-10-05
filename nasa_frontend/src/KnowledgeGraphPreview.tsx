import React, { useState } from 'react';
import { ChevronDown, ChevronUp, FlaskConical, Target, Package, Settings, BarChart2, FileText, CheckCircle } from 'lucide-react';

// Örnek bilgi grafiği verileri
const knowledgeGraphData = [
  {
    "graph_id": "kg1",
    "name": "UPA Flex Line Microbial Knowledge Graph",
    "objective": "To visualize relationships between identified microbial species and experimental conditions in UPA flex line samples.",
    "nodes": [
      "Burkholderia sp.", "B. fungorum", "Fusarium sp.", "Leifsonia lichenia", "Lecythophora mutabilis", "UPA95", "UPA115", "R2A agar", "SABC agar"
    ],
    "edges": [
      { "from": "Burkholderia sp.", "to": "UPA95" },
      { "from": "Burkholderia sp.", "to": "UPA115" },
      { "from": "B. fungorum", "to": "UPA95" },
      { "from": "B. fungorum", "to": "UPA115" },
      { "from": "Fusarium sp.", "to": "UPA95" },
      { "from": "Fusarium sp.", "to": "UPA115" },
      { "from": "Leifsonia lichenia", "to": "UPA115" },
      { "from": "Lecythophora mutabilis", "to": "UPA115" },
      { "from": "UPA95", "to": "R2A agar" },
      { "from": "UPA115", "to": "SABC agar" }
    ],
    "methods": [
      "Sample filtration",
      "Serial dilution",
      "Plating",
      "Incubation",
      "Colony enumeration",
      "Subculturing",
      "DNA extraction",
      "PCR amplification",
      "Sanger sequencing"
    ],
    "conclusion": "Microbial species and their relationships to experimental conditions are visualized, highlighting diversity and experimental context."
  }
];

const KnowledgeGraphCard = ({ graph, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState('objective');

  // Gradient renkleri her kart için farklı
  const gradientColors = [
    'from-purple-900/30 to-blue-900/30',
    'from-teal-900/30 to-green-900/30',
    'from-red-900/30 to-orange-900/30',
    'from-rose-900/30 to-pink-900/30'
  ];

  const borderColors = [
    'border-purple-500',
    'border-teal-500',
    'border-red-500',
    'border-pink-500'
  ];

  const iconBgColors = [
    'bg-purple-600/20 border-purple-500/30',
    'bg-teal-600/20 border-teal-500/30',
    'bg-red-600/20 border-red-500/30',
    'bg-pink-600/20 border-pink-500/30'
  ];

  const iconColors = [
    'text-purple-400',
    'text-teal-400',
    'text-red-400',
    'text-pink-400'
  ];

  const badgeColors = [
    'bg-purple-600/20 text-purple-400 border-purple-500/30',
    'bg-teal-600/20 text-teal-400 border-teal-500/30',
    'bg-red-600/20 text-red-400 border-red-500/30',
    'bg-pink-600/20 text-pink-400 border-pink-500/30'
  ];

  const currentGradient = gradientColors[index % gradientColors.length];
  const currentBorder = borderColors[index % borderColors.length];
  const currentIconBg = iconBgColors[index % iconBgColors.length];
  const currentIconColor = iconColors[index % iconColors.length];
  const currentBadge = badgeColors[index % badgeColors.length];

  return (
    <div className={`bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:${currentBorder} hover:shadow-[0_0_20px_5px_rgba(168,85,247,0.3)] transition-all duration-300`}>
      {/* Header */}
      <div 
        className={`p-6 cursor-pointer bg-gradient-to-r ${currentGradient} hover:brightness-110`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <div className={`${currentIconBg} p-3 rounded-lg border`}>
              <FlaskConical className={`w-6 h-6 ${currentIconColor}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-1 ${currentBadge} text-xs rounded border font-semibold`}>
                  {graph.graph_id}
                </span>
                <span className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded">
                  Bilgi Grafiği #{index + 1}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{graph.name}</h3>
              <p className="text-gray-400 text-sm line-clamp-2">{graph.objective}</p>
            </div>
          </div>
          <button className="ml-4 text-gray-400 hover:text-white transition">
            {isExpanded ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-700">
          {/* Tab Navigation */}
          <div className="bg-gray-900 px-6 py-3 flex gap-2 overflow-x-auto">
            {[
              { id: 'objective', label: 'Amaç', icon: Target },
              { id: 'nodes', label: 'Düğümler', icon: Package },
              { id: 'edges', label: 'Bağlantılar', icon: Settings },
              { id: 'methods', label: 'Yöntemler', icon: FileText },
              { id: 'conclusion', label: 'Sonuç', icon: CheckCircle }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition ${
                    activeSection === tab.id
                      ? `${currentIconBg} ${currentIconColor} shadow-lg`
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Content Area */}
          <div className="p-6">
            {activeSection === 'objective' && (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Target className={`w-5 h-5 ${currentIconColor} mt-1 flex-shrink-0`} />
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Grafik Amacı</h4>
                    <p className="text-gray-300 leading-relaxed">{graph.objective}</p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'nodes' && (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Package className={`w-5 h-5 ${currentIconColor} mt-1 flex-shrink-0`} />
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white mb-3">Düğümler</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {graph.nodes.map((node, idx) => (
                        <div key={idx} className="flex items-start gap-2 bg-gray-900 rounded-lg p-3 border border-gray-700 hover:border-gray-600 transition">
                          <div className={`w-2 h-2 ${currentIconColor.replace('text-', 'bg-')} rounded-full mt-1.5 flex-shrink-0`}></div>
                          <span className="text-gray-300 text-sm">{node}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'edges' && (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Settings className={`w-5 h-5 ${currentIconColor} mt-1 flex-shrink-0`} />
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white mb-3">Bağlantılar</h4>
                    <div className="space-y-2">
                      {graph.edges.map((edge, idx) => (
                        <div key={idx} className="flex items-start gap-2 bg-gray-900 rounded-lg p-3 border border-gray-700 hover:border-gray-600 transition">
                          <span className="text-gray-300 text-sm">{edge.from} → {edge.to}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'methods' && (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <FileText className={`w-5 h-5 ${currentIconColor} mt-1 flex-shrink-0`} />
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white mb-3">Uygulanan Yöntemler</h4>
                    <div className="space-y-2">
                      {graph.methods.map((method, idx) => (
                        <div key={idx} className="flex items-start gap-3 bg-gray-900 rounded-lg p-3 border border-gray-700 hover:border-gray-600 transition">
                          <div className={`${currentIconBg} ${currentIconColor} rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0`}>
                            {idx + 1}
                          </div>
                          <span className="text-gray-300 text-sm">{method}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'conclusion' && (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className={`w-5 h-5 ${currentIconColor} mt-1 flex-shrink-0`} />
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white mb-2">Genel Sonuç</h4>
                    <div className={`${currentIconBg} border rounded-lg p-4`}>
                      <p className="text-gray-300 leading-relaxed">{graph.conclusion}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Ana Component (Önizleme için)
export default function KnowledgeGraphPreview() {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
        <FlaskConical className="w-7 h-7 text-purple-400" />
        Bilgi Grafiği Detayları
      </h2>
      {/* Bilgi grafiği kartları */}
      <div className="space-y-6">
        {knowledgeGraphData.map((graph, index) => (
          <KnowledgeGraphCard key={graph.graph_id} graph={graph} index={index} />
        ))}
      </div>
    </div>
  );
}
