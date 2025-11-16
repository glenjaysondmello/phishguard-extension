import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  fetchBlacklist,
  addBlacklistDomain,
  removeBlacklistDomain,
} from '../features/blacklistSlice';
import Spinner from '../components/Spinner';

const BlacklistPage = () => {
  const dispatch = useAppDispatch();
  const { items: blacklist, status } = useAppSelector((state) => state.blacklist);
  const [domain, setDomain] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchBlacklist());
    }
  }, [status, dispatch]);

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (domain) {
      dispatch(addBlacklistDomain({ domain, reason }));
      setDomain('');
      setReason('');
    }
  };

  const handleRemove = (domain: string) => {
    if (window.confirm(`Are you sure you want to remove ${domain}?`)) {
      dispatch(removeBlacklistDomain(domain));
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">Manage Blacklist</h1>
      
      <form onSubmit={handleAdd} className="p-4 mb-6 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Add to Blacklist</h3>
        <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-3">
          <div className="sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700">Domain</label>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="example.com"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Reason (Optional)</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Phishing"
            />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button
            type="submit"
            className="px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Domain
          </button>
        </div>
      </form>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {status === 'loading' && <div className="p-4"><Spinner /></div>}
        {status === 'failed' && <p className="p-4 text-red-500">Failed to load blacklist.</p>}
        {status === 'succeeded' && (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domain</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Added</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {blacklist.map((item) => (
                <tr key={item._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.domain}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.reason || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleRemove(item.domain)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default BlacklistPage;