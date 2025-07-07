import React, { useState, useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import SearchBar from '@/components/molecules/SearchBar'
import { AuthContext } from '@/App'

const Header = ({ onSearch, savedCount = 0 }) => {
const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { logout } = useContext(AuthContext)
  const { user } = useSelector((state) => state.user)

  const navigation = [
    { name: 'Browse', href: '/browse', icon: 'Home' },
    { name: 'Map View', href: '/map', icon: 'Map' },
    { name: 'Saved', href: '/saved', icon: 'Heart', count: savedCount }
  ]

  const isActive = (path) => location.pathname === path

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-header border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <ApperIcon name="Home" size={20} className="text-white" />
            </div>
            <span className="font-display text-xl font-bold text-gradient">
              PropView
            </span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 justify-center px-8">
            <SearchBar onSearch={onSearch} />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <ApperIcon name={item.icon} size={18} />
                <span>{item.name}</span>
                {item.count > 0 && (
                  <span className="bg-accent text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                    {item.count}
                  </span>
                )}
              </Link>
            ))}
</nav>

          {/* User Menu and Mobile Menu Button */}
          <div className="flex items-center space-x-2">
            {/* User Info */}
            {user && (
              <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-lg">
                <span className="text-sm text-gray-700">
                  {user.firstName} {user.lastName}
                </span>
              </div>
            )}
            
            {/* Logout Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="hidden md:flex items-center"
            >
              <ApperIcon name="LogOut" size={16} className="mr-2" />
              Logout
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <SearchBar onSearch={onSearch} />
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden pb-4"
          >
            <nav className="flex flex-col space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center space-x-2">
                    <ApperIcon name={item.icon} size={18} />
                    <span>{item.name}</span>
                  </div>
                  {item.count > 0 && (
                    <span className="bg-accent text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                      {item.count}
                    </span>
                  )}
</Link>
              ))}
              
              {/* Mobile User Info and Logout */}
              {user && (
                <div className="pt-4 border-t border-gray-200 mt-4">
                  <div className="px-4 py-2 text-sm text-gray-700">
                    Logged in as {user.firstName} {user.lastName}
                  </div>
                  <Button
                    variant="ghost"
                    onClick={logout}
                    className="w-full justify-start text-gray-700 hover:bg-gray-100"
                  >
                    <ApperIcon name="LogOut" size={16} className="mr-2" />
                    Logout
                  </Button>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  )
}

export default Header