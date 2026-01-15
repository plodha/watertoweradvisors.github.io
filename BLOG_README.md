# Watertower Advisors Blog

## 🎉 Automatic Medium Integration

Your blog now **automatically fetches posts from Medium**! Whenever you publish a new article on Medium, it will appear on your blog page automatically—no manual updates needed.

## Setup (One-Time Configuration)

1. Open `blog.js`
2. Find the `MEDIUM_URL` constant at the top
3. Update it with your Medium URL:

```javascript
// For custom domain:
const MEDIUM_URL = 'https://medium.ivangarzab.com';

// Or for regular Medium username:
const MEDIUM_URL = 'https://medium.com/@yourusername';
```

That's it! Your blog will now automatically display all your Medium posts.

## How It Works

- **Automatic Fetching**: The blog page fetches your Medium RSS feed when visitors load the page
- **Chronological Order**: Posts automatically display newest first
- **Real-time Updates**: New Medium posts appear immediately (no website rebuild needed)
- **No Manual Work**: Just publish on Medium and it shows up here

## What Gets Displayed

For each Medium post, the blog automatically shows:
- ✅ Article title
- ✅ Description/excerpt
- ✅ Publication date
- ✅ Tags/categories
- ✅ Estimated read time
- ✅ Direct link to Medium article

## Using Your Friend's Medium Until You Create Your Account

The blog is currently configured to show posts from `https://medium.ivangarzab.com`. When you create your own Medium account:

1. Open `blog.js`
2. Change `MEDIUM_URL` to your Medium URL
3. Save the file
4. Done! Your posts will now display

## Testing

After setting up:
1. Open `blog.html` in your browser
2. Your Medium posts should load automatically
3. If you see "Loading posts..." for more than a few seconds, check the browser console for errors

## Troubleshooting

### No Posts Showing Up
- Verify your Medium URL is correct in `blog.js`
- Make sure you have published articles on Medium
- Check the browser console (F12) for error messages

### Posts Not Updating
- The blog fetches posts fresh on each page load
- Try hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
- Clear your browser cache

## Technical Details

- Uses Medium's RSS feed (`/feed` endpoint)
- RSS2JSON API converts RSS to JSON and handles CORS
- Free tier supports unlimited requests
- No backend or server required

## File Structure

```
blog.html       - The blog page HTML
blog.js         - Blog post data and rendering logic
styles.css      - Includes blog-specific styles
```

## Questions?

The blog page is fully integrated with your existing design system and will match the dark/light theme automatically. All animations and responsive behaviors are already configured!
