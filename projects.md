---
layout: projects-docs
title: Projects & Documentation
permalink: /projects/
---

<section class="projects-docs-intro wrap">
  <h1>Projects & Documentation</h1>
  <p>Explore our open-source projects and their comprehensive documentation. Each project includes detailed guides, API references, and examples to help you get started.</p>
</section>

<!-- Project tabs will be injected here by JavaScript -->
<nav class="project-tabs-nav" id="projectTabs">
  <div class="wrap">
    <div class="project-tabs">
      <button class="project-tab active" data-project="nur">Nur</button>
      <button class="project-tab" data-project="fajr">Fajr</button>
      <button class="project-tab" data-project="way">Way</button>
      <button class="project-tab" data-project="qalam">Qalam</button>
      <button class="project-tab" data-project="bento">Bento</button>
      <button class="project-tab" data-project="tree-sitter-nur">Tree-sitter Nur</button>
      <button class="project-tab" data-project="aqsa">Aqsa</button>
      <button class="project-tab" data-project="compute">Compute</button>
    </div>
  </div>
</nav>

<!-- Main content area with three columns -->
<div class="projects-docs-layout wrap">
  <!-- Left Sidebar - Repo Card & Table of Contents -->
  <aside class="left-sidebar">
    <!-- GitHub Repo Card -->
    <div class="repo-card" id="repoCard" data-github-repo="alkhizanah/nur">
      <div class="repo-header">
        <svg class="repo-icon" viewBox="0 0 16 16" fill="currentColor">
          <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"/>
        </svg>
        <a href="https://github.com/alkhizanah/nur" class="repo-name-link" id="repoLink" target="_blank" rel="noopener">
          <div class="repo-name" id="repoName">
            <span class="repo-owner">alkhizanah</span>/<span class="repo-project">nur</span>
          </div>
        </a>
      </div>

      <p class="repo-description" id="repoDescription">
        A modern, elegant programming language designed for clarity and expressiveness.
      </p>

      <div class="github-stats">
        <span class="loading-stats">Loading stats...</span>
      </div>

      <div class="repo-stats" id="repoStats" style="display: none;">
        <div class="stat">
          <svg viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
          </svg>
          <span class="stat-count" id="starsCount">0</span>
        </div>
        <div class="stat">
          <svg viewBox="0 0 16 16" fill="currentColor">
            <path d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"/>
          </svg>
          <span class="stat-count" id="forksCount">0</span>
        </div>
      </div>

      <div class="repo-topics" id="repoTopics">
        <span class="topic">compiler</span>
        <span class="topic">language</span>
        <span class="topic">systems</span>
      </div>
    </div>

    <!-- Table of Contents -->
    <div class="toc-sidebar">
      <h3>On this page</h3>
      <nav class="toc-nav" id="tocNav">
        <!-- TOC will be generated dynamically based on loaded content -->
      </nav>
    </div>
  </aside>

  <!-- Center - Main Documentation Content -->
  <main class="docs-main-content" id="docsContent">
    <!-- Content will be loaded dynamically from _docs/ folder -->
    <div class="loading-content">
      <p>Loading documentation...</p>
    </div>
  </main>
</div>
