import React, { useState, useEffect, useRef } from 'react';
import { ChevronUp, ChevronDown, Quote, User, Calendar, X } from 'lucide-react';

const ArticleReels = ({ onArticleClick, onClose }) => {
  // Article type for random articles
  type Article = {
    id: number;
    title: string;
    abstract?: string;
    keywords?: string;
    author_names?: string;
    publication_date?: string;
    citation_count?: number;
    summary?: string;
  };
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        // Only use random articles endpoint for Keşfet
        const response = await fetch('http://127.0.0.1:8001/articles?israndom=true');
        const data = await response.json();
        setArticles(Array.isArray(data.items) ? data.items : []);
      } catch (error) {
        console.error('Error fetching random articles:', error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const handleScroll = (direction) => {
    if (direction === 'up' && currentIndex < articles.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (direction === 'down' && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      handleScroll('up');
    }
    if (touchStart - touchEnd < -75) {
      handleScroll('down');
    }
  };

  const handleWheel = (e) => {
    e.preventDefault();
    if (e.deltaY > 0) {
      handleScroll('up');
    } else {
      handleScroll('down');
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, [currentIndex, articles.length]);

  const handleReadMore = async (article) => {
    try {
      const response = await fetch(`http://localhost:8000/articles/${article.id}`);
      const detailData = await response.json();
      if (onArticleClick) {
        onArticleClick(detailData);
      }
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error fetching article details:', error);
      if (onArticleClick) {
        onArticleClick(article);
      }
      if (onClose) {
        onClose();
      }
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-gray-950 flex items-center justify-center">
        <div className="text-white text-xl">Makaleler yükleniyor...</div>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="fixed inset-0 z-50 bg-gray-950 flex items-center justify-center">
        <div className="text-white text-xl">Makale bulunamadı</div>
      </div>
    );
  }

  return (
  <div className="fixed inset-0 z-50 bg-gray-950 overflow-hidden">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-3 bg-gray-800/50 backdrop-blur-md rounded-full text-white hover:bg-gray-700/50 transition-colors border border-gray-700"
      >
        <X className="w-6 h-6" />
      </button>

      <div
        ref={containerRef}
        className="relative h-full w-full"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="absolute inset-0 transition-transform duration-500 ease-out"
          style={{
            transform: `translateY(-${currentIndex * 100}vh)`
          }}
        >
          {articles.map((article, index) => (
            <div
              key={article.id}
              className="h-screen w-full flex items-center justify-center p-6"
            >
              <div className="relative w-full max-w-2xl h-[85vh] rounded-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-purple-500/30 p-10 flex flex-col justify-between shadow-2xl shadow-purple-500/20">
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-4 py-2 bg-blue-600/20 backdrop-blur-sm rounded-full text-blue-300 text-sm font-medium border border-blue-500/30">
                      {article.keywords || 'Research'}
                    </span>
                    <div className="flex items-center gap-2 bg-purple-600/20 backdrop-blur-sm px-3 py-1 rounded-full border border-purple-500/30">
                      <Quote className="w-3 h-3 text-purple-400" />
                      <span className="text-purple-300 text-sm">{article.citation_count || 0}</span>
                    </div>
                  </div>
                  
                  <h2 className="text-4xl font-bold text-white leading-tight drop-shadow-lg">
                    {article.title}
                  </h2>

                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4 text-purple-400" />
                      <span>{article.author_names?.split(',')[0] || article.authors?.split(',')[0] || 'Unknown'} et al.</span>
                    </div>
                    <span className="text-gray-600">•</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-purple-400" />
                      <span>{article.publication_date?.slice(0, 4) || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 flex items-center overflow-y-auto my-6">
                  <div className="bg-black/40 backdrop-blur-md rounded-xl p-5 border border-purple-500/20 shadow-lg">
                    <p className="text-gray-200 text-lg leading-relaxed">
                      {article.abstract_compressed}
                    </p>
                  </div>
                </div>

                <div className="flex items-end justify-end">
                  <button
                    onClick={() => handleReadMore(article)}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full font-semibold transition-all shadow-lg shadow-purple-500/30"
                  >
                    Read More
                  </button>
                </div>

                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  {articles.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-1 h-8 rounded-full transition-all ${
                        idx === currentIndex ? 'bg-purple-500' : 'bg-gray-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {currentIndex > 0 && (
        <button
          onClick={() => handleScroll('down')}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-40 p-3 bg-gray-800/50 backdrop-blur-md rounded-full text-white hover:bg-gray-700/50 transition-colors border border-gray-700"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}

      {currentIndex < articles.length - 1 && (
        <button
          onClick={() => handleScroll('up')}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 p-3 bg-gray-800/50 backdrop-blur-md rounded-full text-white hover:bg-gray-700/50 transition-colors border border-gray-700"
        >
          <ChevronDown className="w-6 h-6" />
        </button>
      )}

      <div className="fixed bottom-4 right-4 z-40 px-4 py-2 bg-gray-800/50 backdrop-blur-md rounded-full text-white text-sm border border-gray-700">
        {currentIndex + 1} / {articles.length}
      </div>
    </div>
  );
};

export default ArticleReels;
