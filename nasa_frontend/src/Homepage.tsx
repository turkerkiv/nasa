import React, { useState } from 'react';
import StarBackground from './StarBackground';
import { Search, Filter, TrendingUp, MessageCircle, X, ChevronRight, Calendar, User, ExternalLink, FileText, BarChart3, Network, Sparkles, BookOpen, Quote, Send, ArrowLeft } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Mock Data
const mockArticles = [
  {
    id: 1,
    title: "Effects of Microgravity on Human Cardiac Tissue Development",
    authors: "Johnson M., Smith K., Williams R.",
    year: 2024,
    category: "microgravity",
    summary: "This study examines how microgravity conditions affect the development and function of human cardiac tissue using 3D bioprinting technology.",
    doi: "10.1038/s41586-024-12345",
    citations: 45,
    abstract: "Microgravity environments present unique challenges for human physiology, particularly affecting cardiac tissue development. This comprehensive study utilized advanced 3D bioprinting techniques to create cardiac tissue models that were subsequently exposed to simulated microgravity conditions aboard the International Space Station.",
    methodology: "We utilized state-of-the-art 3D bioprinting technology to create cardiac tissue models using human-induced pluripotent stem cells (hiPSCs). The tissue constructs were cultured in specialized bioreactors designed to simulate microgravity conditions.",
    results: "Significant changes in gene expression related to cardiac development were observed in microgravity conditions. The tissue samples exhibited modified contractility patterns compared to Earth gravity controls, with a 23% reduction in force generation.",
    similarArticles: [2, 3]
  },
  {
    id: 2,
    title: "Immune System Adaptation in Long-Duration Spaceflight",
    authors: "Chen L., Rodriguez M., Patel S.",
    year: 2023,
    category: "immune system",
    summary: "Analysis of immune system changes in astronauts during extended missions, revealing adaptive mechanisms and potential health risks.",
    doi: "10.1126/science.2023.789",
    citations: 67,
    abstract: "Long-duration spaceflight poses significant challenges to the human immune system. This longitudinal study examines immune cell populations and functional changes in astronauts during six-month missions aboard the International Space Station.",
    methodology: "Blood samples from 15 astronauts were collected at multiple time points: pre-flight, during flight, and post-flight. Comprehensive immune cell profiling was conducted using flow cytometry.",
    results: "T-cell populations showed significant alterations during spaceflight, with a notable shift toward memory phenotypes. NK cell activity decreased by 35% during flight but recovered within 60 days post-mission.",
    similarArticles: [1, 4]
  },
  {
    id: 3,
    title: "Cardiomyocyte Behavior Under Altered Gravity Conditions",
    authors: "Anderson T., Lee J., Brown A.",
    year: 2024,
    category: "cardiomyocytes",
    summary: "Investigation of cardiomyocyte morphology and electrical activity changes in response to various gravity levels.",
    doi: "10.1016/j.cell.2024.456",
    citations: 32,
    abstract: "Cardiomyocytes, the contractile cells of the heart, are highly sensitive to mechanical stress and environmental conditions. This study investigates the morphological and functional changes that occur in cardiomyocytes when exposed to altered gravity conditions.",
    methodology: "iPSC-derived cardiomyocytes were cultured in a rotating wall vessel bioreactor to simulate microgravity conditions. Electrophysiological recordings were obtained using patch-clamp techniques.",
    results: "Cardiomyocytes exhibited significant changes in calcium handling and action potential duration under microgravity conditions. Structural remodeling was evident after 14 days.",
    similarArticles: [1, 5]
  },
  {
    id: 4,
    title: "Cancer Cell Proliferation in Microgravity Environments",
    authors: "Martinez E., Taylor D., Wilson H.",
    year: 2023,
    category: "cancer biology",
    summary: "Study of cancer cell growth patterns and drug resistance mechanisms in simulated space conditions.",
    doi: "10.1038/nature.2023.321",
    citations: 54,
    abstract: "Cancer cells exhibit unique behaviors in microgravity environments that may provide insights into tumor biology and therapeutic strategies.",
    methodology: "Multiple cancer cell lines were cultured in 3D under simulated microgravity using clinostat rotation. Drug efficacy testing included common chemotherapeutic agents.",
    results: "Cancer cells formed unique spheroid structures with altered drug sensitivity profiles. Some cell lines showed increased resistance to chemotherapy.",
    similarArticles: [2, 6]
  },
  {
    id: 5,
    title: "Tissue Engineering Approaches for Space Medicine",
    authors: "Kumar V., Zhang W., Roberts C.",
    year: 2024,
    category: "tissue effects",
    summary: "Comprehensive review of tissue engineering technologies applicable to long-duration space missions and their medical applications.",
    doi: "10.1016/j.biomaterials.2024.678",
    citations: 41,
    abstract: "Long-duration space missions require innovative medical solutions, including the ability to generate tissues and organs on-demand.",
    methodology: "Literature review encompassing 250+ peer-reviewed publications on tissue engineering and space biology. Experimental validation of 3D bioprinting techniques suitable for microgravity environments.",
    results: "Several promising approaches were identified for on-demand tissue fabrication in space. Challenges remain in maintaining tissue viability during long-term storage.",
    similarArticles: [1, 3]
  },
  {
    id: 6,
    title: "Human Health Monitoring Systems for Deep Space Exploration",
    authors: "Thompson R., Garcia F., Kim Y.",
    year: 2023,
    category: "human health",
    summary: "Development of autonomous health monitoring technologies for astronauts during missions beyond low Earth orbit.",
    doi: "10.1109/TBME.2023.901",
    citations: 38,
    abstract: "Deep space exploration missions require autonomous health monitoring systems capable of detecting and diagnosing medical conditions without immediate ground support.",
    methodology: "Integration of multiple wearable sensors monitoring cardiovascular function, respiration, body temperature, and activity levels. AI-powered diagnostic algorithms were trained on astronaut health records.",
    results: "The system successfully detected health anomalies in real-time simulations with 94% accuracy. Machine learning models identified early signs of cardiovascular stress and psychological distress.",
    similarArticles: [2, 4]
  }
];

const categories = ["microgravity", "tissue effects", "immune system", "cardiomyocytes", "cancer biology", "human health"];

const trendData = [
  { year: 2020, articles: 45 },
  { year: 2021, articles: 62 },
  { year: 2022, articles: 78 },
  { year: 2023, articles: 95 },
  { year: 2024, articles: 112 }
];

const categoryData = [
  { name: 'Microgravity', value: 35, color: '#3b82f6' },
  { name: 'Tissue', value: 25, color: '#8b5cf6' },
  { name: 'Immune', value: 20, color: '#ec4899' },
  { name: 'Cardio', value: 15, color: '#10b981' },
  { name: 'Cancer', value: 18, color: '#f59e0b' },
  { name: 'Health', value: 22, color: '#ef4444' }
];

// Navbar Component
const Navbar = () => (
  <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 sticky top-0 z-40 backdrop-blur-lg bg-gray-900/95">
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      <div className="flex items-center gap-3 cursor-pointer group">
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg group-hover:scale-110 transition">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">NASA BiologyHub</h1>
          <p className="text-xs text-gray-400">Smart Article Platform</p>
        </div>
      </div>
      {/* Butonlar kaldırıldı */}
    </div>
  </nav>
);

// Chatbot Component
// Reels Modal Component
const ReelsModal = ({ articles, open, onClose }) => {
  const [current, setCurrent] = useState(0);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-auto bg-gray-900 rounded-xl shadow-lg p-6 flex flex-col items-center">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </button>
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-lg font-bold text-white text-center mb-2">{articles[current].title}</h2>
          <p className="text-xs text-gray-400 mb-2">{articles[current].authors} • {articles[current].year}</p>
          <div className="bg-gray-800 rounded-lg p-4 mb-2 w-full">
            <p className="text-sm text-gray-200 text-center">{articles[current].summary}</p>
          </div>
        </div>
        <div className="flex justify-between w-full mt-4">
          <button
            className="px-3 py-1 bg-gray-700 text-white rounded-lg disabled:opacity-40"
            onClick={() => setCurrent(c => Math.max(0, c - 1))}
            disabled={current === 0}
          >Önceki</button>
          <button
            className="px-3 py-1 bg-blue-600 text-white rounded-lg disabled:opacity-40"
            onClick={() => setCurrent(c => Math.min(articles.length - 1, c + 1))}
            disabled={current === articles.length - 1}
          >Sonraki</button>
        </div>
        <div className="mt-2 text-xs text-gray-400">{current + 1} / {articles.length}</div>
      </div>
    </div>
  );
};
const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Merhaba! NASA biyoloji makaleleri hakkında size nasıl yardımcı olabilirim?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    setMessages([...messages, { type: 'user', text: input }]);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: 'bot',
        text: 'Sorunuzu aldım! Bu bir demo versiyonudur. Gerçek uygulamada AI asistanı devreye girecek.'
      }]);
    }, 1000);
    setInput('');
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-blue-500/50 hover:scale-110 transition-all duration-300 z-50"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 left-6 w-96 h-[500px] bg-gray-800 border border-gray-700 rounded-xl shadow-2xl flex flex-col z-50">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-t-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-white" />
              <span className="font-semibold text-white">YazTek Araştırma Asistanı</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20 p-1 rounded transition">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((msg, idx) => (
              <div key={idx} className={`rounded-lg p-3 ${msg.type === 'bot' ? 'bg-gray-700 text-gray-300' : 'bg-blue-600 text-white ml-8'}`}>
                <p className="text-sm">{msg.text}</p>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Soru sorun..."
                className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
              <button onClick={handleSend} className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Article Card
const ArticleCard = ({ article, onClick }) => (

  <div onClick={onClick} className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-purple-500 hover:shadow-[0_0_20px_5px_rgba(168,85,247,0.5)] transition cursor-pointer group h-full">
    <div className="flex items-start justify-between mb-3">
      <span className="px-3 py-1 bg-blue-600/20 text-blue-400 text-xs rounded-full border border-blue-500/30">
        {article.category}
      </span>
      <span className="text-gray-400 text-sm flex items-center gap-1">
        <Quote className="w-3 h-3" />
        {article.citations}
      </span>
    </div>
    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition line-clamp-2">
      {article.title}
    </h3>
    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{article.summary}</p>
    <div className="flex items-center justify-between text-sm mb-4">
      <div className="flex items-center gap-2 text-gray-500">
        <User className="w-4 h-4" />
        <span className="truncate">{article.authors.split(',')[0]} et al.</span>
      </div>
      <div className="flex items-center gap-2 text-gray-500">
        <Calendar className="w-4 h-4" />
        <span>{article.year}</span>
      </div>
    </div>
    <div className="flex items-end justify-end mt-2">
      <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-blue-400 group-hover:translate-x-1 transition flex-shrink-0" />
    </div>
  </div>
);

// Graph Panel
const GraphPanel = () => (
  <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
    <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
      <BarChart3 className="w-6 h-6 text-blue-500" />
      Analitik Gösterge Paneli
    </h3>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div className="bg-gray-900 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-400 mb-4">Yıllık Yayın Trendi</h4>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="year" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} labelStyle={{ color: '#fff' }} />
            <Line type="monotone" dataKey="articles" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-gray-900 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-400 mb-4">Kategori Dağılımı</h4>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={categoryData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={(entry) => entry.name}>
              {categoryData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
    <div className="bg-gray-900 rounded-lg p-4">
      <h4 className="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2">
        <Network className="w-4 h-4" />
        Konu İlişki Haritası (Knowledge Graph)
      </h4>
      <div className="h-48 flex items-center justify-center border-2 border-dashed border-gray-700 rounded-lg">
        <div className="text-center">
          <Network className="w-12 h-12 text-gray-600 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">İnteraktif grafik yükleniyor...</p>
        </div>
      </div>
    </div>
  </div>
);

// Article Detail Page
const ArticleDetailPage = ({ article, onBack }) => {
  const [activeTab, setActiveTab] = useState('abstract');
  const similarArticles = mockArticles.filter(a => article.similarArticles.includes(a.id));

  const [showExperiments, setShowExperiments] = useState(false);
  // Example experiment data for chart
  const experimentData = [
    { name: 'Deney 1', value: 23 },
    { name: 'Deney 2', value: 17 },
    { name: 'Deney 3', value: 29 },
    { name: 'Deney 4', value: 12 }
  ];
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <button onClick={onBack} className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition hover:shadow-[0_0_20px_5px_rgba(168,85,247,0.5)] focus:shadow-[0_0_20px_5px_rgba(168,85,247,0.7)]">
          <ArrowLeft className="w-5 h-5" />
          Geri Dön
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-8">
              <span className="px-3 py-1 bg-blue-600/20 text-blue-400 text-xs rounded-full border border-blue-500/30 inline-block mb-4">
                {article.category}
              </span>
              <h1 className="text-3xl font-bold text-white mb-4">{article.title}</h1>
              <div className="flex flex-wrap gap-6 text-sm text-gray-400 mb-6">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{article.authors}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{article.year}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Quote className="w-4 h-4" />
                  <span>{article.citations} alıntı</span>
                </div>
              </div>
              <a href="#" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-8">
                <ExternalLink className="w-4 h-4" />
                {article.doi}
              </a>
              <div className="border-b border-gray-700 mb-6">
                <div className="flex gap-4">
                  {['abstract', 'knowledge', 'experiments', 'pdf'].map((tab) => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-3 px-2 capitalize transition ${activeTab === tab ? 'text-blue-400 border-b-2 border-blue-400 shadow-[0_0_20px_5px_rgba(168,85,247,0.5)]' : 'text-gray-400 hover:text-white hover:shadow-[0_0_20px_5px_rgba(168,85,247,0.3)] focus:shadow-[0_0_20px_5px_rgba(168,85,247,0.5)]'}`}>
                      {tab === 'abstract' && 'Özet'}
                      {tab === 'knowledge' && 'Bilgi Grafiği'}
                      {tab === 'experiments' && 'Deneyler'}
                      {tab === 'pdf' && 'PDF'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="text-gray-300 leading-relaxed">
                {activeTab === 'abstract' && <p>{article.abstract}</p>}
                {activeTab === 'knowledge' && (
                  <div className="flex flex-col items-center justify-center py-8">
                    <h3 className="text-xl font-bold text-blue-400 mb-4">Bilgi Grafiği</h3>
                    <div className="bg-gray-900 rounded-lg border border-blue-700 p-8 flex flex-col items-center justify-center w-full max-w-xl">
                      <Network className="w-16 h-16 text-blue-400 mb-4" />
                      <p className="text-gray-300 text-center mb-2">Makalenin metodolojisi yerine, ilişkili kavramları ve süreçleri gösteren bir bilgi grafiği burada yer alacak.</p>
                      <p className="text-xs text-gray-500 text-center">(Gerçek grafik entegrasyonu için ek geliştirme gereklidir)</p>
                    </div>
                  </div>
                )}
                {activeTab === 'experiments' && (
                  <>
                    <p>{article.results}</p>
                    <button
                      className="mt-4 mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      onClick={() => setShowExperiments((v) => !v)}
                    >
                      Deney Grafiğini Göster
                    </button>
                    {showExperiments && (
                      <div className="bg-gray-900 rounded-lg p-6 border border-blue-700">
                        <h3 className="text-lg font-bold text-blue-400 mb-4">Deneyler Grafiği</h3>
                        <ResponsiveContainer width="100%" height={260}>
                          <BarChart data={experimentData} margin={{ top: 20, right: 30, left: 0, bottom: 30 }}>
                            <defs>
                              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#6366f1" />
                                <stop offset="100%" stopColor="#3b82f6" />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                            <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 14 }} axisLine={false} tickLine={false} label={{ value: 'Deneyler', position: 'bottom', offset: 10, fill: '#9ca3af', fontSize: 16 }} />
                            <YAxis stroke="#9ca3af" tick={{ fontSize: 14 }} axisLine={false} tickLine={false} label={{ value: 'Sonuç', angle: -90, position: 'insideLeft', fill: '#9ca3af', fontSize: 16 }} />
                            <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #6366f1', borderRadius: 12, color: '#fff', fontSize: 15 }} labelStyle={{ color: '#6366f1', fontWeight: 'bold', fontSize: 16 }} cursor={{ fill: '#6366f1', opacity: 0.1 }} />
                            <Bar dataKey="value" fill="url(#barGradient)" radius={[12, 12, 0, 0]} barSize={32} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </>
                )}
                {activeTab === 'pdf' && (
                  <div className="h-96 bg-gray-900 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-700">
                    <div className="text-center">
                      <FileText className="w-16 h-16 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-500">PDF Görüntüleyici</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
          </div>
          
          <div className="space-y-6">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-green-500" />
                Benzer Makaleler
              </h3>
              <div className="space-y-3">
                {similarArticles.map((similar) => (
                  <div key={similar.id} className="p-3 bg-gray-900 rounded-lg hover:bg-gray-700 transition cursor-pointer">
                    <h4 className="text-sm font-medium text-white mb-1">{similar.title}</h4>
                    <p className="text-xs text-gray-400">{similar.authors.split(',')[0]} et al., {similar.year}</p>
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Home Page
const HomePage = ({ onArticleClick }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArticles = mockArticles.filter((article) => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.authors.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">NASA Biyoloji Araştırmaları</h2>
          <p className="text-gray-400 text-lg">Uzay biyolojisi alanındaki en son bilimsel makaleleri keşfedin</p>
        </div>
        
        <div className="mb-8">
          <div className="relative max-w-3xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Makale ara... (başlık, yazar, anahtar kelime)"
              className="w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
            />
          </div>
        </div>
        
        <div className="mb-12">
          <div className="flex flex-wrap gap-3 justify-center">
            <button onClick={() => setSelectedCategory('all')} className={`px-6 py-2 rounded-full transition ${selectedCategory === 'all' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-500/50' : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700 hover:shadow-[0_0_20px_5px_rgba(168,85,247,0.5)] focus:shadow-[0_0_20px_5px_rgba(168,85,247,0.7)]'}`}>
              Tümü
            </button>
            {categories.map((cat) => (
              <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-6 py-2 rounded-full transition capitalize ${selectedCategory === cat ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-500/50' : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700 hover:shadow-[0_0_20px_5px_rgba(168,85,247,0.5)] focus:shadow-[0_0_20px_5px_rgba(168,85,247,0.7)]'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
        
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-6 h-6 text-orange-500" />
            <h3 className="text-xl font-semibold text-white">Trend ve Önerilen Makaleler</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.slice(0, 3).map((article) => (
              <ArticleCard key={article.id} article={article} onClick={() => onArticleClick(article)} />
            ))}
          </div>
        </div>
        
        <div className="mb-12">
          <GraphPanel />
        </div>
        
        <div>
          <h3 className="text-xl font-semibold text-white mb-6">Tüm Makaleler ({filteredArticles.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} onClick={() => onArticleClick(article)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App
export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showReels, setShowReels] = useState(false);

  const handleArticleClick = (article) => {
    setSelectedArticle(article);
    setCurrentPage('detail');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setSelectedArticle(null);
  };

  return (
    <>
      {/* NASA Star Background */}
      <StarBackground />
      <Navbar />
      {currentPage === 'home' && <HomePage onArticleClick={handleArticleClick} />}
      {currentPage === 'detail' && selectedArticle && (
        <ArticleDetailPage article={selectedArticle} onBack={handleBackToHome} />
      )}
      <Chatbot />
    </>
  );
}
