# Temporal Flow

<p align="center">
  <img src="https://via.placeholder.com/150" alt="Temporal Flow Logo" width="150" height="150">
</p>

<p align="center">
  A decentralized content sharing platform built with Astro, Svelte and Tailwind CSS
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#installation">Installation</a> •
  <a href="#usage">Usage</a> •
  <a href="#banner-system">Banner System</a> •
  <a href="#friend-content-sharing">Friend Content Sharing</a> •
  <a href="#timeline-visualization">Timeline Visualization</a> •
  <a href="#configuration">Configuration</a> •
  <a href="#roadmap">Roadmap</a> •
  <a href="#contributing">Contributing</a> •
  <a href="#license">License</a>
</p>

> **Note:** Temporal Flow is currently in early beta (v0.1.0). While fully functional, we're actively developing additional features and refining existing ones. Your feedback and contributions are welcome as we work toward our 1.0 release!

## Overview

Temporal Flow is a blazing-fast, self-hosted content platform designed for bloggers, content creators, and digital storytellers who value ownership of their content while desiring connectivity with others. Built on the Astro framework with Svelte components and Tailwind CSS, it delivers a responsive, performant experience across all devices.

The platform combines the best aspects of traditional blogging with modern social features through its decentralized Friend Content Sharing system, allowing you to build a network of connected sites without sacrificing ownership of your data.

## Features

### Core Platform
- 🚀 **Blazing Fast Performance**: Built with Astro Islands architecture for optimal performance
- 📱 **Fully Responsive**: Beautiful experience across desktop, tablet, and mobile devices
- 🌓 **Light/Dark Mode**: Automatic theme detection with manual toggle option
- 🎨 **Customizable Theme**: Adjustable color theme with hue selection
- 🔍 **Built-in Search**: Full-text search across all your content
- 📊 **SEO Optimized**: Built-in meta tags and structured data for better discoverability

### Content Management
- ✍️ **Markdown/MDX Support**: Write content in Markdown or MDX with frontmatter
- 📂 **Category & Tag System**: Organize content with categories and tags
- 📸 **Media Optimization**: Automatic WebP conversion for faster loading
- 📑 **Table of Contents**: Automatically generated for longer articles
- 📎 **Static Asset Handling**: Optimized handling of images and attachments

### Banner System
- 🌠 **Dynamic Banners**: Multiple banner types for visual storytelling
- 🎬 **Video Banners**: Embed YouTube videos as page headers
- ⏳ **Timeline Banners**: Interactive chronological visualizations
- 🖼️ **Image Banners**: Featured images as prominent headers
- 🎭 **Animated Banners**: Auto-transitioning image sequences

### Friend Content Sharing
- 🔗 **Decentralized Connections**: Connect with other blogs without a central server
- 📡 **Content Federation**: Follow and display content from other Temporal Flow sites
- 🔒 **Privacy Focused**: Visitors only see your content, you control what's shared
- 📦 **Content Packages**: Export and import content directly between sites
- 🔄 **Multi-Source Compatibility**: Works with RSS, JSON feeds, and direct site scraping

### Timeline Visualization
- ⏱️ **Interactive Timeline**: Visualize chronological events with an intuitive interface
- 🌍 **Multiple View Modes**: Timeline, List, Tree, and Map visualizations
- ⭐ **Event Highlighting**: Visual differentiation between regular and key events
- 🔍 **Zoom & Pan Controls**: Intuitive navigation of timeline content
- 📱 **Touch Optimized**: Special interactions for mobile devices

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/temporal-flow.git
cd temporal-flow

# Install dependencies
pnpm install

# Build the project
pnpm build

# Start development server
pnpm run astro dev
```

## Usage

### Creating Content

Content in Temporal Flow is created using Markdown (`.md`) or MDX (`.mdx`) files in the `content` directory:

1. Create a new file in `src/content/posts/`
2. Add frontmatter at the top of the file (see Frontmatter section below)
3. Write your content in Markdown/MDX format
4. Save the file and it will automatically appear in your blog feed

### Understanding Frontmatter

Frontmatter is the YAML section at the beginning of each content file that defines metadata and behavior. Here's a breakdown of available options:

#### Basic Metadata
```yaml
---
title: "My Post Title"              # Required: Title of your post
published: 2025-03-29               # Required: Publication date
description: "Brief description"     # Recommended: Used for SEO and previews
image: "/posts/mypost/feature.jpg"   # Featured image path
tags: [Tag1, Tag2, Tag3]            # Array of tags for categorization
category: "Main Category"           # Primary category
draft: false                        # Set to true to hide from production
lang: "en"                          # Content language code
---
```

#### Custom Author Info
```yaml
---
# Custom author override (optional)
avatarImage: "/authors/guest-avatar.png"
authorName: "Guest Author"
authorBio: "Brief author bio goes here"
---
```

#### Banner Configuration
```yaml
---
# Standard image banner
image: "/posts/mypost/banner.jpg"

# OR Video banner
bannerType: "video"
bannerData:
  videoId: "dQw4w9WgXcQ"            # YouTube video ID
  
# OR Timeline banner
bannerType: "timeline"
bannerData:
  category: "Project History"
  startYear: 2020
  endYear: 2025
  background: "/posts/timeline/background.jpg"
  height: "70vh"                    # Optional banner height
---
```

#### Timeline Integration
```yaml
---
# Timeline event data
timelineYear: 2023                  # Year for timeline placement
timelineEra: "digital-age"          # Timeline era classification
timelineLocation: "Global"          # Location for map view
isKeyEvent: true                    # Highlight as a key event
---
```

#### Complete Example
Here's a comprehensive example showing how all these elements can work together:

```yaml
---
title: "MEGA MEAL Universe Timeline"
published: 2025-03-25
description: "Explore the complete chronology of the MEGA MEAL Universe."
image: '/posts/timeline/universe.png'

# Custom author profile
avatarImage: "/posts/timeline/universe-avatar.png"
authorName: "The Universe"
authorBio: "...and everything in it"

# Timeline banner configuration
bannerType: "timeline"
bannerData:
  category: "MEGA MEAL"
  startYear: 1
  endYear: 50000
  background: "/posts/timeline/universe.png"

# Timeline integration
timelineYear: 1
timelineEra: "all-eras"
timelineLocation: "Historical Archives"
isKeyEvent: true

# Additional metadata
showImageOnPost: false
tags: [Timeline, Lore, Universe, Documentation]
category: "MEGA MEAL"
draft: false
lang: ""
---
```

## Banner System

Temporal Flow features a versatile banner system that enhances visual storytelling through multiple banner types:

### Banner Types

#### Standard Animated Banner
The default banner type automatically transitions between a series of images, creating an elegant animated effect for your homepage and standard pages.

```yaml
# No special configuration needed - uses site defaults
```

#### Image Banner
A static featured image banner prominently displays your post's main visual.

```yaml
---
image: "/posts/my-article/featured-image.jpg"
---
```

#### Video Banner
Embed YouTube videos as banners for video-centric content.

```yaml
---
bannerType: "video"
bannerData:
  videoId: "dQw4w9WgXcQ"  # YouTube video ID
---
```

#### Timeline Banner
Create interactive chronological visualizations as page headers - perfect for historical articles, project timelines, or story chronologies.

```yaml
---
bannerType: "timeline"
bannerData:
  category: "Project History"
  startYear: 2020
  endYear: 2025
  background: "/path/to/background.jpg"
  height: "70vh"  # Optional custom height
---
```

### Banner Responsiveness

Banners automatically adapt to different screen sizes:
- Desktop: Full-width display with optimized heights
- Tablet: Adjusted proportions for medium screens
- Mobile: Compact display with touch-friendly interactions

### Banner Customization

Site-wide banner defaults can be configured in `config.ts`, while individual page banners are controlled through frontmatter.

## Friend Content Sharing

The Friend Content Sharing system allows you to connect your blog with others running Temporal Flow, creating a decentralized network of content.

### Enabling Friend Sharing

Friend sharing is enabled by default, but for cross-domain functionality, you need to set up CORS headers:

For GitHub Pages, add a `_headers` file to your repository root:
```
# Set CORS headers for the friend-content.json file
/friend-content.json
  Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: GET
  Access-Control-Allow-Headers: Content-Type
```

### Connecting With Friends

1. Log in to your blog as an administrator
2. Navigate to the `/friends` page
3. Enter your friend's blog name and URL
4. Click "Add Friend"

The system will automatically validate the site and fetch their content, which will be visible only to you when logged in.

## Timeline Visualization

Temporal Flow includes a powerful timeline visualization system that can display chronological events in multiple views.

### Adding Timeline Events

Any blog post can become a timeline event by adding timeline-specific frontmatter:

```yaml
---
title: "My Event"
published: 2025-03-29
timelineYear: 2025
timelineEra: "digital-age"
timelineLocation: "San Francisco"
isKeyEvent: false
---
```

### Timeline Views

- **Timeline View**: Interactive visualization with star-like event nodes
- **List View**: Chronological list of events organized by era
- **Tree View**: Hierarchical display showing relationships between events
- **Map View**: Spatial representation of events with location data

## Configuration

Temporal Flow can be configured through various configuration files:

### Site Configuration

Edit `config.ts` to set site-wide options:

```typescript
export const siteConfig: SiteConfig = {
  title: 'Your Site Name',
  subtitle: 'Your Tagline',
  lang: 'en',
  themeColor: {
    hue: 200,
    fixed: false,
  },
  // Additional options...
}
```

### Navigation Configuration

Edit the `navBarConfig` in `config.ts` to customize the navigation menu:

```typescript
export const navBarConfig: NavBarConfig = {
  links: [
    LinkPreset.Home,
    {
      name: 'Projects',
      url: '/archive/',
      dropdown: [
        // Dropdown items...
      ]
    },
    // Additional links...
  ],
}
```

### Timeline Configuration

Timeline settings can be adjusted in `TimelineConfig.ts`:

```typescript
export const defaultEraConfig: EraConfigMap = {
  'digital-age': {
    displayName: 'The Digital Age',
    startYear: 2000,
    endYear: 2100,
    // Additional options...
  },
  // Additional eras...
}
```

## Roadmap

Temporal Flow is under active development. Here's what we're working on for future releases:

### Coming in v0.2.0
- Enhanced mobile responsiveness
- Improved timeline navigation controls
- Additional banner transition effects
- Performance optimizations

### Coming in v0.3.0
- ActivityPub protocol support for Fediverse integration
- Comment system integration
- Enhanced content editor with WYSIWYG capabilities
- Custom theming system

### Coming in v1.0.0
- Content recommendation engine
- WebSocket-based real-time notifications
- Advanced analytics dashboard
- Multi-language support

## Contributing

Contributions to Temporal Flow are welcome! Here's how you can contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code follows the project's style guidelines and includes appropriate tests.

## License

This project is licensed under the CC BY-NC-SA 4.0 License - see the [LICENSE](https://creativecommons.org/licenses/by-nc-sa/4.0/) file for details.

## Acknowledgments

- Built with [Astro](https://astro.build)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- Interactive components powered by [Svelte](https://svelte.dev)
- Page transitions via [Swup](https://swup.js.org)

---

<p align="center">
  Made with ❤️ by the Temporal Flow community
</p>