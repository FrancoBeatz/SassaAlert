import React, { useState } from 'react';
import { Bell, Menu, X, CreditCard } from 'lucide-react';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'subscribe', label: 'Subscribe' },
    { id: 'dates', label: 'Pay Dates' },
    { id: 'ai-help', label: 'Ask AI Helper' },
  ];

  const handleNav = (id: string) => {
    onNavigate(id);
    setIsOpen(false);
  };

  return (
    <nav className="bg-white border-b-4 border-orange-500 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => handleNav('home')}>
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="bg-orange-600 p-2 rounded-lg text-white">
                <CreditCard size={24} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl text-gray-900 tracking-tight leading-none">Sassa<span className="text-orange-600">Alert</span></span>
                <span className="text-xs text-gray-500 font-medium tracking-wider">PAYDAY NOTIFICATIONS</span>
              </div>
            </div>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`${
                  currentPage === item.id
                    ? 'text-orange-600 font-bold border-b-2 border-orange-600'
                    : 'text-gray-500 hover:text-orange-500'
                } px-3 py-2 text-sm font-medium transition-colors`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => handleNav('subscribe')}
              className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-transform active:scale-95 shadow-lg shadow-orange-200"
            >
              <Bell size={16} />
              Get Alerts
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-500 hover:text-orange-600 focus:outline-none p-2"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`block w-full text-left px-3 py-3 rounded-md text-base font-medium ${
                  currentPage === item.id
                    ? 'bg-orange-50 text-orange-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            ))}
             <button
              onClick={() => handleNav('subscribe')}
              className="w-full mt-4 bg-orange-600 text-white px-3 py-3 rounded-md text-base font-bold flex items-center justify-center gap-2"
            >
              <Bell size={18} />
              Subscribe Now
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;