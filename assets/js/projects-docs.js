(() => {

    // Configuration

    const projects = {
        nur: {
            repo: 'alkhizanah/nur',
            description: 'A scripting language for ease of use.',
            topics: ['programming language', 'interpreter', 'virtual-machine']
        },
        fajr: {
            repo: 'alkhizanah/fajr',
            description: 'A modern and elegant operating system for programmers.',
            topics: ['operating system']
        },
        way: {
            repo: 'alkhizanah/way',
            description: 'A systems programming language for the impatient.',
            topics: ['compiler', 'system-language']
        },
        qalam: {
            repo: 'alkhizanah/qalam',
            description: 'A modal text editor.',
            topics: ['editor', 'tool']
        },
        'tree-sitter-nur': {
            repo: 'alkhizanah/tree-sitter-nur',
            description: 'Nur language grammar for tree-sitter.',
            topics: ['']
        },
        bento: {
            repo: 'alkhizanah/bento',
            description: 'A collection of macros intended at making assembly more convenient to write and a bit closer to C. Only for x86_64 linux and the FASM assembler (for now).',
            topics: ['assembly', 'fasm']
        },
        aqsa: {
            repo: 'alkhizanah/aqsa',
            description: 'A fast red-teaming toolkit featuring a very flexible module interface.',
            topics: ['']
        },
        compute: {
            repo: 'alkhizanah/compute',
            description: 'An attempt to make a computer algebra system.',
            topics: ['']
        },
        mkc: {
            repo: 'alkhizanah/mkc',
            description: 'An attempt to make a computer algebra system.',
            topics: ['c', 'cpp', 'maker', 'etc..']
        }
    };

    // Initialization

    function init() {
        setupTabListeners();
        const hash = window.location.hash.slice(1);
        const projectId = hash || 'nur';
        const targetTab = document.querySelector(`.project-tab[data-project="${projectId}"]`);

        if (targetTab) {
            document.querySelectorAll('.project-tab').forEach(t => t.classList.remove('active'));
            targetTab.classList.add('active');
            loadProject(projectId);
        } else {
            loadProject('nur');
        }
    }

    // Tab Management

    function setupTabListeners() {
        document.querySelectorAll('.project-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const projectId = tab.dataset.project;
                document.querySelectorAll('.project-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                loadProject(projectId);
            });
        });
    }

    function loadProject(projectId) {
        const project = projects[projectId];
        if (!project) return;

        updateRepoCard(project);
        loadDocumentation(projectId);
    }

    // Repo Card Updates

    function updateRepoCard(project) {
        const [owner, repo] = project.repo.split('/');

        // Update repo link and name
        const repoLink = document.getElementById('repoLink');
        const repoName = document.getElementById('repoName');
        if (repoLink) repoLink.href = `https://github.com/${project.repo}`;
        if (repoName) {
            repoName.innerHTML = `<span class="repo-owner">${owner}</span>/<span class="repo-project">${repo}</span>`;
        }

        // Update description
        const repoDesc = document.getElementById('repoDescription');
        if (repoDesc) repoDesc.textContent = project.description;

        // Update topics
        const topicsContainer = document.getElementById('repoTopics');
        if (topicsContainer) {
            topicsContainer.innerHTML = project.topics
                .map(topic => `<span class="topic">${topic}</span>`)
                .join('');
        }

        // Update data attribute
        const repoCard = document.getElementById('repoCard');
        if (repoCard) {
            repoCard.setAttribute('data-github-repo', project.repo);
        }

        // Fetch and update stats
        fetchStats(project.repo);
    }

    // Simple Stats Fetching

    async function fetchStats(repo) {
        const statsContainer = document.getElementById('repoStats');
        if (!statsContainer) return;

        // Method 1: Try GitHub API directly
        try {
            const response = await fetch(`https://api.github.com/repos/${repo}`, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'Mozilla/5.0'
                }
            });
            if (response.ok) {
                const data = await response.json();
                updateStatsDisplay(data.stargazers_count, data.forks_count);
                console.log(`✓ Loaded stats for ${repo}`);
                return;
            }
        } catch (error) {
            console.warn('Direct API failed:', error.message);
        }

        // Method 2: Try CORS proxy
        try {
            const response = await fetch(`https://api.codetabs.com/v1/proxy?quest=https://api.github.com/repos/${repo}`);
            if (response.ok) {
                const data = await response.json();
                updateStatsDisplay(data.stargazers_count, data.forks_count);
                console.log(`✓ Loaded stats via proxy for ${repo}`);
                return;
            }
        } catch (error) {
            console.warn('Proxy failed:', error.message);
        }

        // All methods failed - show placeholders
        console.error('All methods failed to fetch stats');
        updateStatsDisplay(null, null);
    }

    function updateStatsDisplay(stars, forks) {
        const statsContainer = document.getElementById('repoStats');
        if (!statsContainer) return;

        const starsText = stars !== null ? stars.toLocaleString() : '--';
        const forksText = forks !== null ? forks.toLocaleString() : '--';

        const statSpans = statsContainer.querySelectorAll('.stat-count');
        if (statSpans.length >= 2) {
            statSpans[0].textContent = starsText;
            statSpans[1].textContent = forksText;
        }
    }

    // Documentation Loading

    async function loadDocumentation(projectId) {
        const contentContainer = document.getElementById('docsContent');
        if (!contentContainer) return;

        contentContainer.innerHTML = '<div class="loading-content"><p>Loading documentation...</p></div>';

        try {
            const files = getDocFiles(projectId);

            if (files.length === 0) {
                showComingSoon(projectId);
                updateTOC([]);
                return;
            }

            let htmlContent = '';
            const headings = [];

            for (const file of files) {
                const content = await fetchDocFile(file);
                if (content) {
                    const { html, toc } = renderMarkdown(content);
                    htmlContent += html;
                    headings.push(...toc);
                }
            }

            if (htmlContent === '') {
                showComingSoon(projectId);
                updateTOC([]);
            } else {
                contentContainer.innerHTML = htmlContent;
                updateTOC(headings);
            }
        } catch (error) {
            console.error('Error loading documentation:', error);
            showComingSoon(projectId);
            updateTOC([]);
        }
    }

    function getDocFiles(projectId) {
        const baseurl = document.querySelector('meta[name="baseurl"]')?.content || '';

        const fileMap = {
            'nur': [
                'installation', 'syntax', 'data-types',
                'builtins/global', 'builtins/io', 'builtins/fs', 'builtins/math',
                'builtins/os', 'builtins/process', 'builtins/shell', 'builtins/time',
                'builtins/threading', 'builtins/unicode', 'builtins/ffi'
            ].map(f => `${baseurl}/docs/nur/docs/${f}.html`),
            'bento': [`${baseurl}/docs/bento/readme.html`],
            'qalam': [`${baseurl}/docs/qalam/readme.html`],
            'tree-sitter-nur': [`${baseurl}/docs/tree-sitter-nur/readme.html`],
            'mkc': [`${baseurl}/docs/mkc/mkc.html`]
        };

        return fileMap[projectId] || [];
    }

    async function fetchDocFile(filePath) {
        try {
            const response = await fetch(filePath);
            if (response.ok) {
                console.log(`✓ Loaded: ${filePath}`);
                return await response.text();
            }
            console.error(`Failed to fetch ${filePath}: ${response.status}`);
            return null;
        } catch (error) {
            console.error(`Error fetching ${filePath}:`, error);
            return null;
        }
    }

    function showComingSoon(projectId) {
        const project = projects[projectId];
        const contentContainer = document.getElementById('docsContent');
        if (contentContainer && project) {
            contentContainer.innerHTML = `
<div class="loading-content">
    <h2>Documentation Coming Soon</h2>
    <p>Documentation for ${project.repo.split('/')[1]} is currently being prepared.</p>
    <p>In the meantime, check out the <a href="https://github.com/${project.repo}" target="_blank" style="color: var(--accent);">GitHub repository</a> for more information.</p>
</div>
`;
        }
    }

    // Markdown Rendering

    function renderMarkdown(markdown) {
        const headings = [];
        let html = '';
        const lines = markdown.split('\n');
        let inCodeBlock = false;
        let codeBlockLang = '';
        let codeBlockContent = '';

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Code blocks
            if (line.startsWith('```')) {
                if (!inCodeBlock) {
                    inCodeBlock = true;
                    codeBlockLang = line.slice(3).trim();
                    codeBlockContent = '';
                } else {
                    html += `<pre><code class="language-${codeBlockLang}">${highlightCode(codeBlockContent, codeBlockLang)}</code></pre>\n`;
                    inCodeBlock = false;
                    codeBlockLang = '';
                    codeBlockContent = '';
                }
                continue;
            }

            if (inCodeBlock) {
                codeBlockContent += line + '\n';
                continue;
            }

            // Headings
            const headingMatch = line.match(/^(#{1,4})\s+(.+)$/);
            if (headingMatch) {
                const level = headingMatch[1].length;
                const text = headingMatch[2];
                const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

                headings.push({ id, text, level });
                html += `<h${level} id="${id}">${text}</h${level}>\n`;
                continue;
            }

            // Lists
            if (line.match(/^\d+\.\s/)) {
                const content = line.replace(/^\d+\.\s/, '');
                html += `<ol><li>${parseInline(content)}</li></ol>\n`;
                continue;
            }
            if (line.match(/^[-*]\s/)) {
                const content = line.replace(/^[-*]\s/, '');
                html += `<ul><li>${parseInline(content)}</li></ul>\n`;
                continue;
            }

            // Blockquotes
            if (line.startsWith('>')) {
                html += `<blockquote>${parseInline(line.slice(1).trim())}</blockquote>\n`;
                continue;
            }

            // Horizontal rules
            if (line.match(/^---+$/)) {
                html += '<hr>\n';
                continue;
            }

            // Paragraphs
            if (line.trim()) {
                html += `<p>${parseInline(line)}</p>\n`;
            }
        }

        return { html, toc: headings };
    }

    function parseInline(text) {
        return text
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/\*([^*]+)\*/g, '<em>$1</em>')
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    }

    function highlightCode(code, lang) {
        if (!lang) return escapeHtml(code);

        const keywords = {
            nur: /\b(fn|let|const|if|else|for|while|return|import|export|class|struct|enum|match|break|continue)\b/g,
            javascript: /\b(function|const|let|var|if|else|for|while|return|import|export|class|async|await|try|catch)\b/g,
            python: /\b(def|class|if|elif|else|for|while|return|import|from|try|except|with|as|lambda|yield)\b/g,
            rust: /\b(fn|let|mut|const|if|else|for|while|return|use|mod|pub|struct|enum|impl|trait|match)\b/g,
            c: /\b(int|char|float|double|void|if|else|for|while|return|struct|enum|typedef|const|static)\b/g,
            bash: /\b(if|then|else|elif|fi|for|while|do|done|case|esac|function|return|exit)\b/g
        };

        let highlighted = escapeHtml(code);

        if (keywords[lang]) {
            highlighted = highlighted.replace(keywords[lang], '<span class="keyword">$&</span>');
        }

        highlighted = highlighted
            .replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, '<span class="string">$&</span>')
            .replace(/\/\/.*$/gm, '<span class="comment">$&</span>')
            .replace(/\/\*[\s\S]*?\*\//g, '<span class="comment">$&</span>')
            .replace(/\b(\d+)\b/g, '<span class="number">$1</span>')
            .replace(/\b([a-zA-Z_]\w*)\s*\(/g, '<span class="function">$1</span>(');

        return highlighted;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Table of Contents

    function updateTOC(headings) {
        const tocNav = document.getElementById('tocNav');
        if (!tocNav) return;

        if (headings.length === 0) {
            tocNav.innerHTML = '<p style="color: var(--text-muted); font-size: 0.9rem; text-align: center; padding: 1rem 0;">No sections available</p>';
            return;
        }

        const tocHeadings = headings.filter(h => h.level === 2 || h.level === 3);

        let html = '<ul>';
        tocHeadings.forEach(heading => {
            const indentStyle = heading.level === 3 ? ' style="padding-left: 1rem;"' : '';
            html += `<li${indentStyle}><a href="#${heading.id}">${heading.text}</a></li>`;
        });
        html += '</ul>';

        tocNav.innerHTML = html;
        setupScrollSpy(tocHeadings);
    }

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
            if (element) observer.observe(element);
        });
    }

    // Start Application

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
