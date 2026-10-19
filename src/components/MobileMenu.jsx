import { useState, useEffect } from 'react';
import { Menu, X, User, Briefcase, Layers, Globe, Mail } from 'lucide-react';

const MobileMenu = ({ profileData, onViewChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.mobile-menu-container')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.classList.toggle('scroll-locked', isOpen);
    return () => document.body.classList.remove('scroll-locked');
  }, [isOpen]);

  const handleNavClick = (view) => {
    onViewChange(view);
    setIsOpen(false);
  };

  const navItems = [
    { icon: User, label: 'About Me', view: 'me' },
    { icon: Briefcase, label: 'Projects/Case Studies', view: 'projects' },
    { icon: Layers, label: 'Skills', view: 'skills' },
    { icon: Mail, label: 'Contact', view: 'contact' },
  ];

  const footerLinks = [
    { label: 'ayers.repair', href: profileData.contact.portfolio },
    { label: 'AssembleJS', href: profileData.contact.assemblejs },
  ];

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 md:hidden"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? (
          <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        ) : (
          <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-60 md:hidden animate-fade-in" 
          onClick={() => setIsOpen(false)} 
        />
      )}

      {/* Slide-out Menu */}
      <div
        className={`mobile-menu-container fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 backdrop-blur-xl shadow-2xl z-70 transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full bg-white dark:bg-gray-900">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img src="/ai-profile.png" alt="Arlo" className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">{profileData.personal.name}</h2>
                <p className="text-xs text-gray-600 dark:text-gray-400">Navigation</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 py-4 bg-white dark:bg-gray-900">
            <ul className="space-y-1">
              {navItems.map(({ icon: Icon, label, view }) => (
                <li key={view}>
                  <button
                    onClick={() => handleNavClick(view)}
                    className="w-full flex items-center gap-3 px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                  >
                    <Icon className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                    <span className="text-gray-900 dark:text-white font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer Links */}
          <div className="border-t border-gray-200 dark:border-gray-800 p-4 bg-gray-50 dark:bg-gray-800">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wider">My Companies</h3>
            <ul className="space-y-2">
              {footerLinks.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1"
                  >
                    <Globe className="w-4 h-4" />
                    <span>{label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;