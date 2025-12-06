'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Search, 
  Globe, 
  Menu, 
  User, 
  Home as HomeIcon, 
  Compass, 
  Home, 
  HelpCircle,
  ChevronDown,
  Heart,
  Settings,
  LogOut,
  MessageCircle,
  Eye,
  Star,
  Calendar,
  Bot
} from 'lucide-react';

export default function Header() {
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setShowProfileDropdown(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-gray-900/95 backdrop-blur-lg border-b border-gray-800 shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                <HomeIcon className="w-5 h-5 text-white" />
              </div>
              <span className={`text-2xl font-bold ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
                StayEase
              </span>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link 
                href="/" 
                className={`flex items-center space-x-1 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors ${
                  isScrolled ? 'text-gray-700' : 'text-white hover:text-gray-900'
                }`}
              >
                <HomeIcon className="w-4 h-4" />
                <span>Home</span>
              </Link>
              <Link 
                href="/listings" 
                className={`flex items-center space-x-1 hover:bg-gray-800 px-3 py-2 rounded-lg transition-colors ${
                  isScrolled ? 'text-white hover:text-gray-200' : 'text-white hover:text-gray-200'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>Listings</span>
              </Link>
              <Link 
                href="/bookings" 
                className={`flex items-center space-x-1 hover:bg-gray-800 px-3 py-2 rounded-lg transition-colors ${
                  isScrolled ? 'text-white hover:text-gray-200' : 'text-white hover:text-gray-200'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Bookings</span>
              </Link>
              <Link 
                href="/reviews" 
                className={`flex items-center space-x-1 hover:bg-gray-800 px-3 py-2 rounded-lg transition-colors ${
                  isScrolled ? 'text-white hover:text-gray-200' : 'text-white hover:text-gray-200'
                }`}
              >
                <Star className="w-4 h-4" />
                <span>Reviews</span>
              </Link>
              <Link 
                href="/ai-assistant" 
                className={`flex items-center space-x-1 hover:bg-gray-800 px-3 py-2 rounded-lg transition-colors ${
                  isScrolled ? 'text-white hover:text-gray-200' : 'text-white hover:text-gray-200'
                }`}
              >
                <Bot className="w-4 h-4" />
                <span>AI Assistant</span>
              </Link>
            </nav>
          </div>

          {/* Right side - Language, Login/Profile */}
          <div className="flex items-center space-x-4">
            
            {/* Language Selector */}
            <button className={`flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors ${
              isScrolled ? 'text-white hover:text-gray-200' : 'text-white hover:text-gray-200'
            }`}>
              <Globe className="w-4 h-4" />
              <span className="hidden md:inline">EN</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {/* User Profile/Login */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors ${
                    isScrolled ? 'text-white hover:text-gray-200' : 'text-white hover:text-gray-200'
                  }`}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline">{user.name}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-2">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-white hover:bg-gray-700"
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-white hover:bg-gray-700"
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-white hover:bg-gray-700"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost" className="hover:bg-gray-100">
                    Log in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-indigo-600 hover:bg-indigo-700">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
