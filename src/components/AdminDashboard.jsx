import React, { useState, useEffect } from 'react';
import { useAuth } from "@clerk/clerk-react";

const AdminDashboard = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pricePerHour, setPricePerHour] = useState("5.00");
  const [newPriceInput, setNewPriceInput] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  
  const { getToken } = useAuth();

  const API_BASE = 'https://parklock-engine-backend.onrender.com/api/v1/admin';

  const fetchData = async () => {
    try {
      const token = await getToken();

      // Fetch audit logs and current price concurrently
      const [logsRes, priceRes] = await Promise.all([
        fetch(`${API_BASE}/audit-logs`, {
          headers: { "Authorization": `Bearer ${token}` }
        }),
        fetch(`${API_BASE}/config/price`, {
          headers: { "Authorization": `Bearer ${token}` }
        })
      ]);

      if (logsRes.ok) {
        const logsData = await logsRes.json();
        setAuditLogs(logsData);
      }

      if (priceRes.ok) {
        const priceData = await priceRes.text();
        setPricePerHour(priceData);
      }
    } catch (error) {
      console.error("Error loading admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Handle Price Update
  const handleUpdatePrice = async (e) => {
    e.preventDefault();
    try {
      const token = await getToken();
      const response = await fetch(`${API_BASE}/config/price`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ pricePerHour: parseFloat(newPriceInput) })
      });

      if (response.ok) {
        setStatusMessage("Price successfully updated!");
        setPricePerHour(newPriceInput);
        setNewPriceInput("");
        fetchData();
      } else {
        setStatusMessage("Failed to update price.");
      }
    } catch (err) {
      console.error(err);
      setStatusMessage("Error updating price.");
    }
    setTimeout(() => setStatusMessage(""), 4000);
  };

  // Handle Force Unpark / Override
  const handleForceUnpark = async (spotId) => {
    if (!window.confirm(`Are you sure you want to forcefully clear Parking Bay #${spotId}?`)) return;
    
    try {
      const token = await getToken();
      const response = await fetch(`${API_BASE}/force-unpark/${spotId}`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        setStatusMessage(`Bay #${spotId} successfully cleared.`);
        fetchData();
      } else {
        setStatusMessage("Override command failed.");
      }
    } catch (err) {
      console.error(err);
      setStatusMessage("Error executing override.");
    }
    setTimeout(() => setStatusMessage(""), 4000);
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-400 font-mono animate-pulse">Loading secure enterprise command center...</div>;
  }

  return (
    <div className="flex flex-col space-y-6">
      {/* Top Action Feedback Banner */}
      {statusMessage && (
        <div className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 px-4 py-3 rounded-xl font-mono text-xs flex items-center justify-between">
          <span>⚡ {statusMessage}</span>
          <button onClick={() => setStatusMessage("")} className="hover:text-white">&times;</button>
        </div>
      )}

      {/* Admin Control Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Pricing Configuration Card */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-mono text-slate-400 uppercase tracking-wider mb-2">Dynamic Facility Pricing</h3>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-3xl font-black text-white">${pricePerHour}</span>
              <span className="text-xs text-slate-400 font-mono">per hour</span>
            </div>
          </div>
          <form onSubmit={handleUpdatePrice} className="flex gap-2">
            <input 
              type="number" 
              step="0.01"
              placeholder="New rate ($)" 
              value={newPriceInput}
              onChange={(e) => setNewPriceInput(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 flex-1 font-mono"
              required
            />
            <button 
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-indigo-600/20"
            >
              Update Rate
            </button>
          </form>
        </div>

        {/* Quick Override Actions Card */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-mono text-slate-400 uppercase tracking-wider mb-2">Emergency Override Center</h3>
            <p className="text-xs text-slate-400 mb-4">
              Use this tool when a vehicle fails to unpark normally or a gate sensor jams.
            </p>
          </div>
          <div className="flex gap-2">
            <input 
              type="number" 
              id="emergencySpotId"
              placeholder="Enter Bay ID #" 
              className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500 flex-1 font-mono"
            />
            <button 
              onClick={() => {
                const spotId = document.getElementById('emergencySpotId').value;
                if(spotId) handleForceUnpark(spotId);
              }}
              className="px-4 py-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-600/30 rounded-xl text-sm font-medium transition-colors"
            >
              Force Clear Bay
            </button>
          </div>
        </div>

      </div>

      {/* Audit Log Table Header */}
      <div className="flex justify-between items-center px-1">
        <h3 className="text-lg font-bold text-white tracking-tight">Live NeonDB Audit Logs & Activity Stream</h3>
        <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          Clerk Secured &bull; Live Sync Active
        </span>
      </div>

      {/* Database Table */}
      <div className="w-full overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm shadow-xl">
        <table className="min-w-full text-left text-sm whitespace-nowrap">
          <thead className="tracking-wider border-b border-slate-800 bg-slate-800/40 text-slate-400 font-mono text-xs">
            <tr>
              <th className="px-6 py-4 font-semibold">Timestamp</th>
              <th className="px-6 py-4 font-semibold">Action</th>
              <th className="px-6 py-4 font-semibold">Performed By</th>
              <th className="px-6 py-4 font-semibold">License Plate</th>
              <th className="px-6 py-4 font-semibold">Bay ID</th>
              <th className="px-6 py-4 font-semibold">Details</th>
            </tr>
          </thead>
          <tbody className="text-slate-300">
            {auditLogs.map((log) => (
              <tr key={log.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                <td className="px-6 py-4 font-mono text-xs text-slate-400">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono ${
                    log.action.includes('PARKED') ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 
                    log.action.includes('UNPARKED') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                    'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {log.action.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono text-xs text-indigo-300">{log.userEmail || 'system'}</td>
                <td className="px-6 py-4 font-mono font-medium text-amber-200/90">{log.licensePlate || 'N/A'}</td>
                <td className="px-6 py-4 font-mono text-xs text-slate-400">
                  {log.spotId ? `#${log.spotId}` : 'N/A'}
                </td>
                <td className="px-6 py-4 text-slate-400">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {auditLogs.length === 0 && (
          <div className="p-12 text-center text-slate-500 font-mono text-sm">
            No audit logs found in NeonDB. Try performing an action!
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;