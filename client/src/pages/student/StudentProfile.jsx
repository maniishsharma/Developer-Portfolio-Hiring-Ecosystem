import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../services/api';
import { useToast } from '../../hooks/useToast';

export default function StudentProfile() {
  const { register, handleSubmit, reset } = useForm();
  const toast = useToast();

  useEffect(() => {
    api.get('/student/profile').then((r) => {
      const s = r.data;
      reset({
        headline: s.headline,
        about: s.about,
        skills: (s.skills || []).join(', '),
        github: s.socialLinks?.github,
        linkedin: s.socialLinks?.linkedin,
        website: s.socialLinks?.website,
        school: s.education?.[0]?.school,
        degree: s.education?.[0]?.degree,
        company: s.experience?.[0]?.company,
        title: s.experience?.[0]?.title,
        cert: s.certifications?.[0]?.name,
      });
    });
  }, [reset]);

  const onSubmit = async (values) => {
    try {
      const form = new FormData();
      form.append('headline', values.headline || '');
      form.append('about', values.about || '');
      form.append('skills', JSON.stringify((values.skills || '').split(',').map((x) => x.trim()).filter(Boolean)));
      form.append(
        'socialLinks',
        JSON.stringify({ github: values.github || '', linkedin: values.linkedin || '', website: values.website || '' })
      );
      form.append(
        'education',
        JSON.stringify(values.school ? [{ school: values.school, degree: values.degree, field: 'CS', startYear: '2024', endYear: '2026' }] : [])
      );
      form.append(
        'experience',
        JSON.stringify(values.company ? [{ company: values.company, title: values.title, startDate: '2025', endDate: 'Present', description: '' }] : [])
      );
      form.append('certifications', JSON.stringify(values.cert ? [{ name: values.cert, issuer: 'Online', year: '2026' }] : []));
      if (values.avatar?.[0]) form.append('avatar', values.avatar[0]);

      // JSON body is easier for nested fields - send JSON except avatar
      await api.put('/student/profile', {
        headline: values.headline,
        about: values.about,
        skills: (values.skills || '').split(',').map((x) => x.trim()).filter(Boolean),
        socialLinks: { github: values.github || '', linkedin: values.linkedin || '', website: values.website || '' },
        education: values.school ? [{ school: values.school, degree: values.degree, field: 'CS', startYear: '2024', endYear: '2026' }] : [],
        experience: values.company ? [{ company: values.company, title: values.title, startDate: '2025', endDate: 'Present', description: '' }] : [],
        certifications: values.cert ? [{ name: values.cert, issuer: 'Online', year: '2026' }] : [],
      });
      if (values.avatar?.[0]) {
        const fd = new FormData();
        fd.append('avatar', values.avatar[0]);
        await api.put('/student/profile', fd);
      }
      toast('Profile saved');
    } catch (e) {
      toast(e.message, 'error');
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-4xl font-black">Profile</h1>
      <form className="mt-6 space-y-3" onSubmit={handleSubmit(onSubmit)}>
        <input className="w-full rounded-2xl bg-sand px-4 py-3 outline-none dark:bg-white/10" placeholder="Headline" {...register('headline')} />
        <textarea className="w-full rounded-2xl bg-sand px-4 py-3 outline-none dark:bg-white/10" rows={4} placeholder="About" {...register('about')} />
        <input className="w-full rounded-2xl bg-sand px-4 py-3 outline-none dark:bg-white/10" placeholder="Skills (comma separated)" {...register('skills')} />
        <input className="w-full rounded-2xl bg-sand px-4 py-3 outline-none dark:bg-white/10" placeholder="School" {...register('school')} />
        <input className="w-full rounded-2xl bg-sand px-4 py-3 outline-none dark:bg-white/10" placeholder="Degree" {...register('degree')} />
        <input className="w-full rounded-2xl bg-sand px-4 py-3 outline-none dark:bg-white/10" placeholder="Experience company" {...register('company')} />
        <input className="w-full rounded-2xl bg-sand px-4 py-3 outline-none dark:bg-white/10" placeholder="Role title" {...register('title')} />
        <input className="w-full rounded-2xl bg-sand px-4 py-3 outline-none dark:bg-white/10" placeholder="Certification" {...register('cert')} />
        <input className="w-full rounded-2xl bg-sand px-4 py-3 outline-none dark:bg-white/10" placeholder="GitHub URL" {...register('github')} />
        <input className="w-full rounded-2xl bg-sand px-4 py-3 outline-none dark:bg-white/10" placeholder="LinkedIn" {...register('linkedin')} />
        <input type="file" accept="image/*" {...register('avatar')} />
        <button className="btn-primary px-6 py-3">Save profile</button>
      </form>
    </div>
  );
}
