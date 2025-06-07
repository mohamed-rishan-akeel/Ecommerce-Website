import { ReactNode } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../app/store';
import { logout } from '../../features/auth/authSlice';
import { toggleTheme } from '../../features/theme/themeSlice';
import { toast } from 'react-hot-toast';
import {
  MoonIcon,
  SunIcon,
  ShoppingCartIcon,
  UserIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaGithub
} from 'react-icons/fa';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { isDarkMode } = useTheme();

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
    toast.success(`Switched to ${isDarkMode ? 'light' : 'dark'} mode`);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-lg backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90 border-b border-gray-100 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-8">
              <Link 
                to="/" 
                className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent hover:opacity-90 transition-opacity"
              >
                Nexon
              </Link>
              
              {/* Navigation Links */}
              <div className="hidden md:flex items-center space-x-6">
                <Link to="/products" className="nav-link">Products</Link>
                <Link to="/categories" className="nav-link">Categories</Link>
                <Link to="/deals" className="nav-link">Deals</Link>
              </div>
            </div>

            {/* Search, Theme, Cart, and User Menu */}
            <div className="flex items-center space-x-6">
              {/* Search */}
              <div className="hidden md:flex items-center">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="input w-64 pl-10 pr-4 py-2 rounded-full"
                  />
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={handleThemeToggle}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label="Toggle theme"
              >
                {isDarkMode ? (
                  <SunIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                ) : (
                  <MoonIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                )}
              </button>

              {/* Cart Icon */}
              <Link to="/cart" className="nav-link relative p-2">
                <ShoppingCartIcon className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  0
                </span>
              </Link>

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="relative group">
                  <button className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                    <UserIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{user?.name}</span>
                  </button>
                  <div className="dropdown-menu absolute right-0 mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link to="/profile" className="dropdown-item">
                      <UserIcon className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                    <button onClick={handleLogout} className="dropdown-item w-full">
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link to="/login" className="nav-link">Login</Link>
                  <Link to="/register" className="btn btn-primary">Register</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 shadow-lg mt-auto border-t border-gray-100 dark:border-gray-700">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Nexon</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Your one-stop shop for all things tech. Quality products, competitive prices, and excellent service.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="footer-link">About Us</Link></li>
                <li><Link to="/contact" className="footer-link">Contact</Link></li>
                <li><Link to="/faq" className="footer-link">FAQ</Link></li>
                <li><Link to="/shipping" className="footer-link">Shipping Info</Link></li>
              </ul>
            </div>

            {/* Customer Service */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Customer Service</h3>
              <ul className="space-y-2">
                <li><Link to="/returns" className="footer-link">Returns Policy</Link></li>
                <li><Link to="/privacy" className="footer-link">Privacy Policy</Link></li>
                <li><Link to="/terms" className="footer-link">Terms & Conditions</Link></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Stay Updated</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Subscribe to our newsletter for the latest updates and exclusive offers.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="input flex-1 rounded-r-none"
                />
                <button className="btn btn-primary rounded-l-none">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <p className="text-gray-600 dark:text-gray-400">
                © {new Date().getFullYear()} Nexon. All rights reserved.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="social-icon"><FaFacebook className="h-5 w-5" /></a>
                <a href="#" className="social-icon"><FaTwitter className="h-5 w-5" /></a>
                <a href="#" className="social-icon"><FaInstagram className="h-5 w-5" /></a>
                <a href="#" className="social-icon"><FaLinkedin className="h-5 w-5" /></a>
                <a href="#" className="social-icon"><FaGithub className="h-5 w-5" /></a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 