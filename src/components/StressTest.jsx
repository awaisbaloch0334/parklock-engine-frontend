import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'https://parklock-engine-backend.onrender.com';

const StressTest = () => {
  const [logs, setLogs] = useState([]);
  const [isTesting, setIsTesting] = useState(false);
  const [savedTickets, setSavedTickets] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('parklock_test_tickets');
    if (stored) {
      setSavedTickets(JSON.parse(stored));
    }
  }, []);

  const runConcurrencyTest = async () => {
    setIsTesting(true);
    setLogs(['Initializing dynamic massive concurrency payload...']);
    
    const spotTypes = ['STANDARD', 'EV_CHARGING', 'DISABLED_ACCESS'];

    const requests = Array.from({ length: 20 }, () => {
      // 1. Dynamically generate a completely random vehicle type
      const randomType = spotTypes[Math.floor(Math.random() * spotTypes.length)];
      
      // 2. Dynamically generate a random license plate (e.g., DYN-4821)
      const randomPlate = `DYN-${Math.floor(1000 + Math.random() * 9000)}`;
      
      return fetch(`${API_BASE_URL}/api/v1/parking/park`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ licensePlate: randomPlate, vehicleType: randomType }),
      })
      .then(async (res) => {
        const data = await res.json();
        // Pass the random plate down the promise chain so we can log it
        return { status: res.status, data, plate: randomPlate };
      })
      .catch(() => ({ status: 500, data: { message: 'Network Failure' }, plate: randomPlate }));
    });

    const results = await Promise.all(requests);
    
    const successfulTickets = [...savedTickets]; 
    
    const newLogs = results.map((res) => {
      if (res.status === 201 || res.status === 200) {
        if (res.data.ticketNumber) successfulTickets.push(res.data.ticketNumber);
        return `✅ [${res.plate}] Success: Parked in Spot #${res.data.spotId}`;
      }
      return `❌ [${res.plate}] Rejected: ${res.data.message || 'Capacity Reached'}`;
    });

    setSavedTickets(successfulTickets);
    localStorage.setItem('parklock_test_tickets', JSON.stringify(successfulTickets));
    
    setLogs(newLogs);
    setIsTesting(false);
  };

  const runCleanup = async () => {
    setIsTesting(true);
    setLogs([`Found ${savedTickets.length} tickets in memory. Unparking...`]);

    const unparkRequests = savedTickets.map(ticket => 
      fetch(`${API_BASE_URL}/api/v1/parking/unpack/${ticket}`, {
        method: 'POST'
      })
      .then(res => res.ok ? `✅ Unpacked Ticket: ${ticket}` : `❌ Failed: ${ticket}`)
      .catch(() => `❌ Network error: ${ticket}`)
    );

    const results = await Promise.all(unparkRequests);
    
    setSavedTickets([]);
    localStorage.removeItem('parklock_test_tickets');
    
    setLogs(results);
    setIsTesting(false);
  };

  return (
    <div className="p-4 bg-slate-800 text-white shadow-sm rounded-xl mt-6 border border-slate-700">
      <h3 className="font-bold mb-2 text-lg text-indigo-400">System Stress Diagnostics</h3>
      <p className="text-sm text-slate-300 mb-4">
        Fires 20 simultaneous, dynamically generated API payloads to verify database locks.
      </p>
      
      <div className="flex flex-col gap-3">
        <button 
          onClick={runConcurrencyTest}
          disabled={isTesting}
          className="w-full bg-indigo-600 font-bold py-2.5 rounded hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {isTesting ? 'Simulating Traffic Spike...' : 'Execute Concurrency Test'}
        </button>
        
        {savedTickets.length > 0 && (
          <button 
            onClick={runCleanup}
            disabled={isTesting}
            className="w-full bg-rose-600 font-bold py-2.5 rounded hover:bg-rose-700 transition disabled:opacity-50"
          >
            Automated Cleanup (Unpark {savedTickets.length} Vehicles)
          </button>
        )}
      </div>
      
      <div className="mt-4 h-48 overflow-y-auto bg-slate-900 p-3 rounded text-xs font-mono space-y-1">
        {logs.length === 0 ? (
          <span className="text-slate-500">Awaiting test execution...</span>
        ) : (
          logs.map((log, i) => <div key={i}>{log}</div>)
        )}
      </div>
    </div>
  );
};

export default StressTest;