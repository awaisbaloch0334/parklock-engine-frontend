import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'https://parklock-engine-backend.onrender.com';

const ParkingGrid = () => {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSpots = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/parking/spots`);
      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      setSpots(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to connect to ParkLock Engine backend.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpots();
    const interval = setInterval(fetchSpots, 2000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="text-slate-500 animate-pulse">Loading live garage data...</div>;
  if (error) return <div className="text-red-500 font-semibold">{error}</div>;

  return (
    <div className="grid grid-cols-5 gap-3 w-full">
      {spots.map((spot) => {
        const isAvailable = spot.status === 'AVAILABLE';
        let bgColor = isAvailable ? 'bg-emerald-100' : 'bg-rose-100';
        let borderColor = isAvailable ? 'border-emerald-300' : 'border-rose-300';
        let textColor = isAvailable ? 'text-emerald-700' : 'text-rose-700';

        if (spot.spotType === 'EV_CHARGING') {
          bgColor = isAvailable ? 'bg-blue-100' : 'bg-slate-200';
          borderColor = isAvailable ? 'border-blue-300' : 'border-slate-300';
          textColor = isAvailable ? 'text-blue-700' : 'text-slate-500';
        }

        return (
          <div 
            key={spot.id} 
            className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 ${bgColor} ${borderColor} ${textColor} shadow-sm transition-all`}
          >
            <span className="text-xs font-bold uppercase tracking-wider mb-1">
              {spot.spotType.replace('_', ' ')}
            </span>
            <span className="text-2xl font-black">
              #{spot.spotNumber}
            </span>
            <span className="text-xs font-medium mt-1">
              {spot.status}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default ParkingGrid;