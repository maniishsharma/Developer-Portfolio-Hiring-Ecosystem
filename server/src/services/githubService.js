import axios from 'axios';

const headers = () => {
  const token = process.env.GITHUB_TOKEN;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchGithubProfile = async (username) => {
  const { data: user } = await axios.get(`https://api.github.com/users/${username}`, { headers: headers() });
  const { data: repos } = await axios.get(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, {
    headers: headers(),
  });

  const languageCount = {};
  repos.forEach((repo) => {
    if (repo.language) languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
  });

  const languages = Object.entries(languageCount)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));

  const topRepos = [...repos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 6)
    .map((r) => ({
      name: r.name,
      description: r.description,
      stars: r.stargazers_count,
      language: r.language,
      url: r.html_url,
    }));

  return {
    username: user.login,
    name: user.name,
    avatar: user.avatar_url,
    bio: user.bio,
    repoCount: user.public_repos,
    followers: user.followers,
    following: user.following,
    languages,
    topRepos,
  };
};
