import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, History, Layout, MousePointer2 } from 'lucide-react';
import Hyperspeed from '../components/Hyperspeed';

export default function Home({ user }) {
  const navigate = useNavigate();

  return (
    <div className="flex-1 w-full min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden bg-black">
      {/* Hyperspeed Effect Background */}
      <div className="absolute inset-x-0 top-0 h-[80vh] z-0 overflow-hidden pointer-events-none">
        <Hyperspeed
          effectOptions={{
            distortion: 'turbulentDistortion',
            length: 400,
            roadWidth: 10,
            islandWidth: 2,
            lanesPerRoad: 3,
            fov: 90,
            fovSpeedUp: 150,
            speedUp: 2,
            carLightsFade: 0.4,
            totalSideLightSticks: 20,
            lightPairsPerRoadWay: 40,
            shoulderLinesWidthPercentage: 0.05,
            brokenLinesWidthPercentage: 0.1,
            brokenLinesLengthPercentage: 0.5,
            lightStickWidth: [0.12, 0.5],
            lightStickHeight: [1.3, 1.7],
            movingAwaySpeed: [60, 80],
            movingCloserSpeed: [-120, -160],
            carLightsLength: [12, 80],
            carLightsRadius: [0.05, 0.14],
            carWidthPercentage: [0.3, 0.5],
            carShiftX: [-0.8, 0.8],
            carFloorSeparation: [0, 5],
            colors: {
              roadColor: 0x080808,
              islandColor: 0x0a0a0a,
              background: 0x000000,
              shoulderLines: 0x131318,
              brokenLines: 0x131318,
              leftCars: [0xd856bf, 0x6750a2, 0xc247ac],
              rightCars: [0x03b3c3, 0x0e5ea5, 0x324555],
              sticks: 0x03b3c3
            }
          }}
        />
        {/* Bottom Fade to blend with content */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
      </div>

      {/* Hero Section Content */}
      <div className="max-w-4xl w-full text-center z-10 space-y-8 pt-20">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-cyber-green)]/10 border border-[var(--color-cyber-green)]/20 text-[var(--color-cyber-green)] text-xs font-bold tracking-widest uppercase animate-pulse">
          <Zap size={14} /> The Future of AI Visualization
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black text-[var(--color-light-ash)] tracking-tighter">
          Node<span className="text-[var(--color-cyber-green)] glow-text">AI</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-[var(--color-medium-gray)] max-w-2xl mx-auto leading-relaxed font-light">
          Design, connect, and deploy intelligent workflows through an interactive 
          <span className="text-[var(--color-light-ash)] font-medium"> visual canvas</span>. 
          Manage your evolution in real-time.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-8">
          <button 
            onClick={() => navigate(user ? '/canvas' : '/register')}
            className="group relative px-10 py-5 bg-[var(--color-cyber-green)] text-[var(--color-carbon-black)] font-bold rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_var(--color-cyber-green)]/30"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="relative flex items-center gap-2 text-lg">
              {user ? 'Launch Workspace' : 'Get Started Free'} <ArrowRight size={20} />
            </span>
          </button>
          
          {!user && (
            <button 
              onClick={() => navigate('/login')}
              className="px-10 py-5 bg-white/05 border border-white/10 text-[var(--color-light-ash)] font-bold rounded-2xl hover:bg-white/10 transition-all backdrop-blur-sm"
            >
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full mt-32 z-10 pb-20">
        <div className="glass-card p-8 rounded-3xl space-y-4 hover:border-[var(--color-cyber-green)]/30 transition-colors group">
          <div className="p-3 bg-white/05 w-fit rounded-xl group-hover:bg-[var(--color-cyber-green)]/10 transition-colors">
            <Layout size={24} className="text-[var(--color-cyber-green)]" />
          </div>
          <h3 className="text-xl font-bold text-[var(--color-light-ash)]">Visual Architecture</h3>
          <p className="text-[var(--color-medium-gray)] text-sm leading-relaxed">
            Construct complex AI logic using our state-of-the-art React Flow canvas. Link inputs to outputs with a single drag.
          </p>
        </div>

        <div className="glass-card p-8 rounded-3xl space-y-4 hover:border-[var(--color-cyber-green)]/30 transition-colors group">
          <div className="p-3 bg-white/05 w-fit rounded-xl group-hover:bg-[var(--color-cyber-green)]/10 transition-colors">
            <History size={24} className="text-[var(--color-cyber-green)]" />
          </div>
          <h3 className="text-xl font-bold text-[var(--color-light-ash)]">Smart History</h3>
          <p className="text-[var(--color-medium-gray)] text-sm leading-relaxed">
            Every interaction is automatically preserved. Search, organize, and manage your AI journey with ease.
          </p>
        </div>

        <div className="glass-card p-8 rounded-3xl space-y-4 hover:border-[var(--color-cyber-green)]/30 transition-colors group">
          <div className="p-3 bg-white/05 w-fit rounded-xl group-hover:bg-[var(--color-cyber-green)]/10 transition-colors">
            <MousePointer2 size={24} className="text-[var(--color-cyber-green)]" />
          </div>
          <h3 className="text-xl font-bold text-[var(--color-light-ash)]">Interactive Flux</h3>
          <p className="text-[var(--color-medium-gray)] text-sm leading-relaxed">
            Experience a living UI. Responsive particles and shockwave effects make the background breathe with your actions.
          </p>
        </div>
      </div>
    </div>
  );
}
