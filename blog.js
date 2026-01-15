// ==== Blog Configuration ====
// Set your Medium profile URL here (custom domain or username)
// Examples:
//   - Custom domain: 'https://medium.ivangarzab.com'
//   - Username: 'https://medium.com/@yourusername'
const MEDIUM_URL = 'https://tateg.medium.com'; // Change this to your Medium URL

// Fallback posts (shown only if Medium fetch fails)
const fallbackPosts = [];

// ==== Automatic Medium RSS Fetching ====
async function fetchMediumPosts() {
  try {
    // Clean up the URL (remove trailing slash)
    const cleanUrl = MEDIUM_URL.replace(/\/$/, '');
    
    // Build the feed URL
    const feedUrl = `${cleanUrl}/feed`;
    
    console.log('Fetching from:', feedUrl);

    // Use RSS2JSON API to convert Medium RSS to JSON and bypass CORS
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`;
    
    console.log('API URL:', apiUrl);
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    console.log('RSS2JSON response:', data);
    
    if (data.status !== 'ok') {
      throw new Error(`RSS feed fetch failed: ${data.message || 'Unknown error'}`);
    }

    if (!data.items || data.items.length === 0) {
      console.warn('No posts found in RSS feed');
      return fallbackPosts;
    }

    // Transform RSS items to our blog post format
    const posts = data.items.map(item => {
      // Clean up description - remove HTML tags and limit length
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = item.description || item.content || '';
      let plainDescription = tempDiv.textContent || tempDiv.innerText || '';
      
      // Limit description to 200 characters
      if (plainDescription.length > 200) {
        plainDescription = plainDescription.substring(0, 197) + '...';
      }

      // Calculate read time based on content length
      const fullText = tempDiv.textContent || '';
      const wordCount = fullText.split(/\s+/).length;
      const readTime = Math.max(1, Math.ceil(wordCount / 200)) + ' min read';

      // Format date
      const pubDate = new Date(item.pubDate);
      const formattedDate = pubDate.toISOString().split('T')[0];

      return {
        title: item.title || 'Untitled',
        description: plainDescription,
        url: item.link || item.guid,
        date: formattedDate,
        readTime: readTime,
        tags: item.categories ? item.categories.slice(0, 3) : []
      };
    });

    console.log('Processed posts:', posts);
    return posts;
  } catch (error) {
    console.error('Error fetching Medium posts:', error);
    return fallbackPosts;
  }
}

// ==== Blog Post Rendering ====
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

function createPostCard(post) {
  const article = document.createElement('article');
  article.className = 'blog-card card fade-in';
  
  const tags = post.tags && post.tags.length > 0 
    ? `<div class="blog-tags">${post.tags.map(tag => `<span class="blog-tag">${tag}</span>`).join('')}</div>`
    : '';
  
  article.innerHTML = `
    <div class="blog-card__content">
      <div class="blog-meta">
        <time datetime="${post.date}">${formatDate(post.date)}</time>
        ${post.readTime ? `<span class="blog-meta__divider">•</span><span>${post.readTime}</span>` : ''}
      </div>
      <h3 class="h3 blog-card__title">${post.title}</h3>
      <p class="blog-card__description">${post.description}</p>
      ${tags}
      <a href="${post.url}" target="_blank" rel="noopener noreferrer" class="blog-card__link">
        Read on Medium
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 3L11 8L6 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </a>
    </div>
  `;
  
  return article;
}

async function renderBlogPosts() {
  const container = document.getElementById('blog-posts');
  const noPosts = document.getElementById('no-posts');
  const loading = container.querySelector('.blog-loading');
  
  try {
    console.log('Starting to fetch Medium posts...');
    
    // Fetch posts from Medium
    const posts = await fetchMediumPosts();
    
    console.log('Fetched posts:', posts);
    
    if (loading) {
      loading.remove();
    }
    
    if (posts.length === 0) {
      console.log('No posts to display');
      noPosts.style.display = 'block';
      return;
    }
    
    // Sort posts by date (newest first)
    const sortedPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    sortedPosts.forEach((post, index) => {
      const card = createPostCard(post);
      // Add staggered animation delay
      if (index > 0 && index <= 3) {
        card.classList.add(`fade-in-delay-${index}`);
      }
      container.appendChild(card);
    });
    
    // Re-observe fade-in elements
    const fadeElements = container.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    fadeElements.forEach((el) => observer.observe(el));
  } catch (error) {
    console.error('Error rendering blog posts:', error);
    if (loading) {
      loading.remove();
    }
    noPosts.style.display = 'block';
  }
}

// ==== Initialize Blog ====
document.addEventListener('DOMContentLoaded', () => {
  console.log('Blog page loaded, initializing...');
  renderBlogPosts();
});
