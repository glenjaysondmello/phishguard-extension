import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchReports, removeReport } from "../features/reportsSlice";
import { Calendar, Clock, AlertCircle, CheckCircle, Trash2, ExternalLink, ChevronLeft, ChevronRight, Search } from 'lucide-react';

const ReportsPage = () => {
  const dispatch = useAppDispatch();
  const { items: reports, status, total, page, limit } = useAppSelector((state) => state.reports);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchReports({ page }));
  }, [dispatch, page]);

  const totalPages = Math.ceil(total / limit);

  const handleRemove = (reportId: string) => {
    if (window.confirm(`Are you sure you want to remove this report?`)) {
      dispatch(removeReport(reportId));
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      dispatch(fetchReports({ page: newPage }));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'reviewed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resolved': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-3 h-3" />;
      case 'reviewed': return <AlertCircle className="w-3 h-3" />;
      case 'resolved': return <CheckCircle className="w-3 h-3" />;
      default: return null;
    }
  };

  return (
    <>
      <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-10">
        <div className="px-8 py-6">
          <h2 className="text-3xl font-bold text-slate-900">Phishing Reports</h2>
          <p className="text-slate-600 mt-1">Manage and review {total} phishing reports</p>
          
          <div className="mt-6 relative max-w-2xl">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search visible reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
        </div>
      </header>

      <div className="p-8 space-y-4">
        {status === 'loading' && (
           <div className="flex justify-center p-12">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
           </div>
        )}

        {status === 'failed' && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200">
            Failed to load reports.
          </div>
        )}

        {status === 'succeeded' && reports
          .filter((r: any) => 
            !searchTerm || 
            r.url?.toLowerCase().includes(searchTerm.toLowerCase()) || 
            r.userComment?.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((report: any) => (
          <div key={report._id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border ${getStatusColor(report.status)}`}>
                    {getStatusIcon(report.status)}
                    {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(report.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <a href={report.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 mb-2 group-hover:underline">
                  <span className="truncate">{report.url}</span>
                  <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                </a>
                {report.userComment && (
                  <p className="text-slate-600 text-sm mt-2 bg-slate-50 rounded-lg p-3 border border-slate-100">"{report.userComment}"</p>
                )}
              </div>
              <button onClick={() => handleRemove(report._id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600 opacity-50 hover:opacity-100">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
        
        {/* Pagination */}
        {status === 'succeeded' && (
          <div className="flex items-center justify-between mt-8 bg-white rounded-xl p-4 shadow-sm border border-slate-100">
            <p className="text-sm text-slate-600">
              Page <span className="font-semibold">{page + 1}</span> of <span className="font-semibold">{totalPages}</span>
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 0}
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-slate-600" />
              </button>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages - 1}
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ReportsPage;