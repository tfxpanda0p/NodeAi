import { Link, useNavigate } from 'react-router-dom';
import { LogOut, History, Layout, UserCircle } from 'lucide-react';

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      localStorage.removeItem('nodeAiUser');
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="w-full bg-[var(--color-dark-charcoal)] border-b border-gray-700/50 p-4 flex justify-between items-center text-[var(--color-light-ash)] h-16 shadow-md z-50 absolute top-0 left-0">
      <div className="flex items-center gap-6">
        <Link to="/" className="font-bold text-lg flex items-center gap-2 text-[var(--color-cyber-green)] hover:text-[#0ea5e9] transition-colors">
          <div className="w-3 h-3 rounded-full bg-[var(--color-cyber-green)] shadow-[0_0_8px_var(--color-cyber-green)]"></div>
          NodeAI
        </Link>
        {user && (
          <Link to="/canvas" className="flex items-center gap-2 hover:text-[var(--color-cyber-green)] transition-colors">
            <Layout size={18} /> Canvas
          </Link>
        )}
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link to="/history" className="flex items-center gap-2 hover:text-[var(--color-cyber-green)] transition-colors">
              <History size={18} /> History
            </Link>
            <div className="flex items-center gap-2 ml-4 text-[var(--color-medium-gray)] border-l border-gray-700 pl-4">
              <UserCircle size={20} />
              <span>{user.name}</span>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 ml-4 text-red-400 hover:text-red-300 transition-colors">
              <LogOut size={18} /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-[var(--color-cyber-green)] transition-colors">Login</Link>
            <Link to="/register" className="bg-[var(--color-cyber-green)] text-[var(--color-carbon-black)] px-4 py-2 rounded-md font-semibold hover:bg-[#0ea5e9] transition-colors shadow-lg shadow-[var(--color-cyber-green)]/20 hover:shadow-[var(--color-cyber-green)]/40 hover:-translate-y-0.5">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
