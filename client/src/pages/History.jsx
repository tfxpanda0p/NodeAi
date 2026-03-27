import { useState, useEffect, useMemo } from 'react';
import { History as HistoryIcon, Search, AlertCircle, Calendar, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

export default function History() {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState({});
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const fetchHistory = async (page = 1, append = false) => {
    if (append) setIsMoreLoading(true);
    else setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/history?limit=10&page=${page}`, {
        credentials: 'include'
      });
      const data = await response.json();

      if (response.ok && data.success) {
        if (append) {
          setHistory(prev => [...prev, ...data.data]);
        } else {
          setHistory(data.data);
        }
        setPagination(data.pagination);
      } else {
        setError(data.message || 'Failed to fetch history.');
      }
    } catch {
      setError('Failed to fetch history');
    } finally {
      setIsLoading(false);
      setIsMoreLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(1, false);
  }, []);

  const handleLoadMore = () => {
    if (pagination.page < pagination.pages) {
      fetchHistory(pagination.page + 1, true);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this interaction?')) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/history/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setHistory(prev => prev.filter(item => item._id !== id));
        setPagination(prev => ({ ...prev, total: prev.total - 1 }));
      } else {
        alert(data.message || 'Deletion failed.');
      }
    } catch {
      alert('Failed to delete interaction');
    }
  };

  const toggleExpand = (index) => {
    setExpandedItems(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const filteredHistory = useMemo(() => {
    return history.filter(item => 
      item.prompt.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.response.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [history, searchQuery]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex-1 w-full min-h-screen pt-24 px-6 pb-20 bg-[var(--color-carbon-black)] relative">
      {/* Background Glows */}
      <div className="fixed top-20 right-[-10%] w-[30%] h-[30%] bg-[#0ea5e9]/05 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-5xl mx-auto z-10 relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[var(--color-cyber-green)]/10 rounded-xl border border-[var(--color-cyber-green)]/20 shadow-[0_0_20px_var(--color-cyber-green)]/10">
              <HistoryIcon size={24} className="text-[var(--color-cyber-green)]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[var(--color-light-ash)] tracking-tight">Your Interactions</h1>
              <p className="text-[var(--color-medium-gray)] text-sm mt-1">{pagination.total} items found total</p>
            </div>
          </div>

          <div className="relative group flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-medium-gray)] group-focus-within:text-[var(--color-cyber-green)] transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search prompts or responses..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[var(--color-dark-charcoal)] border border-gray-700/50 rounded-2xl py-3 pl-12 pr-4 text-[var(--color-light-ash)] focus:outline-none focus:border-[var(--color-cyber-green)]/50 focus:ring-1 focus:ring-[var(--color-cyber-green)]/30 transition-all shadow-xl"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="bg-[var(--color-dark-charcoal)]/50 border border-gray-700/30 p-8 rounded-3xl h-64 animate-pulse"></div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/50 p-8 rounded-3xl flex flex-col items-center gap-4 text-center max-w-lg mx-auto">
            <AlertCircle size={40} className="text-red-500" />
            <h3 className="text-xl font-bold text-red-400">Unable to load history</h3>
            <p className="text-red-300/80">{error}</p>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="bg-[var(--color-dark-charcoal)] border border-gray-700/50 p-16 rounded-3xl text-center shadow-2xl backdrop-blur-sm max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search size={32} className="text-gray-600" />
            </div>
            <h3 className="text-2xl font-bold text-[var(--color-light-ash)] mb-3">No Records Found</h3>
            <p className="text-[var(--color-medium-gray)] text-lg">
              {searchQuery ? `No results match "${searchQuery}"` : "You haven't saved any AI flows yet. Start your journey on the canvas!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredHistory.map((item, index) => (
              <div key={index} className="group bg-[var(--color-dark-charcoal)]/80 border border-gray-700/50 hover:border-[var(--color-cyber-green)]/30 hover:bg-[var(--color-dark-charcoal)] transition-all duration-300 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
                <div className="p-1 pb-0">
                  <div className="bg-[var(--color-carbon-black)]/60 rounded-t-2xl p-6 border-b border-gray-800/50">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-[var(--color-medium-gray)]">
                        <Calendar size={14} />
                        <span className="text-xs font-medium tracking-tighter uppercase">{formatDate(item.createdAt)}</span>
                      </div>
                    </div>
                    <p className="text-[var(--color-light-ash)] font-medium text-sm leading-relaxed line-clamp-3">
                      {item.prompt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-5 bg-gradient-to-b from-transparent to-[var(--color-cyber-green)]/02 flex-1 flex flex-col">
                   <div className="flex items-center justify-between mb-3">
                     <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[var(--color-cyber-green)] opacity-80">AI Analysis</span>
                     <button 
                       onClick={() => toggleExpand(index)}
                       className="text-[var(--color-medium-gray)] hover:text-[var(--color-light-ash)] transition-colors p-1"
                     >
                       {expandedItems[index] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                     </button>
                   </div>
                   
                   <div className={`relative overflow-hidden transition-all duration-500 ${expandedItems[index] ? 'max-h-[1000px]' : 'max-h-24'}`}>
                      <p className="text-[var(--color-medium-gray)] text-sm leading-relaxed whitespace-pre-wrap italic">
                        "{item.response}"
                      </p>
                      {!expandedItems[index] && item.response.length > 150 && (
                        <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-[var(--color-dark-charcoal)] to-transparent pointer-events-none"></div>
                      )}
                   </div>
                </div>

                <div className="px-6 py-4 bg-gray-900/40 border-t border-gray-800/50 flex items-center justify-end gap-3 translate-y-1 opacity-100 group-hover:translate-y-0 transition-all duration-300">
                   <button 
                     onClick={() => handleDelete(item._id)}
                     className="flex items-center gap-1.5 text-xs font-bold text-red-400/70 hover:text-red-400 transition-colors"
                   >
                     <Trash2 size={14} /> Delete Record
                   </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {pagination.page < pagination.pages && (
          <div className="mt-16 flex justify-center pb-10">
            <button 
              onClick={handleLoadMore}
              disabled={isMoreLoading}
              className="bg-[var(--color-dark-charcoal)] border border-gray-700 hover:border-[var(--color-cyber-green)]/50 text-[var(--color-light-ash)] px-10 py-4 rounded-2xl font-bold shadow-2xl transition-all hover:-translate-y-1 flex items-center gap-3 disabled:opacity-50 disabled:translate-y-0"
            >
              {isMoreLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[var(--color-cyber-green)] border-t-transparent rounded-full animate-spin"></div>
                  Loading...
                </>
              ) : (
                'Load More Results'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
