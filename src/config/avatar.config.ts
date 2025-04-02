// Import type - use import type syntax to fix verbatimModuleSyntax error
import type { ImageMetadata } from 'astro'

// Define the avatar configuration type
export interface AvatarConfig {
  avatarList: string[]
  homeAvatar: string
  animationInterval: number
}

/**
 * Avatar configuration for the site
 * Controls which avatars are used for the home page and posts
 */
export const avatarConfig: AvatarConfig = {
  // List of all available avatars for post pages and rotation
  avatarList: [
    "/src/content/avatar/avatar.png",
    "/src/content/avatar/avatar2.png",
    "/src/content/avatar/avatar3.png",
    "/src/content/avatar/avatar4.png",
    "/src/content/avatar/avatar5.png",
    "/src/content/avatar/avatar6.png"
  ],
  
  // Avatar to use on the home page (site owner)
  homeAvatar: "/src/content/avatar/avatar.png",
  
  // Animation interval in milliseconds
  animationInterval: 7500
};

/**
 * Get a consistent avatar index for a given post slug
 * This ensures the same post always shows the same avatar
 */
export function getAvatarIndexFromSlug(slug: string = '', avatarCount: number): number {
  if (!slug) return 0 // Default to first avatar if no slug
  
  // Simple hash function to get consistent avatar for each slug
  let hash = 0
  for (let i = 0; i < slug.length; i++) {
    hash = ((hash << 5) - hash) + slug.charCodeAt(i)
    hash = hash & hash // Convert to 32bit integer
  }
  
  // Ensure positive index and map to available avatars
  return Math.abs(hash) % avatarCount
}