import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchReports, removeReport } from "../features/reportsSlice";
import Spinner from "../components/Spinner";

const ReportsPage = () => {
  const dispatch = useAppDispatch();
  const {
    items: reports,
    status,
    total,
    page,
    limit,
  } = useAppSelector((state) => state.reports);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    dispatch(fetchReports({ page: currentPage }));
  }, [dispatch, currentPage]);

  const totalPages = Math.ceil(total / limit);

  const handleRemove = (reportId: string) => {
    if (window.confirm(`Are you sure you want to remove this report?`)) {
      dispatch(removeReport(reportId));
    }
  };

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">
        Manage Reports
      </h1>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {status === "loading" && (
          <div className="p-4">
            <Spinner />
          </div>
        )}
        {status === "failed" && (
          <p className="p-4 text-red-500">Failed to load reports.</p>
        )}
        {status === "succeeded" && (
          <>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    URL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Comment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reports.map((report: any) => (
                  <tr key={report._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          report.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 truncate max-w-xs">
                      <a
                        href={report.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {report.url}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-sm">
                      {report.userComment || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(report.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleRemove(report._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center justify-between p-4 border-t">
              <span className="text-sm text-gray-700">
                Showing page {page + 1} of {totalPages} ({total} total reports)
              </span>
              <div className="space-x-2">
                <button
                  onClick={handlePrev}
                  disabled={page === 0}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={handleNext}
                  disabled={page + 1 >= totalPages}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
