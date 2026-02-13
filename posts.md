---
layout: default
title: Posts
permalink: /posts/
---

<section class="wrap page fade-in">
  <div class="section-header">
    <h1>Updates & Announcements</h1>
    <p>Stay updated with the latest news from Al Khizanah</p>
  </div>

  <div class="posts-list">
    {% for post in site.posts %}
    <article class="post-item">
      <h2><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h2>
      <p class="post-meta">{{ post.date | date: "%B %d, %Y" }}{% if post.author %} · {{ post.author }}{% endif %}</p>
      {% if post.excerpt %}
      <p class="post-excerpt">{{ post.excerpt | strip_html | truncatewords: 50 }}</p>
      {% endif %}
      <a href="{{ post.url | relative_url }}" class="text-link">Read more →</a>
    </article>
    {% endfor %}

    {% if site.posts.size == 0 %}
    <div class="card">
      <h3>No posts yet</h3>
      <p class="text-muted">Check back soon for updates and announcements!</p>
    </div>
    {% endif %}
  </div>
</section>
