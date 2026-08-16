import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { SignedIn, SignedOut, SignIn, UserButton, useUser } from '@clerk/clerk-react';
import ParkingGrid from './components/ParkingGrid';
import GateControls from './components/GateControls';
import StressTest from './components/StressTest';
import AdminDashboard from './components/AdminDashboard';

// Replace this with your exact Gmail address that you use to log into Clerk!
const ADMIN_EMAIL = "awaisbaloch0334@gmail.com"; 

const NavigationHeader = () => {
  const { user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const isAdmin = userEmail === ADMIN_EMAIL;

  return (
    <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <span className="font-black text-lg text-white">P</span>
        </div>
        <div>
          <Link to="/" className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
            Parklock Engine
          </Link>
          <p className="text-xs text-slate-400 font-mono">Distributed Concurrency & Parking Core</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Admin Quick Button (Only appears if YOU are logged in) */}
        <SignedIn>
          {isAdmin && (
            <Link 
              to="/admin" 
              className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/20 transition-all flex items-center gap-1.5 shadow-lg shadow-indigo-500/10"
            >
              <span>🔒 Admin Dashboard</span>
            </Link>
          )}
          <UserButton afterSignOutUrl="/" />
        </SignedIn>

        <SignedOut>
          <Link 
            to="/admin" 
            className="px-4 py-1.5 rounded-lg text-xs font-mono font-medium bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 transition-all"
          >
            Sign In
          </Link>
        </SignedOut>

        <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          System Online
        </span>
      </div>
    </header>
  );
};

const PublicView = () => (
  <div className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
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

    <aside className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-white mb-4">Gate Operations</h2>
        <GateControls />
      </div>
      <div>
        <StressTest />
      </div>
    </aside>
  </div>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
        
        {/* Dynamic Navigation Header */}
        <NavigationHeader />

        {/* Main Routing Area */}
        <main className="flex-1 w-full flex flex-col">
          <Routes>
            <Route path="/" element={<PublicView />} />

            <Route 
              path="/admin" 
              element={
                <>
                  <SignedIn>
                    <div className="max-w-7xl mx-auto p-6 w-full mt-6">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                          <span>Database Audit Log</span>
                        </h2>
                        <span className="text-xs text-slate-400 font-mono">Secure Admin View</span>
                      </div>
                      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm shadow-xl overflow-hidden">
                        <AdminDashboard />
                      </div>
                    </div>
                  </SignedIn>
                  
                  <SignedOut>
                    <div className="flex flex-col items-center justify-center mt-20">
                      <div className="mb-6 text-center">
                        <h2 className="text-2xl font-bold text-white mb-2">Admin Portal</h2>
                        <p className="text-slate-400">Sign in to access secure facility logs</p>
                      </div>
                      <SignIn routing="hash" afterSignInUrl="/admin" afterSignUpUrl="/admin" />
                    </div>
                  </SignedOut>
                </>
              } 
            />
          </Routes>
        </main>

        <footer className="border-t border-slate-900 text-center py-4 text-xs text-slate-500 font-mono">
          Parklock Engine Enterprise Architecture &bull; Full-Stack Simulation Dashboard
        </footer>
      </div>
    </Router>
  );
}

export default App;