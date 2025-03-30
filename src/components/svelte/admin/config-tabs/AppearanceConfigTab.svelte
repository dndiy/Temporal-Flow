<script>
  import { createEventDispatcher, onMount } from 'svelte';
  
  // Props
  export let siteConfig;
  
  // Local state
  let editingFavicon = null;
  let showFaviconEditor = false;
  let uploadingFavicon = false;
  let themePreview = '';
  
  // Banner & Avatar specific states
  let bannerType = siteConfig.banner?.type || 'image';
  let bannerMode = siteConfig.banner?.mode || 'sequence';
  let avatarMode = siteConfig.avatar?.mode || 'single';
  let uploadingBanner = false;
  let uploadingAvatar = false;
  let uploadingBannerSequence = false;
  let uploadingAvatarSequence = false;
  let selectedBannerIndex = 0;
  let selectedAvatarIndex = 0;
  
  // Timeline banner form data
  let timelineBannerData = {
    title: siteConfig.banner?.timelineData?.title || '',
    category: siteConfig.banner?.timelineData?.category || '',
    startYear: siteConfig.banner?.timelineData?.startYear || 1900,
    endYear: siteConfig.banner?.timelineData?.endYear || 2025,
    height: siteConfig.banner?.timelineData?.height || '70vh',
    compact: siteConfig.banner?.timelineData?.compact || false,
    background: siteConfig.banner?.timelineData?.background || '/public/posts/timeline/universe.png'
  };
  
  // Video banner form data
  let videoBannerData = {
    videoId: siteConfig.banner?.videoData?.videoId || '',
    platform: siteConfig.banner?.videoData?.platform || 'youtube'
  };
  
  // Ensure the config objects exist with defaults
  if (!siteConfig.banner) {
    siteConfig.banner = {
      type: 'image',
      mode: 'sequence',
      images: [],
      timelineData: {},
      videoData: {}
    };
  }
  
  if (!siteConfig.avatar) {
    siteConfig.avatar = {
      mode: 'single',
      homeAvatar: '',
      avatarList: []
    };
  }
  
  // Event dispatcher
  const dispatch = createEventDispatcher();
  
  // Initialize theme preview
  onMount(() => {
    updateThemePreview();
    
    // Initialize banner and avatar types from config
    if (siteConfig.banner) {
      bannerType = siteConfig.banner.type || 'image';
      bannerMode = siteConfig.banner.mode || 'sequence';
    }
    
    if (siteConfig.avatar) {
      avatarMode = siteConfig.avatar.mode || 'single';
    }
  });
  
  // Function to update theme preview
  function updateThemePreview() {
    themePreview = `hsl(${siteConfig.themeColor.hue}, 65%, 50%)`;
  }
  
  // Function to handle hue change
  function handleHueChange() {
    updateThemePreview();
    dispatch('change', siteConfig);
  }
  
  // Banner type change handler
  function handleBannerTypeChange() {
    siteConfig.banner.type = bannerType;
    dispatch('change', siteConfig);
  }
  
  // Banner mode change handler
  function handleBannerModeChange() {
    siteConfig.banner.mode = bannerMode;
    dispatch('change', siteConfig);
  }
  
  // Avatar mode change handler
  function handleAvatarModeChange() {
    siteConfig.avatar.mode = avatarMode;
    dispatch('change', siteConfig);
  }
  
  // Timeline data change handler
  function handleTimelineDataChange() {
    siteConfig.banner.timelineData = { ...timelineBannerData };
    dispatch('change', siteConfig);
  }
  
  // Video data change handler
  function handleVideoDataChange() {
    siteConfig.banner.videoData = { ...videoBannerData };
    dispatch('change', siteConfig);
  }
  
  // Function to upload a banner image
  function uploadBannerImage() {
    uploadingBanner = true;
    
    // Simulate a file upload with a delay
    setTimeout(() => {
      // Add a placeholder image URL
      if (!siteConfig.banner.images) {
        siteConfig.banner.images = [];
      }
      
      const newImage = `/api/placeholder/1920/1080?text=Banner+${siteConfig.banner.images.length + 1}`;
      siteConfig.banner.images.push(newImage);
      
      if (bannerMode === 'single') {
        // Set as default banner if in single mode
        siteConfig.banner.defaultBanner = newImage;
      }
      
      uploadingBanner = false;
      dispatch('change', siteConfig);
    }, 1500);
  }
  
  // Function to upload avatar image
  function uploadAvatarImage() {
    uploadingAvatar = true;
    
    // Simulate a file upload with a delay
    setTimeout(() => {
      // Add a placeholder image URL
      if (!siteConfig.avatar.avatarList) {
        siteConfig.avatar.avatarList = [];
      }
      
      const newAvatar = `/api/placeholder/512/512?text=Avatar+${siteConfig.avatar.avatarList.length + 1}`;
      siteConfig.avatar.avatarList.push(newAvatar);
      
      if (avatarMode === 'single') {
        // Set as home avatar if in single mode
        siteConfig.avatar.homeAvatar = newAvatar;
      }
      
      uploadingAvatar = false;
      dispatch('change', siteConfig);
    }, 1500);
  }
  
  // Function to upload banner sequence
  function uploadBannerSequence() {
    uploadingBannerSequence = true;
    
    // Simulate a sequence upload with a delay
    setTimeout(() => {
      // Add 5 placeholder image URLs
      if (!siteConfig.banner.images) {
        siteConfig.banner.images = [];
      }
      
      for (let i = 1; i <= 5; i++) {
        siteConfig.banner.images.push(`/api/placeholder/1920/1080?text=Banner+Sequence+${i}`);
      }
      
      uploadingBannerSequence = false;
      dispatch('change', siteConfig);
    }, 2000);
  }
  
  // Function to upload avatar sequence
  function uploadAvatarSequence() {
    uploadingAvatarSequence = true;
    
    // Simulate a sequence upload with a delay
    setTimeout(() => {
      // Add 5 placeholder image URLs
      if (!siteConfig.avatar.avatarList) {
        siteConfig.avatar.avatarList = [];
      }
      
      for (let i = 1; i <= 5; i++) {
        siteConfig.avatar.avatarList.push(`/api/placeholder/512/512?text=Avatar+Sequence+${i}`);
      }
      
      uploadingAvatarSequence = false;
      dispatch('change', siteConfig);
    }, 2000);
  }
  
  // Function to select a banner as default
  function selectDefaultBanner(index) {
    selectedBannerIndex = index;
    siteConfig.banner.defaultBanner = siteConfig.banner.images[index];
    dispatch('change', siteConfig);
  }
  
  // Function to select a home avatar
  function selectHomeAvatar(index) {
    selectedAvatarIndex = index;
    siteConfig.avatar.homeAvatar = siteConfig.avatar.avatarList[index];
    dispatch('change', siteConfig);
  }
  
  // Function to remove a banner image
  function removeBannerImage(index) {
    if (confirm('Are you sure you want to remove this banner image?')) {
      siteConfig.banner.images = siteConfig.banner.images.filter((_, i) => i !== index);
      
      // Update default banner if it was the one removed
      if (siteConfig.banner.defaultBanner === siteConfig.banner.images[index]) {
        siteConfig.banner.defaultBanner = siteConfig.banner.images[0] || '';
      }
      
      dispatch('change', siteConfig);
    }
  }
  
  // Function to remove an avatar image
  function removeAvatarImage(index) {
    if (confirm('Are you sure you want to remove this avatar image?')) {
      siteConfig.avatar.avatarList = siteConfig.avatar.avatarList.filter((_, i) => i !== index);
      
      // Update home avatar if it was the one removed
      if (siteConfig.avatar.homeAvatar === siteConfig.avatar.avatarList[index]) {
        siteConfig.avatar.homeAvatar = siteConfig.avatar.avatarList[0] || '';
      }
      
      dispatch('change', siteConfig);
    }
  }
  
  // Function to add a favicon
  function addFavicon() {
    editingFavicon = {
      isNew: true,
      data: {
        src: '',
        theme: 'light',
        sizes: ''
      }
    };
    showFaviconEditor = true;
  }
  
  // Function to edit a favicon
  function editFavicon(index) {
    editingFavicon = {
      isNew: false,
      index: index,
      data: { ...siteConfig.favicon[index] }
    };
    showFaviconEditor = true;
  }
  
  // Function to save favicon
  function saveFavicon() {
    if (editingFavicon.isNew) {
      // Add new favicon
      if (!siteConfig.favicon) {
        siteConfig.favicon = [];
      }
      siteConfig.favicon = [...siteConfig.favicon, editingFavicon.data];
    } else {
      // Update existing favicon
      const newFavicons = [...siteConfig.favicon];
      newFavicons[editingFavicon.index] = editingFavicon.data;
      siteConfig.favicon = newFavicons;
    }
    
    showFaviconEditor = false;
    dispatch('change', siteConfig);
  }
  
  // Function to delete favicon
  function deleteFavicon(index) {
    if (confirm('Are you sure you want to delete this favicon?')) {
      siteConfig.favicon = siteConfig.favicon.filter((_, i) => i !== index);
      dispatch('change', siteConfig);
    }
  }
  
  // Function to handle favicon upload
  function handleFaviconUpload() {
    // In a real implementation, this would upload to a server
    // For demo purposes, we'll simulate a delay
    uploadingFavicon = true;
    
    setTimeout(() => {
      // Set a demo favicon URL
      editingFavicon.data.src = '/api/placeholder/32/32';
      uploadingFavicon = false;
    }, 1500);
  }
</script>

<div class="appearance-config-tab">
  <div class="mb-6">
    <h2 class="text-xl font-semibold text-black/80 dark:text-white/80 mb-4">Appearance Settings</h2>
    <p class="text-neutral-600 dark:text-neutral-400 mb-4">
      Configure visual aspects of your site, including theme colors, banners, avatars, and icons.
    </p>
  </div>
  
  <!-- Banner Configuration Section -->
  <div class="bg-neutral-50 dark:bg-neutral-800/50 p-5 rounded-lg border border-neutral-200 dark:border-neutral-700 mb-8">
    <h3 class="text-lg font-medium text-black/80 dark:text-white/80 mb-3">Banner Configuration</h3>
    <p class="text-sm text-neutral-500 dark:text-neutral-400 mb-5">
      Configure the banner that appears at the top of your site
    </p>
    
    <!-- Banner Type Selection -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
        Banner Type
      </label>
      <div class="flex flex-wrap gap-3">
        <label class="flex items-center cursor-pointer">
          <input 
            type="radio" 
            bind:group={bannerType} 
            value="image" 
            on:change={handleBannerTypeChange}
            class="h-4 w-4 text-[var(--primary)] border-neutral-300" 
          />
          <span class="ml-2 text-sm text-neutral-700 dark:text-neutral-300">Image Banner</span>
        </label>
        
        <label class="flex items-center cursor-pointer">
          <input 
            type="radio" 
            bind:group={bannerType} 
            value="video" 
            on:change={handleBannerTypeChange}
            class="h-4 w-4 text-[var(--primary)] border-neutral-300" 
          />
          <span class="ml-2 text-sm text-neutral-700 dark:text-neutral-300">Video Banner</span>
        </label>
        
        <label class="flex items-center cursor-pointer">
          <input 
            type="radio" 
            bind:group={bannerType} 
            value="timeline" 
            on:change={handleBannerTypeChange}
            class="h-4 w-4 text-[var(--primary)] border-neutral-300" 
          />
          <span class="ml-2 text-sm text-neutral-700 dark:text-neutral-300">Timeline Banner</span>
        </label>
      </div>
    </div>
    
    <!-- Image Banner Config -->
    {#if bannerType === 'image'}
      <div class="mb-6 border-t border-neutral-200 dark:border-neutral-700 pt-5">
        <div class="flex justify-between items-center mb-4">
          <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Banner Mode
          </label>
          
          <div class="flex items-center space-x-2">
            <label class="flex items-center cursor-pointer">
              <input 
                type="radio" 
                bind:group={bannerMode} 
                value="single" 
                on:change={handleBannerModeChange}
                class="h-4 w-4 text-[var(--primary)] border-neutral-300" 
              />
              <span class="ml-2 text-sm text-neutral-700 dark:text-neutral-300">Single Image</span>
            </label>
            
            <label class="flex items-center cursor-pointer">
              <input 
                type="radio" 
                bind:group={bannerMode} 
                value="sequence" 
                on:change={handleBannerModeChange}
                class="h-4 w-4 text-[var(--primary)] border-neutral-300" 
              />
              <span class="ml-2 text-sm text-neutral-700 dark:text-neutral-300">Image Sequence</span>
            </label>
          </div>
        </div>
        
        <!-- Banner Upload Options -->
        <div class="mb-4 flex flex-wrap gap-3">
          <button 
            on:click={uploadBannerImage} 
            disabled={uploadingBanner}
            class="py-2 px-4 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-800 dark:text-neutral-200 text-sm font-medium rounded transition-colors flex items-center"
          >
            {#if uploadingBanner}
              <svg class="animate-spin mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            {:else}
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Upload Banner Image
            {/if}
          </button>
          
          {#if bannerMode === 'sequence'}
            <button 
              on:click={uploadBannerSequence} 
              disabled={uploadingBannerSequence}
              class="py-2 px-4 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-800 dark:text-neutral-200 text-sm font-medium rounded transition-colors flex items-center"
            >
              {#if uploadingBannerSequence}
                <svg class="animate-spin mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              {:else}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Upload Sequence
              {/if}
            </button>
          {/if}
        </div>
        
        <!-- Banner Images Gallery -->
        {#if siteConfig.banner?.images && siteConfig.banner.images.length > 0}
          <div class="mt-4">
            <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              {bannerMode === 'single' ? 'Select Banner Image' : 'Banner Sequence Images'}
            </label>
            
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
              {#each siteConfig.banner.images as image, index}
                <div class={`relative rounded-lg overflow-hidden border-2 transition-all ${siteConfig.banner.defaultBanner === image ? 'border-[var(--primary)]' : 'border-transparent hover:border-neutral-300 dark:hover:border-neutral-600'}`}>
                  <img src={image} alt={`Banner ${index + 1}`} class="w-full h-28 object-cover" />
                  
                  <div class="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {#if bannerMode === 'single' || !siteConfig.banner.defaultBanner || siteConfig.banner.defaultBanner !== image}
                      <button 
                        on:click={() => selectDefaultBanner(index)}
                        class="p-1.5 bg-white/90 rounded-full text-black hover:bg-white transition-colors"
                        title={bannerMode === 'single' ? 'Set as Banner' : 'Set as Default Banner'}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    {/if}
                    
                    <button 
                      on:click={() => removeBannerImage(index)}
                      class="p-1.5 bg-white/90 rounded-full text-red-500 hover:bg-white hover:text-red-600 transition-colors"
                      title="Remove Image"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  
                  {#if siteConfig.banner.defaultBanner === image}
                    <div class="absolute top-1 left-1 bg-[var(--primary)] text-white text-xs px-1.5 py-0.5 rounded">
                      {bannerMode === 'single' ? 'Selected' : 'Default'}
                    </div>
                  {/if}
                </div>
              {/each}
            </div>
          </div>
        {:else}
          <div class="bg-neutral-100 dark:bg-neutral-700/30 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 text-center mt-4">
            <p class="text-neutral-500 dark:text-neutral-400">No banner images uploaded yet. Please upload at least one image.</p>
          </div>
        {/if}
      </div>
    {/if}
    
    <!-- Video Banner Config -->
    {#if bannerType === 'video'}
      <div class="border-t border-neutral-200 dark:border-neutral-700 pt-5">
        <h4 class="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">Video Banner Settings</h4>
        
        <div class="space-y-4">
          <div>
            <label for="video-platform" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Video Platform
            </label>
            <select 
              id="video-platform" 
              bind:value={videoBannerData.platform}
              on:change={handleVideoDataChange}
              class="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-md text-sm transition"
            >
              <option value="youtube">YouTube</option>
              <option value="vimeo">Vimeo</option>
            </select>
          </div>
          
          <div>
            <label for="video-id" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Video ID
            </label>
            <input 
              type="text" 
              id="video-id" 
              bind:value={videoBannerData.videoId}
              on:input={handleVideoDataChange}
              class="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-md text-sm transition" 
              placeholder={videoBannerData.platform === 'youtube' ? 'e.g. dQw4w9WgXcQ' : 'e.g. 76979871'}
            />
            <p class="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              {#if videoBannerData.platform === 'youtube'}
                Enter the YouTube video ID (found in the URL after "v=")
              {:else if videoBannerData.platform === 'vimeo'}
                Enter the Vimeo video ID (the number at the end of the video URL)
              {/if}
            </p>
          </div>
          
          <!-- Video Preview -->
          {#if videoBannerData.videoId}
            <div class="mt-4">
              <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Video Preview
              </label>
              <div class="relative w-full pb-[56.25%] bg-black overflow-hidden rounded-lg">
                {#if videoBannerData.platform === 'youtube'}
                  <img 
                    src={`https://img.youtube.com/vi/${videoBannerData.videoId}/maxresdefault.jpg`} 
                    alt="Video thumbnail" 
                    class="absolute top-0 left-0 w-full h-full object-cover"
                  />
                {:else if videoBannerData.platform === 'vimeo'}
                  <div class="absolute inset-0 flex items-center justify-center bg-neutral-800">
                    <p class="text-white">Vimeo Thumbnail (ID: {videoBannerData.videoId})</p>
                  </div>
                {/if}
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="w-16 h-16 rounded-full bg-black/60 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          {/if}
        </div>
      </div>
    {/if}
    
    <!-- Timeline Banner Config -->
    {#if bannerType === 'timeline'}
      <div class="border-t border-neutral-200 dark:border-neutral-700 pt-5">
        <h4 class="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">Timeline Banner Settings</h4>
        
        <div class="space-y-4">
          <div>
            <label for="timeline-title" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Timeline Title
            </label>
            <input 
              type="text" 
              id="timeline-title" 
              bind:value={timelineBannerData.title}
              on:input={handleTimelineDataChange}
              class="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-md text-sm transition" 
              placeholder="e.g. History of Computing"
            />
          </div>
          
          <div>
            <label for="timeline-category" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Timeline Category
            </label>
            <input 
              type="text" 
              id="timeline-category" 
              bind:value={timelineBannerData.category}
              on:input={handleTimelineDataChange}
              class="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-md text-sm transition" 
              placeholder="e.g. technology"
            />
            <p class="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              Category determines which timeline events will be displayed
            </p>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="timeline-start-year" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Start Year
              </label>
              <input 
                type="number" 
                id="timeline-start-year" 
                bind:value={timelineBannerData.startYear}
                on:input={handleTimelineDataChange}
                class="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-md text-sm transition" 
              />
            </div>
            
            <div>
              <label for="timeline-end-year" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                End Year
              </label>
              <input 
                type="number" 
                id="timeline-end-year" 
                bind:value={timelineBannerData.endYear}
                on:input={handleTimelineDataChange}
                class="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-md text-sm transition" 
              />
            </div>
          </div>
          
          <div>
            <label for="timeline-height" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Banner Height
            </label>
            <input 
              type="text" 
              id="timeline-height" 
              bind:value={timelineBannerData.height}
              on:input={handleTimelineDataChange}
              class="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-md text-sm transition" 
              placeholder="e.g. 70vh"
            />
            <p class="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              CSS value for height (vh, px, rem, etc.)
            </p>
          </div>
          
          <div>
            <label for="timeline-background" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Background Image
            </label>
            <input 
              type="text" 
              id="timeline-background" 
              bind:value={timelineBannerData.background}
              on:input={handleTimelineDataChange}
              class="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-md text-sm transition" 
              placeholder="/public/posts/timeline/background.png"
            />
          </div>
          
          <div class="flex items-center">
            <input 
              type="checkbox" 
              id="timeline-compact" 
              bind:checked={timelineBannerData.compact}
              on:change={handleTimelineDataChange}
              class="h-4 w-4 text-[var(--primary)] border-neutral-300 dark:border-neutral-600 rounded" 
            />
            <label for="timeline-compact" class="ml-2 block text-sm text-neutral-700 dark:text-neutral-300">
              Compact Mode (use less vertical space)
            </label>
          </div>
        </div>
      </div>
    {/if}
  </div>
  
  <!-- Avatar Configuration Section -->
  <div class="bg-neutral-50 dark:bg-neutral-800/50 p-5 rounded-lg border border-neutral-200 dark:border-neutral-700 mb-8">
    <h3 class="text-lg font-medium text-black/80 dark:text-white/80 mb-3">Avatar Configuration</h3>
    <p class="text-sm text-neutral-500 dark:text-neutral-400 mb-5">
      Configure the profile avatar for your site and posts
    </p>
    
    <!-- Avatar Mode Selection -->
    <div class="mb-6">
      <div class="flex justify-between items-center mb-4">
        <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Avatar Mode
        </label>
        
        <div class="flex items-center space-x-2">
          <label class="flex items-center cursor-pointer">
            <input 
              type="radio" 
              bind:group={avatarMode} 
              value="single" 
              on:change={handleAvatarModeChange}
              class="h-4 w-4 text-[var(--primary)] border-neutral-300" 
            />
            <span class="ml-2 text-sm text-neutral-700 dark:text-neutral-300">Single Avatar</span>
          </label>
          
          <label class="flex items-center cursor-pointer">
            <input 
              type="radio" 
              bind:group={avatarMode} 
              value="sequence" 
              on:change={handleAvatarModeChange}
              class="h-4 w-4 text-[var(--primary)] border-neutral-300" 
            />
            <span class="ml-2 text-sm text-neutral-700 dark:text-neutral-300">Avatar Sequence</span>
          </label>
        </div>
      </div>
      
      <!-- Avatar Upload Options -->
      <div class="mb-4 flex flex-wrap gap-3">
        <button 
          on:click={uploadAvatarImage} 
          disabled={uploadingAvatar}
          class="py-2 px-4 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-800 dark:text-neutral-200 text-sm font-medium rounded transition-colors flex items-center"
        >
          {#if uploadingAvatar}
            <svg class="animate-spin mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Uploading...
          {:else}
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Upload Avatar
          {/if}
        </button>
        
        {#if avatarMode === 'sequence'}
          <button 
            on:click={uploadAvatarSequence} 
            disabled={uploadingAvatarSequence}
            class="py-2 px-4 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-800 dark:text-neutral-200 text-sm font-medium rounded transition-colors flex items-center"
          >
            {#if uploadingAvatarSequence}
              <svg class="animate-spin mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            {:else}
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Upload Sequence
            {/if}
          </button>
        {/if}
      </div>
      
      <!-- Avatar Images Gallery -->
      {#if siteConfig.avatar?.avatarList && siteConfig.avatar.avatarList.length > 0}
        <div class="mt-4">
          <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            {avatarMode === 'single' ? 'Select Avatar' : 'Avatar Sequence Images'}
          </label>
          
          <div class="grid grid-cols-3 md:grid-cols-5 gap-3">
            {#each siteConfig.avatar.avatarList as avatar, index}
              <div class={`relative rounded-lg overflow-hidden border-2 transition-all ${siteConfig.avatar.homeAvatar === avatar ? 'border-[var(--primary)]' : 'border-transparent hover:border-neutral-300 dark:hover:border-neutral-600'}`}>
                <img src={avatar} alt={`Avatar ${index + 1}`} class="w-full h-20 object-cover" />
                
                <div class="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {#if avatarMode === 'single' || !siteConfig.avatar.homeAvatar || siteConfig.avatar.homeAvatar !== avatar}
                    <button 
                      on:click={() => selectHomeAvatar(index)}
                      class="p-1.5 bg-white/90 rounded-full text-black hover:bg-white transition-colors"
                      title={avatarMode === 'single' ? 'Set as Avatar' : 'Set as Home Avatar'}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  {/if}
                  
                  <button 
                    on:click={() => removeAvatarImage(index)}
                    class="p-1.5 bg-white/90 rounded-full text-red-500 hover:bg-white hover:text-red-600 transition-colors"
                    title="Remove Avatar"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                
                {#if siteConfig.avatar.homeAvatar === avatar}
                  <div class="absolute top-1 left-1 bg-[var(--primary)] text-white text-xs px-1.5 py-0.5 rounded">
                    {avatarMode === 'single' ? 'Selected' : 'Home'}
                  </div>
                {/if}
              </div>
            {/each}
          </div>
        </div>
      {:else}
        <div class="bg-neutral-100 dark:bg-neutral-700/30 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 text-center mt-4">
          <p class="text-neutral-500 dark:text-neutral-400">No avatar images uploaded yet. Please upload at least one avatar.</p>
        </div>
      {/if}
      
      <!-- Avatar Animation Settings (For Sequence Mode) -->
      {#if avatarMode === 'sequence' && siteConfig.avatar?.avatarList && siteConfig.avatar.avatarList.length > 1}
        <div class="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-700">
          <h4 class="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">Animation Settings</h4>
          
          <div>
            <label for="avatar-interval" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Animation Interval (ms)
            </label>
            <div class="flex items-center gap-3">
              <input 
                type="range" 
                id="avatar-interval" 
                bind:value={siteConfig.avatar.animationInterval}
                min="1000" 
                max="10000" 
                step="500"
                on:input={() => dispatch('change', siteConfig)}
                class="flex-grow h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer" 
              />
              <input 
                type="number" 
                bind:value={siteConfig.avatar.animationInterval}
                min="1000" 
                max="10000" 
                step="500"
                on:input={() => dispatch('change', siteConfig)}
                class="w-20 px-2 py-1 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-md text-sm transition text-center" 
              />
            </div>
            <p class="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              Time in milliseconds between avatar transitions (1000ms = 1 second)
            </p>
          </div>
        </div>
      {/if}
    </div>
  </div>
  
  <!-- Theme Color Settings -->
  <div class="bg-neutral-50 dark:bg-neutral-800/50 p-5 rounded-lg border border-neutral-200 dark:border-neutral-700 mb-8">
    <h3 class="text-lg font-medium text-black/80 dark:text-white/80 mb-3">Theme Color</h3>
    
    <div class="space-y-4">
      <div class="flex items-center">
        <input 
          type="checkbox" 
          id="theme-fixed" 
          bind:checked={siteConfig.themeColor.fixed}
          on:change={() => dispatch('change', siteConfig)}
          class="h-4 w-4 text-[var(--primary)] border-neutral-300 dark:border-neutral-600 rounded" 
        />
        <label for="theme-fixed" class="ml-2 block text-sm text-neutral-700 dark:text-neutral-300">
          Use fixed theme color (don't allow user customization)
        </label>
      </div>
      
      <div>
        <label for="theme-hue" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          Base Hue (0-360)
        </label>
        <div class="flex items-center space-x-4">
          <input 
            type="range" 
            id="theme-hue" 
            min="0" 
            max="360" 
            step="1"
            bind:value={siteConfig.themeColor.hue}
            on:input={handleHueChange}
            class="flex-grow h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer" 
          />
          <input 
            type="number" 
            bind:value={siteConfig.themeColor.hue}
            on:input={handleHueChange}
            min="0" 
            max="360" 
            class="w-16 px-2 py-1 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-md text-sm transition text-center" 
          />
        </div>
      </div>
      
      <!-- Color Preview -->
      <div class="pt-2">
        <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          Preview
        </label>
        <div class="flex flex-wrap gap-3">
          <div class="w-16 h-16 rounded-lg shadow-sm" style="background-color: {themePreview};"></div>
          <div class="flex flex-col justify-between">
            <div class="text-sm font-medium" style="color: {themePreview};">Text Color Sample</div>
            <button class="px-3 py-1 text-white text-sm rounded" style="background-color: {themePreview};">
              Button Example
            </button>
          </div>
        </div>
      </div>
      
      <!-- Common Colors Quick Select -->
      <div class="pt-4 border-t border-neutral-200 dark:border-neutral-700">
        <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          Quick Select
        </label>
        <div class="flex flex-wrap gap-2">
          {#each [0, 30, 60, 120, 180, 210, 240, 270, 300, 330] as hue}
            <button 
              class="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 focus:scale-110"
              style="background-color: hsl({hue}, 65%, 50%); border-color: {siteConfig.themeColor.hue === hue ? 'white' : 'transparent'};"
              on:click={() => {
                siteConfig.themeColor.hue = hue;
                handleHueChange();
              }}
              title={`Hue: ${hue}°`}
            ></button>
          {/each}
        </div>
      </div>
    </div>
  </div>
  
  <!-- Favicon Settings -->
  <div class="bg-neutral-50 dark:bg-neutral-800/50 p-5 rounded-lg border border-neutral-200 dark:border-neutral-700">
    <div class="flex justify-between items-start mb-4">
      <div>
        <h3 class="text-lg font-medium text-black/80 dark:text-white/80">Favicon</h3>
        <p class="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          The small icon shown in browser tabs and bookmarks
        </p>
      </div>
      <button 
        class="py-1.5 px-3 bg-[var(--primary)] hover:opacity-90 text-white font-medium rounded-md transition-opacity text-sm flex items-center"
        on:click={addFavicon}
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        Add Favicon
      </button>
    </div>
    
    <div class="favicons-grid flex flex-wrap gap-3 mb-4">
      {#if !siteConfig.favicon || siteConfig.favicon.length === 0}
        <div class="w-full bg-neutral-100 dark:bg-neutral-700/30 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 text-center">
          <p class="text-neutral-500 dark:text-neutral-400">No custom favicons configured. Using default favicon.</p>
        </div>
      {:else}
        {#each siteConfig.favicon as favicon, index}
          <div class="favicon-item relative bg-white dark:bg-neutral-700 p-3 rounded-lg border border-neutral-200 dark:border-neutral-600 hover:border-[var(--primary)] transition-colors">
            <div class="w-16 h-16 flex items-center justify-center">
              <img src={favicon.src} alt="Favicon" class="max-w-full max-h-full" />
            </div>
            
            <div class="mt-2 text-center">
              <div class="text-xs font-medium text-neutral-900 dark:text-neutral-100">
                {favicon.sizes || 'Default'}
              </div>
              <div class="text-xs text-neutral-500 dark:text-neutral-400">
                {favicon.theme || 'All themes'}
              </div>
            </div>
            
            <div class="absolute top-1 right-1 flex space-x-1">
              <button 
                class="text-neutral-400 hover:text-[var(--primary)] bg-white dark:bg-neutral-700 rounded-full p-1 w-6 h-6 flex items-center justify-center shadow-sm"
                title="Edit Favicon"
                on:click={() => editFavicon(index)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button 
                class="text-neutral-400 hover:text-red-500 bg-white dark:bg-neutral-700 rounded-full p-1 w-6 h-6 flex items-center justify-center shadow-sm"
                title="Delete Favicon"
                on:click={() => deleteFavicon(index)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        {/each}
      {/if}
    </div>
    
    <div class="text-sm bg-neutral-100 dark:bg-neutral-700/30 p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 mb-2">
      <h4 class="font-medium text-black/80 dark:text-white/80 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Tips for favicons:
      </h4>
      <ul class="mt-2 space-y-1 list-disc pl-5 text-neutral-600 dark:text-neutral-400 text-xs">
        <li>Create square images (recommended sizes: 16x16, 32x32, 180x180)</li>
        <li>Use PNG format for best compatibility</li>
        <li>You can add different favicons for light and dark themes</li>
        <li>If no favicons are added, the default site favicon will be used</li>
      </ul>
    </div>
  </div>
  
  <!-- Favicon Editor Modal -->
  {#if showFaviconEditor}
    <div class="fixed inset-0 bg-black/50 dark:bg-black/60 z-50 flex items-center justify-center">
      <div class="bg-white dark:bg-neutral-800 rounded-lg max-w-lg w-full overflow-auto shadow-lg">
        <div class="p-5">
          <h3 class="text-xl font-semibold text-black/80 dark:text-white/80 mb-4">
            {editingFavicon.isNew ? 'Add Favicon' : 'Edit Favicon'}
          </h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Favicon Image
              </label>
              <div class="flex items-center space-x-3">
                <div class="w-16 h-16 bg-neutral-100 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded flex items-center justify-center overflow-hidden">
                  {#if editingFavicon.data.src}
                    <img src={editingFavicon.data.src} alt="Favicon Preview" class="max-w-full max-h-full" />
                  {:else}
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  {/if}
                </div>
                
                <div class="flex-1">
                  <button 
                    class="w-full py-2 px-3 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-300 rounded text-sm transition-colors flex items-center justify-center"
                    on:click={handleFaviconUpload}
                    disabled={uploadingFavicon}
                  >
                    {#if uploadingFavicon}
                      <svg class="animate-spin mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    {:else}
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      Upload Image
                    {/if}
                  </button>
                </div>
              </div>
            </div>
            
            <div>
              <label for="favicon-src" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Favicon Path
              </label>
              <input 
                type="text" 
                id="favicon-src" 
                bind:value={editingFavicon.data.src}
                class="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-md text-sm transition" 
                placeholder="/favicon/icon-32x32.png"
              />
              <p class="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                Path to the favicon, relative to the /public directory
              </p>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="favicon-theme" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Theme
                </label>
                <select 
                  id="favicon-theme" 
                  bind:value={editingFavicon.data.theme}
                  class="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-md text-sm transition"
                >
                  <option value="">All Themes</option>
                  <option value="light">Light Mode Only</option>
                  <option value="dark">Dark Mode Only</option>
                </select>
              </div>
              
              <div>
                <label for="favicon-sizes" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Size
                </label>
                <input 
                  type="text" 
                  id="favicon-sizes" 
                  bind:value={editingFavicon.data.sizes}
                  class="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-md text-sm transition" 
                  placeholder="e.g. 32x32"
                />
              </div>
            </div>
          </div>
          
          <div class="flex justify-end space-x-3 mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-700">
            <button 
              type="button"
              class="px-4 py-2 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
              on:click={() => showFaviconEditor = false}
            >
              Cancel
            </button>
            
            <button 
              type="button"
              class="px-4 py-2 bg-[var(--primary)] hover:opacity-90 text-white font-medium rounded-md transition-opacity"
              on:click={saveFavicon}
              disabled={!editingFavicon.data.src}
            >
              {editingFavicon.isNew ? 'Add Favicon' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>