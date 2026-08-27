import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Bell,
  Briefcase,
  Building2,
  FolderGit2,
  FolderGit,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  Moon,
  Search,
  Sparkles,
  Sun,
  UserRound,
  FileText,
  ChartColumn,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { logout } from '../redux/authSlice';
import { toggleDark } from '../redux/uiSlice';
import api from '../services/api';
import IdentityMark from '../components/IdentityMark';

const studentLinks = [
  { to: '/student', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/student/profile', label: 'Profile', icon: UserRound },
  { to: '/student/portfolio', label: 'Portfolio', icon: FolderGit2 },
  { to: '/student/resume', label: 'Resume', icon: FileText },
  { to: '/student/jobs', label: 'Jobs', icon: Briefcase },
  { to: '/student/applications', label: 'Applications', icon: Briefcase },
  { to: '/student/analytics', label: 'Analytics', icon: ChartColumn },
  { to: '/student/ai', label: 'AI Labs', icon: Sparkles },
  { to: '/student/github', label: 'GitHub', icon: FolderGit },
  { to: '/student/chat', label: 'Chat', icon: MessageCircle },
  { to: '/student/notifications', label: 'Alerts', icon: Bell },
];

const employerLinks = [
  { to: '/employer', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/employer/company', label: 'Company', icon: Building2 },
  { to: '/employer/jobs', label: 'Jobs', icon: Briefcase },
  { to: '/employer/candidates', label: 'Candidates', icon: Search },
  { to: '/employer/applications', label: 'Applications', icon: FileText },
  { to: '/employer/chat', label: 'Chat', icon: MessageCircle },
  { to: '/employer/notifications', label: 'Alerts', icon: Bell },
];

export default function DashboardLayout({ role }) {
  const user = useSelector((s) => s.auth.user);
  const dark = useSelector((s) => s.ui.dark);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const links = role === 'employer' ? employerLinks : studentLinks;
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    let mounted = true;
    api.get('/notifications').then((r) => {
      if (!mounted) return;
      const count = (r.data || []).filter((n) => !n.read).length;
      setUnread(count);
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  return (
    <div className="min-h-screen bg-cream text-ink dark:bg-[#161311] dark:text-cream">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-ink/5 bg-cream/90 p-5 backdrop-blur-xl transition dark:border-white/10 dark:bg-[#161311]/90 ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <p className="flex items-center gap-2 text-sm font-black tracking-tight"><IdentityMark role={role} size="sm" /> DEVCONNECT AI</p>
        <p className="mt-1 text-xs text-ink/50 dark:text-cream/50">{role === 'employer' ? 'Employer workspace' : 'Student workspace'}</p>
        <nav className="mt-8 space-y-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold ${
                  isActive ? 'bg-blush/70 text-ink' : 'text-ink/60 hover:bg-sand dark:text-cream/60 dark:hover:bg-white/5'
                }`
              }
            >
              <l.icon size={16} />
              {l.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-ink/5 bg-cream/80 px-5 backdrop-blur-xl dark:border-white/10 dark:bg-[#161311]/80">
          <button type="button" className="lg:hidden" onClick={() => setOpen((v) => !v)}>
            <Menu />
          </button>
          <p className="hidden text-sm font-semibold md:block">Hello, {user?.name}</p>
          <div className="ml-auto flex items-center gap-3">
            <button type="button" onClick={() => dispatch(toggleDark())} className="grid h-10 w-10 place-items-center rounded-full bg-sand dark:bg-white/10">
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <div className="relative">
              <button type="button" onClick={() => navigate(role === 'employer' ? '/employer/notifications' : '/student/notifications')} className="grid h-10 w-10 place-items-center rounded-full bg-sand dark:bg-white/10">
                <Bell />
              </button>
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">{unread}</span>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                dispatch(logout());
                navigate('/');
              }}
              className="flex items-center gap-2 rounded-full bg-sand px-4 py-2 text-sm font-bold dark:bg-white/10"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </header>
        <main className="p-5 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
