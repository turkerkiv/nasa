import React, { useEffect, useState } from 'react';
import StarBackground from './StarBackground';
import { Search, Filter, TrendingUp, MessageCircle, X, ChevronRight, Calendar, User, ExternalLink, FileText, BarChart3, Network, Sparkles, BookOpen, Quote, Send, ArrowLeft } from 'lucide-react';
import ExperimentsPreview from './ExperimentsPreview';
import KnowledgeGraphPreview from './KnowledgeGraphPreview';
import ArticleReels from './ArticleReels';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import KnowledgeGraphCards from './KnowledgeGraphCards';

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
          <p className="text-xs text-gray-400 mb-2">{articles[current].author_names} • {articles[current].year}</p>
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

// Article Card
const ArticleCard = ({ article, onClick }) => (

  <div onClick={onClick} className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-purple-500 hover:shadow-[0_0_20px_5px_rgba(168,85,247,0.5)] transition cursor-pointer group h-full">
    <div className="flex items-start justify-between mb-3">
      <span className="px-3 py-1 bg-blue-600/20 text-blue-400 text-xs rounded-full border border-blue-500/30">
        {article.keywords}
      </span>
      <span className="text-gray-400 text-sm flex items-center gap-1">
        <Quote className="w-3 h-3" />
        {article.citation_count}
      </span>
    </div>
    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition line-clamp-2">
      {article.title}
    </h3>
    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{article.summary}</p>
    <div className="flex items-center justify-between text-sm mb-4">
      <div className="flex items-center gap-2 text-gray-500">
        <User className="w-4 h-4" />
        <span className="truncate">{article.author_names?.split(',')[0]} et al.</span>
      </div>
      <div className="flex items-center gap-2 text-gray-500">
        <Calendar className="w-4 h-4" />
        <span>{article.publication_date}</span>
      </div>
    </div>
    <div className="flex items-end justify-end mt-2">
      <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-blue-400 group-hover:translate-x-1 transition flex-shrink-0" />
    </div>
  </div>
);

// Graph Panel
const GraphPanel = ({ trendData, categories }) => (
  <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
    <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
      <BarChart3 className="w-6 h-6 text-blue-500" />
      Analitik Gösterge Paneli
    </h3>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div className="bg-gray-900 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-400 mb-4">Yıllık Yayın Trendi</h4>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={[...trendData].reverse()}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="year" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} labelStyle={{ color: '#fff' }} />
            <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-gray-900 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-400 mb-4">Kategori Dağılımı</h4>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={categories} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={(entry) => entry.name}>
              {categories.map((entry, index) => (
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

  // Chatbot for article detail
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', text: 'You can ask questions about this article.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const handleChatSend = async () => {
    if (!chatInput.trim()) return;
    setChatMessages([...chatMessages, { type: 'user', text: chatInput }]);
    setChatLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8001/articles/chatbot/', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ article_id: article.id, message: chatInput })
      });
      const data = await response.json();
      console.log(data)
      setChatMessages(prev => [...prev, { type: 'bot', text: data.reply || 'Yanıt alınamadı.' }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { type: 'bot', text: 'Sunucuya bağlanılamadı.' }]);
    }
    setChatInput('');
    setChatLoading(false);
  };

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
                {article.keywords}
              </span>
              <h1 className="text-3xl font-bold text-white mb-4">{article.title}</h1>
              <div className="flex flex-wrap gap-6 text-sm text-gray-400 mb-6">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{article.author_names}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{article.publication_date?.slice(0, 10)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Quote className="w-4 h-4" />
                  <span>{article.citation_count} alıntı</span>
                </div>
              </div>
              <a href="#" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-8">
                <ExternalLink className="w-4 h-4" />
                {article.doi}
              </a>
              <div className="border-b border-gray-700 mb-6">
                <div className="flex gap-4">
                  {['abstract', 'knowledge', 'pdf', 'experiments'].map((tab) => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`p-2 rounded capitalize transition ${activeTab === tab ? 'text-blue-400 border-b-2 border-blue-400 shadow-[0_0_20px_5px_rgba(168,85,247,0.5)]' : 'text-gray-400 hover:text-white hover:shadow-[0_0_20px_5px_rgba(168,85,247,0.3)] focus:shadow-[0_0_20px_5px_rgba(168,85,247,0.5)]'}`}>
                      {tab === 'abstract' && 'Özet'}
                      {tab === 'knowledge' && 'Bilgi Grafiği'}
                      {tab === 'pdf' && 'PDF'}
                      {tab === 'experiments' && 'Deneyler'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="text-gray-300 leading-relaxed">
                {activeTab === 'abstract' && <p>{article.abstract}</p>}
                {activeTab === 'knowledge' && <KnowledgeGraphCards />}
                {activeTab === 'pdf' && (
                  <div className="h-96 bg-gray-900 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-700">
                    {article.id ? (
                      <iframe
                        src={`http://127.0.0.1:8001/articles/pdf/${article.file_name}`}
                        title="Makale PDF"
                        width="100%"
                        height="100%"
                        className="rounded-lg border-none h-full w-full"
                      />
                    ) : (
                      <div className="text-center">
                        <FileText className="w-16 h-16 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-500">PDF Görüntüleyici ({article.file_name})</p>
                      </div>
                    )}
                  </div>
                )}
                {activeTab === 'experiments' && <ExperimentsPreview />}
              </div>
            </div>
            {/* Article Chatbot Floating Button & Modal (moved to right) */}
            <button
              onClick={() => setChatOpen(!chatOpen)}
              className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-blue-500/50 hover:scale-110 transition-all duration-300 z-50"
            >
              {chatOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
            </button>
            {chatOpen && (
              <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-gray-800 border border-gray-700 rounded-xl shadow-2xl flex flex-col z-50">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-t-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-white" />
                    <span className="font-semibold text-white">YazTek Article Assistant</span>
                  </div>
                  <button onClick={() => setChatOpen(false)} className="text-white hover:bg-white/20 p-1 rounded transition">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className={`rounded-lg p-3 ${msg.type === 'bot' ? 'bg-gray-700 text-gray-300' : 'bg-blue-600 text-white ml-8'}`}>
                      <p className="text-sm">{msg.text}</p>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-gray-700">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleChatSend()}
                      placeholder="Ask a question about the article..."
                      className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                      disabled={chatLoading}
                    />
                    <button onClick={handleChatSend} className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition" disabled={chatLoading}>
                      {chatLoading ? <span className="animate-spin">...</span> : <Send className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Home Page
const HomePage = ({ onArticleClick }) => {
  const [reelsOpen, setReelsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [trendArticles, setTrendArticles] = useState([]);
  const [trendData, setTrendData] = useState<{ year: number, count: number }[]>([]);
  const [resultArticles, setResultArticles] = useState<[]>([]);
  const [categories, setCategories] = useState([]);
  const [isAll, setIsAll] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(3);
  const [total, setTotal] = useState(0);

  // Fetch trend articles and yearly trend data on mount
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('http://localhost:8001/articles/trending?years=3&min_citations=7&min_percentile=0.1');
        const data = await response.json();
        setTrendArticles(data.map(d => d.article));
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };
    fetchArticles();

    // Fetch yearly counts for trend graph
    const fetchTrendData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8001/articles/counts-by-year');
        const data = await response.json();
        setTrendData(data);
        console.log('Yearly trend data:', data);
      } catch (error) {
        console.error('Error fetching yearly trend data:', error);
      }
    };
    fetchTrendData();
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8001/articles/?page=${page}&page_size=${pageSize}&query=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();
        setResultArticles(data.items);
        setTotal(data.total);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };
    fetchArticles();
  }, [page, isAll]);

  // Fetch categories (keywords) from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8001/articles/keywords?limit=15');
        const data = await response.json();
        setCategories(data || []);
      } catch (error) {
        console.error('Error fetching keywords:', error);
      }
    };
    fetchCategories();
  }, []);

  // Search keywords handler
  // const handleKeywordSearch = async () => {
  //   if (!searchQuery.trim()) return;
  //   try {
  //     const response = await fetch(`http://127.0.0.1:8001/articles/keywords?query=${encodeURIComponent(searchQuery.trim())}&limit=15`);
  //     const data = await response.json();
  //     setCategories(data.keywords || []);
  //   } catch (error) {
  //     console.error('Keyword search error:', error);
  //     setCategories([]);
  //   }
  // };

  // Search handler
  const handleSearch = async () => {
    setPage(1);
    try {
      const response = await fetch(`http://127.0.0.1:8001/articles/?page=1&page_size=3&query=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setResultArticles(data.items);
      setTotal(data.total);
      if (searchQuery.trim() === '') {
        setIsAll(true);
      } else {
        setIsAll(false);
      }
    } catch (error) {
      console.error('Error searching articles:', error);
    }
  };

  // const filteredArticles = articles.filter((article) => {
  //   const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
  //   const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //                        article.authors.toLowerCase().includes(searchQuery.toLowerCase());
  //   return matchesCategory && matchesSearch;
  // });

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Explore Button */}
      <button
        className="fixed top-6 right-8 z-50 px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:scale-105 transition-all font-semibold border border-purple-500/30"
        onClick={() => setReelsOpen(true)}
      >
        Explore
      </button>
      {reelsOpen && (
        <ArticleReels
          onArticleClick={onArticleClick}
          onClose={() => setReelsOpen(false)}
        />
      )}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">NASA Biology Research</h2>
          <p className="text-gray-400 text-lg">Discover the latest scientific articles in space biology</p>
        </div>

        <div className="mb-8">
          <div className="relative max-w-3xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              placeholder="Search for articles... (title, author, keyword)"
              className="w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
            />
          </div>
        </div>

        <div className="mb-12">
          <div className="flex flex-wrap gap-3 justify-center">
              {categories?.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={async () => {
                    setSelectedCategory(cat);
                    setSearchQuery(cat);
                    await handleSearch();
                  }}
                  className={`px-6 py-2 rounded-full transition capitalize ${selectedCategory === cat ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-500/50' : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700 hover:shadow-[0_0_20px_5px_rgba(168,85,247,0.5)] focus:shadow-[0_0_20px_5px_rgba(168,85,247,0.7)]'}`}
                >
                  {cat}
                </button>
              ))}
          </div>
        </div>

        

        <div className="mb-12">
          <div className="flex items-baseline justify-between gap-2 mb-6">
            <div className='flex items-center gap-2'>
            <TrendingUp className="w-6 h-6 text-orange-500" />
            <h3 className="text-xl font-semibold text-white">{isAll ? "All" : "Results"}</h3>
            </div>
            {/* Pagination Controls - Arrow, Current, Last */}
          <div className="mb-4 flex justify-center items-center gap-4">
          <button
            className="px-3 py-2 rounded-lg bg-gray-700 text-white disabled:opacity-40 flex items-center"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            aria-label="Previous page"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          <span className="text-white font-semibold text-lg">
            {page} / {Math.max(1, Math.ceil(total / pageSize))}
          </span>
          <button
            className="px-3 py-2 rounded-lg bg-gray-700 text-white disabled:opacity-40 flex items-center"
            onClick={() => setPage((p) => Math.min(Math.ceil(total / pageSize), p + 1))}
            disabled={page === Math.ceil(total / pageSize) || total === 0}
            aria-label="Next page"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resultArticles?.map((article) => (
              <ArticleCard key={article.id} article={article} onClick={() => onArticleClick(article)} />
            ))}
          </div>
        </div>

        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-6 h-6 text-orange-500" />
            <h3 className="text-xl font-semibold text-white">Trending & Recommended Articles</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendArticles?.map((article) => (
              <ArticleCard key={article.id} article={article} onClick={() => onArticleClick(article)} />
            ))}
          </div>
        </div>

        <div className="mb-12">
          <GraphPanel trendData={trendData} categories={categories} />
        </div>
      </div>
    </div>
  );
};

// Main App
export default function App() {

  const [currentPage, setCurrentPage] = useState('home');
  const [selectedArticle, setSelectedArticle] = useState(null);

  // Article detail fetcher
  const handleArticleClick = async (article) => {
    try {
      // If article has id, fetch details from backend
      if (article && article.id) {
        const response = await fetch(`http://127.0.0.1:8001/articles/${article.id}`);
        if (!response.ok) throw new Error('Makale detayları alınamadı');
        const data = await response.json();
        setSelectedArticle(data);
        setCurrentPage('detail');
      } else {
        // Fallback: use local article
        setSelectedArticle(article);
        setCurrentPage('detail');
      }
    } catch (error) {
      console.error('Makale detay hatası:', error);
    }
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
      {/* Chatbot removed from homepage, now only in ArticleDetailPage */}
    </>
  );
}
