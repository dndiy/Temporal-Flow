// Import types
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
  export const communityConfig: CommunityConfig = {
  hero: {
    title: "Join Our Community",
    description: "Connect with other members, share ideas, get help, and stay updated on the latest developments.",
    showGraphic: false,
    options: []
  },
  discord: {
    enabled: false,
    title: "Discord Community",
    description: "",
    inviteUrl: "",
    buttonText: "",
    features: [],
    channels: []
  },
  contact: {
    enabled: false,
    title: "Get in Touch",
    description: "",
    formActionUrl: "",
    buttonText: "",
    features: [],
    formFields: {
      name: {
        required: false
      },
      email: {
        required: false
      },
      subject: {
        required: false
      },
      message: {
        required: false
      }
    }
  },
  newsletter: {
    enabled: false,
    title: "Newsletter",
    description: "",
    buttonText: "",
    features: [],
    consentText: ""
  },
  events: {
    enabled: false,
    title: "Events",
    description: "",
    calendarButtonText: "",
    calendarUrl: ""
  },
  guidelines: {
    enabled: false,
    title: "Community Guidelines",
    description: "To ensure our community remains a positive and productive space, we ask all members to follow these basic guidelines:\n\nBe respectful and kind to other community members\nKeep discussions relevant to the appropriate channels\nShare knowledge freely and help others when you can\nNo spam, excessive self-promotion, or disruptive behavior\nRespect privacy and confidentiality of others",
    items: []
  }
}