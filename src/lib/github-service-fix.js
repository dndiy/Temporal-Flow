// lib/github-service.js
// This is a client-side GitHub service compatible with static sites

export function createGitHubService(initialConfig = null) {
  // Store configuration and auth state
  let config = initialConfig || null;
  let token = null;
  let octokit = null;

  // Try to load token from localStorage if available
  if (typeof localStorage !== 'undefined') {
    token = localStorage.getItem('github_token');
  }

  // Service API
  return {
    // Get the current config
    get config() {
      return config;
    },

    // Check if authenticated
    isAuthenticated() {
      return !!token;
    },

    // Authenticate with GitHub
    authenticate(accessToken) {
      if (!accessToken) return false;
      
      token = accessToken;
      
      // Save token to localStorage for persistence
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('github_token', token);
      }
      
      return true;
    },

    // Logout / clear authentication
    logout() {
      token = null;
      
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('github_token');
      }
    },

    // Get a file from the repository
    async getFile(path) {
      if (!token) {
        throw new Error('Authentication required');
      }

      try {
        // GitHub API endpoints
        const apiBase = 'https://api.github.com';
        const owner = config?.owner || 'your-github-username';
        const repo = config?.repo || 'your-repo-name';
        const branch = config?.branch || 'main';
        
        // Encode path for URL
        const encodedPath = encodeURIComponent(path);
        
        // Create the API URL
        const url = `${apiBase}/repos/${owner}/${repo}/contents/${encodedPath}?ref=${branch}`;
        
        // Make the API request
        const response = await fetch(url, {
          headers: {
            Authorization: `token ${token}`,
            Accept: 'application/vnd.github.v3+json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // If it's a binary file with content encoded in base64
        if (data.encoding === 'base64') {
          return {
            content: atob(data.content),
            sha: data.sha,
            path: data.path
          };
        }
        
        // If it's a directory or something else
        return data;
      } catch (error) {
        console.error('Error fetching file:', error);
        throw error;
      }
    },

    // List directory contents - needed for browsing posts
    async getDirectory(path) {
      if (!token) {
        throw new Error('Authentication required');
      }

      try {
        // GitHub API endpoints
        const apiBase = 'https://api.github.com';
        const owner = config?.owner || 'your-github-username';
        const repo = config?.repo || 'your-repo-name';
        const branch = config?.branch || 'main';
        
        // Encode path for URL
        const encodedPath = encodeURIComponent(path);
        
        // Create the API URL
        const url = `${apiBase}/repos/${owner}/${repo}/contents/${encodedPath}?ref=${branch}`;
        
        // Make the API request
        const response = await fetch(url, {
          headers: {
            Authorization: `token ${token}`,
            Accept: 'application/vnd.github.v3+json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // If it's not an array, it's not a directory
        if (!Array.isArray(data)) {
          throw new Error(`${path} is not a directory`);
        }
        
        return data;
      } catch (error) {
        console.error('Error listing directory:', error);
        throw error;
      }
    },

    // Commit a file to the repository
    async commitFile(path, content, message) {
      if (!token) {
        throw new Error('Authentication required');
      }

      try {
        // GitHub API endpoints
        const apiBase = 'https://api.github.com';
        const owner = config?.owner || 'your-github-username';
        const repo = config?.repo || 'your-repo-name';
        const branch = config?.branch || 'main';
        
        // Get the current file (if it exists) to get its SHA
        let sha = null;
        try {
          const fileInfo = await this.getFile(path);
          sha = fileInfo.sha;
        } catch (error) {
          // If the file doesn't exist, that's fine - we're creating it
          console.log(`Creating new file: ${path}`);
        }
        
        // Encode path and content for the API
        const encodedPath = encodeURIComponent(path);
        const encodedContent = btoa(unescape(encodeURIComponent(content)));
        
        // Create the API URL
        const url = `${apiBase}/repos/${owner}/${repo}/contents/${encodedPath}`;
        
        // Prepare the request body
        const body = {
          message,
          content: encodedContent,
          branch
        };
        
        // If we have a SHA (updating an existing file), include it
        if (sha) {
          body.sha = sha;
        }
        
        // Make the API request
        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            Authorization: `token ${token}`,
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`GitHub API error: ${response.status} ${errorData.message || response.statusText}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error committing file:', error);
        throw error;
      }
    },

    // Delete a file from the repository
    async deleteFile(path, message) {
      if (!token) {
        throw new Error('Authentication required');
      }

      try {
        // GitHub API endpoints
        const apiBase = 'https://api.github.com';
        const owner = config?.owner || 'your-github-username';
        const repo = config?.repo || 'your-repo-name';
        const branch = config?.branch || 'main';
        
        // We need the SHA of the file to delete it
        const fileInfo = await this.getFile(path);
        const sha = fileInfo.sha;
        
        if (!sha) {
          throw new Error(`Could not get SHA for ${path}`);
        }
        
        // Encode path for URL
        const encodedPath = encodeURIComponent(path);
        
        // Create the API URL
        const url = `${apiBase}/repos/${owner}/${repo}/contents/${encodedPath}`;
        
        // Make the API request
        const response = await fetch(url, {
          method: 'DELETE',
          headers: {
            Authorization: `token ${token}`,
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message,
            sha,
            branch
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`GitHub API error: ${response.status} ${errorData.message || response.statusText}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error deleting file:', error);
        throw error;
      }
    },

    // Trigger a GitHub Actions workflow
    async triggerWorkflow(workflowFile) {
      if (!token) {
        throw new Error('Authentication required');
      }

      try {
        // GitHub API endpoints
        const apiBase = 'https://api.github.com';
        const owner = config?.owner || 'your-github-username';
        const repo = config?.repo || 'your-repo-name';
        const branch = config?.branch || 'main';
        
        // Create the API URL for dispatching a workflow
        const url = `${apiBase}/repos/${owner}/${repo}/actions/workflows/${workflowFile}/dispatches`;
        
        // Make the API request
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            Authorization: `token ${token}`,
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ref: branch,
            inputs: {
              source: 'post-editor'
            }
          })
        });
        
        if (!response.ok) {
          // Some workflow errors don't return JSON
          try {
            const errorData = await response.json();
            throw new Error(`GitHub API error: ${response.status} ${errorData.message || response.statusText}`);
          } catch (e) {
            throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
          }
        }
        
        // Successful workflow dispatches return 204 No Content
        return { success: true };
      } catch (error) {
        console.error('Error triggering workflow:', error);
        throw error;
      }
    }
  };
}
