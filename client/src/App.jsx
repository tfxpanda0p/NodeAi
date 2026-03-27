import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Canvas from './pages/Canvas';
import Login from './pages/Login';
import Register from './pages/Register';
import History from './pages/History';
import DotGrid from './components/DotGrid';
import './App.css';

function App() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('nodeAiUser');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (e) {
        console.error("Failed to parse user", e);
      }
    }
    return null;
  });

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-[var(--color-carbon-black)] text-[var(--color-light-ash)] relative overflow-hidden">
        {/* Advanced Interactive Dot Grid Background */}
        <div className="fixed inset-0 z-0">
          <DotGrid
            dotSize={5}
            gap={15}
            baseColor="#271E37"
            activeColor="#5227FF"
            proximity={120}
            shockRadius={250}
            shockStrength={5}
            resistance={750}
            returnDuration={1.5}
          />
        </div>

        <div className="fixed top-[-5%] left-[-10%] w-[50%] h-[50%] bg-[var(--color-cyber-green)]/05 rounded-full blur-[140px] pointer-events-none animate-pulse z-0 hidden md:block"></div>
        <div className="fixed bottom-[-5%] right-[-10%] w-[50%] h-[50%] bg-[#0ea5e9]/05 rounded-full blur-[140px] pointer-events-none animate-pulse z-0 hidden md:block" style={{ animationDelay: '3s' }}></div>
        
        <Navbar user={user} setUser={setUser} />
        <div className="flex-1 flex flex-col z-10">
          <Routes>
            <Route path="/" element={user ? <Navigate to="/canvas" /> : <Home user={user} />} />
            <Route path="/canvas" element={<Canvas user={user} />} />
            <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/" />} />
            <Route path="/register" element={!user ? <Register setUser={setUser} /> : <Navigate to="/" />} />
            <Route path="/history" element={user ? <History /> : <Navigate to="/login" />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
