// About page configuration

import type { AboutConfig } from '../types/aboutconfig';
import { defaultAboutConfig } from '../types/aboutconfig';

// Export the about page configuration
export const aboutConfig: AboutConfig = {
  ...defaultAboutConfig,
  // Override default values below as needed
  team: {
    ...defaultAboutConfig.team,
    title: "Our Team"
  },
  content: {
    ...defaultAboutConfig.content,
    defaultTitle: "About The Project"
  },
  contact: {
    ...defaultAboutConfig.contact,
    title: "Get In Touch",
    description: "Have questions, ideas, or want to collaborate? We'd love to hear from you!",
    contactInfo: {
      email: "Greg@dndiy.org"
    }
  }
};
