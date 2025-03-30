import type {
  LicenseConfig,
  NavBarConfig,
  ProfileConfig,
  SiteConfig,
} from '../types/config'
import { LinkPreset } from '../types/config'

export const siteConfig: SiteConfig = {
  title: 'Temporal Flow',
  subtitle: 'A Decentralized Content Platform',
  lang: 'en',
  themeColor: {
    hue: 200,
    fixed: false,
  },
  //banner is no longer needed but to keep the code from breaking I will keep it here
  banner: {
    enable: false,
    src: '/assets/banner/0001.png',
    position: 'center',
    credit: {
      enable: true,
      text: '',
      url: ''
    }
  },
  toc: {
    enable: true,
    depth: 3
  },
  favicon: [    // Leave this array empty to use the default favicon
    //{
      //src: '/favicon/mascot-180.png',    // Path of the favicon, relative to the /public directory
      //theme: 'dark',              // (Optional) Either 'light' or 'dark', set only if you have different favicons for light and dark mode
      //sizes: '32x32',              // (Optional) Size of the favicon, set only if you have favicons of different sizes
     //}
]
}

// In your config.ts file
export const navBarConfig: NavBarConfig = {
  links: [
    LinkPreset.Home,
    {
      name: 'Projects',
      url: '/archive/', // Main projects page
      dropdown: [
        {
          name: 'Timeline Example',
          url: '/posts/timeline/',
          //external: false,
        },
        {
          name: 'Project One',
          url: '/projects/project-one/',
          //external: false,
        },
        {
          name: 'Project Two',
          url: '/projects/project-two/',
          //external: false,
        },
        {
          name: 'Project Three',
          url: '/projects/project-three/',
          //external: false,
        },
        {
          name: 'External Project',
          url: 'https://example.com/project',
          external: true,
        },
        // Add more dropdown items as needed
      ]
    },
    LinkPreset.Community,
    LinkPreset.Archive,
    LinkPreset.About,
/*     {
      name: 'External Link',
      url: 'https://example.com',
      external: true,
    }, */
  ],
}

export const profileConfig: ProfileConfig = {
  avatar: ''
  //[
   // '/src/assets/images/avatar.png',
   // '/src/assets/images/avatar2.jpg',
   //]
   ,
  name: 'Site Owner',
  bio: 'Content Creator & Digital Storyteller',
  links: [
    {
      name: 'Twitter',
      icon: 'fa6-brands:twitter',
      url: 'https://twitter.com/example',
    },
    {
      name: 'Discord',
      icon: 'fa6-brands:discord',
      url: 'https://discord.gg/example',
    },
    {
      name: 'GitHub',
      icon: 'fa6-brands:github',
      url: 'https://github.com/example',
    },
  ],
}

export const licenseConfig: LicenseConfig = {
  enable: true,
  name: 'CC BY-NC-SA 4.0',
  url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
}