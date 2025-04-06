<script>
  import { createEventDispatcher } from 'svelte';
  
  // Props
  export let bannerConfig;
  
  // Event dispatcher
  const dispatch = createEventDispatcher();
  
  // Handle changes to configuration
  function handleChange() {
    dispatch('change', bannerConfig);
  }
</script>

<!-- Banner Settings -->
<div class="bg-neutral-50 dark:bg-neutral-800/50 p-5 rounded-lg border border-neutral-200 dark:border-neutral-700 mb-8">
  <h3 class="text-lg font-medium text-black/80 dark:text-white/80 mb-3">Banner Settings</h3>
  
  <div class="space-y-6">
    <!-- Animation Settings -->
    <div>
      <h4 class="text-md font-medium text-black/80 dark:text-white/80 mb-3">Animation Settings</h4>
      
      <div class="space-y-4">
        <div class="flex items-center">
          <input 
            type="checkbox" 
            id="banner-animation-enabled" 
            bind:checked={bannerConfig.animation.enabled}
            on:change={handleChange}
            class="h-4 w-4 text-[var(--primary)] border-neutral-300 dark:border-neutral-600 rounded" 
          />
          <label for="banner-animation-enabled" class="ml-2 block text-sm text-neutral-700 dark:text-neutral-300">
            Enable Banner Animation
          </label>
        </div>
        
        <div>
          <label for="banner-animation-interval" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Animation Interval (ms)
          </label>
          <div class="flex items-center space-x-4">
            <input 
              type="range" 
              id="banner-animation-interval" 
              min="1000" 
              max="10000" 
              step="500"
              bind:value={bannerConfig.animation.interval}
              on:input={handleChange}
              class="flex-grow h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer" 
              disabled={!bannerConfig.animation.enabled}
            />
            <input 
              type="number" 
              bind:value={bannerConfig.animation.interval}
              on:input={handleChange}
              min="1000" 
              max="10000" 
              step="500"
              class="w-24 px-2 py-1 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-md text-sm transition text-center" 
              disabled={!bannerConfig.animation.enabled}
            />
          </div>
        </div>
        
        <div>
          <label for="banner-transition-duration" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Transition Duration (ms)
          </label>
          <div class="flex items-center space-x-4">
            <input 
              type="range" 
              id="banner-transition-duration" 
              min="100" 
              max="2000" 
              step="100"
              bind:value={bannerConfig.animation.transitionDuration}
              on:input={handleChange}
              class="flex-grow h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer" 
              disabled={!bannerConfig.animation.enabled}
            />
            <input 
              type="number" 
              bind:value={bannerConfig.animation.transitionDuration}
              on:input={handleChange}
              min="100" 
              max="2000" 
              step="100"
              class="w-24 px-2 py-1 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-md text-sm transition text-center" 
              disabled={!bannerConfig.animation.enabled}
            />
          </div>
        </div>
        
        <div>
          <label for="banner-animation-direction" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Animation Direction
          </label>
          <select 
            id="banner-animation-direction" 
            bind:value={bannerConfig.animation.direction}
            on:change={handleChange}
            class="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-md text-sm text-neutral-900 dark:text-neutral-100"
            disabled={!bannerConfig.animation.enabled}
          >
            <option value="forward">Forward</option>
            <option value="reverse">Reverse</option>
            <option value="alternate">Alternate</option>
          </select>
        </div>
      </div>
    </div>
    
    <!-- Layout Settings -->
    <div>
      <h4 class="text-md font-medium text-black/80 dark:text-white/80 mb-3">Layout Settings</h4>
      
      <div class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="banner-height-desktop" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Desktop Height
            </label>
            <input 
              type="text" 
              id="banner-height-desktop" 
              bind:value={bannerConfig.layout.height.desktop}
              on:input={handleChange}
              class="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-md text-sm"
              placeholder="e.g., 50vh"
            />
          </div>
          <div>
            <label for="banner-height-mobile" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Mobile Height
            </label>
            <input 
              type="text" 
              id="banner-height-mobile" 
              bind:value={bannerConfig.layout.height.mobile}
              on:input={handleChange}
              class="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-md text-sm"
              placeholder="e.g., 30vh"
            />
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="banner-overlap-desktop" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Desktop Content Overlap
            </label>
            <input 
              type="text" 
              id="banner-overlap-desktop" 
              bind:value={bannerConfig.layout.overlap.desktop}
              on:input={handleChange}
              class="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-md text-sm"
              placeholder="e.g., 3.5rem"
            />
          </div>
          <div>
            <label for="banner-overlap-mobile" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Mobile Content Overlap
            </label>
            <input 
              type="text" 
              id="banner-overlap-mobile" 
              bind:value={bannerConfig.layout.overlap.mobile}
              on:input={handleChange}
              class="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-md text-sm"
              placeholder="e.g., 2rem"
            />
          </div>
        </div>
        
        <div>
          <label for="banner-max-width" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Maximum Width (px)
          </label>
          <input 
            type="number" 
            id="banner-max-width" 
            bind:value={bannerConfig.layout.maxWidth}
            on:input={handleChange}
            class="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-md text-sm"
            placeholder="e.g., 1920"
          />
        </div>
      </div>
    </div>
    
    <!-- Visual Settings -->
    <div>
      <h4 class="text-md font-medium text-black/80 dark:text-white/80 mb-3">Visual Settings</h4>
      
      <div class="space-y-4">
        <div>
          <label for="banner-object-fit" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Image Fit
          </label>
          <select 
            id="banner-object-fit" 
            bind:value={bannerConfig.visual.objectFit}
            on:change={handleChange}
            class="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-md text-sm text-neutral-900 dark:text-neutral-100"
          >
            <option value="cover">Cover</option>
            <option value="contain">Contain</option>
            <option value="fill">Fill</option>
          </select>
        </div>
        
        <div>
          <label for="banner-object-position" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Image Position
          </label>
          <input 
            type="text" 
            id="banner-object-position" 
            bind:value={bannerConfig.visual.objectPosition}
            on:input={handleChange}
            class="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-md text-sm"
            placeholder="e.g., center"
          />
        </div>
        
        <div>
          <label for="banner-border-radius" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Border Radius
          </label>
          <input 
            type="text" 
            id="banner-border-radius" 
            bind:value={bannerConfig.visual.borderRadius}
            on:input={handleChange}
            class="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-md text-sm"
            placeholder="e.g., 0.5rem"
          />
        </div>
        
        <div class="flex items-center">
          <input 
            type="checkbox" 
            id="banner-apply-gradient" 
            bind:checked={bannerConfig.visual.applyGradientOverlay}
            on:change={handleChange}
            class="h-4 w-4 text-[var(--primary)] border-neutral-300 dark:border-neutral-600 rounded" 
          />
          <label for="banner-apply-gradient" class="ml-2 block text-sm text-neutral-700 dark:text-neutral-300">
            Apply Gradient Overlay
          </label>
        </div>
        
        <div>
          <label for="banner-gradient-overlay" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Gradient Overlay
          </label>
          <input 
            type="text" 
            id="banner-gradient-overlay" 
            bind:value={bannerConfig.visual.gradientOverlay}
            on:input={handleChange}
            class="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-md text-sm"
            placeholder="e.g., linear-gradient(to bottom, rgba(0,0,0,0.2), transparent)"
            disabled={!bannerConfig.visual.applyGradientOverlay}
          />
        </div>
      </div>
    </div>
    
    <!-- Fallback Settings -->
    <div>
      <h4 class="text-md font-medium text-black/80 dark:text-white/80 mb-3">Fallback Settings</h4>
      
      <div class="space-y-4">
        <div class="flex items-center">
          <input 
            type="checkbox" 
            id="banner-fallback-enabled" 
            bind:checked={bannerConfig.fallback.enabled}
            on:change={handleChange}
            class="h-4 w-4 text-[var(--primary)] border-neutral-300 dark:border-neutral-600 rounded" 
          />
          <label for="banner-fallback-enabled" class="ml-2 block text-sm text-neutral-700 dark:text-neutral-300">
            Enable Fallback
          </label>
        </div>
        
        <div>
          <label for="banner-fallback-type" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Fallback Type
          </label>
          <select 
            id="banner-fallback-type" 
            bind:value={bannerConfig.fallback.type}
            on:change={handleChange}
            class="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-md text-sm text-neutral-900 dark:text-neutral-100"
            disabled={!bannerConfig.fallback.enabled}
          >
            <option value="color">Solid Color</option>
            <option value="gradient">Gradient</option>
          </select>
        </div>
        
        <div>
          <label for="banner-fallback-value" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Fallback Value
          </label>
          <input 
            type="text" 
            id="banner-fallback-value" 
            bind:value={bannerConfig.fallback.value}
            on:input={handleChange}
            class="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-md text-sm"
            placeholder="e.g., #f8f9fa or linear-gradient(...)"
            disabled={!bannerConfig.fallback.enabled}
          />
        </div>
      </div>
    </div>
  </div>
</div>