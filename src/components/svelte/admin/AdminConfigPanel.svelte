<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import GeneralConfigTab from './config-tabs/GeneralConfigTab.svelte';
  import NavigationConfigTab from './config-tabs/NavigationConfigTab.svelte';
  import ProfileConfigTab from './config-tabs/ProfileConfigTab.svelte';
  import AppearanceConfigTab from './config-tabs/AppearanceConfigTab.svelte';
  import TimelineConfigTab from './config-tabs/TimelineConfigTab.svelte';
  import CommunityConfigTab from './config-tabs/CommunityConfigTab.svelte';
  import AboutConfigTab from './config-tabs/AboutConfigTab.svelte';
  import SecurityConfigTab from './config-tabs/SecurityConfigTab.svelte'; 
  import AdvancedConfigTab from './config-tabs/AdvancedConfigTab.svelte';
  import ConfigExporter from './ConfigExporter.svelte';
  import CommunityConfigExporter from './CommunityConfigExporter.svelte';
  import AboutConfigExporter from './AboutConfigExporter.svelte';
  import GithubAuthForm from './GithubAuthForm.svelte';
  import { createGitHubService } from '../../../lib/github-service';
    
  // Props for configuration objects
  export let siteConfig;
  export let navBarConfig;
  export let profileConfig;
  export let licenseConfig;
  export let timelineConfig;
  export let avatarConfig;
  export let communityConfig;
  export let aboutConfig;
  
  // State management
  let activeTab = 'general';
  let saveStatus = { saving: false, success: false, error: null };
  let hasChanges = false;

  // Original config values for comparison
  let originalConfigValues = {
    siteConfig: null,
    navBarConfig: null,
    profileConfig: null,
    licenseConfig: null,
    timelineConfig: null,
    avatarConfig: null,
    communityConfig: null,
    aboutConfig: null
  };
  
  // Event dispatcher for notifying parent components
  const dispatch = createEventDispatcher();
  
  // GitHub integration
  let githubService = createGitHubService();
  let isGitHubAuthenticated = false;
  let showGitHubAuthForm = false;
  let isCommitting = false;
  let commitStatus = { success: false, error: null };
  let showDeployOptions = false;
  let githubToken = '';
  
  // Tabs configuration
  const tabs = [
    { id: 'general', label: 'General', icon: 'mdi:cog-outline' },
    { id: 'navigation', label: 'Navigation', icon: 'mdi:navigation' },
    { id: 'profile', label: 'Profile', icon: 'mdi:account' },
    { id: 'appearance', label: 'Appearance', icon: 'mdi:palette-outline' },
    { id: 'timeline', label: 'Timeline', icon: 'mdi:timeline' },
    { id: 'community', label: 'Community', icon: 'mdi:account-group' },
    { id: 'about', label: 'About', icon: 'mdi:information-outline' },
    { id: 'security', label: 'Security', icon: 'mdi:shield-outline' },
    { id: 'advanced', label: 'Advanced', icon: 'mdi:code-json' }
  ];
  
  // Tab switching
  function setActiveTab(tabId) {
    activeTab = tabId;
  }
  
  // State for config exporters
  let showConfigExporter = false;
  let showCommunityConfigExporter = false;
  let showAboutConfigExporter = false;
  
  // Function to handle saving all configuration
  async function saveAllConfiguration() {
    try {
      saveStatus.saving = true;
      saveStatus.error = null;
      
      // Store in localStorage for demonstration/temporary savings
      localStorage.setItem('siteConfig', JSON.stringify(siteConfig));
      localStorage.setItem('navBarConfig', JSON.stringify(navBarConfig));
      localStorage.setItem('profileConfig', JSON.stringify(profileConfig));
      localStorage.setItem('licenseConfig', JSON.stringify(licenseConfig));
      localStorage.setItem('timelineConfig', JSON.stringify(timelineConfig));
      localStorage.setItem('avatarConfig', JSON.stringify(avatarConfig));
      localStorage.setItem('communityConfig', JSON.stringify(communityConfig));
      localStorage.setItem('aboutConfig', JSON.stringify(aboutConfig));
      
      // Update original values to reflect saved state
      originalConfigValues = {
        siteConfig: JSON.stringify(siteConfig),
        navBarConfig: JSON.stringify(navBarConfig),
        profileConfig: JSON.stringify(profileConfig),
        licenseConfig: JSON.stringify(licenseConfig),
        timelineConfig: JSON.stringify(timelineConfig),
        avatarConfig: JSON.stringify(avatarConfig),
        communityConfig: JSON.stringify(communityConfig),
        aboutConfig: JSON.stringify(aboutConfig)
      };
      
      // Reset hasChanges flag
      hasChanges = false;
      
      // Show success message
      saveStatus.success = true;
      
      // Show the appropriate exporter based on active tab
      if (activeTab === 'community') {
        showCommunityConfigExporter = true;
      } else if (activeTab === 'about') {
        showAboutConfigExporter = true;
      } else {
        showConfigExporter = true;
      }
      
      // Notify parent component
      dispatch('saved', { 
        siteConfig, 
        navBarConfig, 
        profileConfig, 
        licenseConfig,
        timelineConfig,
        avatarConfig,
        communityConfig,
        aboutConfig
      });
      
      // Reset success message after a delay
      setTimeout(() => {
        saveStatus.success = false;
      }, 3000);
    } catch (error) {
      console.error('Error saving configuration:', error);
      saveStatus.error = 'Failed to save configuration. Please try again.';
    } finally {
      saveStatus.saving = false;
    }
  }
  
  // Show GitHub auth form
  function showGitHubAuth() {
    showGitHubAuthForm = true;
  }
  
  // Handle GitHub authentication
  async function handleGitHubAuth(event) {
    // Get token from event if provided, otherwise use the bound value
    const token = event && event.detail ? event.detail : githubToken;
    
    if (!token) {
      commitStatus.error = 'Please enter a valid token';
      return;
    }
    
    try {
      isCommitting = true;
      commitStatus.error = null;
      
      // Authenticate with GitHub
      const success = githubService.authenticate(token);
      
      if (success) {
        // Test the token with a simple API call
        try {
          await githubService.getFile('README.md');
          isGitHubAuthenticated = true;
          showGitHubAuthForm = false;
          commitStatus.success = true;
          
          // Show success message
          setTimeout(() => {
            commitStatus.success = false;
          }, 3000);
        } catch (error) {
          console.error('Token validation error:', error);
          commitStatus.error = 'Invalid token or repository access. Please check your token permissions.';
          githubService.logout(); // Clear the invalid token
        }
      } else {
        commitStatus.error = 'Failed to authenticate';
      }
    } catch (error) {
      console.error('Authentication error:', error);
      commitStatus.error = error.message || 'Failed to authenticate';
    } finally {
      isCommitting = false;
    }
  }
  
  // Handle GitHub logout
  function handleGitHubLogout() {
    githubService.logout();
    isGitHubAuthenticated = false;
    showDeployOptions = false;
  }
  
  // Handle constant references in the config
  function preserveConstants(configObj) {
    // Create a deep copy to avoid modifying the original
    const config = JSON.parse(JSON.stringify(configObj));
    
    // Check if defaultTheme exists and handle it specially
    if (config.defaultTheme) {
      // Store the original value to determine which constant to use
      const themeValue = config.defaultTheme;
      
      // Mark it for replacement with the appropriate constant
      config.defaultTheme = `__CONSTANT_${themeValue}__`;
    }
    
    return config;
  }
  
  // Generate configuration file content with proper types and imports
  function generateConfigFileContent(configName, configObj) {
    // Different file formats based on config type
    if (configName === 'siteConfig') {
      const processedConfig = preserveConstants(configObj);
      
      return `import type {
  LicenseConfig,
  NavBarConfig,
  ProfileConfig,
  SiteConfig,
} from '../types/config'
import { LinkPreset } from '../types/config'
import { AUTO_MODE, DARK_MODE, LIGHT_MODE } from '@constants/constants.ts'

export const siteConfig: SiteConfig = ${JSON.stringify(processedConfig, null, 2)
        .replace(/"([^"]+)":/g, '$1:')
        .replace(/"__CONSTANT_light__"/g, 'LIGHT_MODE')
        .replace(/"__CONSTANT_dark__"/g, 'DARK_MODE')
        .replace(/"__CONSTANT_auto__"/g, 'AUTO_MODE')}`;
    }
    
    else if (configName === 'navBarConfig') {
      return `import type { NavBarConfig } from '../types/config'
import { LinkPreset } from '../types/config'

export const navBarConfig: NavBarConfig = ${JSON.stringify(configObj, null, 2)
        .replace(/"([^"]+)":/g, '$1:')
        .replace(/"LinkPreset\.([a-zA-Z]+)"/g, 'LinkPreset.$1')}`;
    }
    
    else if (configName === 'profileConfig') {
      return `import type { ProfileConfig } from '../types/config'

export const profileConfig: ProfileConfig = ${JSON.stringify(configObj, null, 2)
        .replace(/"([^"]+)":/g, '$1:')}`;
    }
    
    else if (configName === 'licenseConfig') {
      return `import type { LicenseConfig } from '../types/config'

export const licenseConfig: LicenseConfig = ${JSON.stringify(configObj, null, 2)
        .replace(/"([^"]+)":/g, '$1:')}`;
    }
    
    else if (configName === 'timelineConfig') {
      return `// TimelineConfig.ts - Central configuration for all timeline services

export const timelineConfig = ${JSON.stringify(configObj, null, 2)
        .replace(/"([^"]+)":/g, '$1:')}`;
    }
    
    else if (configName === 'avatarConfig') {
      // Special handling for avatar config with image imports
      return `// Import type - use import type syntax to fix verbatimModuleSyntax error
import type { ImageMetadata } from 'astro'

// Avatar configuration for the site
export const avatarConfig = ${JSON.stringify(configObj, null, 2)
        .replace(/"([^"]+)":/g, '$1:')}`;
    }
    
    else if (configName === 'communityConfig') {
      return `// Import types
import type { 
  CommunityConfig,
  DiscordConfig,
  ContactConfig,
  NewsletterConfig,
  EventsConfig,
  GuidelinesConfig,
  HeroConfig
} from '../types/communityconfig';

// Community page configuration
export const communityConfig: CommunityConfig = ${JSON.stringify(configObj, null, 2)
        .replace(/"([^"]+)":/g, '$1:')}`;
    }
    
    else if (configName === 'aboutConfig') {
      return `// Import types
import type { 
  AboutConfig,
  TeamSectionConfig,
  ContentSectionConfig,
  ContactSectionConfig
} from '../types/aboutconfig';

// About page configuration
export const aboutConfig: AboutConfig = ${JSON.stringify(configObj, null, 2)
        .replace(/"([^"]+)":/g, '$1:')}`;
    }
    
    // Default format for any other configs
    return `// ${configName} configuration
import type { ${configName.charAt(0).toUpperCase() + configName.slice(1)} } from '../types';

export const ${configName} = ${JSON.stringify(configObj, null, 2)
        .replace(/"([^"]+)":/g, '$1:')};
`;
  }
  
  // Save configs to GitHub
  async function saveConfigsToGitHub() {
    if (!isGitHubAuthenticated) {
      saveStatus.error = 'Please authenticate with GitHub first';
      return;
    }
    
    try {
      isCommitting = true;
      commitStatus.error = null;
      
      // Track which configs have changed
      const changedConfigs = [];
      
      // Check each config against its original value
      if (JSON.stringify(siteConfig) !== originalConfigValues.siteConfig) {
        changedConfigs.push({ name: 'siteConfig', obj: siteConfig, filename: 'config.ts' });
      }
      
      if (JSON.stringify(navBarConfig) !== originalConfigValues.navBarConfig) {
        changedConfigs.push({ name: 'navBarConfig', obj: navBarConfig, filename: 'navbar.config.ts' });
      }
      
      if (JSON.stringify(profileConfig) !== originalConfigValues.profileConfig) {
        changedConfigs.push({ name: 'profileConfig', obj: profileConfig, filename: 'profile.config.ts' });
      }
      
      if (JSON.stringify(licenseConfig) !== originalConfigValues.licenseConfig) {
        changedConfigs.push({ name: 'licenseConfig', obj: licenseConfig, filename: 'license.config.ts' });
      }
      
      if (JSON.stringify(timelineConfig) !== originalConfigValues.timelineConfig) {
        changedConfigs.push({ name: 'timelineConfig', obj: timelineConfig, filename: 'timelineconfig.ts' });
      }
      
      if (JSON.stringify(avatarConfig) !== originalConfigValues.avatarConfig) {
        changedConfigs.push({ name: 'avatarConfig', obj: avatarConfig, filename: 'avatar.config.ts' });
      }
      
      if (JSON.stringify(communityConfig) !== originalConfigValues.communityConfig) {
        changedConfigs.push({ name: 'communityConfig', obj: communityConfig, filename: 'community.config.ts' });
      }
      
      if (JSON.stringify(aboutConfig) !== originalConfigValues.aboutConfig) {
        changedConfigs.push({ name: 'aboutConfig', obj: aboutConfig, filename: 'about.config.ts' });
      }
      
      // If no configs have changed, inform the user
      if (changedConfigs.length === 0) {
        commitStatus.error = 'No configuration changes detected to commit';
        isCommitting = false;
        return;
      }
      
      console.log(`Saving ${changedConfigs.length} modified config files...`);
      
      // Save each changed config
      for (const config of changedConfigs) {
        const content = generateConfigFileContent(config.name, config.obj);
        await githubService.saveConfig(config.filename, content);
        console.log(`Saved ${config.filename}`);
      }
      
      // Update original values to reflect new saved state
      originalConfigValues = {
        siteConfig: JSON.stringify(siteConfig),
        navBarConfig: JSON.stringify(navBarConfig),
        profileConfig: JSON.stringify(profileConfig),
        licenseConfig: JSON.stringify(licenseConfig),
        timelineConfig: JSON.stringify(timelineConfig),
        avatarConfig: JSON.stringify(avatarConfig),
        communityConfig: JSON.stringify(communityConfig),
        aboutConfig: JSON.stringify(aboutConfig)
      };
      
      // Reset hasChanges flag
      hasChanges = false;
      
      // Show success and deploy options
      commitStatus.success = true;
      showDeployOptions = true;
      
      // Show success message
      setTimeout(() => {
        commitStatus.success = false;
      }, 3000);
    } catch (error) {
      console.error('Error saving configs to GitHub:', error);
      commitStatus.error = `Failed to save to GitHub: ${error.message}`;
    } finally {
      isCommitting = false;
    }
  }
  
  // Trigger site rebuild
  async function triggerSiteRebuild() {
    if (!isGitHubAuthenticated) {
      commitStatus.error = 'Please authenticate with GitHub first';
      return;
    }
    
    try {
      isCommitting = true;
      commitStatus.error = null;
      
      // Add a small delay to ensure all commits are processed
      // This prevents triggering a rebuild while commits are still being processed
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Trigger the GitHub Action workflow for rebuilding the site
      await githubService.triggerWorkflow('rebuild.yml');
      
      // Update UI status
      commitStatus.success = true;
      showDeployOptions = false;
      
      // Show success message
      setTimeout(() => {
        commitStatus.success = false;
      }, 3000);
    } catch (error) {
      console.error('Error triggering rebuild:', error);
      commitStatus.error = `Failed to trigger rebuild: ${error.message}`;
    } finally {
      isCommitting = false;
    }
  }
  
  // On component mount
  onMount(() => {
    // Check for saved config in localStorage (for demo/persistence)
    try {
      // Initialize configs if they're undefined
      if (!avatarConfig) {
        avatarConfig = {
          avatarList: [],
          homeAvatar: '',
          animationInterval: 3500
        };
      }
      
      if (!communityConfig) {
        communityConfig = {
          hero: {
            title: "Join Our Community",
            description: "Connect with other members, share ideas, get help, and stay updated on the latest developments.",
            showGraphic: false,
            options: []
          },
          discord: { enabled: true, title: "Discord Community", description: "", inviteUrl: "", buttonText: "", features: [], channels: [] },
          contact: { enabled: true, title: "Get in Touch", description: "", formActionUrl: "", buttonText: "", features: [], formFields: { name: {}, email: {}, subject: {}, message: {} } },
          newsletter: { enabled: false, title: "Newsletter", description: "", buttonText: "", features: [], consentText: "" },
          events: { enabled: false, title: "Events", description: "", calendarButtonText: "", calendarUrl: "" },
          guidelines: { enabled: true, title: "Community Guidelines", description: "", items: [] }
        };
      }
      
      if (!aboutConfig) {
        aboutConfig = {
          team: {
            enabled: true,
            title: "Our Team",
            description: "Meet the people behind the project",
            layout: "grid",
            columns: {
              mobile: 1,
              tablet: 2,
              desktop: 3
            },
            showEmail: true,
            showRole: true,
            avatarShape: "rounded"
          },
          content: {
            enabled: true,
            defaultTitle: "About The Project",
            showTableOfContents: true
          },
          contact: {
            enabled: true,
            title: "Get In Touch",
            description: "Have questions, ideas, or want to collaborate? We'd love to hear from you!",
            contactInfo: {
              email: "Greg@dndiy.org"
            },
            displayOrder: ["description", "email"]
          }
        };
      }
      
      const savedSiteConfig = localStorage.getItem('siteConfig');
      if (savedSiteConfig && savedSiteConfig !== 'undefined') {
        siteConfig = { ...siteConfig, ...JSON.parse(savedSiteConfig) };
      }
      
      const savedNavConfig = localStorage.getItem('navBarConfig');
      if (savedNavConfig && savedNavConfig !== 'undefined') {
        navBarConfig = { ...navBarConfig, ...JSON.parse(savedNavConfig) };
      }
      
      const savedProfileConfig = localStorage.getItem('profileConfig');
      if (savedProfileConfig && savedProfileConfig !== 'undefined') {
        profileConfig = { ...profileConfig, ...JSON.parse(savedProfileConfig) };
      }
      
      const savedLicenseConfig = localStorage.getItem('licenseConfig');
      if (savedLicenseConfig && savedLicenseConfig !== 'undefined') {
        licenseConfig = { ...licenseConfig, ...JSON.parse(savedLicenseConfig) };
      }
      
      const savedTimelineConfig = localStorage.getItem('timelineConfig');
      if (savedTimelineConfig && savedTimelineConfig !== 'undefined') {
        timelineConfig = { ...timelineConfig, ...JSON.parse(savedTimelineConfig) };
      }
      
      const savedAvatarConfig = localStorage.getItem('avatarConfig');
      if (savedAvatarConfig && savedAvatarConfig !== 'undefined') {
        avatarConfig = { ...avatarConfig, ...JSON.parse(savedAvatarConfig) };
      }
      
      const savedCommunityConfig = localStorage.getItem('communityConfig');
      if (savedCommunityConfig && savedCommunityConfig !== 'undefined') {
        communityConfig = { ...communityConfig, ...JSON.parse(savedCommunityConfig) };
      }
      
      const savedAboutConfig = localStorage.getItem('aboutConfig');
      if (savedAboutConfig && savedAboutConfig !== 'undefined') {
        aboutConfig = { ...aboutConfig, ...JSON.parse(savedAboutConfig) };
      }
      
      // Store original values for change detection
      originalConfigValues = {
        siteConfig: JSON.stringify(siteConfig),
        navBarConfig: JSON.stringify(navBarConfig),
        profileConfig: JSON.stringify(profileConfig),
        licenseConfig: JSON.stringify(licenseConfig),
        timelineConfig: JSON.stringify(timelineConfig),
        avatarConfig: JSON.stringify(avatarConfig),
        communityConfig: JSON.stringify(communityConfig),
        aboutConfig: JSON.stringify(aboutConfig)
      };
      
      // Check GitHub authentication status
      isGitHubAuthenticated = githubService.isAuthenticated();
    } catch (error) {
      console.error('Error loading saved configuration:', error);
    }
  });
  
  // Check for changes in any config to enable/disable the save button
  $: {
    if (originalConfigValues.siteConfig && originalConfigValues.navBarConfig &&
        originalConfigValues.profileConfig && originalConfigValues.licenseConfig &&
        originalConfigValues.timelineConfig && originalConfigValues.communityConfig &&
        originalConfigValues.aboutConfig) {
          
      try {
        const currentValues = {
          siteConfig: JSON.stringify(siteConfig),
          navBarConfig: JSON.stringify(navBarConfig),
          profileConfig: JSON.stringify(profileConfig),
          licenseConfig: JSON.stringify(licenseConfig),
          timelineConfig: JSON.stringify(timelineConfig),
          avatarConfig: JSON.stringify(avatarConfig),
          communityConfig: JSON.stringify(communityConfig),
          aboutConfig: JSON.stringify(aboutConfig)
        };
        
        hasChanges = 
          currentValues.siteConfig !== originalConfigValues.siteConfig ||
          currentValues.navBarConfig !== originalConfigValues.navBarConfig ||
          currentValues.profileConfig !== originalConfigValues.profileConfig ||
          currentValues.licenseConfig !== originalConfigValues.licenseConfig ||
          currentValues.timelineConfig !== originalConfigValues.timelineConfig ||
          currentValues.avatarConfig !== originalConfigValues.avatarConfig ||
          currentValues.communityConfig !== originalConfigValues.communityConfig ||
          currentValues.aboutConfig !== originalConfigValues.aboutConfig;
      } catch (error) {
        console.error("Error checking for changes:", error);
        // If there's an error comparing, assume changes were made
        hasChanges = true;
      }
    }
  }
</script>
  
<!-- Main Configuration Panel -->
<div class="config-panel">
  <!-- Config Tabs Header -->
  <div class="card-base w-full rounded-[var(--radius-large)] overflow-hidden relative mb-4">
    <div class="p-6 md:p-9">
      <h1 class="text-3xl font-bold text-black/90 dark:text-white/90 mb-6">Site Configuration</h1>
      
      <div class="border-b border-neutral-200 dark:border-neutral-700 mb-6">
        <nav class="flex flex-wrap space-x-1 md:space-x-8" aria-label="Configuration Tabs">
          {#each tabs as tab}
            <button 
              id={`tab-${tab.id}`} 
              class="tab-button py-4 px-3 border-b-2 transition-colors font-medium flex items-center whitespace-nowrap
                     {activeTab === tab.id ? 
                       'border-[var(--primary)] text-[var(--primary)]' : 
                       'border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'}"
              on:click={() => setActiveTab(tab.id)}
            >
              <span class="hidden md:inline mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
                  <!-- Dynamically determine which icon path to use -->
                  {#if tab.icon === 'mdi:cog-outline'}
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                  {:else if tab.icon === 'mdi:navigation'}
                    <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
                  {:else if tab.icon === 'mdi:account'}
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  {:else if tab.icon === 'mdi:palette-outline'}
                    <circle cx="13.5" cy="6.5" r="2.5"></circle>
                    <circle cx="19" cy="13" r="2.5"></circle>
                    <circle cx="6" cy="12" r="2.5"></circle>
                    <circle cx="14" cy="19.5" r="2.5"></circle>
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path>
                  {:else if tab.icon === 'mdi:timeline'}
                    <line x1="12" y1="22" x2="12" y2="15"></line>
                    <path d="M6 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path>
                    <path d="M22 12H2"></path>
                    <path d="M12 7V2"></path>
                    <path d="m14 3-2 2-2-2"></path>
                    <path d="M18 15v7"></path>
                    <path d="M18 22l-2-2"></path>
                    <path d="M18 22l2-2"></path>
                    <path d="M6 15v7"></path>
                    <path d="M6 22l-2-2"></path>
                    <path d="M6 22l2-2"></path>
                  {:else if tab.icon === 'mdi:account-group'}
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  {:else if tab.icon === 'mdi:information-outline'}
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  {:else if tab.icon === 'mdi:shield-outline'}
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path> 
                  {:else if tab.icon === 'mdi:code-json'}
                    <polyline points="16 18 22 12 16 6"></polyline>
                    <polyline points="8 6 2 12 8 18"></polyline>
                  {/if}
                </svg>
              </span>
              {tab.label}
            </button>
          {/each}
        </nav>
      </div>
      
      <!-- Tab Panels -->
      <div class="tab-panels">
        {#if activeTab === 'general'}
          <GeneralConfigTab 
            bind:siteConfig 
            bind:licenseConfig 
            on:change={() => hasChanges = true} 
          />
        {:else if activeTab === 'navigation'}
          <NavigationConfigTab 
            bind:navBarConfig 
            on:change={() => hasChanges = true} 
          />
        {:else if activeTab === 'profile'}
          <ProfileConfigTab 
            bind:profileConfig 
            bind:avatarConfig
            on:change={() => hasChanges = true}
            on:avatarChange={() => hasChanges = true}
          />
        {:else if activeTab === 'appearance'}
          <AppearanceConfigTab 
            bind:siteConfig 
            on:change={() => hasChanges = true} 
          />
        {:else if activeTab === 'timeline'}
          <TimelineConfigTab 
            bind:timelineConfig 
            on:change={() => hasChanges = true} 
          />
        {:else if activeTab === 'community'}
          <CommunityConfigTab 
            bind:communityConfig 
            on:change={() => hasChanges = true} 
          />
        {:else if activeTab === 'about'}
          <AboutConfigTab 
            bind:aboutConfig 
            on:change={() => hasChanges = true} 
          />
          {:else if activeTab === 'security'}
          <SecurityConfigTab
            on:change={() => hasChanges = true}
          />
        {:else if activeTab === 'advanced'}
          <AdvancedConfigTab 
            {siteConfig} 
            {navBarConfig} 
            {profileConfig} 
            {licenseConfig}
            {timelineConfig}
            {avatarConfig}
            {communityConfig}
            {aboutConfig}
            on:update={(e) => {
              // Handle updates from the advanced editor
              const { configType, newValue } = e.detail;
              if (configType === 'siteConfig') siteConfig = newValue;
              else if (configType === 'navBarConfig') navBarConfig = newValue;
              else if (configType === 'profileConfig') profileConfig = newValue;
              else if (configType === 'licenseConfig') licenseConfig = newValue;
              else if (configType === 'timelineConfig') timelineConfig = newValue;
              else if (configType === 'avatarConfig') avatarConfig = newValue;
              else if (configType === 'communityConfig') communityConfig = newValue;
              else if (configType === 'aboutConfig') aboutConfig = newValue;
              
              // Mark that changes have been made
              hasChanges = true;
            }}
          />
        {/if}
      </div>
      
      <!-- Save Button -->
      <div class="mt-8 border-t border-neutral-200 dark:border-neutral-700 pt-6">
        <div class="flex justify-between items-center">
          <!-- Status message -->
          <div class="text-sm">
            {#if saveStatus.saving}
              <span class="text-neutral-500 dark:text-neutral-400 flex items-center">
                <svg class="animate-spin mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving changes...
              </span>
            {:else if saveStatus.success}
              <span class="text-green-600 dark:text-green-400 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                Configuration saved successfully!
              </span>
            {:else if saveStatus.error}
              <span class="text-red-600 dark:text-red-400 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                {saveStatus.error}
              </span>
            {/if}
          </div>
          
          <button 
            on:click={saveAllConfiguration}
            disabled={saveStatus.saving || !hasChanges}
            class="py-2 px-6 bg-[var(--primary)] hover:opacity-90 text-white font-medium rounded-md transition-opacity flex items-center disabled:opacity-60"
            title={!hasChanges ? "No changes to save" : "Save your changes"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            {saveStatus.saving ? 'Saving...' : hasChanges ? 'Save Changes' : 'No Changes'}
          </button>
        </div>
      </div>
      
      <!-- GitHub Integration Panel -->
      <div class="mt-4 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5">
        <h3 class="text-lg font-medium text-black/80 dark:text-white/80 mb-4">GitHub Integration</h3>
        
        {#if !isGitHubAuthenticated}
          <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 rounded-md p-4 text-blue-800 dark:text-blue-200 mb-4">
            <div class="flex">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p class="font-medium">Connect to GitHub</p>
                <p class="mt-1">Authenticate with GitHub to save your changes directly to your repository.</p>
              </div>
            </div>
          </div>
          
          {#if showGitHubAuthForm}
            <GithubAuthForm 
              isAuthenticating={isCommitting}
              errorMessage={commitStatus.error}
              bind:token={githubToken}
              on:authenticate={handleGitHubAuth}
              on:cancel={() => showGitHubAuthForm = false}
              on:error={(e) => commitStatus.error = e.detail}
            />
          {:else}
            <button 
              on:click={showGitHubAuth}
              class="py-2 px-4 bg-neutral-800 dark:bg-neutral-200 hover:bg-neutral-900 dark:hover:bg-neutral-300 text-white dark:text-neutral-800 font-medium rounded-md transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
              Connect to GitHub
            </button>
          {/if}
        {:else}
          <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 rounded-md p-4 text-green-800 dark:text-green-200 mb-4">
            <div class="flex">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <p class="font-medium">Connected to GitHub</p>
                <p class="mt-1">You can now push your changes directly to your repository.</p>
              </div>
            </div>
          </div>
          
          <div class="flex flex-col sm:flex-row gap-3">
            <button 
              on:click={saveConfigsToGitHub}
              disabled={isCommitting || !hasChanges}
              class="py-2 px-4 bg-neutral-800 dark:bg-neutral-200 hover:bg-neutral-900 dark:hover:bg-neutral-300 text-white dark:text-neutral-800 font-medium rounded-md transition-colors flex items-center justify-center disabled:opacity-50"
            >
              {#if isCommitting && !showDeployOptions}
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Committing to GitHub...
              {:else}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
                {hasChanges ? 'Commit to GitHub' : 'No Changes to Commit'}
              {/if}
            </button>
            
            {#if showDeployOptions}
              <button 
                on:click={triggerSiteRebuild}
                disabled={isCommitting}
                class="py-2 px-4 bg-[var(--primary)] hover:opacity-90 text-white font-medium rounded-md transition-opacity flex items-center justify-center disabled:opacity-50"
              >
                {#if isCommitting}
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Triggering Rebuild...
                {:else}
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Deploy Changes
                {/if}
              </button>
            {/if}
            
            <button 
              on:click={handleGitHubLogout}
              class="py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Disconnect
            </button>
          </div>
          
          {#if commitStatus.success}
            <div class="mt-3 text-sm text-green-600 dark:text-green-400 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              {showDeployOptions ? 'Changes committed successfully!' : 'Site rebuild triggered successfully!'}
            </div>
          {/if}
          
          {#if commitStatus.error}
            <div class="mt-3 text-sm text-red-600 dark:text-red-400">
              {commitStatus.error}
            </div>
          {/if}
        {/if}
        
        <div class="mt-4 text-sm text-neutral-500 dark:text-neutral-400">
          <p>This integration automatically commits your configuration changes to your GitHub repository and can trigger a site rebuild.</p>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- General Config Exporter Dialog -->
<ConfigExporter
  bind:show={showConfigExporter}
  {siteConfig}
  {navBarConfig}
  {profileConfig}
  {licenseConfig}
  {timelineConfig}
  {avatarConfig}
  {communityConfig}
  {aboutConfig}
  on:close={() => showConfigExporter = false}
/>

<!-- Community Config Exporter Dialog -->
<CommunityConfigExporter
  bind:show={showCommunityConfigExporter}
  {communityConfig}
  on:close={() => showCommunityConfigExporter = false}
/>

<!-- About Config Exporter Dialog -->
<AboutConfigExporter
  bind:show={showAboutConfigExporter}
  {aboutConfig}
  on:close={() => showAboutConfigExporter = false}
/>
  
<style>
  /* Add any component-specific styles here */
  .tab-button {
    position: relative;
  }
  
  .tab-button::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: transparent;
    transition: background-color 0.2s ease;
  }
  
  .tab-button.active::after {
    background-color: var(--primary);
  }
</style>