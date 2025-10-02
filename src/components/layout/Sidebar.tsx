import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiUsers,
  FiMessageSquare,
  FiBarChart,
  FiSettings,
  FiX,
  FiChevronRight,
  FiActivity,
  FiMoon,
  FiSun,
  FiChevronDown,
  FiChevronUp,
  FiServer,
  FiClock,
  FiZap,
  FiLayers,
  FiShield,
  FiHelpCircle
} from 'react-icons/fi';
import { useTheme } from '../../contexts/ThemeContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: FiHome,
    description: "Overview & metrics",
    badge: null,
    category: "main"
  },
  {
    name: "Users",
    href: "/users",
    icon: FiUsers,
    description: "User management",
    badge: "New",
    category: "main"
  },
  {
    name: "Messages",
    href: "/messages",
    icon: FiMessageSquare,
    description: "SMS campaigns",
    badge: "23",
    category: "main"
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: FiBarChart,
    description: "Reports & insights",
    badge: null,
    category: "analytics"
  },
  {
    name: "Templates",
    href: "/templates",
    icon: FiLayers,
    description: "Message templates",
    badge: null,
    category: "resources"
  },
  {
    name: "Settings",
    href: "/settings",
    icon: FiSettings,
    description: "Configuration",
    badge: null,
    category: "settings"
  },
  {
    name: "Help & Support",
    href: "/help",
    icon: FiHelpCircle,
    description: "Documentation & support",
    badge: null,
    category: "settings"
  },
];

const categories = [
  {
    id: "main",
    name: "Main",
    icon: FiHome
  },
  {
    id: "analytics",
    name: "Analytics",
    icon: FiBarChart
  },
  {
    id: "resources",
    name: "Resources",
    icon: FiLayers
  },
  {
    id: "settings",
    name: "Settings",
    icon: FiSettings
  }
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { theme, toggleTheme, resolvedTheme } = useTheme();
  const [expandedCategories, setExpandedCategories] = useState<{[key: string]: boolean}>({
    main: true,
    analytics: true,
    resources: true,
    settings: true
  });
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-card to-card/95 backdrop-blur-sm
        shadow-2xl transform transition-all duration-300 ease-in-out border-r border-border/20
        flex flex-col h-screen overflow-hidden
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0 lg:shadow-lg
      `}
      >
        {/* Header */}
        <div className={`flex items-center justify-between h-16 px-6 transition-all duration-300 ${
          isScrolled ? 'shadow-sm border-b border-border/10' : ''
        }`}>
          <Link to="/dashboard" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-primary-500/20 transition-all duration-300">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" fillOpacity="0.9"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="transition-all duration-300">
              <h2 className="text-lg font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                BulkSMS Pro
              </h2>
              <p className="text-xs font-medium bg-gradient-to-r from-muted-foreground to-muted-foreground/80 bg-clip-text text-transparent">
                Admin Panel
              </p>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
            aria-label="Close sidebar"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto custom-scrollbar py-4 px-2">
            {categories.map((category) => {
              const categoryItems = navigation.filter(item => item.category === category.id);
              const isExpanded = expandedCategories[category.id];

              return (
                <div key={category.id} className="mb-6 last:mb-0">
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full flex items-center justify-between px-4 py-2 rounded-lg hover:bg-secondary-100/50 dark:hover:bg-secondary-800/30 transition-colors duration-200 group"
                  >
                    <div className="flex items-center space-x-2">
                      <category.icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">
                        {category.name}
                      </span>
                    </div>
                    {isExpanded ? (
                      <FiChevronUp className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    ) : (
                      <FiChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    )}
                  </button>

                  <div className={`mt-1 space-y-1 transition-all duration-300 overflow-hidden ${
                    isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    {categoryItems.map((item) => {
                      const isActive = location.pathname.startsWith(item.href);
                      const Icon = item.icon;

                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          onClick={() => onClose()}
                          className={`
                            group flex items-center px-4 py-2.5 rounded-xl mx-2 transition-all duration-300
                            ${
                              isActive
                                ? "bg-primary-500/10 text-primary-600 dark:text-primary-400 font-medium"
                                : "text-muted-foreground hover:bg-secondary-100/50 dark:hover:bg-secondary-800/50 hover:text-foreground"
                            }
                          `}
                          aria-label={`${item.name} - ${item.description}`}
                        >
                          <div className={`p-1.5 rounded-lg mr-3 transition-all duration-300 ${
                            isActive
                              ? "bg-primary-500/20 text-primary-600 dark:text-primary-400"
                              : "bg-secondary-100 dark:bg-secondary-800 group-hover:bg-secondary-200/70 dark:group-hover:bg-secondary-700/70"
                          }`}>
                            <Icon className={`h-4 w-4 transition-colors duration-300 ${
                              isActive
                                ? "text-primary-600 dark:text-primary-400"
                                : "text-muted-foreground group-hover:text-foreground"
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium truncate">
                                {item.name}
                              </span>
                              {item.badge && (
                                <span className={`ml-2 px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                                  item.badge === 'New'
                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400'
                                    : 'bg-primary-100 text-primary-800 dark:bg-primary-500/20 dark:text-primary-400'
                                }`}>
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground truncate">
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </nav>

        {/* System Status & Footer */}
        <div className="border-t border-border/20 bg-gradient-to-t from-background/80 to-background/50 backdrop-blur-sm">
          {/* System Status */}
          <div className="px-4 pt-4">
            <div className="relative p-4 rounded-xl bg-gradient-to-br from-primary-500/5 to-primary-500/10 border border-primary-500/10 overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-24 h-24 -mr-6 -mt-6 bg-primary-500/5 rounded-full"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 -ml-8 -mb-8 bg-primary-500/5 rounded-full"></div>

              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <FiServer className="h-4 w-4 text-primary-500" />
                    <h3 className="text-sm font-medium text-foreground">
                      System Status
                    </h3>
                  </div>
                  <div className="flex items-center space-x-1.5 px-2 py-1 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      Operational
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2.5 bg-white dark:bg-secondary-800/50 backdrop-blur-sm rounded-lg border border-border/30 shadow-sm">
                    <div className="flex items-center space-x-2 mb-1">
                      <FiZap className="h-3.5 w-3.5 text-amber-500" />
                      <span className="text-xs text-muted-foreground">API Response</span>
                    </div>
                    <div className="text-sm font-semibold text-foreground">
                      <span className="text-emerald-500">89</span>ms
                    </div>
                  </div>

                  <div className="p-2.5 bg-white dark:bg-secondary-800/50 backdrop-blur-sm rounded-lg border border-border/30 shadow-sm">
                    <div className="flex items-center space-x-2 mb-1">
                      <FiClock className="h-3.5 w-3.5 text-blue-500" />
                      <span className="text-xs text-muted-foreground">Uptime</span>
                    </div>
                    <div className="text-sm font-semibold text-foreground">
                      <span className="text-emerald-500">99.9</span>%
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-border/10">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Last updated</span>
                    <span className="font-medium">Just now</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Theme Toggle & Footer */}
          <div className="px-4 pb-4 pt-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-secondary-100/50 dark:hover:bg-secondary-800/30 transition-all duration-300 group"
              aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-1.5 rounded-lg transition-colors duration-300 ${
                  resolvedTheme === 'dark'
                    ? 'bg-amber-500/10 text-amber-500'
                    : 'bg-indigo-500/10 text-indigo-500'
                }`}>
                  {resolvedTheme === 'dark' ? (
                    <FiSun className="h-4 w-4" />
                  ) : (
                    <FiMoon className="h-4 w-4" />
                  )}
                </div>
                <span className="text-sm font-medium text-foreground">
                  {resolvedTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </span>
              </div>
              <div className={`p-1 rounded-lg transition-all duration-300 ${
                resolvedTheme === 'dark'
                  ? 'bg-amber-500/10 text-amber-500'
                  : 'bg-indigo-500/10 text-indigo-500'
              }`}>
                <div className="h-4 w-4 flex items-center justify-center">
                  {resolvedTheme === 'dark' ? (
                    <FiSun className="h-3 w-3" />
                  ) : (
                    <FiMoon className="h-3 w-3" />
                  )}
                </div>
              </div>
            </button>

            {/* Footer */}
            <div className="mt-3 pt-3 border-t border-border/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow">
                    <span className="text-white font-bold text-xs">BS</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      BulkSMS Pro
                    </div>
                    <div className="text-xs text-muted-foreground font-medium">v1.0.0</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    className="p-1.5 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800/50 transition-colors"
                    aria-label="Help & Support"
                    onClick={() => window.open('https://help.bulksmspro.com', '_blank')}
                  >
                    <FiHelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
