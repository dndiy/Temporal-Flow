// src/lib/github-service.ts
// GitHub API Integration using Personal Access Tokens

/**
 * Configuration for GitHub API integration
 */
export interface GitHubConfig {
  owner: string;       // GitHub username or organization
  repo: string;        // Repository name
  branch: string;      // Branch to commit to (e.g., 'main')
  configPath: string;  // Path to the config files in the repo
  postsPath: string;   // Path to the blog posts directory
}

/**
 * GitHub API Service for managing site content and configurations
 */
export class GitHubService {
  private token: string | null = null;
  private config: GitHubConfig;
  
  constructor(config: GitHubConfig) {
    this.config = config;
    // Only access localStorage in browser environment
    if (typeof window !== 'undefined' && window.localStorage) {
      this.token = localStorage.getItem('github_token');
    }
  }
  
  /**
   * Check if the user is authenticated with GitHub
   */
  isAuthenticated(): boolean {
    return this.token !== null;
  }
  
  /**
   * Authenticate with a personal access token
   */
  authenticate(token: string): boolean {
    if (!token) return false;
    
    // Store the token
    this.token = token;
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('github_token', token);
    }
    return true;
  }
  
  /**
   * Log out from GitHub
   */
  logout() {
    this.token = null;
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('github_token');
    }
  }
  
  /**
   * Get file content from the repository
   */
  async getFile(path: string): Promise<{ content: string; sha: string } | null> {
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated with GitHub');
    }
    
    try {
      const response = await fetch(
        `https://api.github.com/repos/${this.config.owner}/${this.config.repo}/contents/${path}?ref=${this.config.branch}`,
        {
          headers: {
            'Authorization': `token ${this.token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );
      
      if (!response.ok) {
        if (response.status === 404) {
          return null; // File doesn't exist
        }
        throw new Error(`Failed to get file: ${response.statusText}`);
      }
      
      const data = await response.json();
      // GitHub API returns content as base64 encoded
      const content = atob(data.content);
      return { content, sha: data.sha };
    } catch (error) {
      console.error('Error getting file:', error);
      throw error;
    }
  }
  
  /**
   * Commit a file to the repository
   */
  async commitFile(path: string, content: string, message: string): Promise<boolean> {
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated with GitHub');
    }
    
    try {
      // First, check if the file already exists to get its SHA
      let sha = null;
      try {
        const existingFile = await this.getFile(path);
        if (existingFile) {
          sha = existingFile.sha;
        }
      } catch (error) {
        // File doesn't exist, which is fine for new files
      }
      
      // Prepare the request body
      const body: any = {
        message,
        content: btoa(content), // Base64 encode the content
        branch: this.config.branch
      };
      
      // Include the SHA if updating an existing file
      if (sha) {
        body.sha = sha;
      }
      
      // Make the API request
      const response = await fetch(
        `https://api.github.com/repos/${this.config.owner}/${this.config.repo}/contents/${path}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `token ${this.token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to commit file: ${response.statusText}`);
      }
      
      return true;
    } catch (error) {
      console.error('Error committing file:', error);
      throw error;
    }
  }
  
  /**
   * Save a configuration file to the repository
   */
  async saveConfig(fileName: string, content: string): Promise<boolean> {
    const path = `${this.config.configPath}/${fileName}`;
    const message = `Update ${fileName} configuration`;
    return this.commitFile(path, content, message);
  }
  
  /**
   * Save a blog post to the repository
   */
  async savePost(slug: string, content: string, isDraft: boolean = false): Promise<boolean> {
    // Determine the folder path based on draft status
    const folder = isDraft ? 'drafts' : 'posts';
    const path = `${this.config.postsPath}/${folder}/${slug}.mdx`;
    const message = `${isDraft ? 'Save draft' : 'Publish'}: ${slug}`;
    return this.commitFile(path, content, message);
  }
  
  /**
   * Trigger a GitHub Action workflow
   * Useful for rebuilding/redeploying the site after changes
   */
  async triggerWorkflow(workflowId: string): Promise<boolean> {
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated with GitHub');
    }
    
    try {
      const response = await fetch(
        `https://api.github.com/repos/${this.config.owner}/${this.config.repo}/actions/workflows/${workflowId}/dispatches`,
        {
          method: 'POST',
          headers: {
            'Authorization': `token ${this.token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ref: this.config.branch
          })
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to trigger workflow: ${response.statusText}`);
      }
      
      return true;
    } catch (error) {
      console.error('Error triggering workflow:', error);
      throw error;
    }
  }
}

// Export a function to create and configure the service
export function createGitHubService(config?: Partial<GitHubConfig>): GitHubService {
  // Default configuration with safe environment variable access
  const defaultConfig: GitHubConfig = {
    owner: typeof import.meta.env !== 'undefined' ? (import.meta.env.PUBLIC_GITHUB_OWNER || '') : '',
    repo: typeof import.meta.env !== 'undefined' ? (import.meta.env.PUBLIC_GITHUB_REPO || '') : '',
    branch: typeof import.meta.env !== 'undefined' ? (import.meta.env.PUBLIC_GITHUB_BRANCH || 'main') : 'main',
    configPath: 'src/config',
    postsPath: 'src/content'
  };
  
  // Merge with provided config
  const mergedConfig = { ...defaultConfig, ...config };
  
  return new GitHubService(mergedConfig);
}