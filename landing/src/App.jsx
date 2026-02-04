import { useState } from 'react';
import Hero from './components/Hero';
import Features from './components/Features';
import LoginDrawer from './components/LoginDrawer';

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const handleGetStarted = () => {
    window.location.href = 'http://localhost:3000';
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero onGetStarted={handleGetStarted} />

      {/* Features Section */}
      <Features />

      {/* Login Drawer */}
      <LoginDrawer isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔥</span>
              <span className="text-xl font-bold">BurnAware</span>
            </div>
            <p className="text-gray-400 text-sm text-center md:text-right">
              © 2025 BurnAware. Your mental wellness journey matters.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

