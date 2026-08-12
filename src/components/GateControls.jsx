import React, { useState } from 'react';

// Your live Render API URL
const API_BASE_URL = 'https://parklock-engine-backend.onrender.com';

const GateControls = () => {
  const [licensePlate, setLicensePlate] = useState('');
  const [vehicleType, setVehicleType] = useState('STANDARD');
  const [ticketNumber, setTicketNumber] = useState('');
  const [message, setMessage] = useState('');

  const handlePark = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/parking/park`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ licensePlate, vehicleType }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(`Success! Parked at Spot #${data.spotId}. Ticket: ${data.ticketNumber}`);
      } else {
        setMessage(`Error: ${data.message || 'Could not park vehicle'}`);
      }
    } catch (error) {
      setMessage('Network error connecting to backend.');
    }
  };

  const handleUnpark = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/parking/unpack/${ticketNumber}`, {
        method: 'POST'
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(`Success! Vehicle has left.`);
      } else {
        setMessage(`Error: ${data.message || 'Could not unpark vehicle'}`);
      }
    } catch (error) {
      setMessage('Network error connecting to backend.');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Entry Gate Card */}
      <div className="p-5 bg-slate-900 border border-slate-800 shadow-xl rounded-2xl backdrop-blur-sm">
        <h3 className="font-bold text-white mb-3 text-base flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          Entry Gate (Park)
        </h3>
        <input 
          type="text" 
          placeholder="License Plate (e.g., ABC-123)" 
          className="w-full mb-3 p-3 bg-slate-950 border border-slate-800 text-white placeholder-slate-500 rounded-xl outline-none focus:border-emerald-500 transition text-sm font-mono"
          value={licensePlate}
          onChange={(e) => setLicensePlate(e.target.value)}
        />
        <select 
          className="w-full mb-4 p-3 bg-slate-950 border border-slate-800 text-white rounded-xl outline-none focus:border-emerald-500 transition text-sm cursor-pointer"
          value={vehicleType}
          onChange={(e) => setVehicleType(e.target.value)}
        >
          <option value="STANDARD" className="bg-slate-900 text-white">Standard Vehicle</option>
          <option value="EV_CHARGING" className="bg-slate-900 text-white">Electric Vehicle</option>
          <option value="DISABLED_ACCESS" className="bg-slate-900 text-white">Disabled Access</option>
        </select>
        <button 
          onClick={handlePark}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-xl transition shadow-lg shadow-emerald-950/50 text-sm tracking-wide"
        >
          Issue Ticket & Park
        </button>
      </div>

      {/* Exit Gate Card */}
      <div className="p-5 bg-slate-900 border border-slate-800 shadow-xl rounded-2xl backdrop-blur-sm">
        <h3 className="font-bold text-white mb-3 text-base flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-500"></span>
          Exit Gate (Unpark)
        </h3>
        <input 
          type="text" 
          placeholder="Ticket Number (e.g., TKT-12345)" 
          className="w-full mb-4 p-3 bg-slate-950 border border-slate-800 text-white placeholder-slate-500 rounded-xl outline-none focus:border-rose-500 transition text-sm font-mono"
          value={ticketNumber}
          onChange={(e) => setTicketNumber(e.target.value)}
        />
        <button 
          onClick={handleUnpark}
          className="w-full bg-rose-600 hover:bg-rose-500 text-white font-semibold py-3 rounded-xl transition shadow-lg shadow-rose-950/50 text-sm tracking-wide"
        >
          Process Payment & Exit
        </button>
      </div>

      {/* Message Output */}
      {message && (
        <div className="p-4 bg-slate-900 border border-slate-800 text-indigo-300 rounded-xl text-xs font-mono shadow-lg leading-relaxed">
          {message}
        </div>
      )}
    </div>
  );
};

export default GateControls;