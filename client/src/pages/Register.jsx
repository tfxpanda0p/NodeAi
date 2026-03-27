import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Eye, EyeOff } from 'lucide-react';

export default function Register({ setUser }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('nodeAiUser', JSON.stringify(data.data));
        setUser(data.data);
        navigate('/canvas');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch {
      setError('Network error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center w-full h-[calc(100vh-4rem)] pt-16 bg-[var(--color-carbon-black)] relative overflow-hidden">
      {/* Interactive Background Elements */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#0ea5e9]/10 rounded-full blur-[120px] mix-blend-screen animate-[pulse_5s_ease-in-out_infinite] z-0 pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[var(--color-cyber-green)]/10 rounded-full blur-[120px] mix-blend-screen animate-[pulse_7s_ease-in-out_infinite] z-0 pointer-events-none" style={{ animationDelay: '1s' }}></div>

      <div className="bg-[var(--color-dark-charcoal)] p-8 rounded-2xl shadow-2xl border border-gray-700/50 w-full max-w-md z-10 backdrop-blur-sm relative">
        <h2 className="text-2xl font-bold text-[var(--color-light-ash)] mb-6 flex items-center gap-2">
          <UserPlus className="text-[var(--color-cyber-green)]" />
          Create an Account
        </h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm text-[var(--color-medium-gray)] mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[var(--color-carbon-black)] border border-gray-700 text-[var(--color-light-ash)] rounded-md p-3 focus:outline-none focus:border-[var(--color-cyber-green)] focus:ring-1 focus:ring-[var(--color-cyber-green)]"
              placeholder="Your Name"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-[var(--color-medium-gray)] mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[var(--color-carbon-black)] border border-gray-700 text-[var(--color-light-ash)] rounded-md p-3 focus:outline-none focus:border-[var(--color-cyber-green)] focus:ring-1 focus:ring-[var(--color-cyber-green)]"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-[var(--color-medium-gray)] mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[var(--color-carbon-black)] border border-gray-700 text-[var(--color-light-ash)] rounded-md p-3 pr-10 focus:outline-none focus:border-[var(--color-cyber-green)] focus:ring-1 focus:ring-[var(--color-cyber-green)]"
                placeholder="••••••••"
                required
                minLength={6}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[var(--color-light-ash)] transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`mt-4 w-full py-3 rounded-lg font-bold shadow-lg transition-all ${isLoading ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-[var(--color-cyber-green)] text-[var(--color-carbon-black)] hover:bg-[#0ea5e9] hover:-translate-y-1 shadow-[var(--color-cyber-green)]/20 hover:shadow-[var(--color-cyber-green)]/40'}`}
          >
            {isLoading ? 'Creating...' : 'Register'}
          </button>
        </form>

        <p className="mt-6 text-sm text-[var(--color-medium-gray)] text-center">
          Already have an account? <Link to="/login" className="text-[var(--color-cyber-green)] hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
