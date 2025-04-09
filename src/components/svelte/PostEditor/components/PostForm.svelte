<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import { marked } from 'marked';
  import { Post, generateSlugFromTitle } from '../utils/postUtils';
  
  // Initialize event dispatcher
  const dispatch = createEventDispatcher<{
    clear: void;
    autosave: { post: Post };
  }>();
  
  // Props
  export let post: Post;
  export let isEditing = false;
  
  // Derived values
  $: tagsArray = typeof post.tags === 'string' ? 
    (post.tags ? post.tags.split(',').map(tag => tag.trim()) : []) : 
    post.tags;
  $: previewHtml = post.content ? marked(post.content) : '';
  $: showVideoFields = post.banner.type === 'video';
  $: showTimelineFields = post.timelineData.enabled;
  $: showAdvancedFields = post.showAdvancedOptions;
  
  // Generate slug from title
  function generateSlug() {
    if (post.title) {
      post.slug = generateSlugFromTitle(post.title);
    }
  }
  
  // Clear the form
  function clearForm() {
    dispatch('clear');
  }
  
  // Auto-save draft
  onMount(() => {
    // Auto-save draft every 30 seconds if there's content
    const autoSaveInterval = setInterval(() => {
      if (post.title) {
        dispatch('autosave', { post });
      }
    }, 30000);
    
    return () => {
      clearInterval(autoSaveInterval);
    };
  });
</script>

<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
  <!-- Frontmatter Section -->
  <div class="space-y-4">
    <h2 class="text-xl font-semibold text-black/80 dark:text-white/80 mb-3">{isEditing ? 'Edit Post' : 'Post Information'}</h2>
    
    <div>
      <label for="title" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Title*</label>
      <input 
        type="text" 
        id="title" 
        bind:value={post.title} 
        on:blur={generateSlug}
        class="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded text-sm text-neutral-900 dark:text-neutral-100" 
        required 
      />
    </div>
    
    <div>
      <label for="description" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Description*</label>
      <input 
        type="text" 
        id="description" 
        bind:value={post.description} 
        class="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded text-sm text-neutral-900 dark:text-neutral-100" 
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
        class="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded text-sm text-neutral-900 dark:text-neutral-100" 
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
        class="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded text-sm text-neutral-900 dark:text-neutral-100" 
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
        class="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded text-sm text-neutral-900 dark:text-neutral-100" 
      />
      {#if tagsArray && tagsArray.length > 0}
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
        class="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded text-sm text-neutral-900 dark:text-neutral-100" 
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
              class="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded text-sm text-neutral-900 dark:text-neutral-100" 
            />
          </div>
          
          <div>
            <label for="timelineEra" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Timeline Era</label>
            <select 
              id="timelineEra" 
              bind:value={post.timelineData.era} 
              class="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded text-sm text-neutral-900 dark:text-neutral-100"
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
              class="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded text-sm text-neutral-900 dark:text-neutral-100" 
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
        class="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded text-sm text-neutral-900 dark:text-neutral-100"
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
            class="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded text-sm text-neutral-900 dark:text-neutral-100" 
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
                class="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded text-sm text-neutral-900 dark:text-neutral-100" 
              />
            </div>
            
            <div>
              <label for="authorBio" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Author Bio</label>
              <input 
                type="text" 
                id="authorBio" 
                bind:value={post.advanced.authorBio} 
                class="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded text-sm text-neutral-900 dark:text-neutral-100" 
              />
            </div>
            
            <div>
              <label for="avatarImage" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Avatar Image URL</label>
              <input 
                type="text" 
                id="avatarImage" 
                bind:value={post.advanced.avatarImage} 
                placeholder="/images/avatar.png" 
                class="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded text-sm text-neutral-900 dark:text-neutral-100" 
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
                  class="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded text-sm text-neutral-900 dark:text-neutral-100" 
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
              class="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded text-sm text-neutral-900 dark:text-neutral-100"
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
        class="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded text-sm font-mono text-neutral-900 dark:text-neutral-100"
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