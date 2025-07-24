import { useState, useEffect } from 'react';

const CACHE_KEY = 'github_stats_cache';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

const useGitHubStats = () => {
  const [stats, setStats] = useState({
    totalStars: 0,
    totalContributions: 0,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchGitHubStats = async () => {
      try {
        // Check cache first
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_DURATION) {
            setStats({ ...data, loading: false, error: null });
            return;
          }
        }

        const accounts = ['N73311', 'MeridianVega'];
        let totalStars = 0;
        let totalRepos = 0;

        // Fetch repos for each account
        for (const account of accounts) {
          try {
            const response = await fetch(`https://api.github.com/users/${account}/repos?per_page=100`);
            
            if (!response.ok) {
              if (response.status === 403) {
                throw new Error('GitHub API rate limit exceeded');
              }
              throw new Error(`Failed to fetch repos for ${account}`);
            }

            const repos = await response.json();
            
            // Sum up stars from all repos
            repos.forEach(repo => {
              if (!repo.fork) { // Only count non-forked repos
                totalStars += repo.stargazers_count || 0;
                totalRepos++;
              }
            });

            // Handle pagination if user has more than 100 repos
            const linkHeader = response.headers.get('Link');
            if (linkHeader && linkHeader.includes('rel="next"')) {
              // For simplicity, we'll just note this - full pagination would require more complex logic
              console.log(`Note: ${account} has more than 100 repos, showing first 100`);
            }
          } catch (error) {
            console.error(`Error fetching repos for ${account}:`, error);
          }
        }

        // For contributions, we'll use total repos as a proxy since the contributions API requires authentication
        // In a real implementation, you might want to use GitHub's GraphQL API with authentication
        const totalContributions = totalRepos;

        const data = { totalStars, totalContributions };
        
        // Cache the results
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          data,
          timestamp: Date.now()
        }));

        setStats({
          ...data,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Error fetching GitHub stats:', error);
        setStats({
          totalStars: 0,
          totalContributions: 0,
          loading: false,
          error: error.message
        });
      }
    };

    fetchGitHubStats();
  }, []);

  return stats;
};

export default useGitHubStats;