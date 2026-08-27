import { FolderGit, Link as LinkIcon, Mail } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import IdentityMark from './IdentityMark';

export default function Footer() {
  return (
    <footer className="border-t border-ink/5 bg-sand px-5 py-16 dark:border-white/10 dark:bg-[#1c1815]">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-4">
        <div>
          <p className="flex items-center gap-2 text-xl font-black"><IdentityMark size="sm" /> DEVCONNECT AI</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink/60 dark:text-cream/60">
            A college hiring ecosystem that connects student talent with opportunity.
          </p>
        </div>
        <div>
          <p className="font-bold">Product</p>
            <div className="mt-3 flex flex-col gap-2 text-sm text-ink/60 dark:text-cream/60">
              <RouterLink to="/features">Features</RouterLink>
              <RouterLink to="/jobs">Jobs</RouterLink>
              <RouterLink to="/developers">Developers</RouterLink>
            </div>
        </div>
        <div>
          <p className="font-bold">Account</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-ink/60 dark:text-cream/60">
            <RouterLink to="/login">Login</RouterLink>
            <RouterLink to="/register">Register</RouterLink>
          </div>
        </div>
        <div>
          <p className="font-bold">Social</p>
            <div className="mt-4 flex gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-cream dark:bg-white/10">
                <FolderGit size={16} />
              </span>
              <span className="grid h-10 w-10 place-items-center rounded-full bg-cream dark:bg-white/10">
                <LinkIcon size={16} />
              </span>
              <span className="grid h-10 w-10 place-items-center rounded-full bg-cream dark:bg-white/10">
                <Mail size={16} />
              </span>
            </div>
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-6xl text-sm text-ink/40 dark:text-cream/40">
        © {new Date().getFullYear()} DevConnect AI. MCA academic project.
      </p>
    </footer>
  );
}
