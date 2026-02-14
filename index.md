---
layout: default
title: Home
---

<!-- Hero Section -->
<section class="hero wrap">
    <img src="{{ '/assets/images/alkhazina_small.png' | relative_url }}" alt="Al Khizanah mark" class="hero-logo">
    <h1>Al Khizanah</h1>
    <p>A group of people gathered to make software</p>
    <div class="hero-actions">
        <a href="{{ '/projects/' | relative_url }}" class="button button-primary">Explore Projects</a>
        <a href="{{ '/about/' | relative_url }}" class="button button-secondary">Learn More</a>
    </div>
</section>

<!-- Featured Projects -->
<section class="projects-preview wrap">
    <div class="section-header">
        <h2>Featured Projects</h2>
        <p>Showcasing our latest work and open-source contributions</p>
    </div>

    <div class="card-grid">
    <!-- Nur Project -->
    <article class="card fade-in" data-github-repo="alkhizanah/nur">
    <h3>Nur</h3>
    <p>A scripting language for ease of use</p>
    <div class="card-tags">
    <span class="tag">Compiler</span>
    <span class="tag">Language</span>
    <span class="tag">Systems</span>
    </div>
    <div class="github-stats">
    <span class="loading-stats">Loading stats...</span>
    </div>
    <div class="project-actions">
    <a href="{{ '/projects/' | relative_url }}#nur" class="project-link">Documentation →</a>
    <a href="https://github.com/alkhizanah/nur" class="project-link" target="_blank" rel="noopener">GitHub →</a>
    </div>
    </article>

    <!-- Fajr Project -->
    <article class="card fade-in" style="animation-delay: 0.1s" data-github-repo="alkhizanah/fajr">
    <h3>Fajr</h3>
    <p>A modern and elegant operating system for programmers.</p>
    <div class="card-tags">
    <span class="tag">Build Tool</span>
    <span class="tag">CLI</span>
    <span class="tag">DevOps</span>
    </div>
    <div class="github-stats">
    <span class="loading-stats">Loading stats...</span>
    </div>
    <div class="project-actions">
    <a href="{{ '/projects/' | relative_url }}#fajr" class="project-link">Documentation →</a>
    <a href="https://github.com/alkhizanah/fajr" class="project-link" target="_blank" rel="noopener">GitHub →</a>
    </div>
    </article>

    <!-- Way Project -->
    <article class="card fade-in" style="animation-delay: 0.2s" data-github-repo="alkhizanah/way">
    <h3>Way</h3>
    <p>A systems programming language for the impatient.</p>
    <div class="card-tags">
    <span class="tag">Framework</span>
    <span class="tag">Architecture</span>
    <span class="tag">New</span>
    </div>
    <div class="github-stats">
    <span class="loading-stats">Loading stats...</span>
    </div>
    <div class="project-actions">
    <a href="{{ '/projects/' | relative_url }}#way" class="project-link">Documentation →</a>
    <a href="https://github.com/alkhizanah/way" class="project-link" target="_blank" rel="noopener">GitHub →</a>
    </div>
    </article>

    <!-- Qalam Project -->
    <article class="card fade-in" style="animation-delay: 0.3s" data-github-repo="alkhizanah/qalam">
    <h3>Qalam</h3>
    <p>A modal text editor.</p>
    <div class="card-tags">
    <span class="tag">Editor</span>
    <span class="tag">IDE</span>
    <span class="tag">Tools</span>
    </div>
    <div class="github-stats">
    <span class="loading-stats">Loading stats...</span>
    </div>
    <div class="project-actions">
    <a href="{{ '/projects/' | relative_url }}#qalam" class="project-link">Documentation →</a>
    <a href="https://github.com/alkhizanah/qalam" class="project-link" target="_blank" rel="noopener">GitHub →</a>
    </div>
    </article>
    </div>

    <div class="view-all-container">
    <a href="{{ '/projects/' | relative_url }}" class="button button-secondary">View All Projects</a>
    </div>
</section>
