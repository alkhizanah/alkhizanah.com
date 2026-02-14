---
layout: default
title: Posts
permalink: /posts/
---

<!-- Hero Section -->
<section class="posts-hero wrap">
  <div class="posts-hero-content fade-in">
    <h1>Updates & Announcements</h1>
    <p class="posts-lead">Stay updated with the latest news, releases, and insights from Al Khizanah</p>
  </div>
</section>

<!-- Posts Grid -->
<section class="posts-content wrap">
  <div class="posts-grid">
    {% for post in site.posts %}
    <article class="post-card fade-in" style="animation-delay: {{ forloop.index0 | times: 0.1 }}s">
      <div class="post-card-header">
        <div class="post-meta-top">
          <time class="post-date">{{ post.date | date: "%b %d, %Y" }}</time>
          {% if post.project %}
          <span class="post-project">{{ post.project }}</span>
          {% endif %}
        </div>
      </div>

      <div class="post-card-content">
        <h2><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h2>

        {% if post.excerpt %}
        <p class="post-excerpt">{{ post.excerpt | strip_html | truncatewords: 30 }}</p>
        {% endif %}

        <a href="{{ post.url | relative_url }}" class="post-read-more">
          Read article
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
      </div>
    </article>
    {% endfor %}

    {% if site.posts.size == 0 %}
    <div class="posts-empty fade-in">
      <div class="empty-icon">📝</div>
      <h3>No posts yet</h3>
      <p>Check back soon for updates, announcements, and insights from the team!</p>
    </div>
    {% endif %}
  </div>
</section>
