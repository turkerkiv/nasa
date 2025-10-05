import React, { useState } from 'react';
import { ChevronDown, ChevronUp, FlaskConical, Target, Package, Settings, BarChart2, FileText, CheckCircle } from 'lucide-react';

// Örnek deney verileri - Birden fazla deney
const experimentsData = [
  {
    "experiment_id": "exp1",
    "name": "Culture-based Microbial Isolation and Identification",
    "objective": "To enumerate and identify culturable bacteria and fungi from UPA flex line samples.",
    "materials_used": [
      "UPA95 stagnant water",
      "UPA115 stagnant water",
      "UPA95 flush water",
      "UPA115 flush water",
      "Sterile flush water",
      "Milliflex system",
      "Reasoner's 2A (R2A) agar cassette",
      "Sabouraud dextrose with chloramphenicol (SABC) cassette",
      "R2A plates",
      "SABC plates",
      "PrepMan® Ultra Sample Preparation Reagent",
      "MicroSEQ® 500 16S rDNA PCR Kit",
      "Fast MicroSEQ® D2 Fungal rDNA PCR Kit",
      "MicroSEQ® 500 16S rDNA Sequencing Kit",
      "MicroSEQ® D2 rDNA Fungal Sequencing Kit",
      "Applied BioSystems® 3500 Genetic Analyzer",
      "MicroSEQ® ID microbial identification v3.1"
    ],
    "conditions": {
      "temperature": "Bacteria: 35 °C; Fungi: 30 °C",
      "duration": "Bacteria: 2-5 days; Fungi: 5-7 days",
      "medium": "R2A agar, SABC agar",
      "concentration": "Serial dilutions for plating",
      "replicates": "Each distinct morphological colony subcultured"
    },
    "methods": [
      "Sample filtration",
      "Serial dilution",
      "Plating",
      "Incubation",
      "Colony enumeration",
      "Subculturing",
      "DNA extraction",
      "PCR amplification (16S rDNA, D2 Fungal rDNA)",
      "Sanger sequencing",
      "Morphological and microscopic confirmation (for fungi)"
    ],
    "results": [
      {
        "parameter": "Bacterial isolates from UPA95",
        "value": "3",
        "unit": null,
        "interpretation": "Identified as Burkholderia sp. (milky white), Burkholderia sp. (yellow), and B. fungorum (smooth white)."
      },
      {
        "parameter": "Fungal isolates from UPA95",
        "value": "1",
        "unit": null,
        "interpretation": "Identified as Fusarium sp."
      },
      {
        "parameter": "Bacterial isolates from UPA115",
        "value": "6",
        "unit": null,
        "interpretation": "Identified as B. fungorum (rough white), Burkholderia sp. (white), Burkholderia sp. (yellow), Unidentified Gram-positive bacterium, Burkholderia sp. (wet), and Leifsonia lichenia."
      },
      {
        "parameter": "Fungal isolates from UPA115",
        "value": "2",
        "unit": null,
        "interpretation": "Identified as Fusarium sp. and Lecythophora mutabilis."
      },
      {
        "parameter": "Microbial diversity comparison",
        "value": "UPA115 > UPA95",
        "unit": null,
        "interpretation": "Higher diversity of organisms recovered from UPA115 compared to UPA95."
      }
    ],
    "conclusion": "Culturable bacteria and fungi, including Burkholderia, Paraburkholderia, Leifsonia, Fusarium, and Lecythophora, were identified from both flex lines, with UPA115 showing greater diversity."
  },
  {
    "experiment_id": "exp2",
    "name": "Flex Line Water Chromium and Chemical Analysis",
    "objective": "To measure chromium and other selected chemical component concentrations in water from the flex lines.",
    "materials_used": [
      "Water samples from UPA95 flex line",
      "Water samples from UPA115 flex line",
      "1% nitric acid",
      "Distilled water",
      "15 mL and 50 mL metal-free tubes",
      "PerkinElmer Nexion 300D (ICP-MS instrument)"
    ],
    "conditions": {
      "temperature": "null",
      "duration": "24 hours (tube soaking in nitric acid)",
      "medium": "null",
      "concentration": "Samples diluted to fall within instrument calibration range",
      "replicates": "Control samples used for quality assurance"
    },
    "methods": [
      "Sample and dilution tube preparation (acid soaking, rinsing)",
      "Sample dilution",
      "Inductively Coupled Plasma-Mass Spectrometry (ICP-MS) based on Standard Methods for the Examination of Water and Wastewater 3125"
    ],
    "results": [
      {
        "parameter": "Chromium concentration in UPA95",
        "value": "280",
        "unit": "mg/L",
        "interpretation": "Significantly high chromium concentration in the UPA95 recycled brine line."
      },
      {
        "parameter": "Chromium concentration in UPA115",
        "value": "1.02",
        "unit": "mg/L",
        "interpretation": "Much lower chromium concentration in the UPA115 purge line."
      },
      {
        "parameter": "Phosphate (as P) concentration in UPA95",
        "value": "1190",
        "unit": "mg/L",
        "interpretation": "Significantly high phosphate concentration in UPA95."
      },
      {
        "parameter": "Phosphate (as P) concentration in UPA115",
        "value": "13.7",
        "unit": "mg/L",
        "interpretation": "Much lower phosphate concentration in UPA115."
      }
    ],
    "conclusion": "UPA95, the brine line, exhibited significantly higher concentrations of chromium and other chemical components (e.g., phosphate) compared to UPA115, consistent with exposure to the urine pretreatment solution."
  }
];

const ExperimentCard = ({ experiment, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState('objective');

  // Gradient renkleri her kart için farklı
  const gradientColors = [
    'from-blue-900/30 to-purple-900/30',
    'from-green-900/30 to-teal-900/30',
    'from-orange-900/30 to-red-900/30',
    'from-pink-900/30 to-rose-900/30'
  ];

  const borderColors = [
    'border-blue-500',
    'border-green-500',
    'border-orange-500',
    'border-pink-500'
  ];

  const iconBgColors = [
    'bg-blue-600/20 border-blue-500/30',
    'bg-green-600/20 border-green-500/30',
    'bg-orange-600/20 border-orange-500/30',
    'bg-pink-600/20 border-pink-500/30'
  ];

  const iconColors = [
    'text-blue-400',
    'text-green-400',
    'text-orange-400',
    'text-pink-400'
  ];

  const badgeColors = [
    'bg-blue-600/20 text-blue-400 border-blue-500/30',
    'bg-green-600/20 text-green-400 border-green-500/30',
    'bg-orange-600/20 text-orange-400 border-orange-500/30',
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
                  {experiment.experiment_id}
                </span>
                <span className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded">
                  Deney #{index + 1}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{experiment.name}</h3>
              <p className="text-gray-400 text-sm line-clamp-2">{experiment.objective}</p>
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
              { id: 'materials', label: 'Malzemeler', icon: Package },
              { id: 'conditions', label: 'Koşullar', icon: Settings },
              { id: 'methods', label: 'Yöntemler', icon: FileText },
              { id: 'results', label: 'Sonuçlar', icon: BarChart2 },
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
                    <h4 className="text-lg font-semibold text-white mb-2">Deney Amacı</h4>
                    <p className="text-gray-300 leading-relaxed">{experiment.objective}</p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'materials' && (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Package className={`w-5 h-5 ${currentIconColor} mt-1 flex-shrink-0`} />
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white mb-3">Kullanılan Malzemeler</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {experiment.materials_used.map((material, idx) => (
                        <div key={idx} className="flex items-start gap-2 bg-gray-900 rounded-lg p-3 border border-gray-700 hover:border-gray-600 transition">
                          <div className={`w-2 h-2 ${currentIconColor.replace('text-', 'bg-')} rounded-full mt-1.5 flex-shrink-0`}></div>
                          <span className="text-gray-300 text-sm">{material}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'conditions' && (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Settings className={`w-5 h-5 ${currentIconColor} mt-1 flex-shrink-0`} />
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white mb-3">Deney Koşulları</h4>
                    <div className="grid grid-cols-1 gap-3">
                      {Object.entries(experiment.conditions).map(([key, value]) => (
                        <div key={key} className="bg-gray-900 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition">
                          <div className="flex items-center justify-between">
                            <span className={`${currentIconColor} font-medium capitalize`}>{key.replace('_', ' ')}</span>
                            <span className="text-gray-300">{value === 'null' ? 'N/A' : value}</span>
                          </div>
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
                      {experiment.methods.map((method, idx) => (
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

            {activeSection === 'results' && (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <BarChart2 className={`w-5 h-5 ${currentIconColor} mt-1 flex-shrink-0`} />
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white mb-3">Deney Sonuçları</h4>
                    <div className="space-y-3">
                      {experiment.results.map((result, idx) => (
                        <div key={idx} className="bg-gray-900 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition">
                          <div className="flex items-start justify-between mb-2">
                            <h5 className={`${currentIconColor} font-semibold`}>{result.parameter}</h5>
                            <span className="text-white font-bold text-lg">
                              {result.value} {result.unit || ''}
                            </span>
                          </div>
                          <p className="text-gray-300 text-sm">{result.interpretation}</p>
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
                      <p className="text-gray-300 leading-relaxed">{experiment.conclusion}</p>
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
export default function ExperimentsPreview() {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
        <FlaskConical className="w-7 h-7 text-blue-400" />
        Deney Detayları
      </h2>
      {/* Deney istatistikleri - Kompakt yan yana */}
      <div className="flex gap-3 mb-6">
        <div className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 flex items-center gap-2">
          <FlaskConical className="w-4 h-4 text-blue-400" />
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Toplam Deney:</span>
            <span className="text-sm font-bold text-white">{experimentsData.length}</span>
          </div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-green-400" />
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Toplam Sonuç:</span>
            <span className="text-sm font-bold text-white">
              {experimentsData.reduce((sum, exp) => sum + exp.results.length, 0)}
            </span>
          </div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 flex items-center gap-2">
          <FileText className="w-4 h-4 text-orange-400" />
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Toplam Yöntem:</span>
            <span className="text-sm font-bold text-white">
              {experimentsData.reduce((sum, exp) => sum + exp.methods.length, 0)}
            </span>
          </div>
        </div>
      </div>
      {/* Deney kartları */}
      <div className="space-y-6">
        {experimentsData.map((experiment, index) => (
          <ExperimentCard key={experiment.experiment_id} experiment={experiment} index={index} />
        ))}
      </div>
    </div>
  );
}
