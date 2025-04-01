import type { AUTO_MODE, DARK_MODE, LIGHT_MODE } from '@constants/constants'

export type SiteConfig = {
  title: string
  subtitle: string

  lang: string

  themeColor: {
    hue: number
    fixed: boolean
  }
  defaultTheme: LIGHT_DARK_MODE 
  banner: {
    enable: boolean
    src: string
    position?: 'top' | 'center' | 'bottom'
    credit: {
      enable: boolean
      text: string
      url?: string
    }
  }
  toc: {
    enable: boolean
    depth: 1 | 2 | 3
  }

  favicon: Favicon[]
}

export type Favicon = {
  src: string
  theme?: 'light' | 'dark'
  sizes?: string
}

export enum LinkPreset {
  Home = 0,
  Archive = 1,
  About = 2,
  Community = 3,
  Projects = 4,
  Configs = 5,
  Friends = 6,
  NewPost = 7,
}

//Password values
export type PasswordConfig = {
  username: string;
  passwordHash: string;
  needsSetup: boolean; // Flag to indicate if setup is needed
  createdAt?: string;
}

//extend NavBarLink type to support dropdown menus
export type NavBarLink = {
  name: string
  url: string
  external?: boolean
  dropdown?: {
    name: string
    url: string
    external?: boolean
  }[]
}

export type NavBarConfig = {
  links: (NavBarLink | LinkPreset)[]
}

export type ProfileConfig = {
  avatar?: string // | string[]; // Allow single string or array of strings
  name: string
  bio?: string
  links: {
    name: string
    url: string
    icon: string
  }[]
}

export type LicenseConfig = {
  enable: boolean
  name: string
  url: string
}

export type LIGHT_DARK_MODE =
  | typeof LIGHT_MODE
  | typeof DARK_MODE
  | typeof AUTO_MODE

  export type BlogPostData = {
    body: string
    title: string
    published: Date
    description: string
    tags: string[]
    draft?: boolean
    yIndex: number
    image?: string
    category?: string
    prevTitle?: string
    prevSlug?: string
    nextTitle?: string
    nextSlug?: string
    // Timeline-specific fields
    timelineYear?: string
    timelineEra?: string
    isKeyEvent?: boolean
    timelineLocation?: string
    // Banner configuration
    bannerType?: 'image' | 'video' | 'timeline'
    bannerData?: {
      videoId?: string       // For video banners
      category?: string      // For timeline banners
      startYear?: number     // For timeline banners
      endYear?: number       // For timeline banners
      background?: string    // For timeline banners
    }
  }