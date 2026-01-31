import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  fetchReports,
  removeReport,
  updateReportStatus,
} from "../features/reportsSlice";
import {
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  Trash2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Search,
  Users,
  XCircle,
  ChevronDown,
} from "lucide-react";
import type { ReportItem } from "../types/report.types";

const ReportsPage = () => {
  const dispatch = useAppDispatch();
  const {
    items: reports,
    status,
    total,
    page,
    limit,
  } = useAppSelector((state) => state.reports);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchReports({ page }));
  }, [dispatch, page]);

  const totalPages = Math.ceil(total / limit);

  const handleRemove = (reportId: string) => {
    if (window.confirm(`Are you sure you want to remove this report?`)) {
      dispatch(removeReport(reportId));
    }
  };

  const handleStatusChange = (reportId: string, newStatus: string) => {
    dispatch(updateReportStatus({ id: reportId, status: newStatus }));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      dispatch(fetchReports({ page: newPage }));
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 focus:ring-amber-500";
      case "reviewed":
        return "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 focus:ring-blue-500";
      case "resolved":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 focus:ring-emerald-500";
      case "ignored":
        return "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 focus:ring-gray-500";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-3.5 h-3.5" />;
      case "reviewed":
        return <AlertCircle className="w-3.5 h-3.5" />;
      case "resolved":
        return <CheckCircle className="w-3.5 h-3.5" />;
      case "ignored":
        return <XCircle className="w-3.5 h-3.5" />;
      default:
        return <Clock className="w-3.5 h-3.5" />;
    }
  };

  return (
    <>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-10">
        <div className="px-4 py-4 md:px-8 md:py-6">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
            Phishing Reports
          </h2>
          <p className="text-slate-600 mt-1 text-sm md:text-base">
            Manage and review {total} phishing reports
          </p>

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

      {/* Main Content */}
      <div className="p-4 md:p-8 space-y-4">
        {status === "loading" && (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {status === "failed" && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200">
            Failed to load reports.
          </div>
        )}

        {status === "succeeded" &&
          reports
            .filter(
              (r: ReportItem) =>
                !searchTerm ||
                r.url?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.userComment?.toLowerCase().includes(searchTerm.toLowerCase()),
            )
            .map((report: ReportItem) => (
              <div
                key={report._id}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      {/* --- STATUS DROPDOWN --- */}
                      <div className="relative inline-block">
                        <select
                          value={report.status}
                          onChange={(e) =>
                            handleStatusChange(report._id, e.target.value)
                          }
                          className={`appearance-none pl-9 pr-8 py-1.5 rounded-lg text-xs font-bold border cursor-pointer transition-colors focus:outline-none focus:ring-2 ${getStatusStyles(
                            report.status,
                          )}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="reviewed">Reviewed</option>
                          <option value="resolved">Resolved</option>
                          <option value="ignored">Ignored</option>
                        </select>

                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none opacity-80 text-current">
                          {getStatusIcon(report.status)}
                        </div>

                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none opacity-50 text-current">
                          <ChevronDown className="w-3 h-3" />
                        </div>
                      </div>

                      {/* --- AGGREGATION BADGE --- */}
                      {report.reportCount > 1 && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                          <Users className="w-3.5 h-3.5" />
                          {report.reportCount} Reports
                        </span>
                      )}

                      <span className="text-xs text-slate-500 flex items-center gap-1 ml-auto sm:ml-0">
                        <Calendar className="w-3 h-3" />
                        {new Date(report.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* --- URL LINK --- */}
                    <a
                      href={report.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 mb-2 group-hover:underline break-all"
                    >
                      <span>{report.url}</span>
                      <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity shrink-0" />
                    </a>

                    {/* --- COMMENTS SECTION --- */}
                    {report.comments && report.comments.length > 0 && (
                      <div className="mt-3 space-y-1">
                        <p className="text-slate-600 text-sm bg-slate-50 rounded-lg p-3 border border-slate-100">
                          "{report.comments[report.comments.length - 1].text}"
                        </p>
                        {report.comments.length > 1 && (
                          <p className="text-xs text-slate-400 pl-1 font-medium">
                            + {report.comments.length - 1} other comments
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* --- DELETE BUTTON --- */}
                  <button
                    onClick={() => handleRemove(report._id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600 opacity-50 hover:opacity-100"
                    title="Delete Report"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}

        {/* --- PAGINATION --- */}
        {status === "succeeded" && (
          <div className="flex items-center justify-between mt-8 bg-white rounded-xl p-4 shadow-sm border border-slate-100">
            <p className="text-sm text-slate-600">
              Page <span className="font-semibold">{page + 1}</span> of{" "}
              <span className="font-semibold">{totalPages}</span>
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