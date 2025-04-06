<script>
  import { onMount } from 'svelte';
  import { marked } from 'marked';
  import { fade } from 'svelte/transition';
  import GithubAuthForm from './GithubAuthForm.svelte';
  import { createGitHubService } from '../../../lib/github-service';
  // Don't import mammoth directly here - we'll load it dynamically when needed
  
  // Tab state
  let activeTab = 'create'; // 'create' or 'import'
  
  // File import state
  let fileToImport = null;
  let fileContent = '';
  let fileType = '';
  let importStatus = '';
  let isImporting = false;
  
  // GitHub integration state
  let githubService = createGitHubService();
  let isGitHubAuthenticated = false;
  let showGitHubAuthForm = false;
  let isCommitting = false;
  let commitStatus = { success: false, error: null };
  let showDeployOptions = false;
  let githubToken = '';
  let githubFolder = 'src/content/posts';
  let subfolderPath = '';
  
  // Reactive state management
  let post = {
    title: '',
    description: '',
    slug: '',
    published: new Date().toISOString().split('T')[0],
    image: '',
    tags: '',
    category: '',
    showAdvancedOptions: false,
    advanced: {
      avatarImage: '',
      authorName: '',
      authorBio: '',
      showImageOnPost: false,
      lang: 'en',
      bannerImage: ''
    },
    timelineData: {
      enabled: false,
      year: undefined,
      era: '',
      location: '',
      isKeyEvent: false
    },
    banner: {
      type: '',
      videoId: '',
      timelineCategory: ''
    },
    content: '',
    draft: true
  };
  
  // Derived values
  $: tagsArray = post.tags ? post.tags.split(',').map(tag => tag.trim()) : [];
  $: previewHtml = post.content ? marked(post.content) : '';
  $: formValid = !!post.title && !!post.slug && !!post.published;
  $: showVideoFields = post.banner.type === 'video';
  $: showTimelineFields = post.timelineData.enabled;
  $: showAdvancedFields = post.showAdvancedOptions;
  
  // Toast notification state
  let showToast = false;
  let toastMessage = '';
  let toastType = 'success';
  
  // Initialize GitHub service
  function initializeGithubService() {
    // Check GitHub authentication status
    isGitHubAuthenticated = githubService.isAuthenticated();
    
    // Set GitHub repository settings if needed
    if (!githubService.config) {
      githubService = createGitHubService({
        // These should match your GitHub repository details
        owner: 'your-github-username', // Update with your GitHub username
        repo: 'your-repo-name',        // Update with your repository name
        branch: 'main',                // Update with your branch name
        configPath: 'src/config',
        postsPath: githubFolder
      });
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
          if (error.message.includes('401')) {
            commitStatus.error = 'Authentication failed. Please check your token permissions.';
          } else if (error.message.includes('404')) {
            commitStatus.error = 'Repository or README.md not found. Check your repository settings.';
          } else {
            commitStatus.error = `Token validation error: ${error.message}`;
          }
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
  
  // Generate slug from title
  function generateSlug() {
    if (post.title) {
      post.slug = post.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    }
  }
  
  // Toast notification function
  function showNotification(message, type = 'success') {
    toastMessage = message;
    toastType = type;
    showToast = true;
    
    setTimeout(() => {
      showToast = false;
    }, 3000);
  }
  
  // Save draft
  async function saveDraft() {
    await savePost(true);
  }
  
  // Publish post
  async function publishPost() {
    await savePost(false);
  }
  
  // Common save function
  async function savePost(isDraft = false) {
    try {
      post.draft = isDraft;
      
      // Build complete post data
      const postData = {
        ...post,
        tags: tagsArray,
      };
      
      // Add timeline data if enabled
      if (post.timelineData.enabled) {
        postData.timelineYear = post.timelineData.year;
        postData.timelineEra = post.timelineData.era;
        postData.timelineLocation = post.timelineData.location;
        postData.isKeyEvent = post.timelineData.isKeyEvent;
      }
      
      // Add banner data if selected
      if (post.banner.type) {
        postData.bannerType = post.banner.type;
        postData.bannerData = {};
        
        if (post.banner.type === 'video') {
          postData.bannerData.videoId = post.banner.videoId;
        } else if (post.banner.type === 'timeline') {
          postData.bannerData.category = post.banner.timelineCategory;
        }
      }
      
      // In a real implementation, send to your API
      // For now, we'll just generate and download the MDX
      generateMdxFile(postData);
      
      // Show success toast
      showNotification(isDraft ? 'Draft saved successfully!' : 'Post published successfully!');
    } catch (error) {
      console.error('Error saving post:', error);
      showNotification('Failed to save post: ' + error.message, 'error');
    }
  }
  
  // Generate frontmatter
  function generateFrontmatter(data) {
    let frontmatter = `---\n`;
    frontmatter += `title: "${data.title}"\n`;
    frontmatter += `published: ${data.published}\n`;
    frontmatter += `description: "${data.description}"\n`;
    
    if (data.image) {
      frontmatter += `image: "${data.image}"\n`;
    }
    
    if (data.tags && data.tags.length > 0) {
      frontmatter += `tags: [${data.tags.map(tag => `"${tag}"`).join(', ')}]\n`;
    }
    
    if (data.category) {
      frontmatter += `category: "${data.category}"\n`;
    }
    
    frontmatter += `draft: ${data.draft}\n`;
    
    // Add advanced fields if enabled
    if (data.showAdvancedOptions) {
      if (data.advanced.avatarImage) {
        frontmatter += `avatarImage: "${data.advanced.avatarImage}"\n`;
      }
      
      if (data.advanced.authorName) {
        frontmatter += `authorName: "${data.advanced.authorName}"\n`;
      }
      
      if (data.advanced.authorBio) {
        frontmatter += `authorBio: "${data.advanced.authorBio}"\n`;
      }
      
      // Add showImageOnPost field
      frontmatter += `showImageOnPost: ${data.advanced.showImageOnPost}\n`;
      
      // Add language field
      if (data.advanced.lang) {
        frontmatter += `lang: "${data.advanced.lang}"\n`;
      }
    }
    
    // Add timeline data if present
    if (data.timelineData && data.timelineData.enabled) {
      frontmatter += `timelineYear: ${data.timelineData.year || new Date().getFullYear()}\n`;
      frontmatter += `timelineEra: "${data.timelineData.era}"\n`;
      frontmatter += `timelineLocation: "${data.timelineData.location}"\n`;
      frontmatter += `isKeyEvent: ${data.timelineData.isKeyEvent}\n`;
    }
    
    // Add banner data if present
    if (data.banner && data.banner.type) {
      frontmatter += `bannerType: "${data.banner.type}"\n`;
      
      if (data.banner.type === 'image' && data.advanced && data.advanced.bannerImage) {
        frontmatter += `bannerData:\n`;
        frontmatter += `  image: "${data.advanced.bannerImage}"\n`;
      } else if (data.banner.type === 'video' && data.banner.videoId) {
        frontmatter += `bannerData:\n`;
        frontmatter += `  videoId: "${data.banner.videoId}"\n`;
      } else if (data.banner.type === 'timeline' && data.banner.timelineCategory) {
        frontmatter += `bannerData:\n`;
        frontmatter += `  category: "${data.banner.timelineCategory}"\n`;
      }
    }
    
    frontmatter += `---`;
    return frontmatter;
  }
  
  // Generate and download MDX file
  function generateMdxFile(postData) {
    const frontmatter = generateFrontmatter(postData);
    const fullContent = `${frontmatter}\n\n${postData.content}`;
    
    // Create downloadable file
    const blob = new Blob([fullContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${postData.slug}.mdx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  
  // Save post to GitHub
  async function savePostToGitHub(isDraft = false) {
    if (!isGitHubAuthenticated) {
      commitStatus.error = 'Please authenticate with GitHub first';
      return;
    }
    
    try {
      isCommitting = true;
      commitStatus.error = null;
      
      // Update draft status
      post.draft = isDraft;
      
      // Create the final content with frontmatter
      const frontmatter = generateFrontmatter(post);
      const fullContent = `${frontmatter}\n\n${post.content}`;
      
      // Determine the file path in the repository
      let filePath;
      if (subfolderPath) {
        filePath = `${githubFolder}/${subfolderPath}/${post.slug}.mdx`;
      } else {
        filePath = `${githubFolder}/${post.slug}.mdx`;
      }
      
      // Commit the file to GitHub
      await githubService.commitFile(
        filePath,
        fullContent,
        `${isDraft ? 'Draft' : 'Publish'}: ${post.title}`
      );
      
      // Update UI status
      commitStatus.success = true;
      showDeployOptions = true;
      
      // Show success message
      showNotification(
        isDraft 
          ? 'Draft saved successfully to GitHub!' 
          : 'Post published successfully to GitHub!',
        'success'
      );
      
      setTimeout(() => {
        commitStatus.success = false;
      }, 3000);
    } catch (error) {
      console.error('Error saving post to GitHub:', error);
      
      // Provide more detailed error messages
      if (error.message.includes('401')) {
        commitStatus.error = 'Authentication failed. Please refresh your GitHub token.';
      } else if (error.message.includes('404')) {
        commitStatus.error = 'Repository or path not found. Check your repository settings.';
      } else {
        commitStatus.error = `Failed to save to GitHub: ${error.message}`;
      }
      
      showNotification(`Failed to save to GitHub: ${error.message}`, 'error');
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Trigger the GitHub Action workflow for rebuilding the site
      await githubService.triggerWorkflow('deploy.yml');
      
      // Update UI status
      commitStatus.success = true;
      showDeployOptions = false;
      
      // Show success message
      showNotification('Site rebuild triggered successfully!', 'success');
      
      setTimeout(() => {
        commitStatus.success = false;
      }, 3000);
    } catch (error) {
      console.error('Error triggering rebuild:', error);
      
      if (error.message.includes('404')) {
        commitStatus.error = `Failed to trigger rebuild: Workflow file not found. Make sure 'deploy.yml' exists in your repository's .github/workflows directory.`;
      } else {
        commitStatus.error = `Failed to trigger rebuild: ${error.message}`;
      }
      
      showNotification(`Failed to trigger rebuild: ${error.message}`, 'error');
    } finally {
      isCommitting = false;
    }
  }
  
  // File Import Functions
  async function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    fileToImport = file;
    fileType = file.name.split('.').pop().toLowerCase();
    
    importStatus = `Selected file: ${file.name}`;
    
    // Clear previous file content
    fileContent = '';
    post.content = '';
  }
  
  async function processImport() {
    if (!fileToImport) {
      showNotification('Please select a file to import', 'error');
      return;
    }
    
    importStatus = 'Processing...';
    isImporting = true;
    
    try {
      // Read the file content
      const reader = new FileReader();
      
      // Define a promise to handle the file reading
      const readFile = new Promise((resolve, reject) => {
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(new Error('Error reading file'));
      });
      
      // Start reading the file based on type
      if (fileType === 'docx') {
        reader.readAsArrayBuffer(fileToImport);
      } else {
        reader.readAsText(fileToImport);
      }
      
      // Wait for the file to be read
      const result = await readFile;
      
      // Convert the content based on file type
      let converted = '';
      let title = fileToImport.name.replace(`.${fileType}`, '');
      
      switch (fileType) {
        case 'txt':
          converted = await convertTextToMarkdown(result);
          break;
        case 'html':
          converted = await convertHtmlToMarkdown(result);
          title = extractTitleFromHtml(result) || title;
          break;
        case 'md':
        case 'markdown':
          // For markdown files, we can use them directly
          converted = result;
          // Try to extract title from first heading
          const mdTitleMatch = result.match(/^#\s+(.+)$/m);
          if (mdTitleMatch && mdTitleMatch[1]) {
            title = mdTitleMatch[1].trim();
          }
          break;
        case 'docx':
          const conversion = await convertDocxToMarkdown(result);
          converted = conversion.content;
          title = conversion.title || title;
          break;
        default:
          converted = `# Imported Content\n\nOriginal file: ${fileToImport.name}\n\n${result}`;
      }
      
      // Update the post state with the converted content
      post.title = title;
      post.content = converted;
      post.slug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      
      importStatus = 'Import successful! You can now edit the content before saving.';
      showNotification('File imported successfully!');
      
      // Switch to create tab to show the imported content
      activeTab = 'create';
    } catch (error) {
      console.error('Import error:', error);
      importStatus = `Error: ${error.message}`;
      showNotification(`Failed to import file: ${error.message}`, 'error');
    } finally {
      isImporting = false;
    }
  }
  
  // Conversion functions
  async function convertTextToMarkdown(text) {
    // For text files, we'll just add some minimal formatting
    const lines = text.split('\n');
    let inCodeBlock = false;
    let inList = false;
    
    const processed = lines.map((line, index) => {
      // Skip empty lines
      if (line.trim() === '') {
        inList = false;
        return '';
      }
      
      // Check for potential headings (simple heuristic)
      if (index === 0 || (index > 0 && lines[index - 1].trim() === '')) {
        if (line.length < 50 && !line.endsWith('.') && !line.includes(':')) {
          return `# ${line}`;
        }
      }
      
      // Check for lists
      if (line.trim().match(/^\d+\.\s/)) {
        inList = true;
        return line;
      } else if (line.trim().match(/^[\*\-]\s/)) {
        inList = true;
        return line;
      } else if (inList && line.trim().match(/^\s+/)) {
        return line;
      } else {
        inList = false;
      }
      
      // Preserve paragraphs
      return line;
    });
    
    return processed.join('\n');
  }
  
  async function convertHtmlToMarkdown(html) {
    // Basic HTML to Markdown conversion
    // This is a simplified version - you may want to use a library like turndown for better results
    let markdown = html;
    
    // Handle headings
    markdown = markdown.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n');
    markdown = markdown.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n');
    markdown = markdown.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n');
    markdown = markdown.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n');
    markdown = markdown.replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n');
    markdown = markdown.replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n');
    
    // Handle paragraphs
    markdown = markdown.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');
    
    // Handle line breaks
    markdown = markdown.replace(/<br\s*\/?>/gi, '\n');
    
    // Handle bold and italic
    markdown = markdown.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
    markdown = markdown.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');
    markdown = markdown.replace(/<em[^>]*>(.*?)<\/em>/gi, '_$1_');
    markdown = markdown.replace(/<i[^>]*>(.*?)<\/i>/gi, '_$1_');
    
    // Handle links
    markdown = markdown.replace(/<a href="(.*?)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');
    
    // Handle images
    markdown = markdown.replace(/<img src="(.*?)"[^>]*>/gi, '![]($1)');
    
    // Handle lists
    markdown = markdown.replace(/<ul[^>]*>(.*?)<\/ul>/gis, (match, content) => {
      return content.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');
    });
    
    markdown = markdown.replace(/<ol[^>]*>(.*?)<\/ol>/gis, (match, content) => {
      let index = 1;
      return content.replace(/<li[^>]*>(.*?)<\/li>/gi, () => {
        return `${index++}. $1\n`;
      });
    });
    
    // Handle blockquotes
    markdown = markdown.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gis, '> $1\n');
    
    // Handle code blocks
    markdown = markdown.replace(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gis, '```\n$1\n```\n');
    
    // Handle inline code
    markdown = markdown.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');
    
    // Remove remaining HTML tags
    markdown = markdown.replace(/<[^>]*>/g, '');
    
    // Decode HTML entities
    markdown = markdown.replace(/&lt;/g, '<');
    markdown = markdown.replace(/&gt;/g, '>');
    markdown = markdown.replace(/&amp;/g, '&');
    markdown = markdown.replace(/&quot;/g, '"');
    markdown = markdown.replace(/&#39;/g, "'");
    
    // Clean up multiple newlines
    markdown = markdown.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    return markdown;
  }
  
  function extractTitleFromHtml(html) {
    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
    if (titleMatch && titleMatch[1]) {
      return titleMatch[1].trim();
    }
    
    const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
    if (h1Match && h1Match[1]) {
      return h1Match[1].trim().replace(/<[^>]*>/g, ''); // Remove any HTML tags inside the h1
    }
    
    return null;
  }
  
  async function convertDocxToMarkdown(arrayBuffer) {
    try {
      // Check if we're in the browser environment
      if (typeof window === 'undefined') {
        throw new Error('DOCX conversion is only available in browser environments');
      }

      // Dynamically import mammoth only when needed
      let mammoth;
      try {
        // Try to load mammoth from the installed package
        mammoth = (await import('mammoth')).default;
      } catch (importError) {
        console.error('Error importing mammoth:', importError);
        return { 
          title: "Word Document Import Error", 
          content: "# Word Document Import Error\n\nThere was an error loading the mammoth.js library needed for DOCX conversion.\n\nPlease make sure you've installed it with:\n```\npnpm install mammoth\n```\n\nIf you've already installed it, try restarting your development server."
        };
      }
      
      // Once we have mammoth, convert the document
      const result = await mammoth.convertToHtml({ arrayBuffer });
      const html = result.value;
      
      // Extract the title from the document
      let title = null;
      const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
      if (h1Match && h1Match[1]) {
        title = h1Match[1].trim().replace(/<[^>]*>/g, '');
      }
      
      // Convert HTML to markdown
      const markdown = await convertHtmlToMarkdown(html);
      
      return { title, content: markdown };
    } catch (error) {
      console.error('Error converting DOCX:', error);
      throw new Error('Failed to convert DOCX file. ' + error.message);
    }
  }
  
  // Clear the form
  function clearForm() {
    localStorage.removeItem('draftPost');
    post = {
      title: '',
      description: '',
      slug: '',
      published: new Date().toISOString().split('T')[0],
      image: '',
      tags: '',
      category: '',
      showAdvancedOptions: false,
      advanced: {
        avatarImage: '',
        authorName: '',
        authorBio: '',
        showImageOnPost: false,
        lang: 'en',
        bannerImage: ''
      },
      timelineData: {
        enabled: false,
        year: undefined,
        era: '',
        location: '',
        isKeyEvent: false
      },
      banner: {
        type: '',
        videoId: '',
        timelineCategory: ''
      },
      content: '',
      draft: true
    };
    fileToImport = null;
    fileContent = '';
    importStatus = '';
    showNotification('Content cleared!');
  }
  
  // Load saved draft if available
  onMount(() => {
    const savedDraft = localStorage.getItem('draftPost');
    if (savedDraft) {
      try {
        const savedPost = JSON.parse(savedDraft);
        
        // Make sure advanced fields are properly initialized
        if (!savedPost.advanced) {
          savedPost.advanced = {
            avatarImage: '',
            authorName: '',
            authorBio: '',
            showImageOnPost: false,
            lang: 'en',
            bannerImage: ''
          };
        }
        
        post = savedPost;
        showNotification('Draft loaded from local storage');
      } catch (e) {
        console.error('Error loading draft:', e);
      }
    }
    
    // Initialize GitHub service
    initializeGithubService();
    
    // Auto-save draft every 30 seconds
    const autoSaveInterval = setInterval(() => {
      if (post.title) {
        localStorage.setItem('draftPost', JSON.stringify(post));
        console.log('Draft auto-saved');
      }
    }, 30000);
    
    return () => {
      clearInterval(autoSaveInterval);
    };
  });
</script>

<div class="post-editor w-full">
  <!-- Toast notification -->
  {#if showToast}
    <div class="fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-md {toastType === 'success' ? 'bg-green-50 text-green-800 border-l-4 border-green-500 dark:bg-green-900/30 dark:text-green-200' : 'bg-red-50 text-red-800 border-l-4 border-red-500 dark:bg-red-900/30 dark:text-red-200'}" transition:fade>
      {toastMessage}
    </div>
  {/if}
  
  <h1 class="text-3xl font-bold text-black/90 dark:text-white/90 mb-6">Post Editor</h1>
  
  <!-- Tab Navigation -->
  <div class="border-b border-neutral-200 dark:border-neutral-700 mb-6">
    <nav class="flex space-x-4">
      <button 
        class="py-2 px-4 font-medium {activeTab === 'create' ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400' : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'}"
        on:click={() => activeTab = 'create'}
      >
        Create New
      </button>
      <button 
        class="py-2 px-4 font-medium {activeTab === 'import' ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400' : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'}"
        on:click={() => activeTab = 'import'}
      >
        Import
      </button>
    </nav>
  </div>
  
  <!-- GitHub Connection Status -->
  <div class="mb-6">
    {#if !isGitHubAuthenticated}
      <div class="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 rounded-md text-blue-800 dark:text-blue-200 mb-4">
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
          <span>Connect to GitHub to publish posts directly to your repository</span>
        </div>
        <button 
          on:click={showGitHubAuth}
          class="ml-3 py-1 px-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
        >
          Connect
        </button>
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
      {/if}
    {:else}
      <div class="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 rounded-md text-green-800 dark:text-green-200">
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <span>Connected to GitHub</span>
        </div>
        
        <div class="flex items-center space-x-3">
          <details class="inline-block">
            <summary class="text-sm cursor-pointer hover:underline">Settings</summary>
            <div class="absolute z-10 mt-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md shadow-lg p-4 w-64">
              <div class="space-y-3">
                <div>
                  <label for="github-folder-inline" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Posts Folder Path
                  </label>
                  <input 
                    type="text" 
                    id="github-folder-inline" 
                    bind:value={githubFolder} 
                    placeholder="src/content/posts" 
                    class="w-full px-2 py-1 text-sm bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded text-neutral-900 dark:text-neutral-100" 
                  />
                </div>
                
                <div>
                  <label for="subfolder-path-inline" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Subfolder (Optional)
                  </label>
                  <input 
                    type="text" 
                    id="subfolder-path-inline" 
                    bind:value={subfolderPath} 
                    placeholder="blog" 
                    class="w-full px-2 py-1 text-sm bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded" 
                  />
                </div>
              </div>
            </div>
          </details>
          
          <button 
            on:click={handleGitHubLogout}
            class="py-1 px-3 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors flex items-center"
          >
            Disconnect
          </button>
        </div>
      </div>
      
      {#if commitStatus.success || commitStatus.error}
        <div class="mt-3 {commitStatus.success ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} text-sm">
          {#if commitStatus.success}
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              {showDeployOptions ? 'Post saved to GitHub successfully!' : 'Site rebuild triggered successfully!'}
            </div>
          {:else}
            {commitStatus.error}
          {/if}
        </div>
      {/if}
    {/if}
  </div>
  
  {#if activeTab === 'import'}
    <!-- Import Tab Content -->
    <div class="space-y-6">
      <div class="p-6 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
        <h2 class="text-xl font-semibold text-black/80 dark:text-white/80 mb-4">Import Content</h2>
        
        <p class="mb-4 text-neutral-600 dark:text-neutral-300">
          Import content from common file formats and convert to MDX. Supported formats:
        </p>
        
        <ul class="list-disc pl-5 mb-6 text-neutral-600 dark:text-neutral-300">
          <li>Text files (.txt)</li>
          <li>HTML files (.html)</li>
          <li>Markdown files (.md, .markdown)</li>
          <li>Word documents (.docx)</li>
        </ul>
        
        <div class="space-y-4">
          <div class="flex flex-col">
            <label for="file-upload" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Select a file to import
            </label>
            <input 
              type="file" 
              id="file-upload" 
              accept=".txt,.html,.md,.markdown,.docx" 
              on:change={handleFileSelect}
              class="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-l text-sm text-neutral-900 dark:text-neutral-100 text-neutral-900 dark:text-neutral-100" 
            />
          </div>
          
          {#if importStatus}
            <div class="mt-2 p-3 bg-neutral-100 dark:bg-neutral-800 rounded text-sm">
              {importStatus}
            </div>
          {/if}
          
          <div class="flex justify-end mt-4">
            <button 
              on:click={processImport}
              disabled={!fileToImport || isImporting}
              class="px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isImporting ? 'Importing...' : 'Import and Convert'}
            </button>
          </div>
        </div>
      </div>
      
      <div class="text-sm text-neutral-500 dark:text-neutral-400">
        <p>After importing, you can edit the content and add metadata before saving or publishing.</p>
      </div>
    </div>
  {:else}
    <!-- Create Tab Content (Original Form) -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Frontmatter Section -->
      <div class="space-y-4">
        <h2 class="text-xl font-semibold text-black/80 dark:text-white/80 mb-3">Post Information</h2>
        
        <div>
          <label for="title" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Title*</label>
          <input 
            type="text" 
            id="title" 
            bind:value={post.title} 
            on:blur={generateSlug}
            class="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-l text-sm text-neutral-900 dark:text-neutral-100" 
            required 
          />
        </div>
        
        <div>
          <label for="description" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Description*</label>
          <input 
            type="text" 
            id="description" 
            bind:value={post.description} 
            class="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-l text-sm text-neutral-900 dark:text-neutral-100" 
            required 
          />
        </div>
        
        <div>
          <label for="slug" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Slug*</label>
          <div class="flex">
            <input 
              type="text" 
              id="slug" 
              bind:value={post.slug} 
              class="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-l text-sm text-neutral-900 dark:text-neutral-100" 
              required 
            />
            <button 
              on:click={generateSlug} 
              class="px-3 py-2 bg-neutral-200 dark:bg-neutral-600 border border-neutral-300 dark:border-neutral-600 rounded-r"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
          <p class="text-xs text-neutral-500 mt-1">URL-friendly version of the title (e.g., "my-blog-post")</p>
        </div>
        
        <div>
          <label for="published" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Publication Date*</label>
          <input 
            type="date" 
            id="published" 
            bind:value={post.published} 
            class="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-l text-sm text-neutral-900 dark:text-neutral-100" 
            required 
          />
        </div>
        
        <div>
          <label for="image" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Featured Image URL</label>
          <input 
            type="text" 
            id="image" 
            bind:value={post.image} 
            placeholder="/posts/your-image.jpg" 
            class="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-l text-sm text-neutral-900 dark:text-neutral-100" 
          />
          {#if post.image}
            <div class="mt-2 p-2 bg-neutral-100 dark:bg-neutral-800 rounded">
              <p class="text-xs mb-1">Image Preview:</p>
              <img src={post.image} alt="Preview" class="max-h-32 rounded" on:error={(e) => e.target.style.display = 'none'} />
            </div>
          {/if}
        </div>
        
        <div>
          <label for="tags" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Tags (comma-separated)</label>
          <input 
            type="text" 
            id="tags" 
            bind:value={post.tags} 
            placeholder="news, tutorial, video" 
            class="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-l text-sm text-neutral-900 dark:text-neutral-100" 
          />
          {#if tagsArray.length > 0}
            <div class="flex flex-wrap gap-1 mt-2">
              {#each tagsArray as tag}
                <span class="px-2 py-1 text-xs bg-neutral-200 dark:bg-neutral-700 rounded">{tag}</span>
              {/each}
            </div>
          {/if}
        </div>
        
        <div>
          <label for="category" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Category</label>
          <input 
            type="text" 
            id="category" 
            bind:value={post.category} 
            class="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-l text-sm text-neutral-900 dark:text-neutral-100" 
          />
        </div>
        
        <!-- Timeline specific fields with toggle -->
        <div>
          <div class="flex items-center mb-2">
            <input 
              type="checkbox" 
              id="enable-timeline" 
              bind:checked={post.timelineData.enabled} 
              class="mr-2" 
            />
            <label for="enable-timeline" class="text-sm font-medium text-neutral-700 dark:text-neutral-300">Add to Timeline</label>
          </div>
          
          {#if showTimelineFields}
            <div class="pl-5 space-y-3">
              <div>
                <label for="timelineYear" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Timeline Year</label>
                <input 
                  type="number" 
                  id="timelineYear" 
                  bind:value={post.timelineData.year} 
                  class="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-l text-sm text-neutral-900 dark:text-neutral-100" 
                />
              </div>
              
              <div>
                <label for="timelineEra" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Timeline Era</label>
                <select 
                  id="timelineEra" 
                  bind:value={post.timelineData.era} 
                  class="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-l text-sm text-neutral-900 dark:text-neutral-100"
                >
                  <option value="">Select an era</option>
                  <option value="ancient-epoch">The Ancient Epoch</option>
                  <option value="awakening-era">The Awakening Era</option>
                  <option value="golden-age">The Corporate Golden Age</option>
                  <option value="conflict-epoch">Extinction Epoch</option>
                  <option value="singularity-conflict">Transtemporal Singularity Conflict</option>
                  <option value="transcendent-age">The Transcendent Age</option>
                  <option value="final-epoch">The Final Epoch</option>
                </select>
              </div>
              
              <div>
                <label for="timelineLocation" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Timeline Location</label>
                <input 
                  type="text" 
                  id="timelineLocation" 
                  bind:value={post.timelineData.location} 
                  class="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-l text-sm text-neutral-900 dark:text-neutral-100" 
                />
              </div>
              
              <div class="flex items-center">
                <input 
                  type="checkbox" 
                  id="isKeyEvent" 
                  bind:checked={post.timelineData.isKeyEvent} 
                  class="mr-2" 
                />
                <label for="isKeyEvent" class="text-sm font-medium text-neutral-700 dark:text-neutral-300">Key Event</label>
              </div>
            </div>
          {/if}
        </div>
        
        <!-- Special banner types -->
        <div>
          <label for="bannerType" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Banner Type</label>
          <select 
            id="bannerType" 
            bind:value={post.banner.type} 
            class="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-l text-sm text-neutral-900 dark:text-neutral-100"
          >
            <option value="">None</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="timeline">Timeline</option>
          </select>
        </div>
        
        {#if showVideoFields}
          <div class="pl-5 space-y-3">
            <div>
              <label for="videoId" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">YouTube Video ID</label>
              <input 
                type="text" 
                id="videoId" 
                bind:value={post.banner.videoId} 
                placeholder="dQw4w9WgXcQ" 
                class="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-l text-sm text-neutral-900 dark:text-neutral-100" 
              />
              <p class="text-xs text-neutral-500 mt-1">The ID from the YouTube URL (e.g., youtube.com/watch?v=<strong>dQw4w9WgXcQ</strong>)</p>
              
              {#if post.banner.videoId}
                <div class="mt-2 p-2 bg-neutral-100 dark:bg-neutral-800 rounded">
                  <p class="text-xs mb-1">Video Preview:</p>
                  <div class="relative pt-[56.25%] bg-black">
                    <iframe 
                      src={`https://www.youtube.com/embed/${post.banner.videoId}?autoplay=0&controls=1`}
                      title="YouTube video preview" 
                      class="absolute top-0 left-0 w-full h-full"
                      frameborder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
                    ></iframe>
                  </div>
                </div>
              {/if}
            </div>
          </div>
        {/if}
        
        <!-- Advanced Options toggle switch -->
        <div class="mt-6 border-t border-neutral-200 dark:border-neutral-700 pt-4">
          <div class="flex items-center mb-2">
            <input 
              type="checkbox" 
              id="enable-advanced" 
              bind:checked={post.showAdvancedOptions} 
              class="mr-2" 
            />
            <label for="enable-advanced" class="text-sm font-medium text-neutral-700 dark:text-neutral-300">Advanced Options</label>
          </div>
          
          {#if showAdvancedFields}
            <div class="mt-4 space-y-4 border-l-2 border-blue-100 dark:border-blue-900 pl-4">
              <!-- Author section -->
              <div class="space-y-3">
                <h4 class="text-sm font-medium text-neutral-600 dark:text-neutral-400">Custom Author</h4>
                
                <div>
                  <label for="authorName" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Author Name</label>
                  <input 
                    type="text" 
                    id="authorName" 
                    bind:value={post.advanced.authorName} 
                    class="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-l text-sm text-neutral-900 dark:text-neutral-100" 
                  />
                </div>
                
                <div>
                  <label for="authorBio" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Author Bio</label>
                  <input 
                    type="text" 
                    id="authorBio" 
                    bind:value={post.advanced.authorBio} 
                    class="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-l text-sm text-neutral-900 dark:text-neutral-100" 
                  />
                </div>
                
                <div>
                  <label for="avatarImage" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Avatar Image URL</label>
                  <input 
                    type="text" 
                    id="avatarImage" 
                    bind:value={post.advanced.avatarImage} 
                    placeholder="/images/avatar.png" 
                    class="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-l text-sm text-neutral-900 dark:text-neutral-100" 
                  />
                  {#if post.advanced.avatarImage}
                    <div class="mt-2 p-2 bg-neutral-100 dark:bg-neutral-800 rounded">
                      <p class="text-xs mb-1">Avatar Preview:</p>
                      <img src={post.advanced.avatarImage} alt="Avatar Preview" class="h-12 w-12 rounded-full object-cover" on:error={(e) => e.target.style.display = 'none'} />
                    </div>
                  {/if}
                </div>
              </div>
              
              <!-- Image and Banner section -->
              <div class="space-y-3">
                <h4 class="text-sm font-medium text-neutral-600 dark:text-neutral-400">Image Settings</h4>
                
                <div class="flex items-center">
                  <input 
                    type="checkbox" 
                    id="showImageOnPost" 
                    bind:checked={post.advanced.showImageOnPost} 
                    class="mr-2" 
                  />
                  <label for="showImageOnPost" class="text-sm font-medium text-neutral-700 dark:text-neutral-300">Show Image on Post</label>
                </div>
                
                {#if post.banner.type === 'image'}
                  <div>
                    <label for="bannerImage" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Banner Image URL</label>
                    <input 
                      type="text" 
                      id="bannerImage" 
                      bind:value={post.advanced.bannerImage} 
                      placeholder="/images/banner.jpg" 
                      class="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-l text-sm text-neutral-900 dark:text-neutral-100" 
                    />
                    {#if post.advanced.bannerImage}
                      <div class="mt-2 p-2 bg-neutral-100 dark:bg-neutral-800 rounded">
                        <p class="text-xs mb-1">Banner Preview:</p>
                        <img src={post.advanced.bannerImage} alt="Banner Preview" class="w-full h-32 object-cover rounded" on:error={(e) => e.target.style.display = 'none'} />
                      </div>
                    {/if}
                  </div>
                {/if}
              </div>
              
              <!-- Language section -->
              <div>
                <label for="language" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Language</label>
                <select 
                  id="language" 
                  bind:value={post.advanced.lang} 
                  class="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-l text-sm text-neutral-900 dark:text-neutral-100"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="it">Italian</option>
                  <option value="pt">Portuguese</option>
                  <option value="ru">Russian</option>
                  <option value="zh">Chinese</option>
                  <option value="ja">Japanese</option>
                  <option value="ko">Korean</option>
                </select>
              </div>
            </div>
          {/if}
        </div>
      </div>
      
      <!-- Content Section -->
      <div class="space-y-4">
        <h2 class="text-xl font-semibold text-black/80 dark:text-white/80 mb-3">Content</h2>
        
        <div>
          <label for="content" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Post Content (Markdown/MDX)</label>
          <textarea 
            id="content" 
            bind:value={post.content} 
            rows="20" 
            class="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-l text-sm text-neutral-900 dark:text-neutral-100 font-mono text-neutral-900 dark:text-neutral-100"
          ></textarea>
        </div>
        
        <div class="pt-4">
          <h3 class="text-lg font-medium text-black/80 dark:text-white/80 mb-3">Preview</h3>
          <div class="p-4 bg-neutral-100 dark:bg-neutral-800 rounded min-h-[300px] markdown-content">
            {@html previewHtml}
          </div>
        </div>
      </div>
    </div>
  {/if}
  
  <!-- Action Buttons -->
  <div class="mt-8">
    <!-- File actions section -->
    <div class="mb-4">
      <h3 class="text-base font-medium text-neutral-700 dark:text-neutral-300 mb-2">Local File Actions</h3>
      <div class="flex flex-wrap gap-3">
        <button 
          on:click={clearForm}
          class="px-4 py-2 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 font-medium rounded hover:bg-red-200 dark:hover:bg-red-800 transition"
        >
          Clear
        </button>
        <button 
          on:click={saveDraft}
          class="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 font-medium rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition"
        >
          Save as Local Draft
        </button>
        <button 
          on:click={publishPost}
          disabled={!formValid}
          class="px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Download MDX
        </button>
      </div>
    </div>

    <!-- GitHub actions section -->
    <div>
      <h3 class="text-base font-medium text-neutral-700 dark:text-neutral-300 mb-2">GitHub Actions</h3>
      <div class="flex flex-wrap gap-3">
        <button 
          on:click={() => savePostToGitHub(true)}
          disabled={!isGitHubAuthenticated || isCommitting || !formValid}
          class="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 font-medium rounded transition-colors flex items-center justify-center disabled:opacity-50"
        >
          {#if isCommitting && !showDeployOptions}
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Saving Draft...
          {:else}
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
            Save Draft to GitHub
          {/if}
        </button>
        
        <button 
          on:click={() => savePostToGitHub(false)}
          disabled={!isGitHubAuthenticated || isCommitting || !formValid}
          class="px-4 py-2 bg-neutral-800 dark:bg-neutral-200 hover:bg-neutral-900 dark:hover:bg-neutral-300 text-white dark:text-neutral-800 font-medium rounded transition-colors flex items-center justify-center disabled:opacity-50"
        >
          {#if isCommitting && !showDeployOptions}
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Publishing Post...
          {:else}
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
            Publish to GitHub
          {/if}
        </button>
        
        {#if showDeployOptions}
          <button 
            on:click={triggerSiteRebuild}
            disabled={!isGitHubAuthenticated || isCommitting}
            class="px-4 py-2 bg-[var(--primary)] hover:opacity-90 text-white font-medium rounded transition-opacity flex items-center justify-center disabled:opacity-50"
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
              Deploy Site
            {/if}
          </button>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  :global(.markdown-content h1) {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }
  
  :global(.markdown-content h2) {
    font-size: 1.25rem;
    font-weight: bold;
    margin-bottom: 0.75rem;
  }
  
  :global(.markdown-content h3) {
    font-size: 1.125rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
  
  :global(.markdown-content p) {
    margin-bottom: 1rem;
  }
  
  :global(.markdown-content ul, .markdown-content ol) {
    margin-bottom: 1rem;
    padding-left: 1.5rem;
  }
  
  :global(.markdown-content ul) {
    list-style-type: disc;
  }
  
  :global(.markdown-content ol) {
    list-style-type: decimal;
  }
  
  :global(.markdown-content code) {
    font-family: monospace;
    background-color: rgba(0, 0, 0, 0.05);
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
  }
  
  :global(.markdown-content pre) {
    background-color: rgba(0, 0, 0, 0.05);
    padding: 0.5rem;
    border-radius: 0.25rem;
    overflow-x: auto;
    margin-bottom: 1rem;
  }
  
  :global(.markdown-content blockquote) {
    border-left: 4px solid rgba(0, 0, 0, 0.1);
    padding-left: 1rem;
    font-style: italic;
    margin-bottom: 1rem;
  }
  
  :global(.markdown-content img) {
    max-width: 100%;
    height: auto;
    margin: 1rem 0;
    border-radius: 0.25rem;
  }
</style>