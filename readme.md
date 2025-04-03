# Temporal Flow

<p align="center">
  <img src="https://temporalflow/public/posts/generic/avatar.png" alt="Temporal Flow Logo" width="150" height="150">
</p>

<p align="center">
  A modern static content platform built with Astro, Svelte and Tailwind CSS
</p>

<p align="center">
  <a href="#features">Features</a> •
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

## Overview

Temporal Flow is a blazing-fast, GitHub Pages compatible content platform designed for bloggers, content creators, and digital storytellers. Built on the Astro framework with Svelte components and Tailwind CSS, it delivers a responsive, performant experience across all devices.

What sets Temporal Flow apart is its browser-based administration panel that connects directly to your GitHub repository, allowing you to manage and deploy your site without ever touching code or using a local development environment. It also features a unique Friend Content Sharing system for decentralized content connections and dynamic banner options for visual storytelling.

## Features

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
- 🗂️ **Config File Management**: Automatic generation and updating of configuration files

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

### Content Management
- ✍️ **Markdown/MDX Support**: Write content in Markdown or MDX with frontmatter
- 📂 **Category & Tag System**: Organize content with categories and tags
- 📸 **Media Optimization**: Automatic WebP conversion for faster loading
- 📑 **Table of Contents**: Automatically generated for longer articles
- 📎 **Static Asset Handling**: Optimized handling of images and attachments

### Community Features
- 👥 **Team Profiles**: Showcase your team members with customizable profiles
- 📢 **Community Page**: Built-in community page with configurable sections
- 💬 **Discord Integration**: Connect your Discord community
- 📧 **Contact Forms**: Customizable contact forms for user engagement
- 📝 **Community Guidelines**: Easily publish and update community guidelines

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

#### General Settings
- Site name, subtitle, and language configuration
- Table of contents settings
- License information

#### Navigation
- Add, remove, and reorder navigation links
- Configure dropdown menus
- Set up external links

#### Profile
- Update your profile information
- Configure social media links
- Manage avatar images and animations

#### Appearance
- Light/dark mode preferences
- Theme color customization
- Favicon configuration

#### Timeline
- Configure timeline eras
- Set default timeline views
- Adjust timeline display options

#### Community
- Configure community page sections
- Set up Discord integration
- Customize contact forms
- Manage community guidelines

#### About
- Configure about page sections
- Manage team member information
- Set up contact information

#### Security
- Reset admin password
- Configure security settings

#### Advanced
- Export configurations
- View and edit raw configuration files

## GitHub Integration

One of Temporal Flow's standout features is its direct GitHub repository integration, allowing you to manage your site without a local development environment.

### Setting Up GitHub Integration

1. Create a GitHub Personal Access Token with repository access
2. In the admin panel, navigate to any configuration tab
3. Scroll down to the GitHub Integration section
4. Click "Connect to GitHub" and enter your token
5. Your site will now be connected to your GitHub repository

### Using GitHub Integration

Once connected, you can:

1. **Commit Changes**: After making configuration changes, click "Commit to GitHub" to push your changes directly to your repository
2. **Deploy Changes**: Trigger your site's build workflow with the "Deploy Changes" button
3. **Monitor Status**: See real-time feedback on commit and deployment status

This integration makes it possible to:
- Update your site from any device with a web browser
- Make quick changes directly from a tablet or even a smartphone
- Avoid the need for a local development environment
- Maintain proper version control for all site changes

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

Site-wide banner defaults can be configured in the admin panel's Appearance tab, while individual page banners are controlled through frontmatter.

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

### Friend Content Privacy

The Friend Content Sharing system is designed with privacy in mind:
- Friend content is only visible to you when logged in
- Your visitors only see your content
- No central server or database stores the connections
- You have full control over which friends to connect with

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

### Timeline Configuration

The timeline can be fully configured through the admin panel:
- Create and manage different eras
- Set default viewing options
- Customize the timeline appearance
- Configure year spans and display options

## Configuration

Temporal Flow can be configured through the admin panel or by directly editing configuration files:

### Site Configuration

In the admin panel, navigate to the "General" tab to configure:
- Site title and subtitle
- Default language
- Theme color settings
- Table of contents options
- License information

### Navigation Configuration

In the "Navigation" tab, you can:
- Add, remove, and reorder navigation links
- Create dropdown menus
- Set up external links
- Configure special page links

### Timeline Configuration

The "Timeline" tab allows you to:
- Create and manage timeline eras
- Set default timeline display options
- Configure year marks and spans
- Adjust timeline appearance settings

### Community & About Pages

Dedicated tabs let you configure:
- Community page sections and features
- Team member profiles
- Contact information
- Discord integration
- Community guidelines

## Roadmap

Temporal Flow is under active development. Here's what we're working on for future releases:

### Coming Soon
- Enhanced media management in admin panel
- Post editor in the admin panel
- Extended banner animation options
- Enhanced friend content discovery

### Future Plans
- Multi-user support with permission levels
- Enhanced analytics integration
- Comment system options
- Extended API capabilities
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