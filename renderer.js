document.addEventListener('DOMContentLoaded', async () => {
    // Remove backdrop creation
    let activeDropdown = null;

    document.querySelectorAll('.sidebar-icon').forEach(icon => {
        icon.addEventListener('click', function (e) {
            e.stopPropagation();
            const dropdown = this.querySelector('.voice-dropdown');

            if (activeDropdown && activeDropdown !== dropdown) {
                activeDropdown.style.display = 'none';
            }

            if (dropdown.style.display === 'block') {
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
            if (optionText.includes('Search Models')) {
                document.querySelector('.model-search').classList.add('active');
                // Fetch and display models when "Search Models" is clicked
                fetchAndDisplayModels();
            } else if (optionText.includes('Text to Speech')) {
                document.querySelector('.text-to-speech').classList.add('active');
            } else if (optionText.includes('Text to SFX')) {
                document.querySelector('.text-to-sfx').classList.add('active');
            } else if (optionText.includes('Voice Changer')) {
                document.querySelector('.voice-changer').classList.add('active');
            } else if (optionText.includes('Voice Cloning')) {
                document.querySelector('.voice-cloning').classList.add('active');
            } else if (optionText.includes('System Info')) {
                document.querySelector('.system-info').classList.add('active');
            } else if (optionText.includes('Runtimes')) {
                document.querySelector('.runtimes').classList.add('active');
            } else if (optionText.includes('My Models')) {
                document.querySelector('.my-models').classList.add('active');
            }

            // Close the dropdown after selection
            if (activeDropdown) {
                activeDropdown.style.display = 'none';
                activeDropdown = null;
            }

            if (optionText.includes('System Info')) {
                updateSystemInfo();
                // Start periodic updates for performance stats
                const statsInterval = setInterval(updatePerformanceStats, 1000);
                // Store the interval ID to clear it when switching away
                this.dataset.statsInterval = statsInterval;
            } else if (this.dataset.statsInterval) {
                // Clear the interval when switching to a different page
                clearInterval(this.dataset.statsInterval);
                delete this.dataset.statsInterval;
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

    // Handle character count for both text-to-speech and text-to-sfx textareas
    const textInputs = {
        'text-input': document.querySelector('.text-to-speech .character-count'),
        'sfx-input': document.querySelector('.text-to-sfx .character-count')
    };

    Object.entries(textInputs).forEach(([inputId, counter]) => {
        const textarea = document.getElementById(inputId);
        if (textarea && counter) {
            textarea.addEventListener('input', function () {
                const length = this.value.length;
                counter.textContent = `${length}/500`;

                // Optional: Disable input if over limit
                if (length > 500) {
                    this.value = this.value.substring(0, 500);
                }
            });
        }
    });

    // Update the language selector handlers
    document.querySelectorAll('.language-select').forEach(selector => {
        selector.addEventListener('click', function (e) {
            e.stopPropagation();

            // Close any other open dropdowns
            document.querySelectorAll('.language-select.active').forEach(active => {
                if (active !== this) active.classList.remove('active');
            });

            // Toggle current dropdown
            this.classList.toggle('active');
        });
    });

    // Original language option handling
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

    // Close dropdowns when clicking outside
    document.addEventListener('click', () => {
        document.querySelectorAll('.language-select.active').forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    });

    // Handle voice model selection
    document.querySelectorAll('.voice-model-option').forEach(option => {
        option.addEventListener('click', function (e) {
            e.stopPropagation();
            const avatar = this.querySelector('.voice-avatar img').cloneNode(true);
            const voiceName = this.querySelector('.voice-name').textContent;

            const selector = this.closest('.voice-select');
            selector.querySelector('.voice-avatar img').replaceWith(avatar);
            selector.querySelector('span').textContent = voiceName;
            selector.classList.remove('active');
        });
    });

    // Update the button click handlers
    document.querySelectorAll('.action-button').forEach(button => {
        button.addEventListener('click', function () {
            const textInput = document.getElementById('text-input');
            let text = '';

            // Check which button was clicked based on its content
            if (this.textContent.includes('Tell a Story')) {
                text = "Once, a curious inventor named Leo built a machine to capture dreams. At night, it recorded the colors, sounds, and feelings people experienced in their sleep. The machine made an extraordinary discovery—dreams could be shared and felt by others. Leo's invention brought people closer, allowing them to experience each other's joy, fears, and desires. It showed that we're all connected by the unseen threads of our subconscious. The dream world became a place for true empathy";
            } else if (this.textContent.includes('Introduce a Podcast')) {
                text = "Welcome to The Storyteller's Journey, where we dive deep into the art of crafting unforgettable narratives. Each episode, we explore the power of storytelling, from personal experiences to timeless tales that have shaped cultures. Join me as I chat with writers, filmmakers, and creators who have mastered the craft, offering insights that will help you unlock the storyteller within. Let's journey into the world of words and wonders together";
            } else if (this.textContent.includes('Create a video voiceover')) {
                text = "Every day, millions of moments unfold in this city—some fleeting, others life-changing. What makes each one special? The stories behind them. Today, we take you on a journey through the streets, capturing the heartbeat of this urban jungle. From unexpected encounters to quiet reflections, let's uncover the stories that bring this place to life";
            }

            if (textInput && text) {
                textInput.value = text;

                // Trigger input event to update character count
                const inputEvent = new Event('input', {
                    bubbles: true,
                    cancelable: true,
                });
                textInput.dispatchEvent(inputEvent);
            }
        });
    });

    // Update the CSS for the progress bar to show progress
    const style = document.createElement('style');
    style.textContent = `
        .progress-bar::before {
            width: var(--progress, 0%);
        }
    `;
    document.head.appendChild(style);

    // Handle model filtering
    const modelFilterInput = document.getElementById('modelFilterInput');
    if (modelFilterInput) {
        modelFilterInput.addEventListener('input', function () {
            const searchTerm = this.value.toLowerCase();
            document.querySelectorAll('.model-item').forEach(item => {
                const modelName = item.querySelector('h3').textContent.toLowerCase();
                if (modelName.includes(searchTerm)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }

    // Handle model actions
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            const modelItem = this.closest('.model-item');
            const modelName = modelItem.querySelector('h3').textContent;
            const action = this.querySelector('span').textContent.toLowerCase();

            switch (action) {
                case 'stop':
                    modelItem.querySelector('.model-status').textContent = 'Stopped';
                    modelItem.querySelector('.model-status').classList.remove('running');
                    modelItem.querySelector('.model-status').classList.add('stopped');
                    this.innerHTML = '<i class="fas fa-play"></i><span>Start</span>';
                    this.classList.remove('stop-btn');
                    this.classList.add('start-btn');
                    break;
                case 'start':
                    modelItem.querySelector('.model-status').textContent = 'Running';
                    modelItem.querySelector('.model-status').classList.remove('stopped');
                    modelItem.querySelector('.model-status').classList.add('running');
                    this.innerHTML = '<i class="fas fa-stop"></i><span>Stop</span>';
                    this.classList.remove('start-btn');
                    this.classList.add('stop-btn');
                    break;
                case 'restart':
                    // Add restart animation
                    this.querySelector('i').style.animation = 'spin 1s linear';
                    setTimeout(() => {
                        this.querySelector('i').style.animation = '';
                    }, 1000);
                    break;
                case 'delete':
                    if (confirm(`Are you sure you want to delete ${modelName}?`)) {
                        modelItem.remove();
                    }
                    break;
            }
        });
    });
});

// Handle slider value updates
document.querySelectorAll('.effect-slider input[type="range"]').forEach(slider => {
    const valueDisplay = slider.parentElement.querySelector('.slider-value');

    slider.addEventListener('input', function () {
        valueDisplay.textContent = this.value;
    });
});

// Update the file upload handling
const uploadButton = document.querySelector('.voice-changer .action-button:nth-child(2)');
if (uploadButton) {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'audio/*';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    // Handle upload button click
    uploadButton.addEventListener('click', () => {
        fileInput.click();
    });

    // Handle file selection
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            // Create container for file info and controls
            const fileContainer = document.createElement('div');
            fileContainer.className = 'selected-file';

            // Add file name
            const fileName = document.createElement('span');
            fileName.textContent = file.name;

            // Create audio player
            const audioPlayer = document.createElement('audio');
            audioPlayer.controls = true;
            audioPlayer.src = URL.createObjectURL(file);

            // Add to container
            fileContainer.appendChild(fileName);
            fileContainer.appendChild(audioPlayer);

            // Insert after the buttons but before the controls
            const controlsSection = document.querySelector('.controls-section');
            controlsSection.insertBefore(fileContainer, controlsSection.firstChild);
        }
    });
}

// Add voice recording functionality
const recordButton = document.querySelector('.voice-changer .action-button:first-child');
let mediaRecorder;
let audioChunks = [];
let isRecording = false;

if (recordButton) {
    recordButton.addEventListener('click', async () => {
        try {
            if (!isRecording) {
                // Start recording
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorder = new MediaRecorder(stream);
                audioChunks = [];

                mediaRecorder.ondataavailable = (event) => {
                    audioChunks.push(event.data);
                };

                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                    const audioUrl = URL.createObjectURL(audioBlob);

                    // Create container for recorded audio
                    const fileContainer = document.createElement('div');
                    fileContainer.className = 'selected-file';

                    // Add recording name
                    const fileName = document.createElement('span');
                    fileName.textContent = 'Recorded Audio';

                    // Create audio player
                    const audioPlayer = document.createElement('audio');
                    audioPlayer.controls = true;
                    audioPlayer.src = audioUrl;

                    // Add to container
                    fileContainer.appendChild(fileName);
                    fileContainer.appendChild(audioPlayer);

                    // Insert into page
                    const controlsSection = document.querySelector('.controls-section');
                    let existingContainer = document.querySelector('.selected-file');
                    if (existingContainer) {
                        existingContainer.replaceWith(fileContainer);
                    } else {
                        controlsSection.insertBefore(fileContainer, controlsSection.firstChild);
                    }
                };

                mediaRecorder.start();
                isRecording = true;
                recordButton.style.background = '#ef4444';  // Red background while recording
                recordButton.querySelector('span').textContent = '⏺';
                recordButton.querySelector('span').nextSibling.textContent = ' Stop Recording';
            } else {
                // Stop recording
                mediaRecorder.stop();
                mediaRecorder.stream.getTracks().forEach(track => track.stop());
                isRecording = false;
                recordButton.style.background = '';  // Reset background
                recordButton.querySelector('span').textContent = '🎤';
                recordButton.querySelector('span').nextSibling.textContent = ' Record Voice';
            }
        } catch (err) {
            console.error('Error accessing microphone:', err);
            alert('Unable to access microphone. Please ensure you have granted permission.');
        }
    });
}

// Add voice cloning functionality
const cloningRecordButton = document.querySelector('.voice-cloning .action-button:first-child');
const cloningUploadButton = document.querySelector('.voice-cloning .action-button:nth-child(2)');

// Handle file upload for voice cloning
if (cloningUploadButton) {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'audio/*';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    cloningUploadButton.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const fileContainer = document.createElement('div');
            fileContainer.className = 'selected-file';

            const fileName = document.createElement('span');
            fileName.textContent = file.name;

            const audioPlayer = document.createElement('audio');
            audioPlayer.controls = true;
            audioPlayer.src = URL.createObjectURL(file);

            fileContainer.appendChild(fileName);
            fileContainer.appendChild(audioPlayer);

            // Insert after buttons
            const inputContainer = document.querySelector('.voice-cloning .input-container');
            let existingContainer = inputContainer.querySelector('.selected-file');
            if (existingContainer) {
                existingContainer.replaceWith(fileContainer);
            } else {
                inputContainer.insertBefore(fileContainer, inputContainer.querySelector('.selector-row'));
            }
        }
    });
}

// Handle voice recording for voice cloning
if (cloningRecordButton) {
    let mediaRecorder;
    let audioChunks = [];
    let isRecording = false;

    cloningRecordButton.addEventListener('click', async () => {
        try {
            if (!isRecording) {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorder = new MediaRecorder(stream);
                audioChunks = [];

                mediaRecorder.ondataavailable = (event) => {
                    audioChunks.push(event.data);
                };

                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                    const audioUrl = URL.createObjectURL(audioBlob);

                    const fileContainer = document.createElement('div');
                    fileContainer.className = 'selected-file';

                    const fileName = document.createElement('span');
                    fileName.textContent = 'Voice Sample Recording';

                    const audioPlayer = document.createElement('audio');
                    audioPlayer.controls = true;
                    audioPlayer.src = audioUrl;

                    fileContainer.appendChild(fileName);
                    fileContainer.appendChild(audioPlayer);

                    const inputContainer = document.querySelector('.voice-cloning .input-container');
                    let existingContainer = inputContainer.querySelector('.selected-file');
                    if (existingContainer) {
                        existingContainer.replaceWith(fileContainer);
                    } else {
                        inputContainer.insertBefore(fileContainer, inputContainer.querySelector('.selector-row'));
                    }
                };

                mediaRecorder.start();
                isRecording = true;
                cloningRecordButton.style.background = '#ef4444';
                cloningRecordButton.querySelector('span').textContent = '⏺';
                cloningRecordButton.querySelector('span').nextSibling.textContent = ' Stop Recording';
            } else {
                mediaRecorder.stop();
                mediaRecorder.stream.getTracks().forEach(track => track.stop());
                isRecording = false;
                cloningRecordButton.style.background = '';
                cloningRecordButton.querySelector('span').textContent = '🎤';
                cloningRecordButton.querySelector('span').nextSibling.textContent = ' Record Voice';
            }
        } catch (err) {
            console.error('Error accessing microphone:', err);
            alert('Unable to access microphone. Please ensure you have granted permission.');
        }
    });
}

// Add character counter for cloning text input
const cloningTextarea = document.getElementById('cloning-input');
const cloningCharCount = document.querySelector('.voice-cloning .character-count');

if (cloningTextarea && cloningCharCount) {
    cloningTextarea.addEventListener('input', function () {
        const length = this.value.length;
        cloningCharCount.textContent = `${length}/500`;

        if (length > 500) {
            this.value = this.value.substring(0, 500);
        }
    });
}

// Add this to your existing code
const modelSearchInput = document.getElementById('modelSearchInput');
const searchResults = document.querySelector('.search-results');

if (modelSearchInput) {
    // Show search results when typing
    modelSearchInput.addEventListener('input', function () {
        if (this.value.length > 0) {
            searchResults.style.display = 'block';
        } else {
            searchResults.style.display = 'none';
        }
    });

    // Handle clicking outside to close search results
    document.addEventListener('click', function (e) {
        if (!modelSearchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.style.display = 'none';
        }
    });

    // Handle search result selection
    document.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', function () {
            const modelTitle = this.querySelector('.result-title').textContent;
            modelSearchInput.value = modelTitle;
            searchResults.style.display = 'none';

            // Show model details section
            document.querySelector('.model-list').style.display = 'block';
        });
    });
}

// Add this to handle model selection
document.querySelectorAll('.model-list-item').forEach(item => {
    item.addEventListener('click', function () {
        // Remove selected class from all items
        document.querySelectorAll('.model-list-item').forEach(i => {
            i.classList.remove('selected');
        });

        // Add selected class to clicked item
        this.classList.add('selected');

        // Show model details section
        document.querySelector('.model-details-section').style.display = 'block';
    });
});

// Initial system info update if starting on system info page
if (document.querySelector('.system-info').classList.contains('active')) {
    updateSystemInfo();
    updatePerformanceStats();
}

// Update the play button handler
let currentAudio = null;

document.addEventListener('click', async (e) => {
    if (e.target.closest('button') && e.target.closest('button').textContent.includes('Generate')) {
        const generateButton = e.target.closest('button');
        try {
            const textInput = document.getElementById('text-input');
            const text = textInput.value;

            if (!text.trim()) {
                alert('Please enter some text first');
                return;
            }

            generateButton.disabled = true;
            generateButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';

            if (currentAudio) {
                currentAudio.pause();
            }
            currentAudio = new Audio('http://127.0.0.1:8001/stream_audio');

            // Show audio controls
            const audioControls = document.querySelector('.audio-controls');
            audioControls.style.display = 'block';

            // Get control elements
            const playPauseBtn = document.getElementById('playPauseBtn');
            const stopBtn = document.getElementById('stopBtn');
            const volumeSlider = document.getElementById('volumeSlider');
            const progressBar = document.querySelector('.progress');  // Changed to target the progress element
            const progressContainer = document.querySelector('.progress-bar');  // Container for click events
            const currentTimeSpan = document.querySelector('.current-time');
            const durationSpan = document.querySelector('.duration');

            // Set up audio event listeners
            currentAudio.addEventListener('loadedmetadata', () => {
                // For streaming content, we might not get a valid duration
                if (isNaN(currentAudio.duration) || !isFinite(currentAudio.duration)) {
                    durationSpan.textContent = '--:--'; // Changed from 'Live' to '--:--'
                } else {
                    durationSpan.textContent = formatTime(currentAudio.duration);
                }
            });

            currentAudio.addEventListener('timeupdate', () => {
                // Only show current time for streaming content
                currentTimeSpan.textContent = formatTime(currentAudio.currentTime);

                // If we have a valid duration, show progress
                if (!isNaN(currentAudio.duration) && isFinite(currentAudio.duration)) {
                    const progress = (currentAudio.currentTime / currentAudio.duration) * 100;
                    progressBar.style.width = `${progress}%`;
                }
            });

            // Play/Pause button
            playPauseBtn.onclick = () => {
                if (currentAudio.paused) {
                    currentAudio.play();
                    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                } else {
                    currentAudio.pause();
                    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                }
            };

            // Stop button
            stopBtn.onclick = () => {
                currentAudio.pause();
                currentAudio.currentTime = 0;
                playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                progressBar.style.width = '0%';  // Reset progress bar width
                currentTimeSpan.textContent = '0:00';
            };

            // Volume control
            volumeSlider.oninput = (e) => {
                if (currentAudio) {
                    currentAudio.volume = e.target.value / 100;
                }
            };

            // Progress bar click handling
            progressContainer.addEventListener('click', (e) => {
                if (currentAudio && !isNaN(currentAudio.duration)) {
                    const rect = progressContainer.getBoundingClientRect();
                    const pos = (e.clientX - rect.left) / rect.width;
                    currentAudio.currentTime = pos * currentAudio.duration;
                    progressBar.style.width = `${pos * 100}%`;
                }
            });

            // Start playing the audio
            await currentAudio.play();
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            generateButton.disabled = false;
            generateButton.innerHTML = '<i class="fas fa-play"></i> Generate';

        } catch (error) {
            console.error('Error playing audio:', error);
            generateButton.disabled = false;
            generateButton.innerHTML = '<i class="fas fa-play"></i> Generate';
        }
    }
});

// Helper function to format time
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Define these functions outside of DOMContentLoaded
async function updateSystemInfo() {
    try {
        const sysInfo = await window.electronAPI.getSystemInfo();
        console.log('Received system info:', sysInfo);  // Add this line for debugging

        // Log the entire system info object
        console.log('System Information:', {
            CPU: {
                Architecture: sysInfo.cpu.architecture,
                Model: sysInfo.cpu.model,
                Cores: sysInfo.cpu.cores,
                PhysicalCores: sysInfo.cpu.physicalCores,
                Speed: sysInfo.cpu.speed,
                Instructions: sysInfo.cpu.instructions
            },
            Memory: {
                Total: `${(sysInfo.memory.total / (1024 * 1024 * 1024)).toFixed(2)} GB`,
                Free: `${(sysInfo.memory.free / (1024 * 1024 * 1024)).toFixed(2)} GB`,
                Used: `${(sysInfo.memory.used / (1024 * 1024 * 1024)).toFixed(2)} GB`
            },
            GPU: sysInfo.gpu.map(g => ({
                Model: g.model,
                VRAM: `${(g.vram / 1024).toFixed(2)} GB`,
                Vendor: g.vendor
            }))
        });

        // Update CPU Architecture
        const archElement = document.querySelector('.info-card:nth-child(1) .info-row:first-child .chip-badge');
        if (archElement) {
            archElement.textContent = sysInfo.cpu.architecture;
        }

        // Update Instruction Set Extensions
        const instructionSet = document.querySelector('.info-card:nth-child(1) .chip-group');
        if (instructionSet) {
            instructionSet.innerHTML = '';
            if (sysInfo.cpu.instructions.hasAVX) {
                instructionSet.innerHTML += '<span class="chip-badge">AVX</span>';
            }
            if (sysInfo.cpu.instructions.hasAVX2) {
                instructionSet.innerHTML += '<span class="chip-badge">AVX2</span>';
            }
        }

        // Update GPU info
        if (sysInfo.gpu.length > 0) {
            const gpu = sysInfo.gpu[0];  // Using first GPU
            const gpuModelElement = document.querySelector('.info-card:nth-child(2) .gpu-model');
            const gpuCountElement = document.querySelector('.info-card:nth-child(2) .gpu-count');
            const vramElement = document.querySelector('.info-card:nth-child(2) .info-row:last-child .info-value');

            if (gpuModelElement) gpuModelElement.textContent = gpu.model;
            if (gpuCountElement) gpuCountElement.textContent = `${sysInfo.gpu.length} GPU detected`;
            if (vramElement) vramElement.textContent = `${(gpu.vram / 1024).toFixed(2)} GB`;
        }

        // Update Memory info
        const ramElement = document.querySelector('.info-card:nth-child(3) .info-row:first-child .info-value');
        const vramTotalElement = document.querySelector('.info-card:nth-child(3) .info-row:last-child .info-value');

        if (ramElement) {
            const totalRAM = (sysInfo.memory.total / (1024 * 1024 * 1024)).toFixed(2);
            ramElement.textContent = `${totalRAM} GB`;
        }

        if (vramTotalElement && sysInfo.gpu.length > 0) {
            vramTotalElement.textContent = `${(sysInfo.gpu[0].vram / 1024).toFixed(2)} GB`;
        }

    } catch (error) {
        console.error('Error updating system info:', error);
    }
}

async function updatePerformanceStats() {
    try {
        const stats = await window.electronAPI.getPerformanceStats();
        console.log('Received performance stats:', stats);  // Add this line for debugging

        // Log the performance stats
        console.log('Performance Stats:', {
            CPU_Usage: `${stats.cpu}%`,
            Memory: {
                Used: `${(stats.memory.used / (1024 * 1024 * 1024)).toFixed(2)} GB`,
                Total: `${(stats.memory.total / (1024 * 1024 * 1024)).toFixed(2)} GB`
            },
            GPU: stats.gpu.map(g => ({
                Usage: `${g.usage}%`,
                MemoryUsed: `${(g.memoryUsed / 1024).toFixed(2)} GB`,
                MemoryTotal: `${(g.memoryTotal / 1024).toFixed(2)} GB`
            }))
        });
        // Update RAM + VRAM usage
        const ramVramElement = document.querySelector('.monitor-card:first-child .monitor-value');
        if (ramVramElement) {
            const ramUsage = (stats.memory.used / (1024 * 1024 * 1024)).toFixed(2);
            ramVramElement.textContent = `${ramUsage} GB`;
        }

        // Update CPU usage
        const cpuElement = document.querySelector('.monitor-card:last-child .monitor-value');
        if (cpuElement) {
            cpuElement.textContent = `${stats.cpu}%`;
        }

    } catch (error) {
        console.error('Error updating performance stats:', error);
    }
}

// New function to fetch and display models
async function fetchAndDisplayModels() {
    const modelListContainer = document.querySelector('.model-list');
    if (!modelListContainer) return;

    modelListContainer.innerHTML = '<div class="loading-message">Loading models...</div>'; // Show loading message

    try {
        const response = await fetch('http://127.0.0.1:8000/models');
        if (!response.ok) {
            console.error(`HTTP error fetching models: ${response.status} ${response.statusText}`); // Log status and statusText
            const errorText = await response.text(); // Get error text from response
            console.error('Response body:', errorText); // Log response body
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        modelListContainer.innerHTML = ''; // Clear loading message

        if (data.models && data.models.length > 0) {
            data.models.forEach(model => {
                const modelItem = createModelListItem(model);
                modelListContainer.appendChild(modelItem);
            });
        } else {
            modelListContainer.innerHTML = '<div class="no-models-message">No models found.</div>'; // Show no models message
        }
    } catch (error) {
        console.error('Error fetching models:', error);
        modelListContainer.innerHTML = '<div class="error-message">Failed to load models. Please check console.</div>'; // Show error message
    }
}

// Function to create a model list item element
function createModelListItem(model) {
    const item = document.createElement('div');
    item.classList.add('model-list-item');

    const header = document.createElement('div');
    header.classList.add('model-list-header');

    const icon = document.createElement('div');
    icon.classList.add('model-icon');
    icon.textContent = '🤖'; // Default icon

    const title = document.createElement('div');
    title.classList.add('model-title');
    title.textContent = model.model_id;

    const tag = document.createElement('div');
    tag.classList.add('model-tag');
    tag.textContent = model.tags.length > 0 ? model.tags[0] : 'N/A'; // Using first tag as example

    header.appendChild(icon);
    header.appendChild(title);
    header.appendChild(tag);

    const description = document.createElement('p');
    description.classList.add('model-description');
    description.textContent = model.description || 'No description available.'; // Use description or default message

    item.appendChild(header);
    item.appendChild(description);

    // Add event listener to handle model selection (you can expand this later)
    item.addEventListener('click', () => {
        // Remove selected class from all items
        document.querySelectorAll('.model-list-item').forEach(i => {
            i.classList.remove('selected');
        });
        // Add selected class to clicked item
        item.classList.add('selected');
        // Show model details section (you'll need to implement populateModelDetails function)
        populateModelDetails(model);
    });

    return item;
}

function populateModelDetails(model) {
    const modelDetailsSection = document.querySelector('.model-details-section');
    if (!modelDetailsSection) return;

    // For now, just update the model title in the details section
    // You will need to expand this to populate all the details you want to show
    const staffPickBanner = modelDetailsSection.querySelector('.staff-pick-banner p');
    if (staffPickBanner) {
        staffPickBanner.textContent = model.description || 'No description available.';
    }

    const modelTitleElement = modelDetailsSection.querySelector('.staff-pick-banner h3');
    if (modelTitleElement) {
        modelTitleElement.textContent = model.model_id;
    }

    const metaRow = modelDetailsSection.querySelector('.meta-row');
    if (metaRow) {
        metaRow.innerHTML = ''; // Clear existing meta data
        // Example meta items - expand as needed
        metaRow.appendChild(createMetaItem('Author:', model.author));
        metaRow.appendChild(createMetaItem('Downloads:', model.downloads));
        metaRow.appendChild(createMetaItem('Likes:', model.likes));
        metaRow.appendChild(createMetaItem('Last Modified:', new Date(model.last_modified).toLocaleDateString()));
    }

    // Show model details section
    document.querySelector('.model-list').style.display = 'block'; // Ensure model list is visible
    modelDetailsSection.style.display = 'block'; // Make details section visible
}

function createMetaItem(label, value) {
    const metaItem = document.createElement('div');
    metaItem.classList.add('meta-item');

    const metaLabel = document.createElement('span');
    metaLabel.classList.add('meta-label');
    metaLabel.textContent = label;

    const metaValue = document.createElement('span');
    metaValue.textContent = value || 'N/A';

    metaItem.appendChild(metaLabel);
    metaItem.appendChild(metaValue);
    return metaItem;
}
