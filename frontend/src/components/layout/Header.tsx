import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCrisis } from '../../context/CrisisContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Search, 
  Bell, 
  HelpCircle, 
  ChevronDown, 
  ChevronRight, 
  ShieldCheck, 
  Check, 
  Plus,
  LogOut,
  Building2
} from 'lucide-react';

export const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, organization, logout } = useAuth();
  const { 
    crises, 
    activeCrisis, 
    setActiveCrisisId,
    notifications,
    setNotificationsOpen,
    showToast
  } = useCrisis();

  const [crisisDropdownOpen, setCrisisDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const unreadCount = notifications.filter(n => n.unread).length;

  const getBreadcrumbTitle = () => {
    const path = location.pathname;
    if (path === '/' || path === '/overview') return { section: 'Dashboard', page: 'Overview' };
    if (path.startsWith('/crisis/new')) return { section: 'Crisis Triage', page: 'New Crisis Entry' };
    if (path.startsWith('/inventory')) return { section: 'Supply Chain', page: 'Inventory Analytics' };
    if (path.startsWith('/decision-center')) return { section: 'Core Platform', page: 'Decision Center' };
    if (path.startsWith('/simulations')) return { section: 'Decision Support', page: 'Strategy Simulator' };
    if (path.startsWith('/past-decisions')) return { section: 'Organizational Memory', page: 'Past Decisions' };
    if (path.startsWith('/memory')) return { section: 'HindSight Engine', page: 'Organizational Memory' };
    if (path.startsWith('/insights')) return { section: 'Intelligence', page: 'Discovered Patterns' };
    if (path.startsWith('/reports')) return { section: 'Executive Briefs', page: 'Reports & Export' };
    if (path.startsWith('/settings')) return { section: 'Administration', page: 'Settings' };
    if (path.startsWith('/help')) return { section: 'Support', page: 'Knowledge & Help' };
    return { section: 'CrisisPilot', page: 'Overview' };
  };

  const breadcrumb = getBreadcrumbTitle();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    showToast(
      'Search Filter Applied',
      `Searching memory base and SKUs for "${searchQuery}"`,
      'info'
    );
  };

  const handleLogout = () => {
    setProfileDropdownOpen(false);
    logout();
    navigate('/login');
  };

  const getInitials = (name?: string) => {
    if (!name) return 'CP';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-20 bg-[#FFFFFF] border-b border-[#E6EAF0] px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Left: Breadcrumb / Page Title */}
      <div className="flex items-center gap-2 text-[13px]">
        <span className="text-[#64748B] font-medium">{breadcrumb.section}</span>
        <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
        <span className="text-[#17213D] font-semibold">{breadcrumb.page}</span>
        
        {/* Active Crisis context pill */}
        <div className="relative ml-3">
          <button
            onClick={() => setCrisisDropdownOpen(!crisisDropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FAFBFD] border border-[#E6EAF0] text-[12px] font-medium text-[#17213D] hover:bg-[#F3F0FD] hover:border-[#E4DEFC] transition-colors cursor-pointer"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#E7A8B7]"></span>
            <span className="text-[#64748B]">Context:</span>
            <span className="font-semibold text-[#17213D]">{activeCrisis?.productName || 'Active Crisis'}</span>
            <ChevronDown className="w-3 h-3 text-[#64748B] ml-0.5" />
          </button>

          {crisisDropdownOpen && (
            <div className="absolute left-0 mt-1.5 w-64 bg-white rounded-lg shadow-lg border border-[#E6EAF0] py-1.5 z-50 animate-in fade-in duration-100">
              <div className="px-3 py-1 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
                Select Active Business Crisis
              </div>
              {crises.map(c => (
                <button
                  key={c.id}
                  onClick={() => {
                    setActiveCrisisId(c.id);
                    setCrisisDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-[#F8FAFC] transition-colors cursor-pointer ${
                    c.id === activeCrisis?.id ? 'bg-[#F3F0FD] text-[#6455D8] font-semibold' : 'text-[#17213D]'
                  }`}
                >
                  <div>
                    <div className="font-medium">{c.productName}</div>
                    <div className="text-[10px] text-[#64748B]">{c.impactAmount} · {c.status}</div>
                  </div>
                  {c.id === activeCrisis?.id && (
                    <Check className="w-3.5 h-3.5 text-[#7567E8]" />
                  )}
                </button>
              ))}
              <div className="border-t border-[#F1F4F9] mt-1 pt-1 px-1">
                <button
                  onClick={() => {
                    setCrisisDropdownOpen(false);
                    navigate('/crisis/new');
                  }}
                  className="w-full text-left px-2 py-1 text-[11px] font-semibold text-[#7567E8] hover:bg-[#F3F0FD] rounded flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Log New Crisis</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Controls: Search, Notifications, Help, User Avatar & Name */}
      <div className="flex items-center gap-3">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
          <div className="flex items-center w-64 lg:w-72 bg-[#FAFBFD] border border-[#E6EAF0] rounded-lg px-3 py-1.5 focus-within:border-[#8175EA] focus-within:bg-white transition-all">
            <Search className="w-3.5 h-3.5 text-[#94A3B8] mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search crises, decisions, SKUs..."
              className="w-full text-xs text-[#17213D] placeholder-[#94A3B8] bg-transparent focus:outline-none"
            />
            <kbd className="hidden lg:inline text-[9px] font-medium text-[#94A3B8] border border-[#E6EAF0] px-1 py-0.2 rounded bg-white">
              /
            </kbd>
          </div>
        </form>

        {/* Notifications */}
        <button
          onClick={() => setNotificationsOpen(true)}
          className="relative w-8 h-8 rounded-lg border border-[#E6EAF0] bg-white flex items-center justify-center text-[#64748B] hover:text-[#17213D] hover:bg-[#FAFBFD] transition-colors cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#E7A8B7] text-[#9C334A] text-[9px] font-bold flex items-center justify-center border border-white">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Help */}
        <button
          onClick={() => navigate('/help')}
          className="w-8 h-8 rounded-lg border border-[#E6EAF0] bg-white flex items-center justify-center text-[#64748B] hover:text-[#17213D] hover:bg-[#FAFBFD] transition-colors cursor-pointer"
          title="Help & Documentation"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* User Profile & Dropdown */}
        <div className="relative pl-1 border-l border-[#E6EAF0]">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 pl-2 py-1 rounded-lg hover:bg-[#FAFBFD] transition-colors text-left cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-[#E8E6FA] text-[#7567E8] font-bold text-[11px] flex items-center justify-center border border-[#DDD8F8]">
              {getInitials(user?.name)}
            </div>
            <div className="hidden sm:block">
              <div className="text-[13px] font-semibold text-[#17213D] leading-none">
                {user?.name || 'Authorized User'}
              </div>
              <div className="text-[10px] text-[#64748B] leading-none mt-0.5 capitalize">
                {user?.role || 'Revenue Ops'}
              </div>
            </div>
            <ChevronDown className="w-3 h-3 text-[#94A3B8]" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-56 bg-white rounded-lg shadow-lg border border-[#E6EAF0] py-1.5 z-50 text-xs text-[#17213D]">
              <div className="px-3 py-2 border-b border-[#F1F4F9]">
                <p className="font-semibold text-[#17213D]">{user?.name || 'User'}</p>
                <p className="text-[11px] text-[#64748B] truncate">{user?.email || ''}</p>
                <div className="mt-1 flex items-center gap-1 text-[10px] text-[#2D7A5D]">
                  <Building2 className="w-3 h-3 text-[#7567E8]" />
                  <span className="font-medium text-slate-600 truncate">{organization?.name || 'Workspace'}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setProfileDropdownOpen(false);
                  navigate('/settings');
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-[#F8FAFC] text-[#64748B] hover:text-[#17213D] cursor-pointer"
              >
                Workspace Settings
              </button>
              <button
                onClick={() => {
                  setProfileDropdownOpen(false);
                  navigate('/help');
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-[#F8FAFC] text-[#64748B] hover:text-[#17213D] cursor-pointer"
              >
                Help & Framework Documentation
              </button>
              <div className="border-t border-[#F1F4F9] mt-1 pt-1">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-1.5 hover:bg-rose-50 text-rose-600 font-medium flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
