// src/utils/url-fixer.ts
import { url, getCategoryUrl, getTagUrl } from './url-utils';

/**
 * Creates properly formatted URLs for friend content
 * Ensures all URLs have correct base path for GitHub Pages
 */
export function getCorrectUrl(path: string): string {
  if (typeof window !== 'undefined') {
    // Use the url utility to ensure base path is included
    return url(path);
  }
  return path; // Fallback for SSR
}

/**
 * Gets correct category URL using the same method as local posts
 */
export function getCorrectCategoryUrl(category: string): string {
  if (typeof window !== 'undefined') {
    try {
      // Try to use the same function used by local posts
      return getCategoryUrl(category);
    } catch (error) {
      // Fallback to simple URL construction
      return getCorrectUrl(`/archive/category/${category.toLowerCase()}/`);
    }
  }
  return `/archive/category/${category.toLowerCase()}/`;
}

/**
 * Gets correct tag URL using the same method as local posts
 */
export function getCorrectTagUrl(tag: string): string {
  if (typeof window !== 'undefined') {
    try {
      // Try to use the same function used by local posts
      return getTagUrl(tag);
    } catch (error) {
      // Fallback to simple URL construction
      return getCorrectUrl(`/archive/tag/${tag.toLowerCase()}/`);
    }
  }
  return `/archive/tag/${tag.toLowerCase()}/`;
}