import React from 'react';
import ParkingGrid from './components/ParkingGrid';
import GateControls from './components/GateControls';
import StressTest from './components/StressTest';

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header Navigation */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <span className="font-black text-lg text-white">P</span>
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Parklock Engine
            </h1>
            <p className="text-xs text-slate-400 font-mono">Distributed Concurrency & Parking Core</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            System Online
          </span>
        </div>
      </header>

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Live Parking Grid */}
        <section className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>Facility Real-Time Grid</span>
            </h2>
            <span className="text-xs text-slate-400 font-mono">16 Total Managed Bays</span>
          </div>
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
            <ParkingGrid />
          </div>
        </section>

        {/* Right Column: Control Center & Diagnostics */}
        <aside className="flex flex-col gap-6">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white mb-4">Gate Operations</h2>
            <GateControls />
          </div>
          <div>
            <StressTest />
          </div>
        </aside>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 text-center py-4 text-xs text-slate-500 font-mono">
        Parklock Engine Enterprise Architecture &bull; Full-Stack Simulation Dashboard
      </footer>
    </div>
  );
}

export default App;