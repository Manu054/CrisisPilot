import React from 'react';
import { useCrisis } from '../../context/CrisisContext';
import { 
  X, 
  CheckCheck, 
  AlertTriangle, 
  Brain, 
  Sliders, 
  FileCheck2,
  ArrowRight
} from 'lucide-react';

export const NotificationDrawer: React.FC = () => {
  const { 
    notificationsOpen, 
    setNotificationsOpen, 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead,
    setActiveTab,
    setActiveCrisisId
  } = useCrisis();

  if (!notificationsOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="w-4 h-4 text-[#9C334A]" />;
      case 'memory':
        return <Brain className="w-4 h-4 text-[#7567E8]" />;
      case 'simulation':
        return <Sliders className="w-4 h-4 text-[#2E62A6]" />;
      case 'strategy':
        return <FileCheck2 className="w-4 h-4 text-[#2D7A5D]" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-[#64748B]" />;
    }
  };

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case 'alert':
        return 'bg-[#FCF1F3] text-[#9C334A] border-[#F5D3DB]';
      case 'memory':
        return 'bg-[#F3F0FD] text-[#6455D8] border-[#E2DCFA]';
      case 'simulation':
        return 'bg-[#F2F7FD] text-[#2E62A6] border-[#D8E6FA]';
      case 'strategy':
        return 'bg-[#F0F9F5] text-[#2D7A5D] border-[#D1EFE4]';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={() => setNotificationsOpen(false)}
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-[#E6EAF0] shadow-xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#E6EAF0] flex items-center justify-between">
            <div>
              <h2 className="text-[16px] font-bold text-[#17213D] font-heading">
                Notifications
              </h2>
              <p className="text-[12px] text-[#64748B]">
                Real-time operational alerts and memory events
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={markAllNotificationsRead}
                className="text-[11px] font-medium text-[#7567E8] hover:text-[#5B4DC7] flex items-center gap-1 px-2 py-1 rounded hover:bg-[#F3F0FD]"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
              <button
                onClick={() => setNotificationsOpen(false)}
                className="w-7 h-7 rounded-lg border border-[#E6EAF0] text-[#64748B] hover:text-[#17213D] hover:bg-[#F8FAFC] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  markNotificationRead(n.id);
                  if (n.relatedTab) {
                    setActiveTab(n.relatedTab);
                    if (n.id === 'notif-1') {
                      setActiveCrisisId('crisis-prod-x');
                    }
                    setNotificationsOpen(false);
                  }
                }}
                className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                  n.unread
                    ? 'bg-[#FAFBFD] border-[#DDD8F8] shadow-xs hover:border-[#7567E8]'
                    : 'bg-white border-[#E6EAF0] opacity-80 hover:opacity-100 hover:border-[#CBD5E1]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg border ${getBadgeStyle(n.type)} shrink-0`}>
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-[13px] font-semibold text-[#17213D] leading-tight">
                        {n.title}
                      </h4>
                      {n.unread && (
                        <span className="w-2 h-2 rounded-full bg-[#7567E8] shrink-0" />
                      )}
                    </div>
                    <p className="text-[12px] text-[#64748B] mt-1 leading-relaxed">
                      {n.desc}
                    </p>
                    <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#94A3B8]">
                      <span>{n.time}</span>
                      <span className="text-[#7567E8] font-medium flex items-center gap-1 group-hover:translate-x-0.5">
                        Inspect <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-[#E6EAF0] bg-[#FAFBFD] text-center text-[12px] text-[#64748B]">
            Connected to HindSight Organizational Learning Engine
          </div>
        </div>
      </div>
    </div>
  );
};
