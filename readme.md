# Temporal Flow

<p align="center">
  <img src="https://temporalflow/public/posts/generic/avatar.png" alt="Temporal Flow Logo" width="150" height="150">
</p>

<p align="center">
  A decentralized content sharing platform built with Astro, Svelte and Tailwind CSS
</p>

<p align="center">
  <a href="https://temporalflow.org">Live Demo</a>
</p>

## What is Temporal Flow?

Temporal Flow is a decentralized content sharing platform designed for creators. It's an all-in-one hub for hosting and sharing creative content in a central location while making it easy to discover and connect with other creators.

Unlike traditional platforms that control your content on centralized servers, Temporal Flow gives you full ownership of your work with the benefits of a connected community.

### Core Features

- **Multi-Function Banner System** - Showcase your content with dynamic banners that support videos, images, timelines, and interactive elements
- **Organized Blog Posts** - Create, package, and share your content in a format that's easily discoverable and searchable on the web
- **Customizable Website** - Get your own free website that's fully customizable to match your creative vision and brand identity
- **Friend System** - Follow other creators and stay updated on their latest work through a decentralized connection system

<p align="center">
  <a href="#detailed-features">Detailed Features</a> •
  <a href="#installation">Installation</a> •
  <a href="#usage">Usage</a> •
  <a href="#admin-panel">Admin Panel</a> •
  <a href="#github-integration">GitHub Integration</a> •
  <a href="#banner-system">Banner System</a> •
  <a href="#friend-content-sharing">Friend Content Sharing</a> •
  <a href="#timeline-visualization">Timeline Visualization</a> •
  <a href="#configuration">Configuration</a> •
  <a href="#roadmap">Roadmap</a> •
  <a href="#contributing">Contributing</a> •
  <a href="#license">License</a>
</p>

> **Note:** Temporal Flow is currently in beta. While fully functional, we're actively developing additional features and refining existing ones. Your feedback and contributions are welcome!

## Detailed Features

### Core Platform
- 🚀 **Blazing Fast Performance**: Built with Astro Islands architecture for optimal performance
- 📱 **Fully Responsive**: Beautiful experience across desktop, tablet, and mobile devices
- 🌓 **Light/Dark Mode**: Automatic theme detection with manual toggle option
- 🎨 **Customizable Theme**: Adjustable color theme with hue selection
- 🔍 **Built-in Search**: Full-text search across all your content
- 📊 **SEO Optimized**: Built-in meta tags and structured data for better discoverability

### Admin Panel
- ⚙️ **Browser-based Admin**: Configure your site entirely through a web interface
- 🔄 **Live Preview**: See your changes in real-time before publishing
- 📂 **Full Configuration Access**: Modify all site settings without touching code
- 🔐 **Secure Authentication**: Password-protected admin access
- 📱 **Mobile Friendly**: Manage your site from any device

### GitHub Integration
- 🔄 **Direct Repository Integration**: Push changes straight to your GitHub repository
- 🚀 **Automated Deployment**: Trigger GitHub Actions workflows to rebuild your site
- 🔄 **Version Control**: All changes are committed to your repository with proper commit messages
- 🔑 **GitHub Token Authentication**: Secure access using personal access tokens

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

### Content Management
- ✍️ **Markdown/MDX Support**: Write content in Markdown or MDX with frontmatter
- 📂 **Category & Tag System**: Organize content with categories and tags
- 📸 **Media Optimization**: Automatic WebP conversion for faster loading
- 📑 **Table of Contents**: Automatically generated for longer articles

### Timeline Visualization
- ⏱️ **Interactive Timeline**: Visualize chronological events with an intuitive interface
- 🔍 **Zoom & Pan Controls**: Intuitive navigation of timeline content
- ⭐ **Event Highlighting**: Visual differentiation between regular and key events
- 🌈 **Era Management**: Organize timeline events into visually distinct eras
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

## Admin Panel

Temporal Flow features a powerful browser-based admin panel that lets you configure and manage your site without writing code.

### Accessing the Admin Panel

1. Navigate to your deployed site's `/admin` path
2. Enter your admin password to authenticate
3. You'll be presented with the main admin dashboard

### Admin Panel Sections

The admin panel is organized into several tabs for easy navigation:

- **General Settings**: Site name, subtitle, language configuration, etc.
- **Navigation**: Add, remove, and reorder navigation links
- **Profile**: Update your profile information and social media links
- **Appearance**: Light/dark mode preferences and theme customization
- **Timeline**: Configure timeline eras and display options
- **Community**: Set up Discord integration and contact forms
- **About**: Configure about page sections and team information
- **Security**: Reset admin password and configure security settings

## GitHub Integration

One of Temporal Flow's standout features is its direct GitHub repository integration, allowing you to manage your site without a local development environment.

### Setting Up GitHub Integration

1. Create a GitHub Personal Access Token with repository access
2. In the admin panel, navigate to any configuration tab
3. Scroll down to the GitHub Integration section
4. Click "Connect to GitHub" and enter your token
5. Your site will now be connected to your GitHub repository

Once connected, you can:
- Commit changes directly to your repository
- Trigger deployment workflows
- Monitor commit and deployment status

## Banner System

Temporal Flow features a versatile banner system that enhances visual storytelling through multiple banner types:

### Banner Types

- **Standard Animated Banner**: Auto-transitions between a series of images
- **Image Banner**: Displays a static featured image
- **Video Banner**: Embeds YouTube videos as page headers
- **Timeline Banner**: Creates interactive chronological visualizations

Banners automatically adapt to different screen sizes and can be customized through the admin panel's Appearance tab or in individual post frontmatter.

## Friend Content Sharing

The Friend Content Sharing system allows you to connect your blog with others running Temporal Flow, creating a decentralized network of content.

### Enabling Friend Sharing

For cross-domain functionality, you need to set up CORS headers. For GitHub Pages, add a `_headers` file to your repository root:
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

The Friend Content Sharing system is designed with privacy in mind - friend content is only visible to you when logged in, and your visitors only see your content.

## Timeline Visualization

Temporal Flow includes a powerful timeline visualization system that can display chronological events in multiple views.

### Adding Timeline Events

Any blog post can become a timeline event by adding timeline-specific frontmatter:

```yaml
---
timelineYear: 2025
timelineEra: "digital-age"
timelineLocation: "San Francisco"
isKeyEvent: false
---
```

The timeline can be fully configured through the admin panel, allowing you to create and manage different eras, set viewing options, and customize the appearance.

## Configuration

Temporal Flow can be configured through the admin panel or by directly editing configuration files:

- **Site Configuration**: Title, subtitle, language, theme settings
- **Navigation Configuration**: Navigation links, dropdown menus, external links
- **Timeline Configuration**: Timeline eras, display options, appearance settings
- **Community & About Pages**: Team profiles, contact information, community features

## Roadmap

Temporal Flow is under active development. Here's what we're working on:

### Coming Soon
- Enhanced media management in admin panel
- Post editor in the admin panel
- Extended banner animation options
- Enhanced friend content discovery

### Future Plans
- Multi-user support with permission levels
- Enhanced analytics integration
- Comment system options
- ActivityPub protocol support for Fediverse integration

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
- Admin panel inspired by modern CMS systems

---

<p align="center">
  Made with ❤️ by the Temporal Flow community
</p>