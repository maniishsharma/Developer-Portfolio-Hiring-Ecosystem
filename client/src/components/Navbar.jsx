import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleDark } from '../redux/uiSlice';
import { logout } from '../redux/authSlice';

const links = [
  { to: '/', label: 'Home' },
  { to: '/features', label: 'Features' },
  { to: '/developers', label: 'Developers' },
  { to: '/jobs', label: 'Jobs' },
  { to: '/companies', label: 'Companies' },
];

export default function Navbar() {
  const user = useSelector((s) => s.auth.user);
  const dark = useSelector((s) => s.ui.dark);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <header className="glass-nav fixed top-0 z-50 h-20 w-full">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-5">
        <Link to="/" className="text-lg font-black tracking-tight">
          DEVCONNECT AI
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-semibold md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => (isActive ? 'text-ink dark:text-cream' : 'text-ink/55 hover:text-ink dark:text-cream/55 dark:hover:text-cream')}
              end={l.to === '/'}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => dispatch(toggleDark())}
            className="grid h-10 w-10 place-items-center rounded-full bg-sand dark:bg-white/10"
            aria-label="Toggle dark mode"
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          {user ? (
            <>
              <button
                type="button"
                onClick={() => navigate(user.role === 'employer' ? '/employer' : '/student')}
                className="hidden rounded-full bg-sand px-4 py-2 text-sm font-bold md:inline dark:bg-white/10"
              >
                Dashboard
              </button>
              <button
                type="button"
                onClick={() => {
                  dispatch(logout());
                  navigate('/');
                }}
                className="text-sm font-semibold"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/register" className="btn-primary px-5 py-2.5 text-sm">
              Get Started
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
