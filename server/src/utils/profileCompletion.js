export const calcProfileCompletion = (student) => {
  const checks = [
    Boolean(student.headline),
    Boolean(student.about),
    Boolean(student.skills?.length),
    Boolean(student.education?.length),
    Boolean(student.experience?.length),
    Boolean(student.socialLinks?.github || student.githubUsername),
    Boolean(student.avatar),
  ];
  const done = checks.filter(Boolean).length;
  return Math.round((done / checks.length) * 100);
};
