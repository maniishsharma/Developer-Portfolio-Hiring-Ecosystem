import { BriefcaseBusiness, Code2 } from 'lucide-react';

export default function IdentityMark({ role = 'student', size = 'md', className = '' }) {
  const isEmployer = role === 'employer';
  const Icon = isEmployer ? BriefcaseBusiness : Code2;

  return (
    <span className={`identity-mark identity-mark-${isEmployer ? 'employer' : 'student'} identity-mark-${size} ${className}`} aria-hidden="true">
      <Icon />
    </span>
  );
}
