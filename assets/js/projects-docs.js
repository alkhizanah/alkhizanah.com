(() => {
    // Project configuration
    const projects = {
        nur: {
            repo: 'alkhizanah/nur',
            description: 'A modern, elegant programming language designed for clarity and expressiveness with powerful features for systems and application development.',
            topics: ['compiler', 'language', 'systems'],
            docsPath: '/nur/docs/'
        },
        fajr: {
            repo: 'alkhizanah/fajr',
            description: 'A blazing fast package manager for the Nur programming language.',
            topics: ['package-manager', 'nur', 'tooling'],
            docsPath: '/fajr/'
        },
        way: {
            repo: 'alkhizanah/way',
            description: 'A modern web framework for Nur.',
            topics: ['web', 'framework', 'nur'],
            docsPath: '/way/'
        },
        qalam: {
            repo: 'alkhizanah/qalam',
            description: 'A beautiful documentation generator for Nur projects.',
            topics: ['documentation', 'generator', 'nur'],
            docsPath: '/qalam/'
        },
        bento: {
            repo: 'alkhizanah/bento',
            description: 'A component library for modern web applications.',
            topics: ['ui', 'components', 'web'],
            docsPath: '/bento/'
        },
        'tree-sitter-nur': {
            repo: 'alkhizanah/tree-sitter-nur',
            description: 'Tree-sitter grammar for the Nur programming language.',
            topics: ['tree-sitter', 'parser', 'nur'],
            docsPath: '/tree-sitter-nur/'
        },
        aqsa: {
            repo: 'alkhizanah/aqsa',
            description: 'A test framework for Nur.',
            topics: ['testing', 'framework', 'nur'],
            docsPath: '/aqsa/'
        },
        compute: {
            repo: 'alkhizanah/compute',
            description: 'High-performance computing library for Nur.',
            topics: ['compute', 'performance', 'nur'],
            docsPath: '/compute/'
        }
    };

    let currentProject = 'nur';
    let currentDocs = {};

    // Initialize
    function init() {
        setupTabListeners();

        // Check for hash in URL to load specific project
        const hash = window.location.hash.slice(1); // Remove the # symbol
        const projectId = hash || 'nur'; // Default to 'nur' if no hash

        // Find and activate the correct tab
        const targetTab = document.querySelector(`.project-tab[data-project="${projectId}"]`);
        if (targetTab) {
            // Remove active from all tabs
            document.querySelectorAll('.project-tab').forEach(t => t.classList.remove('active'));
            // Add active to target tab
            targetTab.classList.add('active');
            // Load the project
            loadProject(projectId);
        } else {
            // Fallback to nur if project not found
            loadProject('nur');
        }
    }

    // Setup tab click listeners
    function setupTabListeners() {
        const tabs = document.querySelectorAll('.project-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const projectId = tab.dataset.project;
                switchTab(tab, projectId);
            });
        });
    }

    // Switch active tab
    function switchTab(clickedTab, projectId) {
        // Update tab states
        document.querySelectorAll('.project-tab').forEach(t => t.classList.remove('active'));
        clickedTab.classList.add('active');

        // Load new project
        currentProject = projectId;
        loadProject(projectId);
    }

    // Load project documentation
    async function loadProject(projectId) {
        const project = projects[projectId];
        if (!project) return;

        // Update repo card
        updateRepoCard(project);

        // Load documentation files
        await loadDocumentation(projectId, project.docsPath);
    }

    // Update GitHub repo card
    function updateRepoCard(project) {
        const [owner, repo] = project.repo.split('/');
        const repoCard = document.getElementById('repoCard');

        // Update data attribute for theme.js to fetch stats
        repoCard.setAttribute('data-github-repo', project.repo);

        // Update the repo link href
        const repoLink = document.getElementById('repoLink');
        repoLink.href = `https://github.com/${project.repo}`;

        // Update the repo name inside the link
        document.getElementById('repoName').innerHTML = `
<span class="repo-owner">${owner}</span>/<span class="repo-project">${repo}</span>
`;

        document.getElementById('repoDescription').textContent = project.description;

        // Update topics
        const topicsContainer = document.getElementById('repoTopics');
        topicsContainer.innerHTML = project.topics
            .map(topic => `<span class="topic">${topic}</span>`)
            .join('');

        // Manually fetch and update stats
        fetchGitHubStatsForCard(project.repo);
    }

    // Fetch GitHub stats for the repo card
    async function fetchGitHubStatsForCard(repo) {
        const statsContainer = document.getElementById('repoStats');
        if (!statsContainer) return;

        statsContainer.innerHTML = '<span class="loading-stats">Loading stats...</span>';

        // Method 1: Try GitHub API directly
        try {
            console.log(`Attempting to fetch stats for ${repo}...`);
            const response = await fetch(`https://api.github.com/repos/${repo}`, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'Mozilla/5.0'
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log(`Successfully fetched stats for ${repo}:`, data);
                displayStats(data.stargazers_count, data.forks_count);
                return;
            } else {
                console.warn(`GitHub API returned ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.warn('Method 1 (Direct API) failed:', error.message);
        }

        // Method 2: Try CORS proxy
        try {
            console.log('Trying CORS proxy...');
            const proxyUrl = `https://api.codetabs.com/v1/proxy?quest=https://api.github.com/repos/${repo}`;
            const response = await fetch(proxyUrl);

            if (response.ok) {
                const data = await response.json();
                console.log('CORS proxy successful:', data);
                displayStats(data.stargazers_count, data.forks_count);
                return;
            }
        } catch (error) {
            console.warn('Method 2 (CORS proxy) failed:', error.message);
        }

        // Method 3: Try alternate CORS proxy
        try {
            console.log('Trying alternate CORS proxy...');
            const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(`https://api.github.com/repos/${repo}`)}`;
            const response = await fetch(proxyUrl);

            if (response.ok) {
                const data = await response.json();
                console.log('Alternate CORS proxy successful:', data);
                displayStats(data.stargazers_count, data.forks_count);
                return;
            }
        } catch (error) {
            console.warn('Method 3 (Alternate CORS proxy) failed:', error.message);
        }

        // All methods failed - show placeholder
        console.error('All methods failed to fetch GitHub stats');
        displayStats(null, null);
    }

    // Helper function to display stats
    function displayStats(stars, forks) {
        const statsContainer = document.getElementById('repoStats');
        const starsText = stars !== null ? stars.toLocaleString() : '--';
        const forksText = forks !== null ? forks.toLocaleString() : '--';

        document.getElementById('starsCount').textContent = starsText;
        document.getElementById('forksCount').textContent = forksText;

        statsContainer.innerHTML = `
<div class="stat">
    <svg viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
    </svg>
    <span class="stat-count">${starsText}</span>
</div>
<div class="stat">
    <svg viewBox="0 0 16 16" fill="currentColor">
        <path d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"/>
    </svg>
    <span class="stat-count">${forksText}</span>
</div>
`;
    }

    // Load documentation from _docs folder
    async function loadDocumentation(projectId, docsPath) {
        const contentContainer = document.getElementById('docsContent');
        contentContainer.innerHTML = '<div class="loading-content"><p>Loading documentation...</p></div>';

        try {
            // Determine which files to load based on project
            const files = await getDocFiles(projectId);

            if (files.length === 0) {
                contentContainer.innerHTML = `
<div class="loading-content">
    <p>No documentation available yet for this project.</p>
</div>
`;
                updateTOC([]);
                return;
            }

            // Load and render all markdown files
            let htmlContent = '';
            const headings = [];

            for (const file of files) {
                const markdown = await fetchMarkdown(file);
                if (markdown) {
                    const { html, toc } = await renderMarkdown(markdown);
                    htmlContent += html;
                    headings.push(...toc);
                }
            }

            if (htmlContent === '') {
                contentContainer.innerHTML = `
<div class="loading-content">
<p>Documentation files could not be loaded. Please check the console for errors.</p>
</div>
`;
                updateTOC([]);
            } else {
                contentContainer.innerHTML = htmlContent;
                updateTOC(headings);
            }

        } catch (error) {
            console.error('Error loading documentation:', error);
            contentContainer.innerHTML = `
<div class="loading-content">
    <p>Error loading documentation. Please try again later.</p>
</div>
`;
            updateTOC([]);
        }
    }

    // Get documentation files for a project
    async function getDocFiles(projectId) {
        // Use relative paths from the site root
        const fileMap = {
            'nur': [
                '/docs/nur/docs/installation',
                '/docs/nur/docs/syntax',
                '/docs/nur/docs/data-types',
                '/docs/nur/docs/builtins/global',
                '/docs/nur/docs/builtins/io',
                '/docs/nur/docs/builtins/fs',
                '/docs/nur/docs/builtins/math',
                '/docs/nur/docs/builtins/os',
                '/docs/nur/docs/builtins/process',
                '/docs/nur/docs/builtins/shell',
                '/docs/nur/docs/builtins/time',
                '/docs/nur/docs/builtins/threading',
                '/docs/nur/docs/builtins/unicode',
                '/docs/nur/docs/builtins/ffi'
            ],
            'bento': ['/docs/bento/readme'],
            'qalam': ['/docs/qalam/readme'],
            'tree-sitter-nur': ['/docs/tree-sitter-nur/readme']
        };

        return fileMap[projectId] || [];
    }

    // Fetch markdown file
    async function fetchMarkdown(filePath) {
        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                console.error(`Failed to fetch ${filePath}: ${response.status} ${response.statusText}`);
                return null;
            }
            return await response.text();
        } catch (error) {
            console.error(`Error fetching ${filePath}:`, error);
            return null;
        }
    }

    // Simple syntax highlighting
    function highlightCode(code, lang) {
        if (!lang) return escapeHtml(code);

        let highlighted = escapeHtml(code);

        // Keywords for common languages
        const keywords = {
            'nur': ['fn', 'let', 'const', 'if', 'else', 'while', 'for', 'return', 'import', 'export', 'class', 'struct', 'enum', 'match', 'case', 'break', 'continue', 'try', 'catch', 'throw', 'async', 'await', 'pub', 'priv', 'mut', 'ref'],
            'javascript': ['const', 'let', 'var', 'function', 'class', 'if', 'else', 'for', 'while', 'return', 'import', 'export', 'async', 'await', 'try', 'catch', 'throw', 'new', 'this', 'super'],
            'python': ['def', 'class', 'if', 'elif', 'else', 'for', 'while', 'return', 'import', 'from', 'as', 'try', 'except', 'finally', 'with', 'async', 'await', 'lambda', 'yield'],
            'rust': ['fn', 'let', 'mut', 'const', 'if', 'else', 'match', 'while', 'for', 'loop', 'return', 'impl', 'trait', 'struct', 'enum', 'pub', 'use', 'mod', 'async', 'await'],
            'c': ['int', 'char', 'float', 'double', 'void', 'if', 'else', 'for', 'while', 'return', 'struct', 'typedef', 'const', 'static', 'extern'],
            'bash': ['if', 'then', 'else', 'fi', 'for', 'while', 'do', 'done', 'case', 'esac', 'function', 'return', 'echo', 'exit']
        };

        const langKeywords = keywords[lang.toLowerCase()] || keywords['nur'];

        // Highlight strings
        highlighted = highlighted.replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, '<span class="string">$&</span>');

        // Highlight comments (// and #)
        highlighted = highlighted.replace(/(\/\/.*$|#.*$)/gm, '<span class="comment">$1</span>');

        // Highlight keywords
        langKeywords.forEach(keyword => {
            const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
            highlighted = highlighted.replace(regex, '<span class="keyword">$1</span>');
        });

        // Highlight numbers
        highlighted = highlighted.replace(/\b(\d+)\b/g, '<span class="number">$1</span>');

        // Highlight function calls
        highlighted = highlighted.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g, '<span class="function">$1</span>');

        return highlighted;
    }

    // Simple markdown to HTML converter
    async function renderMarkdown(markdown) {
        const lines = markdown.split('\n');
        let html = '';
        let inCodeBlock = false;
        let codeBlockContent = '';
        let codeBlockLang = '';
        const headings = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Code blocks
            if (line.startsWith('```')) {
                if (!inCodeBlock) {
                    inCodeBlock = true;
                    codeBlockLang = line.slice(3).trim();
                    codeBlockContent = '';
                } else {
                    const highlightedCode = highlightCode(codeBlockContent, codeBlockLang);
                    html += `<pre><code class="language-${codeBlockLang}">${highlightedCode}</code></pre>\n`;
                    inCodeBlock = false;
                    codeBlockContent = '';
                    codeBlockLang = '';
                }
                continue;
            }

            if (inCodeBlock) {
                codeBlockContent += line + '\n';
                continue;
            }

            // Headings
            if (line.startsWith('# ')) {
                const text = line.slice(2);
                const id = slugify(text);
                headings.push({ level: 1, text, id });
                html += `<h1 id="${id}">${text}</h1>\n`;
            } else if (line.startsWith('## ')) {
                const text = line.slice(3);
                const id = slugify(text);
                headings.push({ level: 2, text, id });
                html += `<h2 id="${id}">${text}</h2>\n`;
            } else if (line.startsWith('### ')) {
                const text = line.slice(4);
                const id = slugify(text);
                headings.push({ level: 3, text, id });
                html += `<h3 id="${id}">${text}</h3>\n`;
            } else if (line.startsWith('#### ')) {
                const text = line.slice(5);
                const id = slugify(text);
                headings.push({ level: 4, text, id });
                html += `<h4 id="${id}">${text}</h4>\n`;
            }
            // Lists
            else if (line.startsWith('- ') || line.startsWith('* ')) {
                const nextLine = lines[i + 1];
                if (i === 0 || (!lines[i - 1].startsWith('- ') && !lines[i - 1].startsWith('* '))) {
                    html += '<ul>\n';
                }
                html += `<li>${processInlineMarkdown(line.slice(2))}</li>\n`;
                if (!nextLine || (!nextLine.startsWith('- ') && !nextLine.startsWith('* '))) {
                    html += '</ul>\n';
                }
            }
            // Ordered lists
            else if (/^\d+\. /.test(line)) {
                const nextLine = lines[i + 1];
                if (i === 0 || !/^\d+\. /.test(lines[i - 1])) {
                    html += '<ol>\n';
                }
                html += `<li>${processInlineMarkdown(line.replace(/^\d+\. /, ''))}</li>\n`;
                if (!nextLine || !/^\d+\. /.test(nextLine)) {
                    html += '</ol>\n';
                }
            }
            // Blockquotes
            else if (line.startsWith('> ')) {
                html += `<blockquote>${processInlineMarkdown(line.slice(2))}</blockquote>\n`;
            }
            // Paragraphs
            else if (line.trim() !== '') {
                html += `<p>${processInlineMarkdown(line)}</p>\n`;
            }
        }

        return { html, toc: headings };
    }

    // Process inline markdown (bold, italic, code, links)
    function processInlineMarkdown(text) {
        // Code
        text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
        // Bold
        text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        text = text.replace(/__([^_]+)__/g, '<strong>$1</strong>');
        // Italic
        text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
        text = text.replace(/_([^_]+)_/g, '<em>$1</em>');
        // Links
        text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

        return text;
    }

    // Escape HTML
    function escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    // Generate slug from text
    function slugify(text) {
        return text
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    // Update table of contents
    function updateTOC(headings) {
        const tocNav = document.getElementById('tocNav');

        if (headings.length === 0) {
            tocNav.innerHTML = '<p style="color: var(--text-muted); font-size: 0.9rem; text-align: center; padding: 1rem 0;">No sections available</p>';
            return;
        }

        // Only show h2 and h3 in TOC
        const tocHeadings = headings.filter(h => h.level === 2 || h.level === 3);

        let html = '<ul>';
        tocHeadings.forEach(heading => {
            const nestedClass = heading.level === 3 ? ' class="toc-nested"' : '';
            const indentStyle = heading.level === 3 ? ' style="padding-left: 1rem;"' : '';
            html += `<li${indentStyle}><a href="#${heading.id}"${nestedClass}>${heading.text}</a></li>`;
        });
        html += '</ul>';

        tocNav.innerHTML = html;

        // Add scroll spy
        setupScrollSpy(tocHeadings);
    }

    // Setup scroll spy for TOC
    function setupScrollSpy(headings) {
        const tocLinks = document.querySelectorAll('.toc-nav a');

        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const id = entry.target.id;
                        tocLinks.forEach(link => {
                            link.classList.remove('active');
                            if (link.getAttribute('href') === `#${id}`) {
                                link.classList.add('active');
                            }
                        });
                    }
                });
            },
            { rootMargin: '-100px 0px -66%' }
        );

        headings.forEach(heading => {
            const element = document.getElementById(heading.id);
            if (element) {
                observer.observe(element);
            }
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
