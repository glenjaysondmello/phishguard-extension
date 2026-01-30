import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchBlacklist, addBlacklistDomain, removeBlacklistDomain } from '../features/blacklistSlice';
import { Ban, Calendar, Trash2, Plus, X } from 'lucide-react';
import type { BlacklistItem } from '../types/blacklist.types';

const BlacklistPage = () => {
  const dispatch = useAppDispatch();
  const { items: blacklist, status } = useAppSelector((state) => state.blacklist);
   
  const [showAddModal, setShowAddModal] = useState(false);
  const [domain, setDomain] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchBlacklist());
    }
  }, [status, dispatch]);

  const handleAdd = () => {
    if (domain) {
      dispatch(addBlacklistDomain({ domain, reason }));
      setDomain('');
      setReason('');
      setShowAddModal(false);
    }
  };

  const handleRemove = (domain: string) => {
    if (window.confirm(`Are you sure you want to remove ${domain}?`)) {
      dispatch(removeBlacklistDomain(domain));
    }
  };

  return (
    <>
      <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-10">
        <div className="px-4 py-4 md:px-8 md:py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Domain Blacklist</h2>
            <p className="text-slate-600 mt-1 text-sm md:text-base">Manage {blacklist.length} blacklisted domains</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 font-medium"
          >
            <Plus className="w-5 h-5" />
            Add Domain
          </button>
        </div>
      </header>

      <div className="p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
         {status === 'loading' && (
           <div className="col-span-full flex justify-center p-12">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
           </div>
         )}

         {status === 'failed' && (
           <div className="col-span-full bg-red-50 text-red-600 p-4 rounded-xl border border-red-200">
             Failed to load blacklist.
           </div>
         )}

        {status === 'succeeded' && blacklist.map((item: BlacklistItem) => (
          <div key={item._id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-medium border border-red-200 flex items-center gap-1">
                  <Ban className="w-3 h-3" /> Blacklisted
                </span>
                <button 
                    onClick={() => handleRemove(item.domain)} 
                    className="p-2 -mr-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <h3 className="text-lg font-semibold text-slate-900 break-all leading-tight">
                {item.domain}
              </h3>
              
              <p className="text-slate-600 text-sm mt-2 mb-3 line-clamp-2">
                {item.reason || 'No reason provided'}
              </p>
            </div>
            <div className="pt-3 border-t border-slate-50">
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Added {new Date(item.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-end md:items-center justify-center z-50 p-0 md:p-4">
          <div className="bg-white rounded-t-2xl md:rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all animate-in slide-in-from-bottom-10 md:slide-in-from-bottom-0">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">Add to Blacklist</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Domain</label>
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="example.com"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Reason (Optional)</label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g., Phishing"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-3 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-medium">
                  Cancel
                </button>
                <button onClick={handleAdd} className="flex-1 px-4 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all font-medium">
                  Add Domain
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BlacklistPage;