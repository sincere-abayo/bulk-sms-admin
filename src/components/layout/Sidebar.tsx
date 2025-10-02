import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiUsers,
  FiMessageSquare,
  FiBarChart,
  FiSettings,
  FiX,
  FiChevronRight,
  FiActivity
} from 'react-icons/fi';
import { useTheme } from '../../contexts/ThemeContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: FiHome,
    description: 'Overview & metrics',
    badge: null
  },
  {
    name: 'Users',
    href: '/users',
    icon: FiUsers,
    description: 'User management',
    badge: null
  },
  {
    name: 'Messages',
    href: '/messages',
    icon: FiMessageSquare,
    description: 'SMS campaigns',
    badge: '23'
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: FiBarChart,
    description: 'Reports & insights',
    badge: null
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: FiSettings,
    description: 'Configuration',
    badge: null
  },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { theme } = useTheme();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="sidebar-backdrop"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-card shadow-large transform transition-all duration-300 ease-in-out border-r border-border
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        {/* Header */}
        <div className="flex items-center justify-between h-14 px-5 border-b border-border">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">BS</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">BulkSMS Pro</h2>
              <p className="text-xs text-muted-foreground">Admin</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
            aria-label="Close sidebar"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-2 px-3 custom-scrollbar">
          <div className="space-y-2">
            {/* Main Navigation */}
            <div className="space-y-1">
              {navigation.slice(0, 3).map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => onClose()}
                    className={`
                      nav-item group relative overflow-hidden px-3 py-2.5 rounded-lg transition-all duration-200
                      ${isActive ? 'nav-item-active bg-primary-50 dark:bg-primary-900/30' : 'hover:bg-secondary-50 dark:hover:bg-secondary-800/50'}
                    `}
                    aria-label={`${item.name} - ${item.description}`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center flex-1 min-w-0">
                        <div className={`
                          p-1.5 rounded-md mr-3 transition-all duration-200
                          ${isActive
                            ? 'bg-primary-100 dark:bg-primary-900/50'
                            : 'bg-secondary-100 dark:bg-secondary-800 group-hover:bg-secondary-200 dark:group-hover:bg-secondary-700'
                          }
                        `}>
                          <item.icon
                            className={`
                              h-3.5 w-3.5 transition-colors duration-200
                              ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-muted-foreground group-hover:text-foreground'}
                            `}
                            aria-hidden="true"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-foreground truncate">
                              {item.name}
                            </span>
                            {item.badge && (
                              <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-medium bg-error-100 dark:bg-error-900/50 text-error-700 dark:text-error-400 rounded-full">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <FiChevronRight
                        className={`
                          h-3.5 w-3.5 transition-all duration-200 ml-1 flex-shrink-0
                          ${isActive
                            ? 'text-primary-600 dark:text-primary-400 opacity-100'
                            : 'text-muted-foreground opacity-0 group-hover:opacity-100'
                          }
                        `}
                        aria-hidden="true"
                      />
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Separator */}
            <div className="px-3 py-2">
              <div className="h-px bg-border"></div>
            </div>

            {/* Secondary Navigation */}
            <div className="space-y-1">
              {navigation.slice(3).map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => onClose()}
                    className={`
                      nav-item group relative overflow-hidden px-3 py-2 rounded-md transition-all duration-200
                      ${isActive ? 'nav-item-active bg-primary-50 dark:bg-primary-900/30' : 'hover:bg-secondary-50 dark:hover:bg-secondary-800/50'}
                    `}
                    aria-label={`${item.name} - ${item.description}`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center flex-1 min-w-0">
                        <div className={`
                          p-1 rounded-md mr-2 transition-all duration-200
                          ${isActive
                            ? 'bg-primary-100 dark:bg-primary-900/50'
                            : 'bg-secondary-100 dark:bg-secondary-800 group-hover:bg-secondary-200 dark:group-hover:bg-secondary-700'
                          }
                        `}>
                          <item.icon
                            className={`
                              h-3 w-3 transition-colors duration-200
                              ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-muted-foreground group-hover:text-foreground'}
                            `}
                            aria-hidden="true"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium text-foreground truncate">
                            {item.name}
                          </span>
                        </div>
                      </div>
                      <FiChevronRight
                        className={`
                          h-3 w-3 transition-all duration-200 flex-shrink-0
                          ${isActive
                            ? 'text-primary-600 dark:text-primary-400 opacity-100'
                            : 'text-muted-foreground opacity-0 group-hover:opacity-100'
                          }
                        `}
                        aria-hidden="true"
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        {/* System Status Section */}
        <div className="mt-6 px-3">
          <div className="p-3 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg border border-border/50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-medium text-foreground">System Status</h3>
              <div className="flex items-center space-x-1">
                <span className="inline-block w-2 h-2 bg-success-500 rounded-full animate-pulse"></span>
                <span className="text-xs text-success-600 dark:text-success-400 font-medium">Online</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-center p-2 bg-card rounded-md border border-border/30">
                <div className="text-xs text-muted-foreground">API Response</div>
                <div className="text-sm font-medium text-success-600 dark:text-success-400">89ms</div>
              </div>
              <div className="text-center p-2 bg-card rounded-md border border-border/30">
                <div className="text-xs text-muted-foreground">Uptime</div>
                <div className="text-sm font-medium text-success-600 dark:text-success-400">99.9%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-border bg-secondary-50/50 dark:bg-secondary-900/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-primary-600 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-xs">BS</span>
              </div>
              <div>
                <div className="text-xs font-medium text-foreground">BulkSMS Pro</div>
                <div className="text-xs text-muted-foreground">v1.0.0</div>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <span className="inline-block w-1.5 h-1.5 bg-success-500 rounded-full animate-pulse"></span>
              <span className="text-xs text-success-600 dark:text-success-400 font-medium">Live</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar; 