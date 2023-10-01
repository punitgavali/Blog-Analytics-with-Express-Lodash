const express = require('express');
const axios = require('axios');
const _ = require('lodash');

const app = express();
const port = 3001;

// Middleware to fetch blog data and perform analytics
app.get('/api/blog-stats', async (req, res) => {
  try {
    // Make a GET request to fetch the blog data
    const response = await axios.get(
      'https://intent-kit-16.hasura.app/api/rest/blogs',
      {
        headers: {
          'x-hasura-admin-secret':
            '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6',
        },
      }
    );

    const blogs = response.data;

    // Calculate total number of blogs
    const totalBlogs = blogs.length;

    // Find the blog with the longest title
    const longestBlog = _.maxBy(blogs, (blog) => blog.title.length);

    // Determine the number of blogs with titles containing "privacy" (case-insensitive)
    const blogsWithPrivacy = _.filter(blogs, (blog) =>
      _.includes(blog.title.toLowerCase(), 'privacy')
    ).length;

    // Create an array of unique blog titles
    const uniqueTitles = _.uniqBy(blogs, 'title').map((blog) => blog.title);

    // Respond with the statistics in JSON format
    res.json({
      totalBlogs,
      longestBlog: longestBlog.title,
      blogsWithPrivacy,
      uniqueTitles,
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Blog search endpoint
app.get('/api/blog-search', async (req, res) => {
  const query = req.query.query;

  // Check if query parameter exists
  if (!query) {
    return res.status(400).json({ error: 'Query parameter "query" is required' });
  }

  try {
    // Make a GET request to fetch the blog data
    const response = await axios.get(
      'https://intent-kit-16.hasura.app/api/rest/blogs',
      {
        headers: {
          'x-hasura-admin-secret':
            '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6',
        },
      }
    );

    const blogs = response.data;

    // Perform a case-insensitive search
    const searchResults = _.filter(blogs, (blog) =>
      _.includes(blog.title.toLowerCase(), query.toLowerCase())
    );

    // Respond with the search results
    res.json(searchResults);
  } catch (error) {
    // Handle errors
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
