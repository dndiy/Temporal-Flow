<script>
  import { onMount } from 'svelte';
  import { isFriendContentEnabled, getFriendPostsAsEntries } from '../../../stores/friendStore';
  import { postCardConfig } from '../../../config/postcard.config';
  
  // Using onMount to ensure browser APIs are only accessed client-side
  onMount(() => {
    console.log("FriendContentIntegrator mounted");
    console.log("postCardConfig available:", !!postCardConfig);
    
    // Check authentication status
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    // Check if friend content is enabled
    const friendContentEnabled = isFriendContentEnabled();
    
    console.log("Auth status:", isAuthenticated, "Friend content enabled:", friendContentEnabled);
    
    // Only proceed if authenticated and enabled
    if (!isAuthenticated || !friendContentEnabled) return;
    
    // Create default friend config in case postCardConfig is missing
    const defaultFriendConfig = {
      friendStyling: {
        indicatorType: 'border',
        indicatorColor: '#4f46e5',
        showFriendAvatar: true,
        avatarSize: 'w-6 h-6'
      },
      attribution: {
        showAttribution: true,
        attributionText: 'From [friendName]',
        linkToFriendSite: true
      },
      behavior: {
        sortingMethod: 'date',
        mergeWithLocalPosts: true
      }
    };
    
    // Integration function that reuses your PostCard component
    function integrateFriendPosts() {
      try {
        console.log("Integrating friend posts...");
        
        // Get the posts container
        const postsContainer = document.getElementById('posts-container');
        if (!postsContainer) {
          console.error('Posts container not found');
          return;
        }
        
        // Remove any existing friend posts to avoid duplicates
        const existingFriendPosts = document.querySelectorAll('[data-friend-content="true"]');
        existingFriendPosts.forEach(post => post.remove());
        
        // Get friend posts as entry-compatible objects
        const friendEntries = getFriendPostsAsEntries();
        console.log("Raw friend entries:", friendEntries);
        
        if (friendEntries.length === 0) return;
        
        console.log(`Integrating ${friendEntries.length} friend posts`);
        
        // Debug local posts date attributes
        const localPosts = postsContainer.querySelectorAll('.local-post');
        console.log(`Found ${localPosts.length} local posts`);
        if (localPosts.length > 0) {
          const samplePost = localPosts[0];
          console.log('Sample local post data attributes:', {
            timestamp: samplePost.getAttribute('data-post-timestamp'),
            date: samplePost.getAttribute('data-post-date'),
            type: samplePost.getAttribute('data-post-type')
          });
        }
        
        // Find a local PostCard to clone its structure
        const localPostCard = postsContainer.querySelector('.card-base');
        if (!localPostCard) {
          console.error('No local post card found to use as template');
          return;
        }
        
        // Safely get friend config, using defaults if needed
        const friendConfig = (postCardConfig && postCardConfig.friendPosts) ? 
          postCardConfig.friendPosts : defaultFriendConfig;
        
        // For each friend post, clone and modify a local post card
        friendEntries.forEach((entry, index) => {
          try {
            // Enhanced debugging for the first few entries
            if (index < 3) {
              console.log(`Friend entry ${index} details:`, {
                id: entry.id,
                title: entry.data.title,
                slug: entry.slug,
                published: entry.data.published,
                publishedType: typeof entry.data.published,
                publishedIsDate: entry.data.published instanceof Date,
                publishedValue: entry.data.published instanceof Date 
                  ? entry.data.published.toISOString() 
                  : String(entry.data.published),
                image: entry.data.image,
                imageType: typeof entry.data.image,
                sourceUrl: entry.data.sourceUrl,
                friendName: entry.data.friendName,
                friendUrl: entry.data.friendUrl
              });
            }
            
            // Handle date carefully - make sure we have a valid Date object
            let publishedDate;
            let timestamp;
            let dateStr;
            
            // Case 1: Already a Date object
            if (entry.data.published instanceof Date) {
              publishedDate = entry.data.published;
            }
            // Case 2: ISO date string
            else if (typeof entry.data.published === 'string' && entry.data.published.match(/^\d{4}-\d{2}-\d{2}/)) {
              publishedDate = new Date(entry.data.published);
            }
            // Case 3: Other string format
            else if (typeof entry.data.published === 'string') {
              // Try parsing with Date.parse
              const parsedMs = Date.parse(entry.data.published);
              if (!isNaN(parsedMs)) {
                publishedDate = new Date(parsedMs);
              } else {
                // Try extracting date with regex
                const dateMatch = entry.data.published.match(/\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{4}|\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}/i);
                if (dateMatch) {
                  publishedDate = new Date(dateMatch[0]);
                } else {
                  console.warn(`Could not parse date: ${entry.data.published}`);
                  publishedDate = new Date();
                }
              }
            }
            // Default case
            else {
              console.warn(`Unknown date format for entry ${entry.id}`);
              publishedDate = new Date();
            }
            
            // Check if we got a valid date
            if (isNaN(publishedDate.getTime())) {
              console.warn(`Invalid date for entry ${entry.id}: ${entry.data.published}`);
              publishedDate = new Date();
            }
            
            timestamp = publishedDate.getTime();
            dateStr = publishedDate.toISOString().split('T')[0];
            
            if (index < 3) {
              console.log(`Friend entry ${index} processed date:`, {
                original: entry.data.published,
                parsed: publishedDate,
                timestamp,
                dateStr
              });
            }
            
            // Clone the structure of a local post card
            const friendPostElement = localPostCard.cloneNode(true);
            
            // Add friend-specific attributes and classes
            friendPostElement.setAttribute('data-friend-content', 'true');
            friendPostElement.setAttribute('data-post-id', entry.id);
            friendPostElement.setAttribute('data-post-type', 'friend');
            friendPostElement.setAttribute('data-post-timestamp', timestamp);
            friendPostElement.setAttribute('data-post-date', dateStr);
            friendPostElement.setAttribute('data-post-category', (entry.data.category || 'uncategorized').toLowerCase());
            friendPostElement.setAttribute('data-post-tags', (entry.data.tags || []).join(',').toLowerCase());
            
            // Apply the configured indicator style (with safety checks)
            if (friendConfig.friendStyling && friendConfig.friendStyling.indicatorType === 'border') {
              friendPostElement.style.borderLeft = `3px solid ${friendConfig.friendStyling.indicatorColor || '#4f46e5'}`;
            } else if (friendConfig.friendStyling && friendConfig.friendStyling.indicatorType === 'background') {
              friendPostElement.style.backgroundColor = `${friendConfig.friendStyling.indicatorColor || '#4f46e5'}20`;
            } else if (friendConfig.friendStyling && friendConfig.friendStyling.indicatorType === 'badge') {
              friendPostElement.setAttribute('data-needs-badge', 'true');
            }
            
            // Update the title link
            const titleLink = friendPostElement.querySelector('a');
            if (titleLink) {
              titleLink.href = entry.data.sourceUrl || `/friend/${entry.slug}`;
              titleLink.textContent = entry.data.title;
            }
            
            // Update the publication date with our properly processed date
            const dateElement = friendPostElement.querySelector('.text-sm.font-medium');
            if (dateElement) {
              const formattedDate = publishedDate.toLocaleDateString(undefined, { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              });
              dateElement.textContent = formattedDate;
            }
            
            // Update category
            const categoryLink = friendPostElement.querySelector('a[href*="/category/"]');
            if (categoryLink) {
              categoryLink.href = `/archive/category/${(entry.data.category || 'uncategorized').toLowerCase()}/`;
              categoryLink.textContent = entry.data.category || 'Uncategorized';
            }
            
            // Update tags
            const tagsContainer = friendPostElement.querySelector('.hidden.md\\:flex.items-center');
            if (tagsContainer && entry.data.tags && entry.data.tags.length > 0) {
              const tagsWrapper = tagsContainer.querySelector('div:last-child');
              if (tagsWrapper) {
                // Clear existing tags
                tagsWrapper.innerHTML = '';
                
                // Add each tag
                entry.data.tags.forEach((tag, i) => {
                  // Add separator for all but first tag
                  if (i > 0) {
                    const separator = document.createElement('div');
                    separator.className = 'mx-1.5 text-[var(--meta-divider)] text-sm';
                    separator.textContent = '/';
                    tagsWrapper.appendChild(separator);
                  }
                  
                  // Create tag link
                  const tagLink = document.createElement('a');
                  tagLink.href = `/archive/tag/${tag.toLowerCase()}/`;
                  tagLink.className = 'link-lg transition text-50 text-sm font-medium hover:text-[var(--primary)] dark:hover:text-[var(--primary)] whitespace-nowrap';
                  tagLink.textContent = tag;
                  tagsWrapper.appendChild(tagLink);
                });
              }
            }
            
            // Update description
            const descriptionEl = friendPostElement.querySelector('.transition.text-75');
            if (descriptionEl && entry.data.description) {
              descriptionEl.textContent = entry.data.description;
            }
            
            // Update word count and reading time - safer approach
            const statsElements = friendPostElement.querySelectorAll('.text-sm.text-black\\/30 > div');
            if (statsElements.length >= 3) {
              try {
                const renderResult = entry.render();
                const wordCount = renderResult?.remarkPluginFrontmatter?.words || 
                                 (entry.body ? Math.ceil(entry.body.split(/\s+/).length) : 100);
                const minutes = renderResult?.remarkPluginFrontmatter?.minutes || 
                               Math.max(1, Math.ceil(wordCount / 200));
                
                statsElements[0].textContent = `${wordCount} words`;
                statsElements[2].textContent = `${minutes} min read`;
              } catch (error) {
                console.warn(`Error setting word count for ${entry.id}:`, error);
                statsElements[0].textContent = '100 words';
                statsElements[2].textContent = '1 min read';
              }
            }
            
            // Find the metadata section to place attribution after it
            const metadataSection = friendPostElement.querySelector('.mb-4');
            
            // Check if we need to add a badge
            if (friendConfig.friendStyling && 
                friendConfig.friendStyling.indicatorType === 'badge' && 
                friendPostElement.getAttribute('data-needs-badge') === 'true') {
              const badge = document.createElement('div');
              badge.className = 'absolute right-3 top-3 py-1 px-2 rounded-md text-xs font-medium';
              badge.style.backgroundColor = friendConfig.friendStyling.indicatorColor || '#4f46e5';
              badge.style.color = 'white';
              badge.textContent = 'Friend';
              
              // Append badge to post element
              friendPostElement.appendChild(badge);
            }
            
            // Add friend attribution if enabled
            if (metadataSection && 
                friendConfig.attribution && 
                friendConfig.attribution.showAttribution) {
              
              // Create friend attribution element
              const attribution = document.createElement('div');
              attribution.className = 'flex items-center mb-3';
              
              // Build attribution HTML with avatar if enabled
              let attributionHTML = '';
              
              // Add avatar if enabled - with safety checks
              if (friendConfig.friendStyling && friendConfig.friendStyling.showFriendAvatar) {
                const avatarSize = friendConfig.friendStyling.avatarSize || 'w-6 h-6';
                attributionHTML += `
                  <div class="${avatarSize} bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden mr-2 flex-shrink-0">
                    ${entry.data.friendAvatar ? `
                      <img 
                        src="${entry.data.friendAvatar}" 
                        alt="${entry.data.friendName || 'Friend'}'s avatar"
                        class="w-full h-full object-cover"
                        onerror="this.src='/assets/avatar/avatar.png'"
                      />
                    ` : `
                      <img 
                        src="/assets/avatar/avatar.png" 
                        alt="${entry.data.friendName || 'Friend'}'s avatar"
                        class="w-full h-full object-cover"
                      />
                    `}
                  </div>
                `;
              }
              
              // Add attribution text with friend name - with safety checks
              const attributionText = friendConfig.attribution && friendConfig.attribution.attributionText ? 
                friendConfig.attribution.attributionText.replace('[friendName]', entry.data.friendName || 'Friend') : 
                `From ${entry.data.friendName || 'Friend'}`;
              
              // Add link if enabled - with safety checks
              if (friendConfig.attribution && friendConfig.attribution.linkToFriendSite) {
                attributionHTML += `
                  <span class="text-sm text-neutral-500 dark:text-neutral-400">
                    ${attributionText.replace(entry.data.friendName || 'Friend', `<a href="${entry.data.friendUrl || '#'}" target="_blank" rel="noopener noreferrer" class="text-[var(--primary)] hover:underline">${entry.data.friendName || 'Friend'}</a>`)}
                  </span>
                `;
              } else {
                attributionHTML += `
                  <span class="text-sm text-neutral-500 dark:text-neutral-400">
                    ${attributionText}
                  </span>
                `;
              }
              
              attribution.innerHTML = attributionHTML;
              
              // Insert after the metadata section
              metadataSection.after(attribution);
            }
            
            // Update cover image if present - improved image handling
            const coverImageWrapper = friendPostElement.querySelector('a.group');
            const imageElement = coverImageWrapper ? coverImageWrapper.querySelector('img') : null;
            
            if (imageElement) {
              if (entry.data.image) {
                let imageUrl = entry.data.image;
                
                // Make sure image URL is absolute if it's not already
                if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
                  imageUrl = '/' + imageUrl;
                }
                
                // For external URLs that don't have http/https, add https
                if (imageUrl && !imageUrl.startsWith('/') && !imageUrl.startsWith('http')) {
                  imageUrl = 'https://' + imageUrl;
                }
                
                if (index < 3) console.log(`Image URL for post ${index}:`, imageUrl);
                
                // Set the image
                imageElement.src = imageUrl;
                imageElement.alt = `Cover image for ${entry.data.title}`;
                
                // Make sure the image wrapper is visible
                if (coverImageWrapper) {
                  coverImageWrapper.classList.remove('!hidden');
                }
              } else {
                // If no image, hide the image wrapper
                if (coverImageWrapper) {
                  coverImageWrapper.classList.add('!hidden');
                }
              }
            }
            
            // Add the friend post to the container
            postsContainer.appendChild(friendPostElement);
          } catch (error) {
            console.error(`Error processing friend entry ${entry.id}:`, error);
          }
        });
        
        // Log the final set of posts before sorting
        const allPosts = Array.from(postsContainer.children);
        console.log(`Posts before sorting: ${allPosts.length} total posts`);
        
        let sortedPosts = [];
        
        // Check sorting method from config
        const sortingMethod = friendConfig.behavior && friendConfig.behavior.sortingMethod ? 
          friendConfig.behavior.sortingMethod : 'date';
        
        console.log(`Using sorting method: ${sortingMethod}`);
        
        if (sortingMethod === 'date') {
          // Sort by date (timestamp) with extra validation
          sortedPosts = allPosts.sort((a, b) => {
            const aTime = parseInt(a.getAttribute('data-post-timestamp') || '0');
            const bTime = parseInt(b.getAttribute('data-post-timestamp') || '0');
            
            if (isNaN(aTime) || isNaN(bTime)) {
              console.warn('Invalid timestamp found during sorting:', { 
                aTime, 
                bTime, 
                aTimestamp: a.getAttribute('data-post-timestamp'),
                bTimestamp: b.getAttribute('data-post-timestamp')
              });
              return 0; // Keep original order if invalid
            }
            
            return bTime - aTime; // Descending order (newest first)
          });
        } else if (sortingMethod === 'source') {
          // First local posts, then friend posts grouped by source
          const localPosts = allPosts.filter(post => post.getAttribute('data-post-type') !== 'friend');
          const friendPosts = allPosts.filter(post => post.getAttribute('data-post-type') === 'friend');
          
          console.log(`Sorting by source: ${localPosts.length} local, ${friendPosts.length} friend posts`);
          
          // Sort each group by date internally
          localPosts.sort((a, b) => {
            const aTime = parseInt(a.getAttribute('data-post-timestamp') || '0');
            const bTime = parseInt(b.getAttribute('data-post-timestamp') || '0');
            return bTime - aTime;
          });
          
          // Group friend posts by friend name if available
          const friendGroups = {};
          friendPosts.forEach(post => {
            const friendName = post.querySelector('.text-[var(--primary)].hover\\:underline')?.textContent || 'Unknown';
            if (!friendGroups[friendName]) {
              friendGroups[friendName] = [];
            }
            friendGroups[friendName].push(post);
          });
          
          // Sort each friend group internally by date
          Object.values(friendGroups).forEach(group => {
            group.sort((a, b) => {
              const aTime = parseInt(a.getAttribute('data-post-timestamp') || '0');
              const bTime = parseInt(b.getAttribute('data-post-timestamp') || '0');
              return bTime - aTime;
            });
          });
          
          // Combine all posts in order: local posts first, then friend groups
          sortedPosts = [
            ...localPosts,
            ...Object.values(friendGroups).flat()
          ];
        } else {
          // Default fallback to date sorting
          console.log(`Unknown sorting method "${sortingMethod}", falling back to date sorting`);
          sortedPosts = allPosts.sort((a, b) => {
            const aTime = parseInt(a.getAttribute('data-post-timestamp') || '0');
            const bTime = parseInt(b.getAttribute('data-post-timestamp') || '0');
            return bTime - aTime;
          });
        }
        
        // Check if we should merge with local posts - with safety checks
        const mergeWithLocalPosts = friendConfig.behavior && 
          typeof friendConfig.behavior.mergeWithLocalPosts !== 'undefined' ? 
          friendConfig.behavior.mergeWithLocalPosts : true;
        
        if (mergeWithLocalPosts) {
          console.log('Merging all posts together in sorted order');
          // Clear and reinsert in sorted order
          while (postsContainer.firstChild) {
            postsContainer.removeChild(postsContainer.firstChild);
          }
          
          sortedPosts.forEach(post => {
            postsContainer.appendChild(post);
          });
        } else {
          console.log('Keeping friend posts separate');
          // Separate friend posts from local posts
          // First remove friend posts
          const friendPostElements = document.querySelectorAll('[data-friend-content="true"]');
          friendPostElements.forEach(el => el.remove());
          
          // Create a container for friend posts
          const friendPostsContainer = document.createElement('div');
          friendPostsContainer.className = 'friend-posts-container mt-8';
          friendPostsContainer.innerHTML = `
            <h2 class="text-2xl font-bold mb-4 text-black/90 dark:text-white/90">Friend Posts</h2>
          `;
          
          // Get all friend posts
          const friendPosts = sortedPosts.filter(post => post.getAttribute('data-post-type') === 'friend');
          
          // Add friend posts to the friend container
          friendPosts.forEach(post => {
            friendPostsContainer.appendChild(post);
          });
          
          // Add the friend container after the main posts container
          if (postsContainer.parentNode) {
            postsContainer.parentNode.insertBefore(friendPostsContainer, postsContainer.nextSibling);
          }
        }
        
        console.log(`Successfully integrated ${friendEntries.length} friend posts`);
      } catch (error) {
        console.error('Error integrating friend posts:', error);
      }
    }
    
    // The rest of your code remains the same...
    function setupSwupIntegration() {
      const handlePageTransition = () => {
        if (isAuthenticated && friendContentEnabled) {
          setTimeout(() => {
            try {
              integrateFriendPosts();
            } catch (error) {
              console.error('Error integrating friend posts after page transition:', error);
            }
          }, 500);
        }
      };
      
      if (window.swup?.hooks) {
        window.swup.hooks.on('page:view', handlePageTransition);
      } else {
        document.addEventListener('swup:enable', () => {
          if (window.swup?.hooks) {
            window.swup.hooks.on('page:view', handlePageTransition);
          }
        });
      }
    }
    
    function handleFriendContentToggle(e) {
      const enabled = e.detail?.enabled ?? false;
      
      if (enabled && isAuthenticated) {
        integrateFriendPosts();
      } else {
        const friendPostElements = document.querySelectorAll('[data-friend-content="true"]');
        friendPostElements.forEach(el => el.remove());
      }
    }
    
    window.addEventListener('friend-content-toggled', handleFriendContentToggle);
    
    setTimeout(() => {
      try {
        integrateFriendPosts();
      } catch (error) {
        console.error('Error integrating friend posts:', error);
      }
    }, 300);
    
    setupSwupIntegration();
    
    return () => {
      window.removeEventListener('friend-content-toggled', handleFriendContentToggle);
    };
  });
</script>

<!-- This component doesn't render anything visible -->