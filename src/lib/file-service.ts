// lib/file-service.ts
import type { Post } from '../types/Post';
import matter from 'gray-matter';

/**
 * File service for handling local Markdown/MDX files
 * 
 * NOTE: This service uses the Astro dev server endpoints for local development
 * When deployed to GitHub Pages, these operations will use GitHub API instead
 */
export function createFileService() {
  const isDev = import.meta.env.DEV;
  const postsPath = 'src/content/posts';
  
  /**
   * List all available posts in the content directory
   */
  async function listPosts(): Promise<{slug: string, title: string, published: string}[]> {
    if (!isDev) {
      console.warn('listPosts is only available in development mode');
      return [];
    }
    
    try {
      const response = await fetch('/api/posts');
      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error listing posts:', error);
      return [];
    }
  }
  
  /**
   * Get a specific post by slug
   */
  async function getPost(slug: string): Promise<Post | null> {
    if (!isDev) {
      console.warn('getPost is only available in development mode');
      return null;
    }
    
    try {
      const response = await fetch(`/api/posts/${slug}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch post: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error getting post ${slug}:`, error);
      return null;
    }
  }
  
  /**
   * Save a post to the content directory
   */
  async function savePost(post: Post): Promise<boolean> {
    if (!isDev) {
      console.warn('savePost is only available in development mode');
      return false;
    }
    
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(post),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to save post: ${response.statusText}`);
      }
      
      return true;
    } catch (error) {
      console.error('Error saving post:', error);
      return false;
    }
  }
  
  /**
   * Delete a post by slug
   */
  async function deletePost(slug: string): Promise<boolean> {
    if (!isDev) {
      console.warn('deletePost is only available in development mode');
      return false;
    }
    
    try {
      const response = await fetch(`/api/posts/${slug}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete post: ${response.statusText}`);
      }
      
      return true;
    } catch (error) {
      console.error(`Error deleting post ${slug}:`, error);
      return false;
    }
  }
  
  /**
   * Extract frontmatter and content from a markdown string
   */
  function parseFrontmatter(content: string): { data: Record<string, any>; content: string } {
    try {
      const { data, content: markdownContent } = matter(content);
      return { data, content: markdownContent };
    } catch (error) {
      console.error('Error parsing frontmatter:', error);
      return { data: {}, content };
    }
  }
  
  /**
   * Generate frontmatter string from post data
   */
  function generateFrontmatter(data: Record<string, any>): string {
    let frontmatter = `---\n`;
    
    for (const [key, value] of Object.entries(data)) {
      // Skip the content field
      if (key === 'content') continue;
      
      // Handle arrays (like tags)
      if (Array.isArray(value)) {
        frontmatter += `${key}: [${value.map(item => `"${item}"`).join(', ')}]\n`;
      } 
      // Handle nested objects
      else if (typeof value === 'object' && value !== null) {
        frontmatter += `${key}:\n`;
        for (const [nestedKey, nestedValue] of Object.entries(value)) {
          frontmatter += `  ${nestedKey}: ${JSON.stringify(nestedValue)}\n`;
        }
      }
      // Handle strings, numbers, and booleans
      else if (value !== undefined && value !== null) {
        if (typeof value === 'string') {
          frontmatter += `${key}: "${value}"\n`;
        } else {
          frontmatter += `${key}: ${value}\n`;
        }
      }
    }
    
    frontmatter += `---`;
    return frontmatter;
  }
  
  return {
    listPosts,
    getPost,
    savePost,
    deletePost,
    parseFrontmatter,
    generateFrontmatter,
    isDev,
    postsPath
  };
}

export type FileService = ReturnType<typeof createFileService>;