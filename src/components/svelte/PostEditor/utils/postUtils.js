// Utility functions for post operations

/**
 * Generate a slug from a title
 * @param {string} title - The post title
 * @returns {string} - URL-friendly slug
 */
export function generateSlugFromTitle(title) {
    if (!title) return '';
    
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  
  /**
   * Format a date for display
   * @param {string} dateString - ISO date string
   * @returns {string} - Formatted date
   */
  export function formatDate(dateString) {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  }
  
  /**
   * Generate frontmatter for MDX files
   * @param {Object} data - Post data
   * @returns {string} - Formatted frontmatter
   */
  export function generateFrontmatter(data) {
    let frontmatter = `---\n`;
    frontmatter += `title: "${data.title}"\n`;
    frontmatter += `published: ${data.published}\n`;
    frontmatter += `description: "${data.description}"\n`;
    
    if (data.image) {
      frontmatter += `image: "${data.image}"\n`;
    }
    
    if (data.tags && data.tags.length > 0) {
      frontmatter += `tags: [${data.tags.map(tag => `"${tag}"`).join(', ')}]\n`;
    }
    
    if (data.category) {
      frontmatter += `category: "${data.category}"\n`;
    }
    
    frontmatter += `draft: ${data.draft}\n`;
    
    // Add advanced fields if enabled
    if (data.showAdvancedOptions) {
      if (data.advanced.avatarImage) {
        frontmatter += `avatarImage: "${data.advanced.avatarImage}"\n`;
      }
      
      if (data.advanced.authorName) {
        frontmatter += `authorName: "${data.advanced.authorName}"\n`;
      }
      
      if (data.advanced.authorBio) {
        frontmatter += `authorBio: "${data.advanced.authorBio}"\n`;
      }
      
      // Add showImageOnPost field
      frontmatter += `showImageOnPost: ${data.advanced.showImageOnPost}\n`;
      
      // Add language field
      if (data.advanced.lang) {
        frontmatter += `lang: "${data.advanced.lang}"\n`;
      }
    }
    
    // Add timeline data if present
    if (data.timelineData && data.timelineData.enabled) {
      frontmatter += `timelineYear: ${data.timelineData.year || new Date().getFullYear()}\n`;
      frontmatter += `timelineEra: "${data.timelineData.era}"\n`;
      frontmatter += `timelineLocation: "${data.timelineData.location}"\n`;
      frontmatter += `isKeyEvent: ${data.timelineData.isKeyEvent}\n`;
    }
    
    // Add banner data if present
    if (data.banner && data.banner.type) {
      frontmatter += `bannerType: "${data.banner.type}"\n`;
      
      if (data.banner.type === 'image' && data.advanced && data.advanced.bannerImage) {
        frontmatter += `bannerData:\n`;
        frontmatter += `  image: "${data.advanced.bannerImage}"\n`;
      } else if (data.banner.type === 'video' && data.banner.videoId) {
        frontmatter += `bannerData:\n`;
        frontmatter += `  videoId: "${data.banner.videoId}"\n`;
      } else if (data.banner.type === 'timeline' && data.banner.timelineCategory) {
        frontmatter += `bannerData:\n`;
        frontmatter += `  category: "${data.banner.timelineCategory}"\n`;
      }
    }
    
    frontmatter += `---`;
    return frontmatter;
  }
  
  /**
   * Parse MDX/MD file content with frontmatter
   * @param {string} fileContent - Raw MDX/MD file content
   * @returns {Object} - Parsed frontmatter and content
   */
  export function parseMdxFile(fileContent) {
    try {
      // Simple frontmatter parser
      const frontmatterMatch = fileContent.match(/---\n([\s\S]*?)\n---/);
      let frontmatter = {};
      let content = fileContent;
      
      if (frontmatterMatch) {
        const frontmatterText = frontmatterMatch[1];
        
        // Extract each line and parse
        frontmatterText.split('\n').forEach(line => {
          const match = line.match(/^(\w+):\s*(.*)$/);
          if (match) {
            let [_, key, value] = match;
            
            // Handle array values (tags: ["a", "b"])
            if (value.startsWith('[') && value.endsWith(']')) {
              try {
                value = JSON.parse(value.replace(/'/g, '"'));
              } catch (e) {
                value = value.slice(1, -1).split(',').map(item => item.trim().replace(/["']/g, ''));
              }
            }
            
            // Handle boolean values
            else if (value === 'true' || value === 'false') {
              value = value === 'true';
            }
            
            frontmatter[key] = value;
          }
        });
        
        // Remove frontmatter from content
        content = fileContent.slice(frontmatterMatch[0].length).trim();
      }
      
      return { frontmatter, content };
    } catch (error) {
      console.error('Error parsing MDX file:', error);
      return { frontmatter: {}, content: fileContent };
    }
  }
  
  /**
   * Create a new empty post object
   * @returns {Object} - Empty post object with default values
   */
  export function createEmptyPost() {
    return {
      title: '',
      description: '',
      slug: '',
      published: new Date().toISOString().split('T')[0],
      image: '',
      tags: '',
      category: '',
      showAdvancedOptions: false,
      advanced: {
        avatarImage: '',
        authorName: '',
        authorBio: '',
        showImageOnPost: false,
        lang: 'en',
        bannerImage: ''
      },
      timelineData: {
        enabled: false,
        year: undefined,
        era: '',
        location: '',
        isKeyEvent: false
      },
      banner: {
        type: '',
        videoId: '',
        timelineCategory: ''
      },
      content: '',
      draft: true,
      filepath: ''
    };
  }
  
  /**
   * Save a post to localStorage cache
   * @param {Object} postData - Post data to cache
   * @param {string} githubFolder - GitHub folder path
   */
  export function saveCachedPost(postData, githubFolder) {
    try {
      // Get existing cached posts
      const existingPostsStr = localStorage.getItem('cachedPosts');
      let existingPosts = existingPostsStr ? JSON.parse(existingPostsStr) : [];
      
      // Create a metadata entry for this post
      const postMetadata = {
        id: `${postData.slug}.mdx`,
        title: postData.title,
        description: postData.description,
        slug: postData.slug,
        published: postData.published,
        updated: new Date().toISOString().split('T')[0],
        tags: postData.tags,
        category: postData.category,
        draft: postData.draft,
        content: postData.content.substring(0, 150) + (postData.content.length > 150 ? '...' : ''),
        // Use the original filepath if we're editing an existing post
        filepath: postData.filepath || `${githubFolder}/${postData.slug}.mdx`
      };
      
      // Check if post already exists (by slug) and update it, otherwise add it
      const existingIndex = existingPosts.findIndex(p => p.slug === postData.slug);
      if (existingIndex !== -1) {
        existingPosts[existingIndex] = postMetadata;
      } else {
        existingPosts.push(postMetadata);
      }
      
      // Save the updated list back to localStorage
      localStorage.setItem('cachedPosts', JSON.stringify(existingPosts));
      
      // Also save the full post content separately for potential future editing
      localStorage.setItem(`fullPost_${postData.slug}`, JSON.stringify({
        ...postMetadata,
        content: postData.content,
        advanced: postData.advanced,
        timelineData: postData.timelineData,
        banner: postData.banner
      }));
      
      return existingPosts;
    } catch (error) {
      console.error('Error saving post to cache:', error);
      throw error;
    }
  }
  
  /**
   * Get cached posts from localStorage
   * @returns {Array} - Array of cached posts
   */
  export function getCachedPosts() {
    try {
      const cachedPostsStr = localStorage.getItem('cachedPosts');
      if (cachedPostsStr) {
        return JSON.parse(cachedPostsStr);
      }
      return [];
    } catch (error) {
      console.error('Error loading cached posts:', error);
      return [];
    }
  }githubUtils