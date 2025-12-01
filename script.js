// script.js

document.addEventListener('DOMContentLoaded', () => {
    const profileSection = document.querySelector('.sidebar .profile');
    const profileLink = profileSection ? profileSection.querySelector('a') : null;
    const profileSkills = profileSection ? profileSection.querySelector('small') : null; 
    const profilePhoto = document.getElementById('profile-photo');
    const changePhotoButton = document.getElementById('change-photo-btn');
    
    // ELEMENTS FOR BANNER
    const profileBanner = document.getElementById('profile-banner');
    const changeBannerButton = document.getElementById('change-banner-btn');
    
    // NEW ELEMENTS FOR SKILLS
    const skillsListContainer = document.getElementById('skills-list');
    const manageSkillsBtn = document.getElementById('manage-skills-btn');

    // NEW: Navigation and Popup Elements - UPDATED SELECTOR
    const navItems = document.querySelectorAll('.network, .jobs, .message, .notification, .me, .work'); 
    const popups = document.querySelectorAll('.nav-popup');
    
    // NEW: Search Elements
    const globalSearchInput = document.getElementById('global-search-input');
    const searchResultsPopup = document.getElementById('search-results-popup');
    const searchContainer = document.getElementById('search-container');
    
    // --- Initial setup ---
    if (skillsListContainer) {
        initializeSkills();
        manageSkillsBtn.addEventListener('click', manageSkills);
    }

    if (profileLink && profileSkills) {
        const editButton = document.createElement('i');
        editButton.classList.add('fa-solid', 'fa-pen');
        editButton.id = 'edit-profile-btn';
        profileLink.parentNode.insertBefore(editButton, profileLink.nextSibling);
        editButton.addEventListener('click', updateProfile);
    }
    
    if (changePhotoButton && profilePhoto) {
        changePhotoButton.addEventListener('click', changeProfilePhoto);
    }
    
    if (changeBannerButton && profileBanner) {
        changeBannerButton.addEventListener('click', changeProfileBanner);
    }
    
    // ------------------------------------------------------------------
    // NEW: Global Search Logic
    // ------------------------------------------------------------------
    if (globalSearchInput && searchResultsPopup) {
        
        globalSearchInput.addEventListener('focus', () => {
            // Hide all nav popups when search is focused
            popups.forEach(popup => popup.classList.add('hidden'));
            navItems.forEach(item => item.classList.remove('active'));
            
            // Show search results popup
            searchResultsPopup.classList.remove('hidden');
        });
        
        globalSearchInput.addEventListener('input', () => {
            // In a real app, this would dynamically update the search results content
            // console.log('Searching for:', globalSearchInput.value);
            // For now, we only handle the display, the content is static mock data
        });
        
        // Clicks on mock search items for demonstration
        searchResultsPopup.querySelectorAll('.search-item').forEach(item => {
            item.addEventListener('click', (event) => {
                const query = event.currentTarget.querySelector('span').textContent.replace(/\*\*/g, '');
                alert(`Simulating search for: "${query.trim()}"`);
                // Close the popup after selection/click
                searchResultsPopup.classList.add('hidden');
                globalSearchInput.value = query.trim();
            });
        });
        
        // Mock clear history button
        const clearHistoryBtn = document.getElementById('clear-search-history-btn');
        if (clearHistoryBtn) {
            clearHistoryBtn.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevent the main document click listener from hiding the popup
                const recentSearches = searchResultsPopup.querySelectorAll('.recent-search');
                recentSearches.forEach(item => item.remove());
                alert('Search history cleared (mock functionality).');
                // You'd typically re-render the list or hide the 'Recent searches' header if list is empty
            });
        }
    }


    // ------------------------------------------------------------------
    // Logic to toggle popups and clear badges on navigation click (MODIFIED)
    // ------------------------------------------------------------------

    navItems.forEach(item => {
        item.addEventListener('click', handleNavItemClick);
    });

    /**
     * Handles the click event for navigation items (Network, Jobs, Messaging, Notifications, Me, Work).
     * Toggles the relevant popup and clears the badge count for badge items.
     */
    function handleNavItemClick(event) {
        const clickedItem = event.currentTarget;
        const sectionId = clickedItem.dataset.section; // e.g., 'me'
        const targetPopup = document.getElementById(`${sectionId}-popup`);
        
        // Ensure a target popup exists
        if (!targetPopup) return;

        const isCurrentlyActive = clickedItem.classList.contains('active');

        // 1. Close all nav popups and remove active state from all items
        popups.forEach(popup => popup.classList.add('hidden'));
        navItems.forEach(item => item.classList.remove('active'));
        
        // 1b. Close search results popup
        searchResultsPopup.classList.add('hidden'); // NEW

        // 2. If the item was not active (or if it was, we just closed it, so stop here)
        if (!isCurrentlyActive) {
            // Show the target popup and set the item as active
            targetPopup.classList.remove('hidden');
            clickedItem.classList.add('active');

            // 3. Clear the badge count (only applies to items with data-count)
            const count = clickedItem.dataset.count;
            if (count && count > "0") {
                console.log(`User opened ${sectionId}. Clearing ${count} new items.`);
                // Reset the attribute to "0" to simulate viewing and hide the CSS badge
                clickedItem.dataset.count = "0";
            }
        }
    }

    // Close popup when clicking outside (on the main container)
    document.addEventListener('click', (event) => {
        const isInsideNav = event.target.closest('nav');
        
        // If the click is anywhere outside the navigation wrapper, close all popups
        if (!isInsideNav) {
            popups.forEach(popup => popup.classList.add('hidden'));
            navItems.forEach(item => item.classList.remove('active'));
            searchResultsPopup.classList.add('hidden'); // NEW: Hide search popup
        }
        
        // If the click is not inside the search container, and not the input itself, close search popup
        const isInsideSearchContainer = event.target.closest('#search-container');
        if (!isInsideSearchContainer && searchResultsPopup.contains(event.target)) {
            // Do nothing if it's inside the *popup* but not inside the *input/container*. 
            // Clicks inside the popup (like on the results) should be handled by the click handlers inside the popup, 
            // but the popup should stay open unless a result is clicked (which is handled above).
            return;
        } else if (!isInsideSearchContainer) {
             searchResultsPopup.classList.add('hidden');
        }
    });
    
    // ------------------------------------------------------------------
    // NEW: Logic for "View Profile" link inside the "Me" popup
    // ------------------------------------------------------------------
    const viewProfileLink = document.querySelector('.me-view-profile[data-action="view-profile"]');
    if (viewProfileLink) {
        viewProfileLink.addEventListener('click', handleViewProfile);
    }
    
    function handleViewProfile(event) {
        event.preventDefault(); // Stop the default anchor link behavior
        
        // Close all popups
        popups.forEach(popup => popup.classList.add('hidden'));
        navItems.forEach(item => item.classList.remove('active'));
        
        const profileName = profileLink.dataset.profileName || 'Your Profile';
        
        // Simulate navigation/information visualization with an alert
        alert(`Navigating to ${profileName}'s full profile page...\n\n(In a real application, this would load the dedicated /in/${profileName} page, showing sections like About, Experience, Education, and Skills.)`);
        
        // In a real application, you would change window.location.href here
        // window.location.href = `/in/${profileName.replace(/\s/g, '-')}`; 
    }

    // ------------------------------------------------------------------
    // Post Comment and Action Logic (REMAINS THE SAME)
    // ------------------------------------------------------------------
    const feedPost = document.querySelector('.feed-post');
    if (feedPost) {
        const commentInput = feedPost.querySelector('.new-comment-input');
        const postButton = feedPost.querySelector('.post-comment-btn');
        const commentsList = feedPost.querySelector('.comments-list');
        const commentCountSpan = feedPost.querySelector('.comment-count');

        // Enable/Disable Post Button
        commentInput.addEventListener('input', () => {
            if (commentInput.value.trim().length > 0) {
                postButton.classList.remove('btn-disabled');
            } else {
                postButton.classList.add('btn-disabled');
            }
        });

        // Handle Comment Post
        postButton.addEventListener('click', () => {
            const commentText = commentInput.value.trim();
            if (commentText && !postButton.classList.contains('btn-disabled')) {
                addComment(commentText, commentsList, commentCountSpan);
                commentInput.value = ''; // Clear input
                postButton.classList.add('btn-disabled'); // Disable button
            }
        });
        
        // Handle action button clicks (e.g., Liking)
        const actionButtons = feedPost.querySelectorAll('.post-actions .action-btn');
        actionButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                handlePostAction(e.currentTarget);
            });
        });

    }


    /**
     * Creates and appends a new comment element to the list and updates the count.
     */
    function addComment(text, list, countSpan) {
        const newCommentItem = document.createElement('div');
        newCommentItem.classList.add('comment-item');
        
        // Mock user data for the new comment
        newCommentItem.innerHTML = `
            <img src="./Images/dp.jpg" alt="Your Profile" class="comment-user-img">
            <div class="comment-body">
                <strong>Nirmalraj D (You)</strong>
                <small>Professional Python Developer & Engineer</small>
                <p>${text}</p>
                <small class="comment-timestamp">Just now</small>
            </div>
        `;

        list.prepend(newCommentItem); // Add new comment to the top

        // Update comment count attribute and display text
        let currentCount = parseInt(countSpan.dataset.comments);
        currentCount++;
        countSpan.dataset.comments = currentCount;
        countSpan.textContent = `${currentCount} comments`;
    }
    
    /**
     * Simulates post actions like Liking/Commenting.
     */
    function handlePostAction(button) {
        const action = button.dataset.action;
        if (action === 'like') {
            if (button.classList.contains('active-like')) {
                // Unlike
                button.classList.remove('active-like');
                button.innerHTML = '<i class="fa-regular fa-thumbs-up"></i> Like';
            } else {
                // Like
                button.classList.add('active-like');
                button.innerHTML = '<i class="fa-solid fa-thumbs-up"></i> Liked';
            }
        } else if (action === 'comment') {
            // Scroll to and focus the comment input
            const commentInput = document.querySelector('.new-comment-input');
            if (commentInput) {
                commentInput.focus();
            }
        } else {
            console.log(`Action: ${action} triggered.`);
        }
    }
    
    // ====================================================================
    // SKILLS AND PROFILE FUNCTIONS (REMAIN THE SAME)
    // ====================================================================

    /**
     * Renders the skills stored in the data-skills attribute to the HTML view.
     */
    function renderSkills(skillsString) {
        skillsListContainer.innerHTML = ''; 
        if (!skillsString) return;

        const skillsArray = skillsString.split(',').map(s => s.trim()).filter(s => s.length > 0);

        skillsArray.forEach(skill => {
            const skillTag = document.createElement('span');
            skillTag.classList.add('skill-tag');
            skillTag.textContent = skill;
            skillsListContainer.appendChild(skillTag);
        });
    }

    /**
     * Initializes the skills display on page load.
     */
    function initializeSkills() {
        const initialSkills = skillsListContainer.dataset.skills;
        renderSkills(initialSkills);
    }

    /**
     * Prompts the user to enter a new list of skills and updates the profile.
     */
    function manageSkills(event) {
        event.preventDefault();
        const currentSkills = skillsListContainer.dataset.skills;

        const newSkills = prompt(
            'Enter your new skills, separated by commas (e.g., HTML, CSS, React):\n\nCurrent Skills: ' + currentSkills,
            currentSkills
        );

        if (newSkills !== null && newSkills.trim() !== '') {
            skillsListContainer.dataset.skills = newSkills.trim();
            renderSkills(newSkills.trim());
            alert('Skills updated successfully!');
        } else if (newSkills === '') {
            skillsListContainer.dataset.skills = '';
            renderSkills('');
            alert('All skills have been cleared.');
        }
    }
    
    /**
     * Prompts the user for new profile details (Name/Designation) and updates the display.
     */
    function updateProfile() {
        const currentName = profileLink.dataset.profileName || profileLink.textContent;
        const currentDesignation = profileSkills.dataset.profileDesignation || profileSkills.textContent;

        const newName = prompt(`Enter new profile name (Current: ${currentName}):`, currentName);

        if (newName !== null && newName.trim() !== '') {
            const newDesignation = prompt(`Enter new skills/designation (Current: ${currentDesignation}):`, currentDesignation);

            if (newDesignation !== null && newDesignation.trim() !== '') {
                profileLink.textContent = newName;
                profileSkills.textContent = newDesignation;

                profileLink.dataset.profileName = newName;
                profileSkills.dataset.profileDesignation = newDesignation;

                alert(`Profile updated successfully!\nName: ${newName}\nDesignation: ${newDesignation}`);
            }
        }
    }

    /**
     * Prompts the user for a new image URL and updates the profile photo.
     */
    function changeProfilePhoto() {
        const currentPhotoUrl = profilePhoto.dataset.photoUrl; 
        const newPhotoUrl = prompt('Enter a new profile photo URL (e.g., a link to an image):', currentPhotoUrl);

        if (newPhotoUrl !== null && newPhotoUrl.trim() !== '') {
            if (newPhotoUrl.startsWith('http') || newPhotoUrl.startsWith('./')) {
                const finalUrl = newPhotoUrl.trim();
                profilePhoto.src = finalUrl;
                profilePhoto.dataset.photoUrl = finalUrl; 
                alert('Profile photo updated successfully!');
            } else {
                alert('Please enter a valid URL or path for the image.');
            }
        }
    }
    
    /**
     * Prompts the user for a new image URL and updates the profile banner background.
     */
    function changeProfileBanner() {
        let currentBannerUrl = profileBanner.dataset.bannerUrl; 

        const newBannerUrl = prompt('Enter a new profile banner URL (e.g., a link to an image):', currentBannerUrl);

        if (newBannerUrl !== null && newBannerUrl.trim() !== '') {
            if (newBannerUrl.startsWith('http') || newBannerUrl.startsWith('./')) {
                const finalUrl = newBannerUrl.trim();
                profileBanner.style.backgroundImage = `url('${finalUrl}')`;
                profileBanner.dataset.bannerUrl = finalUrl; 
                profileBanner.style.backgroundColor = 'transparent';
                alert('Profile banner updated successfully!');
            } else {
                alert('Please enter a valid URL or path for the image.');
            }
        }
    }
});