import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Replace with your actual Render backend URL!
  const API_URL = 'https://parklock-engine-api.onrender.com/api/admin/audit-logs';

  const fetchLogs = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setAuditLogs(data);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    
    // Optional: Auto-refresh the logs every 5 seconds so you 
    // don't have to refresh the page after parking a car!
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-400 font-mono animate-pulse">Fetching secure database logs...</div>;
  }

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-700/50 bg-slate-900/50">
      <table className="min-w-full text-left text-sm whitespace-nowrap">
        <thead className="tracking-wider border-b border-slate-700/50 bg-slate-800/50 text-slate-400 font-mono text-xs">
          <tr>
            <th className="px-6 py-4 font-semibold">Timestamp</th>
            <th className="px-6 py-4 font-semibold">Action</th>
            <th className="px-6 py-4 font-semibold">License Plate</th>
            <th className="px-6 py-4 font-semibold">Ticket ID</th>
            <th className="px-6 py-4 font-semibold">Details</th>
          </tr>
        </thead>
        <tbody className="text-slate-300">
          {auditLogs.map((log) => (
            <tr key={log.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
              <td className="px-6 py-4 font-mono text-xs text-slate-400">
                {new Date(log.timestamp).toLocaleString()}
              </td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  log.action.includes('PARKED') ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 
                  log.action.includes('UNPARKED') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                  'bg-slate-700/30 text-slate-400 border border-slate-600/30'
                }`}>
                  {log.action.replace(/_/g, ' ')}
                </span>
              </td>
              <td className="px-6 py-4 font-mono font-medium text-amber-200/90">{log.licensePlate || 'N/A'}</td>
              <td className="px-6 py-4 font-mono text-xs text-slate-500">
                {log.ticketNumber ? log.ticketNumber.substring(0, 8) + '...' : 'N/A'}
              </td>
              <td className="px-6 py-4 text-slate-400">{log.details}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {auditLogs.length === 0 && (
        <div className="p-8 text-center text-slate-500 font-mono text-sm">
          No audit logs found. Try parking a vehicle first!
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;