// TimelineConfig.ts - Central configuration for all timeline services

// Define timeline event type
export interface TimelineEvent {
    title: string;
    description: string;
    slug: string;
    year: number;
    era?: string;
    category?: string;
    isKeyEvent: boolean;
    location?: string;
    isDraft?: boolean;
    yIndex?: number; 
    bannerData?: {
      category?: string;
      startYear?: number;
      endYear?: number;
      background?: string;
      eraConfig?: {
        [eraKey: string]: {
          displayName: string;
          startYear: number;
          endYear: number;
        }
      };
    };
  }
  
  // Define era display names with ability to customize
  export const defaultEraDisplayNames: { [key: string]: string } = {
    'pre-spork': 'Pre-Spork Era',
    'spork-uprising': 'Spork Uprising',
    'snuggaloid': 'Snuggaloid Emergence',
    'post-extinction': 'Post-Extinction Recovery',
    'unknown': 'Unknown Era'
  };
  
  // Enhanced era configuration type
  export interface EraConfig {
    displayName: string;
    startYear: number;
    endYear: number;
    colorClass?: string;
    badgeClass?: string;
  }
  
  // Era configuration type mapping
  export interface EraConfigMap {
    [eraKey: string]: EraConfig;
  }
  
  // Default era configuration with years - CENTRALIZED DEFINITION
  export const defaultEraConfig: EraConfigMap = {
    'all-time': {
        displayName: 'All-Time',
        startYear: 1,
        endYear: 50000
    },
    'pre-spork': {
      displayName: 'Pre-Spork Era',
      startYear: 1,
      endYear: 3042
    },
    'spork-uprising': {
      displayName: 'Spork Uprising',
      startYear: 3042,
      endYear: 3044
    },
    'snuggaloid': {
      displayName: 'Snuggaloid Emergence',
      startYear: 3044,
      endYear: 3050
    },
    'post-extinction': {
      displayName: 'Post-Extinction Recovery',
      startYear: 3050,
      endYear: 20000
    },
    'unknown': {
      displayName: 'Unknown Era',
      startYear: -Infinity,
      endYear: Infinity
    }
  };
  
  // Helper function to get era ranges in the format expected by getEraFromYear
  export function getDefaultEraRanges(): {[key: string]: [number, number]} {
    const ranges: {[key: string]: [number, number]} = {};
    
    Object.entries(defaultEraConfig).forEach(([era, config]) => {
      ranges[era] = [config.startYear, config.endYear];
    });
    
    return ranges;
  }
  
  // Function to determine era based on year - with dynamic configuration
  export function getEraFromYear(year: number, eraConfig?: {[key: string]: [number, number]}): string {
    // Use default ranges from centralized config
    const defaultRanges = getDefaultEraRanges();
    
    // Use provided config or default
    const config = eraConfig || defaultRanges;
    
    // Find which era contains this year
    for (const [era, [startYear, endYear]] of Object.entries(config)) {
      if (year >= startYear && year < endYear) {
        return era;
      }
    }
    
    return 'unknown';
  }
  
  // Function to get display name for era
  export function getEraDisplayName(era: string, customDisplayNames?: { [key: string]: string }): string {
    // Check custom display names first
    if (customDisplayNames && customDisplayNames[era]) {
      return customDisplayNames[era];
    }
    
    // Fall back to default display names
    return defaultEraDisplayNames[era] || defaultEraDisplayNames['unknown'];
  }
  
  // Function to get CSS classes for era
  export function getEraClasses(era: string, customConfig?: EraConfigMap): string {
    // Check for custom era class in provided config
    if (customConfig && customConfig[era] && customConfig[era].badgeClass) {
      return customConfig[era].badgeClass;
    }
    
    // Default styling based on era
    switch(era) {
      case 'pre-spork':
        return 'bg-[oklch(0.8_0.1_var(--hue))/0.1] dark:bg-[oklch(0.8_0.1_var(--hue))/0.2] text-[oklch(0.3_0.1_var(--hue))] dark:text-[oklch(0.8_0.1_var(--hue))]';
      case 'spork-uprising':
        return 'bg-[oklch(0.7_0.2_var(--hue))/0.1] dark:bg-[oklch(0.7_0.2_var(--hue))/0.2] text-[oklch(0.3_0.2_var(--hue))] dark:text-[oklch(0.7_0.2_var(--hue))]';
      case 'snuggaloid':
        return 'bg-[oklch(0.6_0.3_var(--hue))/0.1] dark:bg-[oklch(0.6_0.3_var(--hue))/0.2] text-[oklch(0.3_0.3_var(--hue))] dark:text-[oklch(0.6_0.3_var(--hue))]';
      case 'post-extinction':
        return 'bg-[oklch(0.5_0.1_var(--hue))/0.1] dark:bg-[oklch(0.5_0.1_var(--hue))/0.2] text-[oklch(0.2_0.1_var(--hue))] dark:text-[oklch(0.5_0.1_var(--hue))]';
      default:
        return 'bg-[oklch(0.9_0.05_var(--hue))/0.1] dark:bg-[oklch(0.3_0.05_var(--hue))/0.2] text-[oklch(0.4_0.05_var(--hue))] dark:text-[oklch(0.9_0.05_var(--hue))]';
    }
  }
  
  // Extract era configuration from timeline events
  export function extractEraConfig(events: TimelineEvent[]): EraConfigMap {
    // Start with default config
    const config = { ...defaultEraConfig };
    
    // Look for banner posts with era configurations
    const bannerEvents = events.filter(event => event.bannerData?.eraConfig);
    
    if (bannerEvents.length > 0) {
      // Use the first banner with era config
      const primaryBanner = bannerEvents[0];
      if (primaryBanner.bannerData?.eraConfig) {
        // Merge with default config, maintaining default values for missing properties
        for (const [eraKey, eraSettings] of Object.entries(primaryBanner.bannerData.eraConfig)) {
          if (config[eraKey]) {
            // Update existing era
            config[eraKey] = {
              ...config[eraKey],
              ...eraSettings
            };
          } else {
            // Add new era
            config[eraKey] = {
              displayName: eraSettings.displayName,
              startYear: eraSettings.startYear,
              endYear: eraSettings.endYear,
              colorClass: "",
              badgeClass: ""
            };
          }
        }
      }
    }
    
    return config;
  }
  
  // Function to group events by era
  export function groupEventsByEra(events: TimelineEvent[]): { [era: string]: TimelineEvent[] } {
    const grouped: { [era: string]: TimelineEvent[] } = {};
    
    events.forEach(event => {
      const era = event.era || 'unknown';
      if (!grouped[era]) {
        grouped[era] = [];
      }
      grouped[era].push(event);
    });
    
    // Sort eras based on earliest year
    const sortedGrouped: { [era: string]: TimelineEvent[] } = {};
    Object.keys(grouped)
      .sort((a, b) => {
        const aFirstYear = grouped[a][0].year;
        const bFirstYear = grouped[b][0].year;
        return aFirstYear - bFirstYear;
      })
      .forEach(era => {
        sortedGrouped[era] = grouped[era];
      });
    
    return sortedGrouped;
  }
  
  // Function to get timeline statistics
  export function getTimelineStatistics(events: TimelineEvent[]): {
    totalEvents: number;
    keyEvents: number;
    yearSpan: number;
    minYear: number;
    maxYear: number;
    categories: string[];
    eras: string[];
  } {
    if (events.length === 0) {
      return {
        totalEvents: 0,
        keyEvents: 0,
        yearSpan: 0,
        minYear: 0,
        maxYear: 0,
        categories: [],
        eras: []
      };
    }
  
    const years = events.map(event => event.year);
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);
    
    const uniqueCategories = [...new Set(events.map(event => event.category).filter(Boolean))];
    const uniqueEras = [...new Set(events.map(event => event.era).filter(Boolean))];
    
    return {
      totalEvents: events.length,
      keyEvents: events.filter(event => event.isKeyEvent).length,
      yearSpan: maxYear - minYear,
      minYear,
      maxYear,
      categories: uniqueCategories as string[],
      eras: uniqueEras as string[]
    };
  }