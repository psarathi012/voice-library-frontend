document.addEventListener('DOMContentLoaded', async () => {
    // Track current active dropdown
    let activeDropdown = null;

    // Handle sidebar icon clicks to show/hide dropdown
    document.querySelectorAll('.sidebar-icon').forEach(icon => {
        icon.addEventListener('click', function (e) {
            e.stopPropagation();
            const dropdown = this.querySelector('.voice-dropdown');

            // Close any other open dropdown
            if (activeDropdown && activeDropdown !== dropdown) {
                activeDropdown.style.display = 'none';
            }

            // Toggle current dropdown
            const isVisible = window.getComputedStyle(dropdown).display !== 'none';
            if (isVisible) {
                dropdown.style.display = 'none';
                activeDropdown = null;
            } else {
                dropdown.style.display = 'block';
                activeDropdown = dropdown;
            }
        });
    });

    // Handle voice option clicks
    document.querySelectorAll('.voice-option').forEach(option => {
        option.addEventListener('click', function (e) {
            e.stopPropagation();
            const optionText = this.textContent;

            // Hide all content first
            document.querySelectorAll('.voice-content').forEach(div => {
                div.classList.remove('active');
            });

            // Show appropriate content based on option clicked
            if (optionText.includes('Text to Speech')) {
                document.querySelector('.text-to-speech').classList.add('active');
            } else if (optionText.includes('Text to SFX')) {
                document.querySelector('.text-to-sfx').classList.add('active');
            } else if (optionText.includes('Voice Changer')) {
                document.querySelector('.voice-changer').classList.add('active');
            } else if (optionText.includes('Dubbing')) {
                document.querySelector('.dubbing').classList.add('active');
            } else if (optionText.includes('Voice Cloning')) {
                document.querySelector('.voice-cloning').classList.add('active');
            }

            // Close the dropdown after selection
            if (activeDropdown) {
                activeDropdown.style.display = 'none';
                activeDropdown = null;
            }
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        if (activeDropdown) {
            activeDropdown.style.display = 'none';
            activeDropdown = null;
        }
    });

    // Prevent dropdown from closing when clicking inside it
    document.querySelectorAll('.voice-dropdown').forEach(dropdown => {
        dropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });

    // Show Text to Speech content by default
    document.querySelector('.text-to-speech').classList.add('active');

    // Handle character count
    const textarea = document.getElementById('text-input');
    const charCount = document.querySelector('.character-count');

    if (textarea && charCount) {
        textarea.addEventListener('input', function () {
            const length = this.value.length;
            charCount.textContent = `${length}/500`;

            // Optional: Disable input if over limit
            if (length > 500) {
                this.value = this.value.substring(0, 500);
            }
        });
    }

    // Add this to your existing DOMContentLoaded event listener
    document.querySelectorAll('.language-option').forEach(option => {
        option.addEventListener('click', function (e) {
            e.stopPropagation();
            const flagImg = this.querySelector('img').cloneNode(true);
            const languageText = this.querySelector('span').textContent;

            const selector = this.closest('.language-select');
            selector.querySelector('.flag-container img').replaceWith(flagImg);
            selector.querySelector('span').textContent = languageText;
        });
    });

    // Add this to your existing code
    document.querySelectorAll('.voice-model-option').forEach(option => {
        option.addEventListener('click', function (e) {
            e.stopPropagation();
            const avatarImg = this.querySelector('.avatar-icon').cloneNode(true);
            const voiceName = this.querySelector('span').textContent;

            const selector = this.closest('.voice-select');
            selector.querySelector('.voice-avatar img').replaceWith(avatarImg);
            selector.querySelector('span').textContent = voiceName;
        });
    });
}); 
