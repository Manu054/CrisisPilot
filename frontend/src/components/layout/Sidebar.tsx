import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCrisis } from '../../context/CrisisContext';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard,
  PlusCircle, 
  Package, 
  Compass, 
  Sliders, 
  History, 
  Brain,
  TrendingUp, 
  FileText, 
  Settings,
  HelpCircle,
  Sparkles,
  LogOut,
  Building2
} from 'lucide-react';

interface SidebarProps {
  onOpenChat?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenChat }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setChatOpen } = useCrisis();
  const { user, organization, logout } = useAuth();

  const primaryNavItems = [
    { path: '/overview', label: 'Overview', icon: LayoutDashboard },
    { path: '/crisis/new', label: 'New Crisis', icon: PlusCircle, badge: '+' },
    { path: '/inventory', label: 'Inventory', icon: Package },
    { path: '/decision-center', label: 'Decision Center', icon: Compass, badge: 'Active' },
    { path: '/simulations', label: 'Simulations', icon: Sliders },
    { path: '/past-decisions', label: 'Past Decisions', icon: History },
    { path: '/memory', label: 'Organizational Memory', icon: Brain, badge: 'HindSight' },
    { path: '/insights', label: 'Insights', icon: TrendingUp },
    { path: '/reports', label: 'Reports', icon: FileText },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = (name?: string) => {
    if (!name) return 'CP';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <aside className="w-[250px] bg-[#FFFFFF] border-r border-[#E6EAF0] flex flex-col justify-between h-screen sticky top-0 select-none z-30 shrink-0">
      {/* Top: Logo & Organization Name */}
      <div>
        <div className="px-5 pt-6 pb-5 border-b border-[#F1F4F9]">
          <div 
            onClick={() => navigate('/overview')}
            className="cursor-pointer group flex items-start gap-3"
          >
            {/* Geometric logo */}
            <div className="w-8 h-8 rounded-lg bg-[#7567E8] flex items-center justify-center text-white shrink-0 shadow-xs">
              <svg 
                className="w-4.5 h-4.5" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <polygon points="12 2 19 8.5 19 15.5 12 22 5 15.5 5 8.5 12 2" />
                <line x1="12" y1="7" x2="12" y2="17" />
                <line x1="7" y1="12" x2="17" y2="12" />
              </svg>
            </div>
            
            <div className="flex flex-col min-w-0">
              <div className="text-[14px] font-bold tracking-tight text-[#17213D] leading-none uppercase flex items-center gap-1.5 font-heading">
                <span>CRISIS</span>
                <span className="text-[#7567E8]">PILOT</span>
              </div>
              <div className="flex items-center gap-1 mt-1 text-[11px] text-[#64748B] font-medium tracking-tight truncate">
                <Building2 className="w-3 h-3 text-[#7567E8] shrink-0" />
                <span className="truncate">{organization?.name || 'Organization'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="px-3 py-4 space-y-1">
          {primaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
              (item.path === '/decision-center' && location.pathname.startsWith('/decision-center')) ||
              (item.path === '/overview' && location.pathname === '/');

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#F3F0FD] text-[#17213D] font-semibold'
                    : 'text-[#64748B] hover:text-[#17213D] hover:bg-[#F8FAFC]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-[18px] h-[18px] transition-colors shrink-0 ${
                      isActive ? 'text-[#7567E8]' : 'text-[#8492A6]'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                      isActive
                        ? 'bg-white text-[#7567E8] border border-[#E4DEFC]'
                        : item.badge === 'Active'
                        ? 'bg-[#FEF9ED] text-[#8C6417] border border-[#F8ECC7]'
                        : item.badge === 'HindSight'
                        ? 'bg-[#F3F0FD] text-[#6455D8] border border-[#E4DEFC]'
                        : 'bg-[#F1F4F9] text-[#64748B]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom: Settings, Help & Support, Assistant Trigger & User Profile */}
      <div className="p-3 border-t border-[#F1F4F9] space-y-2">
        {/* Subtle AI Assistant button */}
        <button
          onClick={() => {
            if (onOpenChat) onOpenChat();
            else setChatOpen(true);
          }}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-[#FAFBFD] border border-[#E6EAF0] text-[12px] font-medium text-[#17213D] hover:bg-[#F3F0FD] hover:border-[#E4DEFC] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#7567E8]" />
            <span>CrisisPilot Intelligence</span>
          </div>
          <span className="text-[10px] bg-[#EDE9FE] text-[#7567E8] px-1.5 py-0.5 rounded font-semibold">
            Ask
          </span>
        </button>

        {/* Settings button */}
        <button
          onClick={() => navigate('/settings')}
          className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors cursor-pointer ${
            location.pathname === '/settings'
              ? 'bg-[#F3F0FD] text-[#17213D] font-semibold'
              : 'text-[#64748B] hover:text-[#17213D] hover:bg-[#F8FAFC]'
          }`}
        >
          <Settings 
            className={`w-[18px] h-[18px] ${
              location.pathname === '/settings' ? 'text-[#7567E8]' : 'text-[#8492A6]'
            }`} 
          />
          <span>Settings</span>
        </button>

        {/* Help & Support button */}
        <button
          onClick={() => navigate('/help')}
          className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors cursor-pointer ${
            location.pathname === '/help'
              ? 'bg-[#F3F0FD] text-[#17213D] font-semibold'
              : 'text-[#64748B] hover:text-[#17213D] hover:bg-[#F8FAFC]'
          }`}
        >
          <HelpCircle className={`w-[18px] h-[18px] ${location.pathname === '/help' ? 'text-[#7567E8]' : 'text-[#8492A6]'}`} />
          <span>Help & Support</span>
        </button>

        {/* Real User Profile Card with Logout */}
        <div className="pt-2 border-t border-[#F1F4F9] flex items-center justify-between px-2 py-1.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#E8E6FA] text-[#7567E8] font-bold text-xs flex items-center justify-center shrink-0 border border-[#DDD8F8]">
              {getInitials(user?.name)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-semibold text-[#17213D] leading-tight truncate">
                {user?.name || 'Authorized User'}
              </div>
              <div className="text-[11px] text-[#64748B] leading-tight truncate capitalize">
                {user?.role || 'Revenue Ops'}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Log out"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
