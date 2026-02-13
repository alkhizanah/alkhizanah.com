(() => {
  // Theme Toggle
  const root = document.documentElement;
  const toggle = document.getElementById('theme-toggle');
  const key = 'alkhizanah-theme';

  const updateIcon = (theme) => {
    if (toggle) {
      toggle.innerHTML = theme === 'dark'
        ? '☀️' // Sun icon for dark mode (click to go light)
        : '🌙'; // Moon icon for light mode (click to go dark)
    }
  };

  const setTheme = (theme) => {
    root.setAttribute('data-theme', theme);
    localStorage.setItem(key, theme);
    updateIcon(theme);
  };

  // Initialize theme
  const initial = localStorage.getItem(key) || 'dark';
  setTheme(initial);

  // Toggle on click
  if (toggle) {
    toggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') || 'dark';
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const navRight = document.querySelector('.nav-right');

  if (mobileToggle && navRight) {
    mobileToggle.addEventListener('click', () => {
      navRight.classList.toggle('active');

      // Update hamburger icon
      const isActive = navRight.classList.contains('active');
      mobileToggle.innerHTML = isActive ? '✕' : '☰';
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileToggle.contains(e.target) && !navRight.contains(e.target)) {
        navRight.classList.remove('active');
        mobileToggle.innerHTML = '☰';
      }
    });

    // Close menu when clicking a link
    navRight.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navRight.classList.remove('active');
        mobileToggle.innerHTML = '☰';
      });
    });
  }

  // GitHub Stats Fetcher with multiple fallback methods
  async function fetchGitHubStats(owner, repo) {
    const fullRepo = `${owner}/${repo}`;

    // Method 1: Try GitHub API directly
    try {
      console.log(`Attempting to fetch stats for ${fullRepo}...`);
      const response = await fetch(`https://api.github.com/repos/${fullRepo}`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Mozilla/5.0'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`Successfully fetched stats for ${fullRepo}:`, data);
        return {
          stars: data.stargazers_count,
          forks: data.forks_count
        };
      } else {
        console.warn(`GitHub API returned ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.warn('Method 1 (Direct API) failed:', error.message);
    }

    // Method 2: Try CORS proxy
    try {
      console.log('Trying CORS proxy...');
      const proxyUrl = `https://api.codetabs.com/v1/proxy?quest=https://api.github.com/repos/${fullRepo}`;
      const response = await fetch(proxyUrl);

      if (response.ok) {
        const data = await response.json();
        console.log('CORS proxy successful:', data);
        return {
          stars: data.stargazers_count,
          forks: data.forks_count
        };
      }
    } catch (error) {
      console.warn('Method 2 (CORS proxy) failed:', error.message);
    }

    // Method 3: Try alternate CORS proxy
    try {
      console.log('Trying alternate CORS proxy...');
      const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(`https://api.github.com/repos/${fullRepo}`)}`;
      const response = await fetch(proxyUrl);

      if (response.ok) {
        const data = await response.json();
        console.log('Alternate CORS proxy successful:', data);
        return {
          stars: data.stargazers_count,
          forks: data.forks_count
        };
      }
    } catch (error) {
      console.warn('Method 3 (Alternate CORS proxy) failed:', error.message);
    }

    // All methods failed
    console.error(`All methods failed to fetch GitHub stats for ${fullRepo}`);
    return null;
  }

  // Update GitHub stats for all project cards
  async function updateGitHubStats() {
    const cards = document.querySelectorAll('[data-github-repo]');

    for (const card of cards) {
      const repo = card.dataset.githubRepo;
      const [owner, repoName] = repo.split('/');
      const statsContainer = card.querySelector('.github-stats');

      if (!statsContainer) continue;

      // Show loading state
      statsContainer.innerHTML = '<span class="loading-stats">Loading stats...</span>';

      // Fetch stats
      const stats = await fetchGitHubStats(owner, repoName);

      if (stats) {
        statsContainer.innerHTML = `
          <span class="stat">
            <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
            </svg>
            ${stats.stars.toLocaleString()}
          </span>
          <span class="stat">
            <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75v-.878a2.25 2.25 0 111.5 0v.878a2.25 2.25 0 01-2.25 2.25h-1.5v2.128a2.251 2.251 0 11-1.5 0V8.5h-1.5A2.25 2.25 0 013.5 6.25v-.878a2.25 2.25 0 111.5 0zM5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm6.75.75a.75.75 0 100-1.5.75.75 0 000 1.5zm-3 8.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"/>
            </svg>
            ${stats.forks.toLocaleString()}
          </span>
        `;
      } else {
        // Show placeholder with dashes instead of error message
        statsContainer.innerHTML = `
          <span class="stat">
            <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
            </svg>
            --
          </span>
          <span class="stat">
            <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75v-.878a2.25 2.25 0 111.5 0v.878a2.25 2.25 0 01-2.25 2.25h-1.5v2.128a2.251 2.251 0 11-1.5 0V8.5h-1.5A2.25 2.25 0 013.5 6.25v-.878a2.25 2.25 0 111.5 0zM5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm6.75.75a.75.75 0 100-1.5.75.75 0 000 1.5zm-3 8.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"/>
            </svg>
            --
          </span>
        `;
      }
    }
  }

  // Initialize GitHub stats when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateGitHubStats);
  } else {
    updateGitHubStats();
  }
})();
