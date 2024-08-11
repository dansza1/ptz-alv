
let selectedCamera = ''; // Initialize selected camera as empty string
let camerasData = null; // Initialize variable to store camera data
const storedTwitchURL = localStorage.getItem('twitchURL');
twitchURL = storedTwitchURL;

window.onload = function () {
    loadcheck();
    fetchCameraDataAndPopulateUI(); // Fetch camera data and populate UI
    // Check if Full PTZ is enabled and hide / show element    
};

function loadcheck() {
    const savedViewMode = localStorage.getItem('viewMode');
    const prePad = document.querySelector('.preset-container');

    if (savedViewMode === 'vid') {
        prePad.style.display = 'none';
    } else {
        toggleDirectionPad('.preset-container');
    }
    const savedCheckboxState = localStorage.getItem('fullPTZCheckboxState');
    const isFullPTZEnabled = savedCheckboxState === 'true';
    toggleDirectionContainer(isFullPTZEnabled);
    // Check if MPV Button is enabled and hide / show
    const savedMPVCheckboxState = localStorage.getItem('MPVCheckboxState');
    const isMPVEnabled = savedMPVCheckboxState === 'true';
    toggleMPV(isMPVEnabled);
}

// Load and set collapsed state of boxes on page load
window.addEventListener('load', () => {
    for (const [key, value] of Object.entries(localStorage)) {
        if (key.startsWith('boxState-')) {
            const selector = key.slice(9); // Extract selector from key (including the dot)
            const box = document.querySelector(selector);
            if (box) {
                const isCollapsed = value === 'true'; // Convert string value to boolean
                box.classList.toggle('collapsed');
            }
        }
    }
});

// Check if the thumbnailCheckbox setting exists in local storage
if (localStorage.getItem('thumbnailVisibility') === null) {
    // If not, initialize it with a default value of true
    localStorage.setItem('thumbnailVisibility', 'true');
}
if (localStorage.getItem('CamerathumbnailVisibility') === null) {
    // If not, initialize it with a default value of true
    localStorage.setItem('CamerathumbnailVisibility', 'true');
}

if (localStorage.getItem('swapHotkeyCheckboxState') === null) {
    // If not, initialize it with a default value of true
    localStorage.setItem('swapHotkeyCheckboxState', 'false');
}

if (localStorage.getItem('arrowKeyCheckboxState') === null) {
    // If not, initialize it with a default value of true
    localStorage.setItem('arrowKeyCheckboxState', 'true');
}

if (localStorage.getItem('fullPTZCheckboxState') === null) {
    // If not, initialize it with a default value of true
    localStorage.setItem('fullPTZCheckboxState', 'false');
}

if (localStorage.getItem('MPVCheckboxState') === null) {
    // If not, initialize it with a default value of true
    localStorage.setItem('MPVCheckboxState', 'false');
}

// Function to update thumbnail visibility based on checkbox state for grid layout
const updateThumbnailVisibility = (isChecked) => {
    const thumbnails = document.querySelectorAll('.grid-layout .preset-image, .grid-layout .custom-preset-image');
    thumbnails.forEach(thumbnail => {
        thumbnail.style.display = isChecked ? 'block' : 'none'; // Show/hide thumbnails based on checkbox state
    });
};

function updateCameraThumbnailVisibility(isChecked) {
    const cameraThumbnails = document.querySelectorAll('.camera-thumbnail');
    const cameraButtons = document.querySelectorAll('.camera-button');
    
    // Update visibility of thumbnails
    cameraThumbnails.forEach(thumbnail => {
        console.log(`Setting display for ${thumbnail.src} to ${isChecked ? 'block' : 'none'}`);
        thumbnail.style.display = isChecked ? 'block' : 'none';
    });

    // Update width of camera buttons based on checkbox state
    cameraButtons.forEach(button => {
        if (isChecked) {
            button.style.width = '140px'; // Example width when thumbnails are visible
            button.style.height = '28px'; // Example width when thumbnails are visible

        } else {
            button.style.width = '200px'; // Example width when thumbnails are hidden
            button.style.height = '30px'; // Example width when thumbnails are visible

        }
        console.log(`Setting width for button to ${button.style.width}`);
    });
}

// Function to update button height based on checkbox state for grid layout
const updateButtonHeight = (isChecked) => {
    const buttons = document.querySelectorAll('.grid-layout .preset-button, .grid-layout .custom-preset-button');
    buttons.forEach(button => {
        button.style.height = isChecked ? '30px' : '60px'; // Adjust height based on checkbox state
    });
};

// Helper function to reset inline styles
const resetInlineStyles = (element) => {
    element.style.height = '';
    element.style.marginTop = '';
    element.style.paddingTop = '';
    element.style.display = '';
};

// Function to toggle the visibility of the mpv button 
function toggleMPV(isVisible) {
    const mpvbutton = document.getElementsByClassName('mpv-button')[0];
    if (mpvbutton) {
        mpvbutton.style.display = isVisible ? 'block' : 'none';
    } else {
        console.error('mpv-button element not found.');
    }
}

function toggleDirectionPad(selector) {
    const directionPad = document.querySelector(selector);
    const listLayout = document.querySelector('.list-layout');
    const gridLayout = document.querySelector('.grid-layout');
    const customPresetLabel = document.querySelector('.custom-label-preset');
    const customPresetPad = document.querySelector('.custom-preset-pad');

    if (directionPad) {
        directionPad.classList.toggle('collapsed');
        const isCollapsed = directionPad.classList.contains('collapsed');

        if (customPresetLabel && customPresetPad) {
            if (listLayout && selector === '.preset-pad') {
                if (isCollapsed) {
                    customPresetLabel.style.marginTop = '-10px';
                    customPresetPad.style.paddingTop = '15px';
                } else {
                    customPresetLabel.style.marginTop = ''; // Remove inline style
                    customPresetPad.style.paddingTop = ''; // Remove inline style
                }
            } else if (gridLayout && selector === '.preset-pad') {
                if (isCollapsed) {
                    customPresetLabel.style.marginTop = '-30px';
                } else {
                    customPresetLabel.style.marginTop = ''; // Remove inline style
                }
            }
        }
        // Store collapsed state in local storage
        if (isCollapsed) {
            localStorage.setItem(`boxState-${selector}`, true);

        } else {
            localStorage.removeItem(`boxState-${selector}`);
        }
    } else {
        console.log('Element not found with selector:', selector);
    }
}

function togglePad(selector) {
    const directionPads = document.querySelectorAll('.direction-pad, .pantilt-pad, .zoom-pad');
    directionPads.forEach(pad => {
        if (pad.classList.contains(selector.replace('.', ''))) {
            pad.classList.remove('hidden'); // Show the pad
        } else {
            pad.classList.add('hidden'); // Hide the pad
        }
    });
}

// Function to toggle the visibility of the direction container
function toggleDirectionContainer(isVisible) {

    const ptzContainer = document.getElementById('ptzContainer');
    if (ptzContainer) {
        ptzContainer.style.display = isVisible ? 'block' : 'none';
    } else {
        console.error('ptzContainer element not found.');
    }

    const directionpadContainer = document.getElementById('directionpadContainer');
    if (directionpadContainer) {
        directionpadContainer.style.display = isVisible ? 'block' : 'none';
    } else {
        console.error('directionpadContainer element not found.');
    }

    const irContainer = document.getElementById('irContainer');
    if (irContainer) {
        irContainer.style.display = isVisible ? 'block' : 'none';
    } else {
        console.error('irContainer element not found.');
    }
    const mpvbutton = document.getElementsByClassName('mpv-button')[0];
    if (mpvbutton) {
        mpvbutton.style.display = isVisible ? 'block' : 'none';
    } else {
        console.error('mpv-button element not found.');
    }
    const clickIcon = document.getElementById('vidIcon');
    if (clickIcon) {
        clickIcon.style.display = isVisible ? 'inline-block' : 'none';
    } else {
        console.error('clickIcon element not found.');
    }

    const custompresetpadContainer = document.getElementById('customPresetPad');
    const customLabelPreset = document.querySelector('.custom-label-preset');

    if (custompresetpadContainer && customLabelPreset) {
        // Check if the parent container has the class 'list-layout' or 'grid-layout'
        const parentContainer = custompresetpadContainer.closest('.list-layout, .grid-layout');
        const isListLayout = parentContainer && parentContainer.classList.contains('list-layout');
        const isGridLayout = parentContainer && parentContainer.classList.contains('grid-layout');

        if (isListLayout) {
            console.log("Setting display for list layout");
            custompresetpadContainer.style.display = isVisible ? 'grid' : 'none';
            customLabelPreset.style.display = isVisible ? 'block' : 'none';
        } else if (isGridLayout) {
            console.log("Setting display for grid layout");
            custompresetpadContainer.style.display = isVisible ? 'flex' : 'none';
            customLabelPreset.style.display = isVisible ? 'block' : 'none';
        } else {
            console.log("Setting display for default layout");
            custompresetpadContainer.style.display = isVisible ? 'block' : 'none';
            customLabelPreset.style.display = isVisible ? 'block' : 'none';
        }
    }
    else {
        console.error('custompresetpadContainer or customLabelPreset element not found.');
    }
}

function toggleVideo(selector) {

    const vidButtons = document.querySelector('.vidbuttondiv');
    const presetPad = document.querySelector('.presetPad');
    const twitchIframe = document.getElementById('video-placeholder');
    const presetCards = document.querySelectorAll('.preset-container-card');
    const presetContainer = document.querySelector('.preset-container');


    // Toggle visibility based on selector
    if (selector === 'video') {
        twitchIframe.style.visibility = 'visible';
        twitchIframe.style.display = 'block';

        presetContainer.style.display = 'none';

        // Loop through each element and add the 'hidden' class
        presetCards.forEach(card => {
            card.classList.add('hidden');
        });

    } else if (selector === 'presets') {
        const presetPads = document.querySelector('.preset-pad');
        if (presetPads && presetPads.classList.contains('collapsed')) {
            toggleDirectionPad('.preset-pad');
        }
        const prePad = document.querySelector('.preset-container');
        if (prePad.classList.contains('collapsed')) {
            toggleDirectionPad('.preset-container');
        }

        // Loop through each element and remove the 'hidden' class
        presetCards.forEach(card => {
            card.classList.remove('hidden');
        });

        twitchIframe.style.display = 'none';
        vidButtons.style.display = 'block';
        presetContainer.style.display = '';


    } else {
        // Handle unexpected selector values (optional)
        console.error("Invalid selector:", selector);
    }
}

function animateButton(button) {
    // Apply scale transformation to shrink the button
    button.style.transform = 'scale(0.9)';

    // Reset the scale after a short delay
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 100);
}

function setActiveHeading(headingClass) {
    const allHeadings = document.querySelectorAll('.direction-move-heading, .direction-pan-heading, .direction-zoom-heading');
    allHeadings.forEach(h => h.classList.remove('active'));

    const headings = document.querySelectorAll(headingClass);
    headings.forEach(h => h.classList.add('active'));
}

async function fetchTwitchURL() {
    fetch('/twitch-settings')
        .then(response => {
            if (!response.ok) {
                console.error('Error fetching Twitch settings. Status:', response.status);
                return response.text().then(text => console.error('Response body:', text));
            }
            return response.json();
        })
        .then(data => {
            // Update the global variable with the fetched URL
            twitchURL = data.twitch.url || 'https://player.twitch.tv/?channel=alveussanctuary&parent=localhost';
            localStorage.setItem('twitchURL', twitchURL);            
        })
        .catch(error => console.error('Error fetching Twitch settings:', error));
}


document.addEventListener('DOMContentLoaded', function () {
    const gridIcon = document.getElementById('gridIcon');
    const listIcon = document.getElementById('listIcon');
    const presetContainer = document.querySelector('.preset-container');
    const customPresetContainer = document.querySelector('.custom-preset-container');

    function openPresetDialog() {
        // Create the dialog element if it doesn't exist
        let dialog = document.getElementById('dialog');
        let closeButton;
        adjustLayout();

        document.body.classList.add('no-scroll'); // Disable scrolling
        if (!dialog) {
            dialog = document.createElement('div');
            dialog.id = 'dialog';
            dialog.className = 'dialog'; // Default class

            const dialogContent = document.createElement('div');
            dialogContent.className = 'dialog-content';

            closeButton = document.createElement('span');
            closeButton.id = 'closeDialogButton';
            closeButton.className = 'close-button';
            closeButton.innerHTML = '&times;'; // Close button (×)

            // Append elements to the dialog content
            dialogContent.appendChild(closeButton);

            // Append dialog content to the dialog
            dialog.appendChild(dialogContent);

            // Append dialog to the body
            document.body.appendChild(dialog);
        } else {
            closeButton = document.getElementById('closeDialogButton');
        }

        // Get the existing preset-container
        const originalPresetContainer = document.querySelector('.preset-container');
        if (originalPresetContainer) {
            // Clone the preset-container
            const clonedPresetContainer = originalPresetContainer.cloneNode(true);

            // Determine layout type
            const isGridLayout = originalPresetContainer.classList.contains('grid-layout');
            const layoutType = isGridLayout ? 'grid-layout' : 'list-layout';


            // Remove any existing layout classes
            dialog.classList.remove('grid-layout', 'list-layout');

            // Add the appropriate layout class
            if (isGridLayout) {
                dialog.classList.add('grid-layout');
            } else {
                dialog.classList.add('list-layout');
            }
            // Apply styles based on layout type
            applyStyles(layoutType);
            adjustLayout();

            // Add layout-specific class to dialog
            dialog.classList.add(layoutType);

            // Ensure that the cloned elements are visible
            const presetCards = clonedPresetContainer.querySelectorAll('.preset-container-card');
            presetCards.forEach(card => {
                card.classList.remove('hidden');
                card.style.display = ''; // Ensure it's visible
            });

            // Ensure no unwanted styles are applied
            clonedPresetContainer.classList.remove('collapsed'); // Remove 'collapsed' class
            clonedPresetContainer.style.display = ''; // Ensure it's visible

            // Handle layout-specific adjustments
            if (isGridLayout) {
                clonedPresetContainer.classList.remove('collapsed'); // Ensure it's expanded
                const gridItems = clonedPresetContainer.querySelectorAll('.grid-item'); // Adjust selector as needed
                gridItems.forEach(item => {
                    item.classList.remove('hidden');
                    item.style.display = ''; // Ensure it's visible
                });
            } else {
                clonedPresetContainer.classList.remove('collapsed'); // Ensure it's expanded
                clonedPresetContainer.querySelectorAll('.preset-pad').forEach(presetPad => {
                    presetPad.classList.remove('collapsed');
                    presetPad.style.display = ''; // Ensure it's visible
                });
            }

            const clonedPresetPads = clonedPresetContainer.querySelectorAll('.preset-pad');
            const clonedLabelHeading = clonedPresetContainer.querySelector('.label-preset-heading');

            if (clonedLabelHeading) {
                clonedLabelHeading.style.cursor = 'pointer';
                clonedLabelHeading.addEventListener('click', () => {
                    clonedPresetPads.forEach(presetPad => {
                        presetPad.classList.toggle('collapsed');
                    });
                });
            }
            // Reattach event listeners to cloned buttons and images
            reattachListeners(clonedPresetContainer);

            // Clear previous content in the dialog and append the cloned container
            const dialogContent = document.querySelector('.dialog-content');
            if (dialogContent) {
                // Clear previous content
                dialogContent.innerHTML = '';
                dialogContent.appendChild(closeButton);
                dialogContent.appendChild(clonedPresetContainer);

                // Show the dialog
                dialog.style.display = 'block';

                // Ensure styles are applied
                applyStyles(layoutType); // Call with layoutType to apply specific styles
            }
        }

        // Event listeners for closing the dialog
        closeButton.addEventListener('click', closePresetDialog);
        window.addEventListener('click', (event) => {
            if (event.target === dialog) {
                closePresetDialog();
            }
        });

        // Function to close the dialog
        function closePresetDialog() {
            dialog.style.display = 'none';
            document.body.classList.remove('no-scroll'); // Enable scrolling
        }
    }

    function applyStyles(isGridLayout) {
        const style = document.createElement('style');
        style.textContent = `
           .dialog {
                display: none; /* Hidden by default */
                position: fixed;
                left: 50%; /* Center horizontally */
                top: 0; /* Cover full screen vertically */
                transform: translateX(-50%); /* Center horizontally */
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,0.5); /* Semi-transparent background */
                z-index: 1000; /* Make sure it appears on top */
                overflow: hidden; /* Prevent scrolling within the dialog */
            }

            .dialog-content {
                background: #404040;
                padding: 20px;
                border-radius: 5px;
                position: absolute; /* Position absolutely within the dialog */
                top: 35%; /* Move down from vertical center (adjust this value) */
                left: 50%; /* Center horizontally within the dialog */
                transform: translate(-50%, -50%); /* Adjust to center content */
                width: 80%;
                max-width: 800px;
                max-height: 80vh; /* Limit height to viewport height */
                overflow-y: auto; /* Allow scrolling within the dialog content if it overflows */
            }

            .dialog.grid-layout .dialog-content {
                width: 90%; /* Adjust width for grid layout */
                max-width: 60%; /* Example max width for grid layout */
            }

            .dialog.list-layout .dialog-content {
                width: 80%; /* Adjust width for list layout */
                max-width: 500px; /* Example max width for list layout */
            }

            .close-button {
                float: right;
                font-size: 24px;
                cursor: pointer;
            }
        `;
        document.head.appendChild(style);
    }

    // Function to reattach event listeners to cloned buttons and images
    function reattachListeners(container) {
        const presetButtons = container.querySelectorAll('.preset-button');
        const customPresetButtons = container.querySelectorAll('.custom-preset-button');

        // Reattach event listeners to preset buttons
        presetButtons.forEach(button => {
            button.addEventListener('click', () => sendLoadCommand(selectedCamera, button.textContent));
        });

        // Reattach event listeners to custom preset buttons
        customPresetButtons.forEach(button => {
            button.addEventListener('click', () => sendCustomDialogCommand(selectedCamera, button.textContent));
        });

        // Reattach event listeners to images
        const images = container.querySelectorAll('img');
        images.forEach(image => {
            image.addEventListener('click', (event) => {
                const button = event.target.closest('.preset-button-container')?.querySelector('.preset-button')
                    || event.target.closest('.custom-preset-button-container')?.querySelector('.custom-preset-button');
                if (button) {
                    button.click();
                }
            });
        });
    }



    // Function to remove active class from all icons
    const removeActiveClassFromIcons = () => {
        gridIcon.classList.remove('active-icon');
        listIcon.classList.remove('active-icon');
    };

    // Function to switch to grid view
    const switchToGridView = () => {
        removeActiveClassFromIcons(); // Remove active class from all icons
        gridIcon.classList.add('active-icon'); // Add active class to grid icon
        presetContainer.style.display = '';
        presetContainer.classList.remove('list-layout');
        presetContainer.classList.add('grid-layout');
        customPresetContainer.classList.remove('list-layout');
        localStorage.setItem('viewMode', 'grid'); // Save the selection to localStorage

        const vidButtons = document.querySelector('.vidbuttondiv');
        vidButtons.style.display = 'none';
        // Remove or clear video-container to stop the iframe
        const videoPlaceholder = document.getElementById("video-placeholder");
        const videoContainer = document.getElementById("video-container");
        const videoContainerCard = document.getElementById("video-container-card");

        videoPlaceholder.classList.remove("video-active");

        if (videoContainer) {
            videoPlaceholder.removeChild(videoContainerCard); // Remove the entire video-container
        }

        // Retrieve the checkbox state from localStorage
        const thumbnailCheckboxState = localStorage.getItem('thumbnailVisibility');
        const thumbnailCheckboxChecked = thumbnailCheckboxState === 'true';

        // Use the checkbox state to determine visibility and button height
        updateThumbnailVisibility(thumbnailCheckboxChecked);
        updateButtonHeight(thumbnailCheckboxChecked);

        // Check if preset-pad is collapsed, if yes, run toggleDirectionPad('.preset-pad')
        const presetPad = document.querySelector('.preset-pad');
        presetPad.style.display = 'flex';

        if (presetPad && presetPad.classList.contains('collapsed')) {
            toggleDirectionPad('.preset-pad');
        }
        const prePad = document.querySelector('.preset-container');
        if (prePad.classList.contains('collapsed')) {
            toggleDirectionPad('.preset-container');
        }
        // Select all elements with the class 'preset-container-card'
        const presetCards = document.querySelectorAll('.preset-container-card');

        // Loop through each element and add the 'hidden' class
        presetCards.forEach(card => {
            card.classList.remove('hidden');
        });
        const savedCheckboxState = localStorage.getItem('fullPTZCheckboxState');
        const isFullPTZEnabled = savedCheckboxState === 'true';
        toggleDirectionContainer(isFullPTZEnabled);
    };

    // Function to switch to list view
    const switchToListView = () => {
        removeActiveClassFromIcons(); // Remove active class from all icons
        listIcon.classList.add('active-icon'); // Add active class to list icon
        presetContainer.style.display = '';
        presetContainer.classList.remove('grid-layout');
        presetContainer.classList.add('list-layout');
        customPresetContainer.classList.remove('grid-layout');
        customPresetContainer.classList.add('list-layout');
        localStorage.setItem('viewMode', 'list'); // Save the selection to localStorage

        const vidButtons = document.querySelector('.vidbuttondiv');
        vidButtons.style.display = 'none';
        // Remove or clear video-container to stop the iframe
        const videoPlaceholder = document.getElementById("video-placeholder");
        const videoContainer = document.getElementById("video-container");
        videoPlaceholder.classList.remove("video-active");
        const videoContainerCard = document.getElementById("video-container-card");

        if (videoContainer) {
            videoPlaceholder.removeChild(videoContainerCard); // Remove the entire video-container
        }

        // Always hide thumbnails in list view
        const thumbnails = document.querySelectorAll('.preset-image, .custom-preset-image');
        thumbnails.forEach(thumbnail => {
            thumbnail.style.display = 'none';
        });

        const affectedElements = document.querySelectorAll('.preset-button, .custom-preset-button, .preset-pad, .preset-container-card');
        affectedElements.forEach(element => resetInlineStyles(element));

        // Check if preset-pad is collapsed, if yes, run toggleDirectionPad('.preset-pad')
        const presetPad = document.querySelector('.preset-pad');
        if (presetPad && presetPad.classList.contains('collapsed')) {
            toggleDirectionPad('.preset-pad');
        }
        const prePad = document.querySelector('.preset-container');
        if (prePad.classList.contains('collapsed')) {
            toggleDirectionPad('.preset-container');
        }
        // Select all elements with the class 'preset-container-card'
        const presetCards = document.querySelectorAll('.preset-container-card');

        // Loop through each element and add the 'hidden' class
        presetCards.forEach(card => {
            card.classList.remove('hidden');
        });
        const savedCheckboxState = localStorage.getItem('fullPTZCheckboxState');
        const isFullPTZEnabled = savedCheckboxState === 'true';
        toggleDirectionContainer(isFullPTZEnabled);
    };

    const switchToVidView = () => {
        removeActiveClassFromIcons(); // Remove active class from all icons
        vidIcon.classList.add('active-icon'); // Add active class to video icon
        localStorage.setItem('viewMode', 'vid'); // Save the selection to localStorage
        fetchTwitchURL();

        // Check if 'preset-pad' is not collapsed and toggle it if needed
        const prePad = document.querySelector('.preset-container');
        if (!prePad.classList.contains('collapsed')) {
            toggleDirectionPad('.preset-container');
        }

        const videoPlaceholder = document.getElementById("video-placeholder");
        videoPlaceholder.classList.add("video-active");
        videoPlaceholder.style.display = 'block';

        // Select all elements with the class 'preset-container-card'
        const presetCards = document.querySelectorAll('.preset-container-card');

        // Loop through each element and add the 'hidden' class
        presetCards.forEach(card => {
            card.classList.add('hidden');
        });

        // Check if the videoContainerCard already exists
        let existingContainer = document.getElementById("video-container-card");
        if (existingContainer) {
            // If it exists, simply show it and return
            existingContainer.style.display = 'block';
            return;
        }

        // Create the parent div
        const videoContainerCard = document.createElement("div");
        videoContainerCard.id = "video-container-card";
        videoContainerCard.style.backgroundColor = '#1c1c1c';
        videoContainerCard.style.boxShadow = '0 0 10px 0 rgba(0,0,0,0.45) inset';
        videoContainerCard.style.borderRadius = '10px';
        videoContainerCard.style.paddingLeft = '18px';
        videoContainerCard.style.position = 'absolute';
        videoContainerCard.style.width = 'calc(99%)';
        videoContainerCard.style.height = 'calc(98vh)';
        videoContainerCard.style.top = '0';
        videoContainerCard.style.left = '-18px';
        videoContainerCard.style.margin = '10px';

        const buttonDiv = document.createElement("div");
        buttonDiv.classList.add("button-container");

        // Create buttons
        const button1 = document.createElement("button");
        button1.classList.add("vidbutton");
        button1.textContent = "Full Cam";
        button1.addEventListener('click', function () {
            showCamera(1);
        });

        const button2 = document.createElement("button");
        button2.classList.add("vidbutton2");
        button2.textContent = "Presets";
        button2.addEventListener('click', function () {
            openPresetDialog();
        });

        const button3 = document.createElement("button");
        button3.classList.add("vidbutton3");
        button3.textContent = "Area Select";
        button3.addEventListener('click', function () {
            toggleOverlayZIndex();
        });

        const button4 = document.createElement("button");
        button4.classList.add("vidbutton4");
        button4.textContent = "Click On";
        button4.classList.add("highlighted"); // Add a class to indicate highlighted state
        button4.addEventListener('click', function () {
            toggleOverlay();
            updateClickButtonLabel();
        });

        // Create a container for the left buttons
        const leftButtonDiv = document.createElement("div");
        leftButtonDiv.classList.add("left-buttons");
        leftButtonDiv.appendChild(button2);
        buttonDiv.appendChild(leftButtonDiv);
        buttonDiv.appendChild(button3);

        const videoContainer = document.createElement("div");
        videoContainer.id = "video-container";
        videoContainer.style.position = 'relative';
        videoContainer.style.width = '100%';
        videoContainer.style.height = '100vh';
        videoContainer.style.overflow = 'hidden';
        videoContainer.style.display = 'block';
        videoContainer.style.marginTop = '40px';
        videoContainer.style.marginLeft = '-5px';

        const iframe = document.createElement("iframe");
        iframe.id = "twitchIframe";
        iframe.src = twitchURL;
        iframe.frameBorder = "0";
        iframe.allow = "autoplay; fullscreen";
        iframe.allowFullscreen = true;
        iframe.style.width = '99%';
        iframe.style.height = '90%';
        iframe.style.objectFit = 'cover';
        iframe.style.position = 'absolute';
        iframe.style.zIndex = '1';


        const boxOverlay = document.createElement("div");
        boxOverlay.id = "boxoverlay";
        boxOverlay.style.position = 'absolute';
        boxOverlay.style.top = '0';
        boxOverlay.style.left = '0';
        boxOverlay.style.width = '100%';
        boxOverlay.style.height = '100%';
        boxOverlay.style.zIndex = '1';

        const clickOverlay = document.createElement("div");
        clickOverlay.id = "clickoverlay";
        clickOverlay.style.position = 'absolute';
        clickOverlay.style.top = '0';
        clickOverlay.style.left = '0';
        clickOverlay.style.width = '100%';
        clickOverlay.style.height = '100%';
        clickOverlay.style.zIndex = '3';
        clickOverlay.style.cursor = 'pointer';


        const canvasOverlay = document.createElement("canvas");
        canvasOverlay.id = "canvasoverlay";
        canvasOverlay.style.position = 'absolute';
        canvasOverlay.style.top = '0';
        canvasOverlay.style.left = '0';
        canvasOverlay.style.width = '100%';
        canvasOverlay.style.height = '100%';
        canvasOverlay.style.zIndex = '2';


        buttonDiv.appendChild(button2);
        buttonDiv.appendChild(button3);
        buttonDiv.appendChild(button4);

        // Add the iframe and overlays to the video-container
        videoContainer.appendChild(iframe);
        videoContainer.appendChild(boxOverlay);
        videoContainer.appendChild(clickOverlay);
        videoContainer.appendChild(canvasOverlay);

        videoContainerCard.appendChild(buttonDiv);

        // Insert the video-container into the placeholder
        videoPlaceholder.appendChild(videoContainer);
        videoContainerCard.appendChild(videoContainer);
        videoPlaceholder.appendChild(videoContainerCard);


        loadcanvas();
        loadboxoutlines();
        loadclickoverlay();
        setupEventListeners();

    };

    // Check if there is a previous selection stored in localStorage
    const savedViewMode = localStorage.getItem('viewMode');
    if (savedViewMode === 'grid') {
        switchToGridView();
    } else if (savedViewMode === 'list') {
        switchToListView();
    } else if (savedViewMode === 'vid') {
        switchToVidView();
    }

    gridIcon.addEventListener('click', switchToGridView);
    listIcon.addEventListener('click', switchToListView);
    vidIcon.addEventListener('click', switchToVidView);

});

function setupEventListeners() {
    const clickOverlay = document.getElementById('clickoverlay');
    const canvasOverlay = document.getElementById('canvasoverlay');
    const canvasContainers = document.querySelectorAll('.canvas-container');

    function handleRightClick(event) {
        event.preventDefault(); // Prevent the default context menu from appearing
        toggleOverlayZIndex();
    }

    // Remove existing listeners if needed
    clickOverlay.removeEventListener('contextmenu', handleRightClick);
    canvasOverlay.removeEventListener('contextmenu', handleRightClick);
    canvasContainers.forEach(container => container.removeEventListener('contextmenu', handleRightClick));

    // Add listeners
    clickOverlay.addEventListener('contextmenu', handleRightClick);
    canvasOverlay.addEventListener('contextmenu', handleRightClick);

    canvasContainers.forEach(container => {
        container.addEventListener('contextmenu', handleRightClick);
    });
}

const toggleOverlay = () => {
    const canvasOverlay = document.getElementById('canvasoverlay');
    const canvasContainer = document.querySelector('.canvas-container');
    const clickOverlay = document.getElementById('clickoverlay');
    const boxOverlay = document.getElementById('boxoverlay');
    const iframe = document.getElementById("twitchIframe");
    const videoPlaceholder = document.getElementById("video-placeholder");

    if (iframe.style.zIndex === '1') {
        iframe.style.zIndex = '5';
    } else if (iframe.style.zIndex === '5') {
        iframe.style.zIndex = '1';
    }
    setTimeout(() => {
        updateClickButtonLabel();
    }, 0);

};

function updateClickButtonLabel() {
    const iframe = document.getElementById("twitchIframe");
    const button4 = document.querySelector('.vidbutton4'); // Adjust selector as needed
    const button3 = document.querySelector('.vidbutton3'); // Adjust selector as needed


    // Use getComputedStyle to get the actual zIndex if needed
    const isOverlayOn = iframe.style.zIndex === '1';
    // Update button label based on the condition
    button4.textContent = isOverlayOn ? "Click On" : "Click Off";

    if (isOverlayOn) {
        button3.style.visibility = 'visible'; // Show button3
        button4.classList.add('highlighted');
    } else {
        button3.style.visibility = 'hidden'; // Hide button3
        button4.classList.remove('highlighted');
    }
}

// Function to update button highlight based on clickOverlay zIndex
const updateButtonHighlight = () => {
    const clickOverlay = document.getElementById('clickoverlay');
    const button3 = document.querySelector('.vidbutton3');

    if (clickOverlay && button3) {
        if (clickOverlay.style.zIndex === '2') {
            button3.classList.add('highlighted');
        } else {
            button3.classList.remove('highlighted');
        }
    }
};

const toggleOverlayZIndex = () => {
    const canvasOverlay = document.getElementById('canvasoverlay');
    const canvasContainer = document.querySelector('.canvas-container');
    const clickOverlay = document.getElementById('clickoverlay');
    const iframe = document.getElementById("twitchIframe");
    const videoPlaceholder = document.getElementById("video-placeholder");

    if (clickOverlay.style.zIndex === '3') {
        clickOverlay.style.zIndex = '2';
        canvasOverlay.style.zIndex = '3';
        canvasContainer.style.display = '';
        loadcanvas();
    } else if (clickOverlay.style.zIndex === '2') {
        clickOverlay.style.zIndex = '3';
        canvasOverlay.style.zIndex = '2';
        canvasContainer.style.display = 'none';
    }
    updateButtonHighlight();
};


// Main event listener to handle clicks on the overlay
function loadcanvas() {

    const canvasOverlay = document.getElementById("canvasoverlay");
    if (!canvasOverlay) {
        console.error("Click-overlay element not found.");
        return;
    }

    // Get viewport dimensions to calculate scaling factors
    const iframe = document.getElementById("twitchIframe");

    const viewportWidth = iframe.clientWidth;
    const viewportHeight = iframe.clientHeight;

    console.log(`Viewport Width: ${viewportWidth}, Height: ${viewportHeight}`);

    // Calculate expected 16:9 height and width
    const expected16x9Height = (9 / 16) * viewportWidth;
    const expected16x9Width = (16 / 9) * viewportHeight;

    // Determine effective width and height considering black bars
    let effectiveWidth;
    let effectiveHeight;

    if (expected16x9Height > viewportHeight) {
        effectiveHeight = viewportHeight;
        effectiveWidth = expected16x9Width;
    } else {
        effectiveWidth = viewportWidth;
        effectiveHeight = expected16x9Height;
    }

    // Calculate horizontal and vertical offsets due to black bars
    const horizontalOffset = (viewportWidth - effectiveWidth) / 2;
    const verticalOffset = (viewportHeight - effectiveHeight) / 2;

    console.log(`Horizontal Offset: ${horizontalOffset}, Vertical Offset: ${verticalOffset}`);

    // Define scaling factors relative to 1080p
    const widthScale = effectiveWidth / 1920;
    const heightScale = effectiveHeight / 1080;



    console.log(`Width Scale: ${widthScale}, Height Scale: ${heightScale}`);

    // Define box boundaries with correct offsets and scaling
    const boxBoundaries = [
        {
            id: 1,
            x: horizontalOffset,
            y: verticalOffset,
            width: 640 * widthScale,
            height: 360 * heightScale,
        },
        {
            id: 2,
            x: horizontalOffset,
            y: verticalOffset + (360 * heightScale),
            width: 640 * widthScale,
            height: 360 * heightScale,
        },
        {
            id: 3,
            x: horizontalOffset,
            y: verticalOffset + (720 * heightScale),
            width: 640 * widthScale,
            height: 360 * heightScale,
        },
        {
            id: 4,
            x: horizontalOffset + (640 * widthScale),
            y: verticalOffset + (720 * heightScale),
            width: 640 * widthScale,
            height: 360 * heightScale,
        },
        {
            id: 5,
            x: horizontalOffset + (1280 * widthScale),
            y: verticalOffset + (720 * heightScale),
            width: 640 * widthScale,
            height: 360 * heightScale,
        },
        {
            id: 6,
            x: horizontalOffset + (640 * widthScale),
            y: verticalOffset,
            width: 1280 * widthScale,
            height: 720 * heightScale,
        },
    ];

    // Log box boundaries for troubleshooting
    boxBoundaries.forEach((box) => {
        console.log(`Box ID: ${box.id}, x: ${box.x}, y: ${box.y}, width: ${box.width}, height: ${box.height}`);
    });

    // Initialize the Fabric.js canvas
    const canvas = new fabric.Canvas(canvasOverlay, {
        width: viewportWidth,
        height: viewportHeight
    });

    console.log("Fabric.js canvas initialized with width:", viewportWidth, "and height:", viewportHeight);

    let isDrawing = false;
    let startPoint = { x: 0, y: 0 };
    let rect;
    let button;

    canvas.on('mouse:down', function (options) {
        if (options.target) return;
        isDrawing = true;
        startPoint = { x: options.e.offsetX, y: options.e.offsetY };
        console.log("Start point set to:", startPoint);
    });

    canvas.on('mouse:move', function (options) {
        if (!isDrawing) return;
        if (rect) {
            canvas.remove(rect);
            if (rect.button) {
                canvas.remove(rect.button);
            }
        }
        rect = new fabric.Rect({
            left: startPoint.x,
            top: startPoint.y,
            width: options.e.offsetX - startPoint.x,
            height: options.e.offsetY - startPoint.y,
            fill: 'rgba(255,0,0,0.3)',
            stroke: 'red',
            strokeWidth: 2,
            selectable: true,
            hasControls: true,
            hasBorders: true,
            originX: 'left',
            originY: 'top'
        });
        canvas.add(rect);
    });

    canvas.on('mouse:up', function (options) {
        isDrawing = false;
        if (rect) {
            rect.set({
                selectable: true,
                hasControls: true,
                hasBorders: true,
                cornerColor: 'white', // Color of the resize controls
                cornerStrokeColor: 'yellow', // Color of the border around the resize controls
                cornerSize: 10 // Size of the resize controls
            });

            // Check if the button already exists
            if (!rect.button) {
                // Create a new button-like object inside the rectangle
                const buttonSize = Math.min(rect.width, rect.height) * 0.1; // Button size as a percentage of the smallest dimension
                button = new fabric.Rect({
                    left: rect.left + rect.width - buttonSize, // Position relative to rectangle
                    top: rect.top + rect.height - buttonSize, // Position relative to rectangle
                    width: buttonSize,
                    height: buttonSize,
                    fill: 'blue',
                    selectable: false,
                    hasControls: false,
                    hasBorders: false,
                    hoverCursor: 'pointer' // Change cursor to pointer on hover
                });

                canvas.add(button);
                button.bringToFront(); // Bring the button to the front
                canvas.renderAll();

                // Attach the button to the rectangle
                rect.button = button;
            }
        }
    });

    // Function to update the button position relative to the rectangle
    function updateButtonPosition(rect) {
        const buttonSize = Math.min(rect.width, rect.height) * 0.1; // Button size as a percentage of the smallest dimension
        const rectLeft = rect.left + (rect.width * rect.scaleX);
        const rectTop = rect.top + (rect.height * rect.scaleY);

        rect.button.set({
            left: rectLeft - buttonSize,
            top: rectTop - buttonSize,
            width: buttonSize,
            height: buttonSize
        });
        rect.button.setCoords();
        canvas.renderAll();
    }

    // Update button position on move or resize
    canvas.on('object:moving', function (options) {
        const rect = options.target;
        if (rect.type === 'rect' && rect.button) {
            updateButtonPosition(rect);
        }
    });

    canvas.on('object:scaling', function (options) {
        const rect = options.target;
        if (rect.type === 'rect' && rect.button) {
            updateButtonPosition(rect);
        }
    });

    canvas.on('mouse:down', function (options) {
        if (options.target === button) {
            if (rect) {

                const rectBounds = rect.getBoundingRect();
                const centerX = rectBounds.left + rectBounds.width / 2;
                const centerY = rectBounds.top + rectBounds.height / 2;

                // Use the same box boundaries as the click overlay
                const updatedBoxBoundaries = boxBoundaries;

                // Log the updated box boundaries
                updatedBoxBoundaries.forEach((box) => {
                    console.log(`Updated Box ID: ${box.id}, x: ${box.x.toFixed(2)}, y: ${box.y.toFixed(2)}, width: ${box.width.toFixed(2)}, height: ${box.height.toFixed(2)}`);
                });

                // Find the box containing the rectangle coordinates
                const clickedBox = updatedBoxBoundaries.find(
                    (box) =>
                        centerX >= box.x &&
                        centerX < box.x + box.width &&
                        centerY >= box.y &&
                        centerY < box.y + box.height
                );

                if (!clickedBox) {
                    console.error("Rectangle drawn outside defined boxes.");
                    console.log(`Rectangle center coordinates: X=${centerX}, Y=${centerY}`);
                    return;
                }

                console.log(`Rectangle drawn within box ID: ${clickedBox.id}`)

                // Calculate scaled dimensions of the rectangle
                const scaledRectWidth = rectBounds.width * (1920 / clickedBox.width);
                const scaledRectHeight = rectBounds.height * (1080 / clickedBox.height);


                // Calculate zoom level based on the scaled rectangle dimensions
                const zoomWidth = 1920 / scaledRectWidth;
                const zoomHeight = 1080 / scaledRectHeight;
                const zoom = Math.floor(Math.min(zoomWidth, zoomHeight) * 100);

                // Adjust center coordinates by subtracting the offsets
                const adjustedCenterX = centerX - horizontalOffset;
                const adjustedCenterY = centerY - verticalOffset;

                // Define scaling factors relative to 1080p
                const widthScale = 1920 / effectiveWidth;
                const heightScale = 1080 / effectiveHeight;

                // Convert rectangle coordinates to iframe coordinates using the same scale factors
                const scledX = adjustedCenterX * widthScale;
                const scledY = adjustedCenterY * heightScale;

                const adjrecL = rectBounds.left - horizontalOffset;
                const adjrecT = rectBounds.top - verticalOffset;

                const recL = adjrecL * widthScale;
                const recT = adjrecT * heightScale;

                const recwoff = rectBounds.width - horizontalOffset;
                const rechoff = rectBounds.height - verticalOffset;

                const recwS = rectBounds.width * widthScale;
                const rechS = rectBounds.height * heightScale;

                console.log("rectBounds.left:", recL);
                console.log("rectBounds.top:", recT);
                console.log("rectBounds.width:", recwS);
                console.log("rectBounds.height:", rechS);

                console.log(`Scaled coordinates for 1080p: X=${scledX}, Y=${scledY}, Zoom=${zoom}`);

                // Send the command
                sendclickCommand(scledX, scledY, zoom);


                // Remove the rectangle and button
                canvas.remove(rect);
                canvas.remove(button);
                rect = null; // Reset the rect variable
                button = null; // Reset the button variable
                canvas.renderAll();
            }
        }
    });

 // Add a keydown event listener to the document
document.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        // Check if the button is present on the canvas
        if (button && canvas.getObjects().includes(button)) {
            // Trigger the button's click
            const options = {
                target: button
            };
            canvas.fire('mouse:down', options);
        }
    }
});   

    // Handle the Escape key press to remove the rectangle
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            if (rect) {
                canvas.remove(rect);
                canvas.remove(button);
                rect = null; // Reset the rect variable
                button = null; // Reset the button variable
                canvas.renderAll();
            }
        }
    });
}


// Main event listener to handle clicks on the overlay
function loadboxoutlines() {

    const boxOverlay = document.getElementById("boxoverlay");
    if (!boxOverlay) {
        console.error("Click-overlay element not found.");
        return;
    }
    // Define styles for box outlines to ensure visibility
    const styleElement = document.createElement("style");
    styleElement.innerHTML = `
        .box-outline {
            border: 1px solid red; // Outline border for visibility
            position: absolute;
            z-index: 1000; // Ensures outlines are on top
        }
    `;
    document.head.appendChild(styleElement);

    // Get viewport dimensions to calculate scaling factors
    const iframe = document.getElementById("twitchIframe");

    const viewportWidth = iframe.clientWidth;
    const viewportHeight = iframe.clientHeight;

    console.log(`Viewport Width: ${viewportWidth}, Height: ${viewportHeight}`);

    // Calculate expected 16:9 height and width
    const expected16x9Height = (9 / 16) * viewportWidth;
    const expected16x9Width = (16 / 9) * viewportHeight;

    // Determine effective width and height considering black bars
    let effectiveWidth;
    let effectiveHeight;

    if (expected16x9Height > viewportHeight) {
        effectiveHeight = viewportHeight;
        effectiveWidth = expected16x9Width;
    } else {
        effectiveWidth = viewportWidth;
        effectiveHeight = expected16x9Height;
    }

    // Calculate horizontal and vertical offsets due to black bars
    const horizontalOffset = (viewportWidth - effectiveWidth) / 2;
    const verticalOffset = (viewportHeight - effectiveHeight) / 2;

    console.log(`Horizontal Offset: ${horizontalOffset}, Vertical Offset: ${verticalOffset}`);

    // Define scaling factors relative to 1080p
    const widthScale = effectiveWidth / 1920;
    const heightScale = effectiveHeight / 1080;

    console.log(`Width Scale: ${widthScale}, Height Scale: ${heightScale}`);

    // Define box boundaries with correct offsets and scaling
    const boxBoundaries = [
        {
            id: 1,
            x: horizontalOffset,
            y: verticalOffset,
            width: 640 * widthScale,
            height: 360 * heightScale,
        },
        {
            id: 2,
            x: horizontalOffset,
            y: verticalOffset + (360 * heightScale),
            width: 640 * widthScale,
            height: 360 * heightScale,
        },
        {
            id: 3,
            x: horizontalOffset,
            y: verticalOffset + (720 * heightScale),
            width: 640 * widthScale,
            height: 360 * heightScale,
        },
        {
            id: 4,
            x: horizontalOffset + (640 * widthScale),
            y: verticalOffset + (720 * heightScale),
            width: 640 * widthScale,
            height: 360 * heightScale,
        },
        {
            id: 5,
            x: horizontalOffset + (1280 * widthScale),
            y: verticalOffset + (720 * heightScale),
            width: 640 * widthScale,
            height: 360 * heightScale,
        },
        {
            id: 6,
            x: horizontalOffset + (640 * widthScale),
            y: verticalOffset,
            width: 1280 * widthScale,
            height: 720 * heightScale,
        },
    ];

    // Log box boundaries for troubleshooting
    boxBoundaries.forEach((box) => {
        console.log(`Box ID: ${box.id}, x: ${box.x}, y: ${box.y}, width: ${box.width}, height: ${box.height}`);
    });

    boxOverlay.innerHTML = '';

    // Function to add box outlines with center dots to the click overlay
    boxBoundaries.forEach((box) => {
        // Create the box outline element
        const boxElement = document.createElement("div");
        boxElement.classList.add("box-outline");

        // Set the position and size of the box outline
        boxElement.style.position = "absolute";
        boxElement.style.top = `${box.y}px`;
        boxElement.style.left = `${box.x}px`;
        boxElement.style.width = `${box.width}px`;
        boxElement.style.height = `${box.height}px`;

        // Create the dot to be centered in the box
        const dotElement = document.createElement("div");
        dotElement.classList.add("center-dot");

        // Set the dot's style to make it a small red circle
        dotElement.style.position = "absolute";
        dotElement.style.width = "10px"; // Size of the dot
        dotElement.style.height = "10px";
        dotElement.style.borderRadius = "50%"; // Circular shape
        dotElement.style.backgroundColor = "red"; // Color for visibility

        // Center the dot in the box
        const centerX = box.width / 2 - 5; // Half of width minus half of dot size
        const centerY = box.height / 2 - 5; // Half of height minus half of dot size
        dotElement.style.left = `${centerX}px`;
        dotElement.style.top = `${centerY}px`;

        // Append the dot to the box outline
        boxElement.appendChild(dotElement);

        // Append the box outline to the click overlay
        boxOverlay.appendChild(boxElement);
    });

    // Optional CSS styles for better visualization
    const style = document.createElement("style");
    style.innerHTML = `

    .center-dot {
        transition: all 0.2s; // Optional smooth transition for animations
    }
    `;
}

function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

window.addEventListener('resize', debounce(loadboxoutlines, 200));

function loadclickoverlay() {
    const clickOverlay = document.getElementById("clickoverlay");
    if (!clickOverlay) {
        console.error("Click-overlay element not found.");
        return;
    }

    // Get viewport dimensions to calculate scaling factors
    const iframe = document.getElementById("twitchIframe");

    const viewportWidth = iframe.clientWidth;
    const viewportHeight = iframe.clientHeight;

    console.log(`Viewport Width: ${viewportWidth}, Height: ${viewportHeight}`);

    // Calculate expected 16:9 height and width
    const expected16x9Height = (9 / 16) * viewportWidth;
    const expected16x9Width = (16 / 9) * viewportHeight;

    // Determine effective width and height considering black bars
    let effectiveWidth;
    let effectiveHeight;

    if (expected16x9Height > viewportHeight) {
        effectiveHeight = viewportHeight;
        effectiveWidth = expected16x9Width;
    } else {
        effectiveWidth = viewportWidth;
        effectiveHeight = expected16x9Height;
    }

    // Calculate horizontal and vertical offsets due to black bars
    const horizontalOffset = (viewportWidth - effectiveWidth) / 2;
    const verticalOffset = (viewportHeight - effectiveHeight) / 2;

    console.log(`Horizontal Offset: ${horizontalOffset}, Vertical Offset: ${verticalOffset}`);

    // Define scaling factors relative to 1080p
    const widthScale = effectiveWidth / 1920;
    const heightScale = effectiveHeight / 1080;

    console.log(`Width Scale: ${widthScale}, Height Scale: ${heightScale}`);

    // Define box boundaries with correct offsets and scaling
    const boxBoundaries = [
        {
            id: 1,
            x: horizontalOffset,
            y: verticalOffset,
            width: 640 * widthScale,
            height: 360 * heightScale,
        },
        {
            id: 2,
            x: horizontalOffset,
            y: verticalOffset + (360 * heightScale),
            width: 640 * widthScale,
            height: 360 * heightScale,
        },
        {
            id: 3,
            x: horizontalOffset,
            y: verticalOffset + (720 * heightScale),
            width: 640 * widthScale,
            height: 360 * heightScale,
        },
        {
            id: 4,
            x: horizontalOffset + (640 * widthScale),
            y: verticalOffset + (720 * heightScale),
            width: 640 * widthScale,
            height: 360 * heightScale,
        },
        {
            id: 5,
            x: horizontalOffset + (1280 * widthScale),
            y: verticalOffset + (720 * heightScale),
            width: 640 * widthScale,
            height: 360 * heightScale,
        },
        {
            id: 6,
            x: horizontalOffset + (640 * widthScale),
            y: verticalOffset,
            width: 1280 * widthScale,
            height: 720 * heightScale,
        },
    ];

    // Log box boundaries for troubleshooting
    boxBoundaries.forEach((box) => {
        console.log(`Box ID: ${box.id}, x: ${box.x}, y: ${box.y}, width: ${box.width}, height: ${box.height}`);
    });

    // Handle click events to determine corrected x and y
    clickOverlay.addEventListener("click", async (e) => {
        const clickX = e.clientX;
        const clickY = e.clientY;
        console.log(`Raw click coordinates: X=${clickX}, Y=${clickY}`);

        
        // Get iframe dimensions and position
        const iframeRect = iframe.getBoundingClientRect();
        const iframeWidth = iframeRect.width;
        const iframeHeight = iframeRect.height;

        console.log(`Iframe Rect:`, iframeRect);

        // Get raw click coordinates relative to the viewport
        const rawClickX = e.clientX;
        const rawClickY = e.clientY;

        console.log(`Raw click coordinates: X=${rawClickX}, Y=${rawClickY}`);

        // Calculate click coordinates relative to the iframe
        const relativeX = rawClickX - iframeRect.left;
        const relativeY = rawClickY - iframeRect.top;

        console.log(`Relative click coordinates within iframe: X=${relativeX}, Y=${relativeY}`);

        // Define content size with 16:9 aspect ratio
        const contentWidth = 1920;
        const contentHeight = 1080;
        const contentAspectRatio = contentWidth / contentHeight;

        // Calculate effective dimensions of the content area
        let effectiveWidth, effectiveHeight;

        if (iframeWidth / iframeHeight > contentAspectRatio) {
            // Pillarbox (vertical black bars)
            effectiveHeight = iframeHeight;
            effectiveWidth = effectiveHeight * contentAspectRatio;
        } else {
            // Letterbox (horizontal black bars)
            effectiveWidth = iframeWidth;
            effectiveHeight = effectiveWidth / contentAspectRatio;
        }

        // Calculate offsets
        const horizontalOffset = (iframeWidth - effectiveWidth) / 2;
        const verticalOffset = (iframeHeight - effectiveHeight) / 2;

        console.log(`Effective dimensions: Width=${effectiveWidth}, Height=${effectiveHeight}`);
        console.log(`Offsets: Horizontal=${horizontalOffset}, Vertical=${verticalOffset}`);

        // Calculate coordinates within the content area
        const scledX = (relativeX - horizontalOffset) / effectiveWidth * contentWidth;
        const scledY = (relativeY - verticalOffset) / effectiveHeight * contentHeight;

        // Check if the click is within any of the box boundaries
        let isWithinBox = false;
        for (const box of boxBoundaries) {
            if (
                relativeX >= box.x &&
                relativeX <= box.x + box.width &&
                relativeY >= box.y &&
                relativeY <= box.y + box.height
            ) {
                isWithinBox = true;
                break;
            }
        }

        if (isWithinBox) {
            sendclickCommand(scledX, scledY);
        } else {
            console.log("Click is outside the box boundaries.");
        }

    });
}

function preloadImages(cameras) {
    cameras.forEach(camera => {
        const img = new Image();
        img.src = `camera-img/${camera.name}.webp`;
        img.onerror = function () {
            img.src = 'img/logo.webp';
        };
    });
}

function preloadPresetPadImages(cameraName, presets) {
    presets.forEach(preset => {
        const img = new Image();
        img.src = `./button-img/${cameraName.toLowerCase()}/${preset}.png`;
        img.onerror = function () {
            this.src = `./button-img/${cameraName.toLowerCase()}/home.png`;
            this.style.backgroundColor = '#222222';
            this.style.filter = 'blur(3px)';
            this.onerror = function () {
                this.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
                this.style.backgroundColor = '#222222';
                this.style.borderTopLeftRadius = '15px';
                this.style.borderTopRightRadius = '15px';
            };
        };
    });
}

async function fetchCameraDataAndPopulateUI() {
    try {
        const response = await fetch('cameras.json');
        const data = await response.json();

        camerasData = data;
        preloadImages(camerasData.cameras); // Preload images
        populateCameraButtons(camerasData.cameras);
        populateDropdowns(camerasData.cameras);

        const storedCamera = localStorage.getItem('selectedCamera');
        if (storedCamera) {
            selectCamera(storedCamera);
        } else {
            selectCamera(camerasData.cameras[0].name);
        }
    } catch (error) {
        console.error('Error fetching camera data:', error);
    }

}

function populateCameraButtons(cameras) {
    const cameraContainer = document.querySelector('.camera-container');
    const fragment = document.createDocumentFragment();
    const thumbnailCameraCheckboxState = localStorage.getItem('CamerathumbnailVisibility');
    const thumbnailCameraCheckboxChecked = thumbnailCameraCheckboxState === 'true';
 console.log("camerathumb state:", thumbnailCameraCheckboxChecked);

    cameras.forEach(camera => {
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('camera-button-container');

        const image = document.createElement('img');
        image.classList.add('camera-thumbnail');
        image.src = `camera-img/${camera.name.toLowerCase()}.webp`;
        image.alt = ``;

        image.onerror = function () {
            image.src = 'img/logo.webp';
        };

        image.addEventListener('click', () => {
            button.click();
        });

        const button = document.createElement('button');
        button.classList.add('camera-button');
        button.textContent = camera.name;
        button.addEventListener('click', () => selectCamera(camera.name));

        buttonContainer.appendChild(image);
        buttonContainer.appendChild(button);
        fragment.appendChild(buttonContainer);
    });

    cameraContainer.appendChild(fragment);
    // Use the checkbox state to determine visibility and button height
    updateCameraThumbnailVisibility(thumbnailCameraCheckboxChecked);

}

function selectCamera(cameraName) {
    selectedCamera = cameraName; // Set the selected camera
    localStorage.setItem('selectedCamera', selectedCamera); // Store selected camera
    const selectedCameraData = camerasData.cameras.find(camera => camera.name === cameraName);
    const presetPad = document.querySelector('.preset-pad');
    if (presetPad && presetPad.classList.contains('collapsed')) {
        toggleDirectionPad('.preset-pad');
    }
    preloadPresetPadImages(cameraName, selectedCameraData.presets); // Preload images

    // Populate preset pad with presets for the selected camera
    populatePresetPad(selectedCameraData.presets);
    // Populate preset pad with custom presets for the selected camera
    fetchAndPopulateCustomPresets(cameraName);
    // Adjust layout based on the number of items
    adjustLayout();
    highlightSelectedCameraButton();
}

function populatePresetPad(presets) {
    const presetPad = document.getElementById('presetPad');
    presetPad.innerHTML = ''; // Clear previous preset buttons

    const thumbnailCheckboxState = localStorage.getItem('thumbnailVisibility');
    const thumbnailCheckboxChecked = thumbnailCheckboxState === 'true';

    const fragment = document.createDocumentFragment();

    presets.forEach(preset => {
        const container = document.createElement('div');
        container.classList.add('preset-button-container');

        const image = document.createElement('img');
        image.src = `./button-img/${selectedCamera.toLowerCase()}/${preset}.png`;
        image.classList.add('preset-image');

        image.onerror = function () {
            this.src = `./button-img/${selectedCamera.toLowerCase()}/home.png`;
            this.style.backgroundColor = '#222222';
            this.style.filter = 'blur(3px)';
            this.onerror = function () {
                this.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
                this.style.backgroundColor = '#222222';
                this.style.borderTopLeftRadius = '15px';
                this.style.borderTopRightRadius = '15px';
            };
        };

        const button = document.createElement('button');
        button.classList.add('preset-button');
        button.textContent = preset;
        button.addEventListener('click', () => sendLoadCommand(selectedCamera, preset));

        image.addEventListener('click', () => button.click());

        image.addEventListener('mouseover', () => button.classList.add('preset-button-hover'));
        image.addEventListener('mouseout', () => button.classList.remove('preset-button-hover'));

        container.appendChild(image);
        container.appendChild(button);
        fragment.appendChild(container);
    });

    presetPad.appendChild(fragment);
    updateThumbnailVisibility(thumbnailCheckboxChecked);
    updateButtonHeight(thumbnailCheckboxChecked);

}


async function fetchAndPopulateCustomPresets(cameraName) {
    try {
        const customPresets = await fetchCustomPresets(cameraName);
        populateCustomPresetPad(customPresets); // Pass filtered custom presets
        // Retrieve the checkbox state from localStorage
    } catch (error) {
        console.error('Error fetching custom presets:', error);
    }
}

async function fetchCustomPresets(cameraName) {
    try {
        const response = await fetch(`/custom-presets`);

        if (!response.ok) {
            throw new Error('Failed to fetch custom presets');
        }

        const data = await response.json();
        // Filter custom presets based on the cameraName
        return data.presets.filter(preset => preset.cameraName === cameraName);
    } catch (error) {
        console.error('Error fetching custom presets:', error);
        return []; // Return an empty array in case of an error
    }
}
function populateCustomPresetPad(customPresets) {
    const customPresetPad = document.getElementById('customPresetPad');
    customPresetPad.innerHTML = ''; // Clear previous custom preset buttons

    const thumbnailCheckboxState = localStorage.getItem('thumbnailVisibility');
    const thumbnailCheckboxChecked = thumbnailCheckboxState === 'true';

    const fragment = document.createDocumentFragment();

    customPresets.forEach(customPreset => {
        const container = document.createElement('div');
        container.classList.add('custom-preset-button-container');

        const image = document.createElement('img');
        image.src = `./button-img/${selectedCamera.toLowerCase()}/${customPreset.presetName}.png`;
        image.classList.add('custom-preset-image');

        image.onerror = function () {
            this.src = `./button-img/${selectedCamera.toLowerCase()}/home.png`;
            this.style.backgroundColor = '#222222';
            this.style.filter = 'blur(3px)';
            this.onerror = function () {
                this.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
                this.style.backgroundColor = '#222222';
                this.style.borderTopLeftRadius = '15px';
                this.style.borderTopRightRadius = '15px';
            };
        };

        const button = document.createElement('button');
        button.classList.add('custom-preset-button');
        button.textContent = customPreset.presetName;
        button.addEventListener('click', () => sendCustomCommand(selectedCamera, customPreset.presetName, customPresets));

        image.addEventListener('click', () => button.click());

        container.appendChild(image);
        container.appendChild(button);
        fragment.appendChild(container);
    });

    customPresetPad.appendChild(fragment);
    updateThumbnailVisibility(thumbnailCheckboxChecked);
    updateButtonHeight(thumbnailCheckboxChecked);
    toggleCustomPresetContainerVisibility();
    adjustLayout();

}




function highlightSelectedCameraButton() {
    const buttons = document.querySelectorAll('.camera-button');
    const thumbnails = document.querySelectorAll('.camera-thumbnail');

    buttons.forEach((button, index) => {
        if (button.textContent.toLowerCase() === selectedCamera.toLowerCase()) {
            button.classList.add('selected');
            thumbnails[index].classList.add('selected-thumbnail');
        } else {
            button.classList.remove('selected');
            thumbnails[index].classList.remove('selected-thumbnail');
        }
    });
}

function fetchDataAndPopulatePresetPad(callback) {
    // Make AJAX request to fetch data and populate preset-pad
    // Once the request is complete and the preset-pad is populated
    // Call the callback function to adjust the layout
    setTimeout(callback, 1000); // Simulate a delay for demonstration
}

document.addEventListener('DOMContentLoaded', function () {
    // Call fetchDataAndPopulatePresetPad after the DOM is loaded
    fetchDataAndPopulatePresetPad(adjustLayout);
});

// Listen for resize events and adjust the layout accordingly
window.addEventListener('resize', adjustLayout);

// Function to adjust the layout based on the number of items
function adjustLayout() {
    const presetPad = document.querySelector('.preset-pad');
    const customPresetPad = document.querySelector('.custom-preset-pad');
    const numberOfItemsThreshold = 15; // Set your desired threshold here

    try {
        if (presetPad) {
            const numberOfItems = presetPad.querySelectorAll('.preset-button').length;
            if (numberOfItems <= numberOfItemsThreshold) {
                presetPad.classList.add('single-column');
                presetPad.classList.remove('two-columns');
            } else {
                presetPad.classList.remove('single-column');
                presetPad.classList.add('two-columns');
            }
        } else {
            console.warn("presetPad is null or undefined.");
        }

        if (customPresetPad) {
            const numberOfCustomItems = customPresetPad.querySelectorAll('.custom-preset-button').length; // Corrected variable name
            if (numberOfCustomItems <= numberOfItemsThreshold) {
                customPresetPad.classList.add('single-column');
                customPresetPad.classList.remove('two-columns');
            } else {
                customPresetPad.classList.remove('single-column');
                customPresetPad.classList.add('two-columns');
            }
        } else {
            console.warn("customPresetPad is null or undefined.");
        }
    } catch (error) {
        console.error("An error occurred in adjustLayout:", error.message);
    }
}

function toggleCustomPresetContainerVisibility() {
    var customPresetPad = document.getElementById("customPresetPad");
    var customPresetContainer = document.querySelector(".custom-preset-container");

    if (customPresetPad.innerHTML.trim() === "") {
        customPresetContainer.style.display = "none";
    } else {
        customPresetContainer.style.display = "block";
    }
}

function populateDropdowns(cameras) {
    // Get references to the dropdown elements
    const dropdown1 = document.getElementById('swap-dropdown1');
    const dropdown2 = document.getElementById('swap-dropdown2');

    // Clear existing options
    dropdown1.innerHTML = '';
    dropdown2.innerHTML = '';

    // Create a default option for each dropdown
    const defaultOption = document.createElement('option');
    defaultOption.value = 'option1';
    defaultOption.textContent = '-Select-';
    dropdown1.appendChild(defaultOption.cloneNode(true));
    dropdown2.appendChild(defaultOption.cloneNode(true));

    // Populate dropdowns with camera options
    cameras.forEach(camera => {
        // Create an option element for each camera
        const option = document.createElement('option');
        option.value = camera.name;
        option.textContent = camera.name;

        // Append the option to both dropdowns
        dropdown1.appendChild(option.cloneNode(true));
        dropdown2.appendChild(option.cloneNode(true));
    });
}

function sendptzpadCommand(direction) {
    const sliderValue = document.getElementById('sliderValueLabel').textContent; // Get the current value assigned to the button
    let pan = 0;
    let tilt = 0;

    // Determine the pan and tilt values based on the direction
    switch (direction) {
        case 'left':
            pan = -sliderValue;
            break;
        case 'right':
            pan = sliderValue;
            break;
        case 'up':
            tilt = sliderValue;
            break;
        case 'down':
            tilt = -sliderValue;
            break;
        default:
            break;
    }

    const command = `!ptzset ${selectedCamera.toLowerCase()} ${pan} ${tilt} 0`; // Construct the command string
    sendCommand(command);
}


function sendCustomCommand(cameraName, presetName, customPresets) {
    // Find the custom preset data based on the preset name
    const customPreset = customPresets.find(preset => preset.presetName === presetName);

    // Check if the custom preset is found
    if (!customPreset) {
        console.error(`Custom preset '${presetName}' not found.`);
        return; // Exit the function if preset not found
    }

    // Extract the necessary data from the custom preset
    const { cameraName: presetCameraName, pan, tilt, zoom, autoFocus, focus } = customPreset;

    // Check if any of the variables is undefined
    if (typeof pan === 'undefined' || typeof tilt === 'undefined' || typeof zoom === 'undefined' ||
        typeof autoFocus === 'undefined' || typeof focus === 'undefined') {
        console.error('One or more parameters are undefined.');
        return; // Exit the function if any parameter is undefined
    }

    // Construct the set command using the extracted data
    const setCommand = `!ptzseta ${presetCameraName.toLowerCase()} ${pan} ${tilt} ${zoom} ${autoFocus} ${focus}`;

    // Send the set command to the backend server
    sendCommand(setCommand);
}


async function sendCustomDialogCommand(cameraName, presetName) {
    try {
        // Fetch the custom preset data
        const presetData = await findDialogPresetData(cameraName, presetName);

        // Check if presetData is valid
        if (!presetData) {
            console.error(`Custom preset '${presetName}' not found.`);
            return; // Exit the function if presetData is not found
        }

        // Extract the necessary data from the presetData
        const { pan, tilt, zoom, autoFocus, focus } = presetData;

        // Check if any of the variables is undefined
        if (typeof pan === 'undefined' || typeof tilt === 'undefined' || typeof zoom === 'undefined' ||
            typeof autoFocus === 'undefined' || typeof focus === 'undefined') {
            console.error('One or more parameters are undefined.');
            return; // Exit the function if any parameter is undefined
        }

        // Construct the set command using the extracted data
        const setCommand = `!ptzseta ${cameraName.toLowerCase()} ${pan} ${tilt} ${zoom} ${autoFocus} ${focus}`;

        // Send the set command to the backend server
        sendCommand(setCommand);

    } catch (error) {
        console.error('Error in sending custom dialog command:', error);
    }
}

// Update findPresetData to return the preset data
async function findDialogPresetData(cameraName, presetName) {
    try {
        // Fetch data from the endpoint
        const response = await fetch('/custom-presets');
        const data = await response.json();

        // Access the 'presets' array from the fetched data
        const customPresets = data.presets;

        // Find the preset that matches both cameraName and presetName
        const preset = customPresets.find(preset => preset.cameraName === cameraName && preset.presetName === presetName);

        if (preset) {
            // Return the extracted data
            return preset;
        } else {
            console.error(`Preset '${presetName}' not found for camera '${cameraName}'.`);
            return null;
        }
    } catch (error) {
        console.error('Error fetching or parsing custom preset data:', error);
        return null;
    }
}

function sendLoadCommand(camera, preset) {
    const command = `!ptzload ${camera.toLowerCase()} ${preset}`;
    sendCommand(command);
}

function sendDirectionCommand(direction) {
    const command = `!ptzmove ${selectedCamera.toLowerCase()} ${direction}`;
    sendCommand(command);
}

function sendPanTiltZoom() {
    const pan = document.getElementById('panInput').value || '0';
    const tilt = document.getElementById('tiltInput').value || '0';
    const zoom = document.getElementById('zoomPTZInput').value || '0';
    const command = `!ptzset ${selectedCamera.toLowerCase()} ${pan} ${tilt} ${zoom}`;
    sendCommand(command);
    // Clear the input values
    document.getElementById('panInput').value = '';
    document.getElementById('tiltInput').value = '';
    document.getElementById('zoomPTZInput').value = '';
}

function sendZoom() {
    const zoom = document.getElementById('zoomInput').value || '0';
    const command = `!ptzzoom ${selectedCamera.toLowerCase()} ${zoom}`;
    sendCommand(command);

    // Clear the input values
    document.getElementById('zoomInput').value = '';
    document.getElementById('zoomSlider').value = 0;
}

function sendpadZoom(action) {
    let zoom = document.getElementById('sliderZoomLabel').textContent;

    // Ensure the zoom value is a number
    zoom = parseInt(zoom, 10);

    if (action === 'minus') {
        if (zoom <= 100) {
            zoomLevel = 100 - zoom;
        } else {
            zoomLevel = 0;
        }
    }
    if (action === 'plus') {
        if (zoom <= 100) {
            zoomLevel = zoom + 100;
        } else if (zoom > 100) {
            zoomLevel = zoom + 100;
        }
    }


    const command = `!ptzareazoom ${selectedCamera.toLowerCase()} 960 540 ${zoomLevel}`;
    sendCommand(command);
}

function sendIRcommand(selected) {
    const command = `!ptzir ${selectedCamera.toLowerCase()} ${selected}`;
    sendCommand(command);
}

function sendReset() {
    if (selectedCamera.toLowerCase() === "marmin") {
        cam = "marmosetindoor";
    } else if (selectedCamera.toLowerCase() === "marmout") {
        cam = "marmoset";
    } else if (selectedCamera.toLowerCase() === "crowin") {
        cam = "crowindoor";
    } else if (selectedCamera.toLowerCase() === "crowout") {
        cam = "crow";
    } else {
        cam = selectedCamera.toLowerCase();
    }

    const command = `!resetcam ${cam}`;
    sendCommand(command);
}

function sendSwapCommand() {
    const swap1DropdownValue = document.getElementById('swap-dropdown1').value.trim();
    const swap2DropdownValue = document.getElementById('swap-dropdown2').value.trim();
    let swap1 = '';
    let swap2 = '';

    if (swap1DropdownValue && swap2DropdownValue && swap1DropdownValue !== 'option1' && swap2DropdownValue !== 'option1') {
        // If both dropdowns have selected values other than "-Select-", use those values
        swap1 = swap1DropdownValue;
        swap2 = swap2DropdownValue;
    } else {
        // If either dropdown is not selected or "-Select-" is selected, check if both inputs in the swap-wrapper are filled out
        swap1 = document.getElementById('swap1').value.trim();
        swap2 = document.getElementById('swap2').value.trim();

        const swapWrapperFilled = swap1 !== '' && swap2 !== '';

        if (!swapWrapperFilled) {
            alert('Please fill out both swap inputs.');
            return; // Stop execution if swap-wrapper inputs are not filled out
        }
    }

    const command = `!swap ${swap1.toLowerCase()} ${swap2.toLowerCase()}`;
    sendCommand(command);

    document.getElementById('swap-dropdown1').value = 'option1';
    document.getElementById('swap-dropdown2').value = 'option1';
    // Clear the input values
    document.getElementById('swap1').value = '';
    document.getElementById('swap2').value = '';
}


function sendFocusCommand() {
    const focus = document.getElementById('focus').value || '';
    const command = `!ptzfocusr ${selectedCamera.toLowerCase()} ${focus}`;
    sendCommand(command);

    // Clear the input values
    document.getElementById('focus').value = '';
}

function sendAutoFocusCommand() {
    const command = `!ptzautofocus ${selectedCamera.toLowerCase()} on`;
    sendCommand(command);

}

// Function to send a command to the backend endpoint
async function sendCommand(command) {
    try {
        const response = await fetch('/send-command', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ command })
        });

        if (!response.ok) {
            throw new Error('Failed to send command');
        }

        console.log('Command sent successfully');
    } catch (error) {
        console.error('Error sending command:', error);
    }
}

function setSwapNumber(number) {
    // Set swap1 to "1" and swap2 to the clicked number
    document.getElementById('swap1').value = '1';
    document.getElementById('swap2').value = number.toString();
    // Clear swap-dropdown1 and swap-dropdown2
    document.getElementById('swap-dropdown1').value = 'option1';
    document.getElementById('swap-dropdown2').value = 'option1';
    // Trigger the sendSwapCommand function
    sendSwapCommand();
}

function setPresetSwap(selected) {
    if (selected === 'wolf') {
        sendCommand('!swap wolf wolfcorner');
    } else if (selected === 'crow') {
        sendCommand('!swap crowin crowout');
    } else if (selected === 'marm') {
        sendCommand('!swap marmin marmout');
    } else if (selected === 'wolfin') {
        sendCommand('!swap wolf wolfindoor');
    } else if (selected === 'wden') {
        sendCommand('!swap wolf wolfden');
    } else if (selected === 'fox') {
        sendCommand('!swap fox foxcorner');
    }
}

// Function to release input after pressing enter on pan / tilt / zoom input boxes
function blurOnEnter(event) {
    if (event.key === 'Enter') {
        event.target.blur();
    }
}

// Add event listeners to each input element
document.getElementById('zoomPTZInput').addEventListener('keydown', blurOnEnter);
document.getElementById('tiltInput').addEventListener('keydown', blurOnEnter);
document.getElementById('panInput').addEventListener('keydown', blurOnEnter);
document.getElementById('zoomInput').addEventListener('keydown', blurOnEnter);

// Add event listeners to both dropdowns to clear both inputs when an option other than "Select" is chosen
document.getElementById('swap-dropdown1').addEventListener('change', function () {
    const selectedOption = this.value;
    // Check if the selected option is not "-Select-"
    if (selectedOption !== 'option1') {
        // Clear the input values for both swap1 and swap2
        document.getElementById('swap1').value = '';
        document.getElementById('swap2').value = '';
    }
});

document.getElementById('swap-dropdown2').addEventListener('change', function () {
    const selectedOption = this.value;
    // Check if the selected option is not "-Select-"
    if (selectedOption !== 'option1') {
        // Clear the input values for both swap1 and swap2
        document.getElementById('swap1').value = '';
        document.getElementById('swap2').value = '';
    }
});

// Add event listeners to both inputs to clear both dropdowns when any input is changed
document.getElementById('swap1').addEventListener('input', function () {
    // Reset the dropdowns to the default "Select" option
    document.getElementById('swap-dropdown1').value = 'option1';
    document.getElementById('swap-dropdown2').value = 'option1';
});

document.getElementById('swap2').addEventListener('input', function () {
    // Reset the dropdowns to the default "Select" option
    document.getElementById('swap-dropdown1').value = 'option1';
    document.getElementById('swap-dropdown2').value = 'option1';
});

// Arrow key ptzspin
let panSpeed = 0;
let tiltSpeed = 0;
let zoomSpeed = 0;
let arrowIsPan = 1;
let arrowIsTilt = 1;
let arrowIsZoom = 1;

function handlePtzSpin(event) {

    // Check if the target element is an input box or textarea
    if (event.target.tagName.toLowerCase() === 'input' || event.target.tagName.toLowerCase() === 'textarea') {
        // Allow default behavior of arrow keys inside input boxes and textareas
        return;
    }
    event.preventDefault(); // Prevent default only for arrow keys outside input boxes and textareas

    if (event.repeat) return; // Ignore repeated events

    switch (event.key) {
        case 'ArrowLeft':
            panSpeed = -10; // Start panning left
            ptzSpin(panSpeed, tiltSpeed, zoomSpeed);
            arrowIsPan = 2;
            break;
        case 'ArrowRight':
            panSpeed = 10; // Start panning right
            ptzSpin(panSpeed, tiltSpeed, zoomSpeed);
            arrowIsPan = 2;
            break;
        case 'ArrowUp':
            tiltSpeed = 10; // Start tilting up
            ptzSpin(panSpeed, tiltSpeed, zoomSpeed);
            arrowIsTilt = 2;
            break;
        case 'ArrowDown':
            tiltSpeed = -10; // Start tilting down
            ptzSpin(panSpeed, tiltSpeed, zoomSpeed);
            arrowIsTilt = 2;
            break;
        case '=':
            zoomSpeed = 5; // Start zooming in
            ptzSpin(panSpeed, tiltSpeed, zoomSpeed);
            arrowIsZoom = 2;
            break;
        case '-':
            zoomSpeed = -5; // Start zooming out
            ptzSpin(panSpeed, tiltSpeed, zoomSpeed);
            arrowIsZoom = 2;
            break;
        case '1':
            // Adjust speed to a low setting
            panSpeed = panSpeed > 0 ? 10 : (panSpeed < 0 ? -10 : panSpeed);
            tiltSpeed = tiltSpeed > 0 ? 10 : (tiltSpeed < 0 ? -10 : tiltSpeed);
            zoomSpeed = zoomSpeed > 0 ? 10 : (zoomSpeed < 0 ? -10 : zoomSpeed);
            arrowIsdown = 2;
            ptzSpin(panSpeed, tiltSpeed, zoomSpeed);
            break;
        case '2':
            // Adjust speed to a medium setting
            panSpeed = panSpeed > 0 ? 30 : (panSpeed < 0 ? -30 : panSpeed);
            tiltSpeed = tiltSpeed > 0 ? 30 : (tiltSpeed < 0 ? -30 : tiltSpeed);
            zoomSpeed = zoomSpeed > 0 ? 30 : (zoomSpeed < 0 ? -30 : zoomSpeed);
            arrowIsdown = 2;
            ptzSpin(panSpeed, tiltSpeed, zoomSpeed);
            break;
        case '3':
            // Adjust speed to a high setting
            panSpeed = panSpeed > 0 ? 50 : (panSpeed < 0 ? -50 : panSpeed);
            tiltSpeed = tiltSpeed > 0 ? 50 : (tiltSpeed < 0 ? -50 : tiltSpeed);
            zoomSpeed = zoomSpeed > 0 ? 50 : (zoomSpeed < 0 ? -50 : zoomSpeed);

            arrowIsdown = 2;
            ptzSpin(panSpeed, tiltSpeed, zoomSpeed);
            break;
        case '4':
            // Adjust speed to a high setting
            panSpeed = panSpeed > 0 ? 80 : (panSpeed < 0 ? -80 : panSpeed);
            tiltSpeed = tiltSpeed > 0 ? 80 : (tiltSpeed < 0 ? -80 : tiltSpeed);
            zoomSpeed = zoomSpeed > 0 ? 80 : (zoomSpeed < 0 ? -80 : zoomSpeed);
            arrowIsdown = 2;
            ptzSpin(panSpeed, tiltSpeed, zoomSpeed);
            break;
    }
}
function handlePtzSpinStop(event) {
    const isSpinEnabled = localStorage.getItem('isSpinEnabled') === 'true';

    // Check if event.key is in arrowKeys or plusminusKeys and isSpinEnabled is true
    if (isSpinEnabled) {
        // Event listener for keyup
        switch (event.key) {
            case 'ArrowLeft':
            case 'ArrowRight':
                panSpeed = 0; // Stop panning
                ptzSpin(panSpeed, tiltSpeed, zoomSpeed);
                arrowIsPan = 1;
                break;
            case 'ArrowUp':
            case 'ArrowDown':
                tiltSpeed = 0; // Stop tilting
                ptzSpin(panSpeed, tiltSpeed, zoomSpeed);
                arrowIsTilt = 1;
                break;
            case '=':
            case '-':
                zoomSpeed = 0; // Stop zooming
                ptzSpin(panSpeed, tiltSpeed, zoomSpeed);
                arrowIsZoom = 1;
                break;
        }
    }
}

function handleHotkeyswap(event) {
    // Define the command to send based on the key pressed
    let command = '';
    switch (event.key) {
        case '2':
            command = '!swap 1 2';
            break;
        case '3':
            command = '!swap 1 3';
            break;
        case '4':
            command = '!swap 1 4';
            break;
        case '5':
            command = '!swap 1 5';
            break;
        case '6':
            command = '!swap 1 6';
            break;
    }

    // Send the command
    sendCommand(command);

    // Display the command in the commandDisplay element
    const commandDisplay = document.getElementById('commandDisplay');
    commandDisplay.textContent = `Swap 1 ${event.key}`;

    // Clear the display after 3 seconds
    setTimeout(() => {
        commandDisplay.textContent = '';
    }, 3000);
}

function ptzSpin(panSpeed, tiltSpeed, zoomSpeed) {
    const command = `!ptzspin ${selectedCamera.toLowerCase()} ${panSpeed} ${tiltSpeed} ${zoomSpeed} `;
    sendCommand(command);
}
// handle key down events

// Attach the handleKeyDown function to the keydown event
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handlePtzSpinStop);

let keysPressed = ''; // Keep track of the keys pressed
const delay = 1000; // Adjust the delay as needed
let timeoutId; // Keep track of the setTimeout ID


function handleKeyDown(event) {
    // Check if the arrow key checkbox state is stored in local storage
    const savedArrowKeyCheckboxState = localStorage.getItem('arrowKeyCheckboxState');
    const savedAswapHotkeyCheckboxState = localStorage.getItem('swapHotkeyCheckboxState');

    if (savedArrowKeyCheckboxState !== 'true') {
        return; // Exit the function if checkbox is not checked (or if the state is not found in local storage)
    }

    const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    const numberKeys = ['1', '2', '3', '4'];
    const plusminusKeys = ['=', '-'];
    const isSpinEnabled = localStorage.getItem('isSpinEnabled') === 'true';
    console.log('isSpinEnabled:', isSpinEnabled);

    if ((arrowKeys.includes(event.key) || plusminusKeys.includes(event.key)) && isSpinEnabled) {
        lastKeyPressed = event.key;
        handlePtzSpin(event);
        return;
    } else if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        handleArrowKeys(event);
        return;
        }

    if (numberKeys.includes(event.key) && (arrowIsPan == 2 || arrowIsTilt == 2 || arrowIsZoom == 2)) {
        handlePtzSpin(event);
        return;
    }

    if ((savedAswapHotkeyCheckboxState == 'true') && (event.ctrlKey && event.key >= '2' && event.key <= '6')) {
        // Ctrl key is held and a number key (2-6) is pressed
        handleHotkeyswap(event);        
    }

    // Reset lastKeyPressed if it's not one of the arrow keys or number keys
    lastKeyPressed = null;

    // Handle arrow keys separately
    //if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', '1', '2', '3'].includes(event.key)) {
    //    //handleArrowKeys(event);
    //    handlePtzSpin(event);
    //    return;
    //}

    // Handle other keys
    if (event.key === 'Enter') {
        // Check if no input element is currently focused
        if (document.activeElement.tagName.toLowerCase() !== 'input' && document.activeElement.tagName.toLowerCase() !== 'textarea') {
            // Focus the input box with ID presetSearch
            document.getElementById('presetSearch').focus();
        }
    }
    // Check if the pressed key is a number (0-9) and no other keys are pressed
    if (event.key >= '0' && event.key <= '9' && keysPressed === '' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA' && !event.ctrlKey) {
        // Convert the key to a number
        const index = parseInt(event.key, 10) - 1; // Convert '1' to 0, '2' to 1, etc.
        // Get the list of camera buttons
        const cameraButtons = document.querySelectorAll('.camera-button');
        // Check if the index is within the range of available buttons
        if (index >= 0 && index < cameraButtons.length) {
            // Focus the corresponding button
            cameraButtons[index].focus();
            // Optionally, you can trigger a click event if you want the button to be "pressed"
            cameraButtons[index].click();
        }
        return; // Exit the function to prevent hotkey handling
    }


    // Check if the target element is an input box or textarea
    if (event.target.tagName.toLowerCase() === 'input' || event.target.tagName.toLowerCase() === 'textarea') {
        return;
    }

    // Filter out non-printable keys and control keys
    if (event.key.length === 1 && !event.ctrlKey && !event.altKey && !event.metaKey) {
        // Add the pressed key to the keysPressed string
        keysPressed += event.key;
    }

    // Handle hotkey functionality
    handleHotkey(event);
}

function handleArrowKeys(event) {
    // Check if the target element is an input box or textarea
    if (event.target.tagName.toLowerCase() === 'input' || event.target.tagName.toLowerCase() === 'textarea') {
        // Allow default behavior of arrow keys inside input boxes and textareas
        return;
    }
    event.preventDefault(); // Prevent default only for arrow keys outside input boxes and textareas

    // Execute sendDirectionCommand based on the pressed arrow key
    switch (event.key) {
        case 'ArrowUp':
            sendDirectionCommand('up');
            break;
        case 'ArrowDown':
            sendDirectionCommand('down');
            break;
        case 'ArrowLeft':
            sendDirectionCommand('left');
            break;
        case 'ArrowRight':
            sendDirectionCommand('right');
            break;
        default:
            break;
    }
}

function handleHotkey(event) {
    // Clear any existing timeout
    clearTimeout(timeoutId);

    // Retrieve normal and custom hotkey data from the server
    Promise.all([getHotkeys(), getCustomHotkeys()])
        .then(([hotkeys, customHotkeys]) => {
            // Retrieve the selected camera name from the .camera-container
            const selectedCameraElement = document.querySelector('.camera-container .selected');
            if (!selectedCameraElement) {
                console.error('No camera selected.');
                keysPressed = ''; // Reset keysPressed
                return;
            }
            const selectedCameraName = selectedCameraElement.textContent.trim();

            // Check custom hotkeys for matches first
            const customPresets = customHotkeys[selectedCameraName] || {};
            const normalPresets = hotkeys[selectedCameraName] || {};

            const matchingCustomPresets = [];
            const matchingNormalPresets = [];

            // Filter out empty hotkeys and then check for matches
            for (const preset in customPresets) {
                const hotkey = customPresets[preset];
                if (hotkey && ((typeof hotkey === 'string' && hotkey.startsWith(keysPressed)) ||
                    (typeof hotkey === 'object' && hotkey.hotkey && hotkey.hotkey.startsWith(keysPressed)))) {
                    matchingCustomPresets.push({ preset, hotkey: hotkey.hotkey || hotkey });
                }
            }

            for (const preset in normalPresets) {
                const hotkey = normalPresets[preset];
                if (hotkey && ((typeof hotkey === 'string' && hotkey.startsWith(keysPressed)) ||
                    (typeof hotkey === 'object' && hotkey.hotkey && hotkey.hotkey.startsWith(keysPressed)))) {
                    matchingNormalPresets.push({ preset, hotkey: hotkey.hotkey || hotkey });
                }
            }

            const allMatchingPresets = matchingCustomPresets.concat(matchingNormalPresets);

            if (allMatchingPresets.length === 1) {
                // Only one match found, but ensure all keys are pressed
                const { preset, hotkey } = allMatchingPresets[0];
                if (keysPressed === hotkey) {
                    if (matchingCustomPresets.length === 1) {
                        console.log(`Custom hotkey '${keysPressed}' matched for camera '${selectedCameraName}' and preset '${preset}'.`);
                        executeHotkeyAction(selectedCameraName, preset, true);
                    } else {
                        console.log(`Hotkey '${keysPressed}' matched for camera '${selectedCameraName}' and preset '${preset}'.`);
                        executeHotkeyAction(selectedCameraName, preset, false);
                    }
                    keysPressed = ''; // Reset keysPressed
                } else {
                    // Set a timeout to wait for more keys
                    timeoutId = setTimeout(() => {
                        console.log(`Timed out waiting for more keys for camera '${selectedCameraName}' and key combination '${keysPressed}'.`);
                        keysPressed = ''; // Reset keysPressed
                    }, delay);
                }
            } else if (allMatchingPresets.length > 1) {
                // Multiple matches found, set a timeout to wait for more keys
                timeoutId = setTimeout(() => {
                    const finalPreset = allMatchingPresets.find(p => p.hotkey === keysPressed);
                    if (finalPreset) {
                        if (matchingCustomPresets.some(p => p.preset === finalPreset.preset)) {
                            console.log(`Custom hotkey '${keysPressed}' pressed for camera '${selectedCameraName}' and preset '${finalPreset.preset}'.`);
                            executeHotkeyAction(selectedCameraName, finalPreset.preset, true);
                        } else {
                            console.log(`Hotkey '${keysPressed}' pressed for camera '${selectedCameraName}' and preset '${finalPreset.preset}'.`);
                            executeHotkeyAction(selectedCameraName, finalPreset.preset, false);
                        }
                    } else {
                        console.log(`No exact match found for camera '${selectedCameraName}' and key combination '${keysPressed}'.`);
                    }
                    keysPressed = ''; // Reset keysPressed
                }, delay);
            } else {
                console.log(`No matching hotkeys found for camera '${selectedCameraName}' and key combination '${keysPressed}'.`);
                keysPressed = ''; // Reset keysPressed
            }
        })
        .catch(error => {
            console.error('Error fetching hotkey data:', error);
            keysPressed = ''; // Reset keysPressed
        });
}


function executeHotkeyAction(cameraName, preset, isCustom) {
    console.log(`Executing action for camera '${cameraName}' and preset '${preset}'.`);
    if (isCustom) {
        findPresetData(cameraName, preset);
    } else {
        sendLoadCommand(cameraName, preset);
    }
    const commandDisplay = document.getElementById('commandDisplay');
    commandDisplay.textContent = `(${keysPressed}) - load ${cameraName} ${preset}`;
    setTimeout(() => {
        commandDisplay.textContent = '';
    }, 3000);
}

function executeHotkeyAction(cameraName, preset, isCustom) {
    console.log(`Executing action for camera '${cameraName}' and preset '${preset}'.`);
    if (isCustom) {
        findPresetData(cameraName, preset);
    } else {
        sendLoadCommand(cameraName, preset);
    }
    const commandDisplay = document.getElementById('commandDisplay');
    commandDisplay.textContent = `(${keysPressed}) - load ${cameraName} ${preset}`;
    setTimeout(() => {
        commandDisplay.textContent = '';
    }, 3000);
}

// Attach the handleHotkey function to the keypress event
document.addEventListener('keypress', handleHotkey);

async function findPresetData(cameraName, presetName) {
    try {
        // Fetch data from the endpoint
        const response = await fetch('/custom-presets');
        const data = await response.json();

        // Access the 'presets' array from the fetched data
        const customPresets = data.presets;

        // Find the preset that matches both cameraName and presetName
        const preset = customPresets.find(preset => preset.cameraName === cameraName && preset.presetName === presetName);

        if (preset) {
            // Extract the required data
            const { pan, tilt, zoom, autoFocus, focus } = preset;
            // Use the extracted data for sending a custom command
            sendCustomCommand(cameraName, presetName, customPresets);

            keysPressed = ''; // Reset keysPressed


        } else {
            console.error(`Preset '${presetName}' not found for camera '${cameraName}'.`);
        }
    } catch (error) {
        console.error('Error fetching or parsing custom preset data:', error);
    }
}

async function getHotkeys() {
    try {
        const response = await fetch('/hotkeys');

        if (!response.ok) {
            throw new Error('Failed to fetch hotkey data');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching hotkey data:', error);
        throw error; // Re-throw the error to be caught by the caller
    }
}

async function getCustomHotkeys() {
    try {
        const response = await fetch('/custom-hotkeys');

        if (!response.ok) {
            throw new Error('Failed to fetch hotkey data');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching hotkey data:', error);
        throw error; // Re-throw the error to be caught by the caller
    }
}


function updatePanTiltZoom() {
    const sliderValue = parseInt(document.getElementById('speedSlider').value);
    const panInput = document.getElementById('panInput');
    const tiltInput = document.getElementById('tiltInput');
    const zoomPTZInput = document.getElementById('zoomPTZInput');

    // Update input values based on slider position
    panInput.value = sliderValue;
    tiltInput.value = sliderValue;
    zoomPTZInput.value = sliderValue;

    // Call the sendPanTiltZoom function to send the updated values
    sendPanTiltZoom();
}

// ptz and zoom pad sliders config
// Get the button element
const button = document.getElementById('sliderValueLabel');

// PanTilt middle button
const values = ['0.5', '1', '3', '6', '9']; // Define the three values
let currentIndex = 0; // Initialize the index to 0

function toggleValues() {
    currentIndex = (currentIndex + 1) % values.length; // Increment index and loop back to 0 if it exceeds the array length
    document.getElementById('sliderValueLabel').textContent = values[currentIndex]; // Update the button label with the new value
}

//const zoomValues = ['0', '5', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55', '60', '65', '70', '75', '80', '85', '90', '95', '100', '105'];
const zoomValues = ['10', '20', '30', '40', '50', '60', '70', '80', '90', '100', '150', '200', '300', '400'];
let currentZoomIndex = 0;

function updateZoomLabel() {
        document.getElementById('sliderZoomLabel').textContent = zoomValues[currentZoomIndex] + '%';
    }

function incrementZoom() {
    if (currentZoomIndex < zoomValues.length - 1) {
        currentZoomIndex++;
        updateZoomLabel();
    }
}

function decrementZoom() {
    if (currentZoomIndex > 0) {
        currentZoomIndex--;
        updateZoomLabel();
    }
}

// Function to send the volume command
function sendVolumeCommand(source, volumeLevel) {
    let command;
    if (source === "music") {
        command = `!setmusicvolume ${volumeLevel}`; // Construct the music volume command
    } else {
        command = `!setvolume ${source} ${volumeLevel}`; // Construct the general volume command
    }

    fetch('/send-command', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ command })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to send command');
            }
            return response.text(); // Extract the text response from the server
        })
        .then(message => {
            console.log(message); // Log the message to the console
            // Optionally, display the message on the UI
            const sendButton = document.querySelector(`button[data-source="${source}"]`);
            if (sendButton) {
                sendButton.style.display = "none"; // Hide the send button
            }
        })
        .catch(error => {
            console.error('Error sending command:', error);
            // Optionally, display an error message on the UI
        });
}

async function sendVolumeControl() {
    try {
        // Call syncVolumeControl to ensure there's a message to listen for with fetchVolumeLevels
        await syncVolumeControl();

        // Fetch dynamic volume levels
        const dynamicVolumeLevels = await fetchVolumeLevels();

        // Create a dialog
        const dialog = document.createElement("div");
        dialog.classList.add("volume-control-dialog");

        // Add volume controls for each sound source using dynamic volume levels
        for (const volumeInfo of dynamicVolumeLevels) {
            // Parse volume info
            const [source, volume] = volumeInfo.split(' - ');

            // Create the volume container
            const volumeContainer = document.createElement("div");
            volumeContainer.classList.add("volume-container");

            // Create the label for the volume control
            const label = document.createElement("label");
            label.textContent = `${source}:`;

            // Extract the numeric value from the volume level
            const volumeValue = parseInt(volume);

            // Determine if the source originally had 'm' suffix
            const isMuted = volume.endsWith('m');

            // Create the volume label
            const labelvol = document.createElement("labelvol");
            labelvol.textContent = volume;

            // Create the volume control
            const volumeControl = document.createElement("input");
            volumeControl.type = "range";
            volumeControl.min = 0;
            volumeControl.max = 100;
            volumeControl.value = volumeValue;

            // Create the send button
            const sendButton = document.createElement("button");
            sendButton.textContent = "Send";
            sendButton.dataset.source = source; // Set dataset to identify the source
            sendButton.style.display = "none"; // Initially hide the send button

            // Set onclick function for send button
            sendButton.onclick = function () {
                sendVolumeCommand(source, volumeControl.value);
            };

            // Create the mute/unmute button
            const muteButton = document.createElement("button");
            muteButton.classList.add("mute-button");
            muteButton.style.backgroundImage = "url('./img/unmute.png')";
            // Add onclick event listener to the unmute button for the music source when it's muted
            if (source === "music") {
                muteButton.onclick = function () {
                    handleMusicmute(volumeValue);
                };
            }

            // Append the unmute button to the volume container
            volumeContainer.appendChild(muteButton);

            const unmuteButton = document.createElement("button");
            unmuteButton.classList.add("unmute-button");
            unmuteButton.style.backgroundImage = "url('./img/mute.png')";
            // Add onclick event listener to the unmute button for the music source when it's muted
            if (source === "music") {
                unmuteButton.onclick = function () {
                    handleMusicUnmute(volumeValue);
                };
            }

            // Determine which button to show based on whether the volume is muted
            if (isMuted) {
                volumeContainer.appendChild(unmuteButton); // Show unmute button if muted
            } else {
                volumeContainer.appendChild(muteButton); // Show mute button if not muted
            }


            // Update the label and show the send button when the volume control value changes
            volumeControl.addEventListener("input", function () {
                const newValue = volumeControl.value;
                labelvol.textContent = newValue + (isMuted ? 'm' : ''); // Append 'm' if it's originally muted
                if (!sendButton.style.display || sendButton.style.display === "none") {
                    sendButton.style.display = "block"; // Show the send button if it's not already displayed
                }
            });

            // Append the elements to the volume container
            volumeContainer.appendChild(label);
            volumeContainer.appendChild(volumeControl);
            volumeContainer.appendChild(labelvol);
            volumeContainer.appendChild(sendButton);

            // Append the volume container to the dialog
            dialog.appendChild(volumeContainer);
        }

        // Open the dialog
        document.body.appendChild(dialog);

        // Close the dialog when clicking outside of it
        document.addEventListener("mousedown", function (event) {
            if (!dialog.contains(event.target) && document.body.contains(dialog)) {
                dialog.remove();
            }
        });
    } catch (error) {
        console.error('Error sending volume control:', error);
    }
}

function updateVolumeControls(dialog, volumeLevels) {
    const volumeLevelsMap = {};

    // Parse volume levels into an object
    volumeLevels.forEach(volume => {
        const [source, level] = volume.split(' - ');
        volumeLevelsMap[source.trim()] = parseInt(level);
    });

    // Update UI elements with volume levels
    const volumeContainers = dialog.querySelectorAll(".volume-container");
    volumeContainers.forEach(volumeContainer => {
        const source = volumeContainer.querySelector("button").dataset.source;
        const volumeControl = volumeContainer.querySelector("input[type='range']");
        const labelvol = volumeContainer.querySelector("labelvol");

        if (source in volumeLevelsMap) {
            const volumeValue = volumeLevelsMap[source];
            volumeControl.value = volumeValue;
            labelvol.textContent = volumeValue;
        }
    });
}

function fetchVolumeLevels() {
    // Send a POST request to the backend endpoint
    return fetch('/fetch-volume-levels', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch volume levels');
            }
            return response.json(); // Parse response as JSON
        })
        .then(data => {
            if (data.volumeLevels && data.volumeLevels.length > 0) {
                // Process volume levels
                const volumeLevels = data.volumeLevels.map(volume => volume.trim()); // Trim whitespace
                console.log('Received volume levels:', volumeLevels);
                // Update UI elements with volume levels
                // Here you can parse the volume levels and update your UI accordingly
                return volumeLevels;
            } else {
                console.log('No volume levels received.');
                // Handle no volume levels case
                return [];
            }
        })
        .catch(error => {
            console.error('Error fetching volume levels:', error);
            // Handle error case
            throw error;
        });
}

function syncVolumeControl() {
    // Construct the command to be sent
    const command = '!getvolume all';
    sendCommand(command);
}

// Function to handle unmute button click for music source
function handleMusicmute(currentVolume) {
    // Round down the current volume to the nearest multiple of 10
    const startingVolume = Math.floor(currentVolume / 10) * 10;

    // Define the volume values to fade to
    const volumeValues = [];
    for (let volume = startingVolume - 10; volume >= 40; volume -= 5) {
        volumeValues.push(volume);
    }

    // Fade the music volume with a delay between commands
    fadeMusicVolume(volumeValues)
        .then(() => {
            // After fading, send the !musicoff command
            sendCommand('!musicoff');
            // After a delay, set music volume to 80
            setTimeout(() => {
                sendCommand('!setmusicvolume 80');
                // After another delay, update the volume label to "80m"
                setTimeout(() => {
                    sendVolumeControl(); // Rebuild the dialog
                }, 1000); // 1 second delay
            }, 1000); // 1 second delay
        })
        .catch(error => {
            console.error('Error fading music volume:', error);
        });
}

// Function to fade music volume with a delay between commands
async function fadeMusicVolume(volumeValues) {
    // Define the delay between commands in milliseconds
    const delayBetweenCommands = 1000; // 1s second

    for (let i = 0; i < volumeValues.length; i++) {
        const volume = volumeValues[i];
        // Construct the command to set the music volume
        const command = `!setmusicvolume ${volume}`;
        // Send the command to the backend endpoint
        await sendCommand(command);
        // Wait for the specified delay before sending the next command
        await new Promise(resolve => setTimeout(resolve, delayBetweenCommands));
    }
}

// Function to handle unmute button click for music source
function handleMusicUnmute(currentVolume) {
    // First, set music volume to 30
    sendCommand('!setmusicvolume 30')
        .then(() => {
            return new Promise(resolve => setTimeout(resolve, 1000));
        })
        .then(() => {
            return sendCommand('!musicon');
        })
        .then(() => {
            // After sending !musicon, define the volume values to fade up to the current volume
            const volumeValues = [];
            for (let volume = 40; volume <= currentVolume; volume += 10) {
                volumeValues.push(volume);
            }
            // Fade the music volume up to the source volume value
            return fadeMusicVolume(volumeValues);
        })
        .then(() => {
            // After fading up to the current volume, update the volume label to the new volume
            sendVolumeControl(); // Rebuild the dialog
        })
        .catch(error => {
            console.error('Error handling music unmute:', error);
        });
}



window.addEventListener('load', function() {
    localStorage.setItem('isSpinEnabled', 'false');

    let isSpinEnabled = localStorage.getItem('isSpinEnabled') === 'true';
    let button = document.getElementById('spinButton');
    if (isSpinEnabled) {
        button.classList.add('highlighted');
    } else {
        button.classList.remove('highlighted');
    }
});

function enableSpin(button) {
    let isSpinEnabled = localStorage.getItem('isSpinEnabled') === 'true';
    if (!isSpinEnabled) {
        console.log('Spin Enabled.');
        localStorage.setItem('isSpinEnabled', 'true');
        button.classList.add('highlighted');
    } else {
        console.log('Spin Disabled.');
        localStorage.setItem('isSpinEnabled', 'false');
        button.classList.remove('highlighted');
    }
    console.log('New state: ', localStorage.getItem('isSpinEnabled') === 'true' ? 'Enabled' : 'Disabled');
}


// Function to generate a unique client identifier
function generateClientId() {
    return Math.random().toString(36).substr(2, 9); // Generate a random string
}


function sendAreazoomCommand(scaledX, scaledY, zoom, cameraName) {
    const zoomInput = document.getElementById('zoomInput');
    const selectedCameraElement = document.querySelector('.camera-container .selected');
    const defaultCameraName = selectedCameraElement ? selectedCameraElement.textContent.trim().toLowerCase() : '';

    let zoomLevel;

    if (zoom === null || zoom === undefined) {
        const inputValue = zoomInput ? zoomInput.value.trim() : '';
        zoomLevel = inputValue === '' ? 100 : parseInt(inputValue, 10);
    } else {
        zoomLevel = parseInt(zoom, 10);
    }

    let intX = parseInt(scaledX, 10);
    let intY = parseInt(scaledY, 10);

    // Use provided cameraName or default to manually selected cameraName
    const effectiveCameraName = cameraName || defaultCameraName;
    const ptzareazoomCommand = `!ptzareazoom ${effectiveCameraName} ${intX} ${intY} ${zoomLevel}`;
    const ptzcenterCommand = `!ptzcenter ${effectiveCameraName} ${intX} ${intY} ${zoomLevel}`;

    if (scaledX !== undefined && scaledY !== undefined) {
        sendCommand(ptzareazoomCommand);
        console.log("Command sent:", ptzareazoomCommand);

        const commandDisplay = document.getElementById('commandDisplay');
        commandDisplay.textContent = `Click sent for: ${effectiveCameraName}`;

        setTimeout(() => {
            commandDisplay.textContent = '';
        }, 3000);

        document.getElementById('zoomInput').value = '';
        document.getElementById('zoomInput').blur();
        document.getElementById('zoomSlider').value = 0;
    } else {
        console.error("Failed to fetch valid pan, tilt, or zoom values. PTZ command not sent.");
    }
}

function ssendAreazoomCommand(scaledX, scaledY, zoom) {

    const selectedCameraElement = document.querySelector('.camera-container .selected');
    const selectedCameraName = selectedCameraElement ? selectedCameraElement.textContent.trim() : '';

    // Get the zoom input
    const zoomInput = document.getElementById('zoomInput');

    let zoomLevel;

    if (zoom === null || zoom === undefined) {
        // Check if zoom parameter is not provided, so use the value from zoomInput
        const inputValue = zoomInput ? zoomInput.value.trim() : '';
        console.log('Zoom Input Value:', inputValue);

        zoomLevel = inputValue === '' ? 100 : parseInt(inputValue, 10);
        console.log('Parsed Zoom Level from Input:', zoomLevel);

    } else {
        // Use the provided zoom value, ensuring it's an integer
        zoomLevel = parseInt(zoom, 10);
    }

    let intX = parseInt(scaledX, 10);
    let intY = parseInt(scaledY, 10);
    // Construct the command to be sent to Twitch chat
    const ptzareazoomCommand = `!ptzareazoom ${selectedCameraName.toLowerCase()} ${intX} ${intY} ${zoomLevel}`;
    const ptzcenterCommand = `!ptzcenter ${selectedCameraName.toLowerCase()} ${intX} ${intY} ${zoomLevel}`;

    // Only proceed if all required values are defined
    if (scaledX !== undefined && scaledY !== undefined) {
        // Send the command immediately
        sendCommand(ptzareazoomCommand);
        console.log("Command sent:", ptzareazoomCommand);

        // Display message in header bar
        const commandDisplay = document.getElementById('commandDisplay');
        commandDisplay.textContent = `Click sent for: ${selectedCameraName}`;

        // Clear the message after 3 seconds
        setTimeout(() => {
            commandDisplay.textContent = '';
        }, 3000); // Clears message after 3 seconds

        // Clear zoom input boxes
        document.getElementById('zoomInput').value = '';
        document.getElementById('zoomInput').blur();
        document.getElementById('zoomSlider').value = 0;
    } else {
        console.error("Failed to fetch valid pan, tilt, or zoom values. PTZ command not sent.");
    }
}

function sendcenterCommand(scaledX, scaledY) {
    const selectedCameraElement = document.querySelector('.camera-container .selected');
    const selectedCameraName = selectedCameraElement ? selectedCameraElement.textContent.trim() : '';

    // Get the zoom input
    const zoomInput = document.getElementById('zoomInput');

    // Check if zoom parameter is not provided, so use the value from zoomInput
    const inputValue = zoomInput ? zoomInput.value.trim() : '';
    zoomLevel = inputValue === '' ? 0 : parseInt(inputValue, 10) * 100;

    let intX = parseInt(scaledX, 10);
    let intY = parseInt(scaledY, 10);
    // Construct the command to be sent to Twitch chat
    const ptzareazoomCommand = `!ptzareazoom ${selectedCameraName.toLowerCase()} ${intX} ${intY} ${zoomLevel}`;
    const ptzcenterCommand = `!ptzcenter ${selectedCameraName.toLowerCase()} ${intX} ${intY} ${zoomLevel}`;

    // Only proceed if all required values are defined
    if (scaledX !== undefined && scaledY !== undefined) {
        // Send the command immediately
        sendCommand(ptzcenterCommand);
        console.log("Command sent:", ptzcenterCommand);

        // Display message in header bar
        const commandDisplay = document.getElementById('commandDisplay');
        commandDisplay.textContent = `Click sent for: ${selectedCameraName}`;

        // Clear the message after 3 seconds
        setTimeout(() => {
            commandDisplay.textContent = '';
        }, 3000); // Clears message after 3 seconds

        // Clear zoom input boxes
        document.getElementById('zoomInput').value = '';
        document.getElementById('zoomInput').blur();
        document.getElementById('zoomSlider').value = 0;
    } else {
        console.error("Failed to fetch valid pan, tilt, or zoom values. PTZ command not sent.");
    }

}

function sendclickCommand(scaledX, scaledY, zoom) {
    const selectedCameraElement = document.querySelector('.camera-container .selected');
    const selectedCameraName = selectedCameraElement ? selectedCameraElement.textContent.trim() : '';

    // Get the zoom input
    const zoomInput = document.getElementById('zoomInput');

    // Check if zoom parameter is not provided, so use the value from zoomInput
    const inputValue = zoomInput ? zoomInput.value.trim() : '';
    const zoomLevel = zoom !== undefined ? zoom : (inputValue === '' ? 100 : parseInt(inputValue, 10));

    let intX = parseInt(scaledX, 10);
    let intY = parseInt(scaledY, 10);

    // Construct the command to be sent to Twitch chat
    const ptzareazoomCommand = `!ptzareazoom ${selectedCameraName.toLowerCase()} ${intX} ${intY} ${zoomLevel}`;
    const ptzclickCommand = `!ptzclick ${intX} ${intY} ${zoomLevel}`;

    // Only proceed if all required values are defined
    if (scaledX !== undefined && scaledY !== undefined && scaledX > 0 && scaledY > 0) {
        // Send the command immediately
        sendCommand(ptzclickCommand);
        console.log("Command sent:", ptzclickCommand);

        // Display message in header bar
        const commandDisplay = document.getElementById('commandDisplay');
        commandDisplay.textContent = `Click sent x: ${intX} y: ${intY} z: ${zoomLevel}`;

        // Clear the message after 3 seconds
        setTimeout(() => {
            commandDisplay.textContent = '';
        }, 3000); // Clears message after 3 seconds

        // Clear zoom input boxes
        document.getElementById('zoomInput').value = '';
        document.getElementById('zoomInput').blur();
        document.getElementById('zoomSlider').value = 0;
    } else {
        console.error("Failed to fetch valid pan, tilt, or zoom values. PTZ command not sent.");
    }
}
// Get references to the slider and text input
const slider = document.getElementById('zoomSlider');
const zoomInput = document.getElementById('zoomInput');

// Add a change event listener to the slider
slider.addEventListener('input', function () {
    // Update the value of the text input with the value of the slider
    zoomInput.value = this.value;
});

// Event listener for preset search input
const presetSearchInput = document.getElementById('presetSearch');
const presetPad = document.getElementById('presetPad');
let filteredPad = document.getElementById('filteredPad');

// Function to update filtered results
function updateFilteredResults(query) {
    // Get all preset buttons
    const presetButtons = document.querySelectorAll('.preset-button');
    const thumbnailCheckboxState = localStorage.getItem('thumbnailVisibility');
    const thumbnailCheckboxChecked = thumbnailCheckboxState === 'true';

    // Clear existing filtered results
    if (filteredPad) {
        while (filteredPad.firstChild) {
            filteredPad.removeChild(filteredPad.firstChild);
        }
    } else {
        filteredPad = document.createElement('div');
        filteredPad.id = 'filteredPad';
        filteredPad.className = presetPad.className; // Apply the same classes as presetPad
        presetPad.parentNode.insertBefore(filteredPad, presetPad.nextSibling); // Append after presetPad
    }

    // Determine layout using parent container
    const parentContainer = presetPad.closest('.list-layout, .grid-layout');
    const isListLayout = parentContainer && parentContainer.classList.contains('list-layout');
    const isGridLayout = parentContainer && parentContainer.classList.contains('grid-layout');

    // Ensure filteredPad has the necessary classes
    if (isGridLayout) {
        filteredPad.classList.add('grid-layout');
    } else {
        filteredPad.classList.remove('grid-layout');
    }

    // Filtered preset buttons based on query
    const filteredButtons = Array.from(presetButtons).filter(button => {
        const presetName = button.textContent.trim().toLowerCase();
        return presetName.includes(query);
    });

    // Track unique button text to avoid duplicates
    const uniqueNames = new Set();

    // Add new filtered buttons to filteredPad
    filteredButtons.forEach(button => {
        const presetName = button.textContent.trim().toLowerCase();

        if (!uniqueNames.has(presetName)) {
            const clonedButton = button.cloneNode(false); // Clone without children
            console.log('Cloned button before adding image:', clonedButton);

            // Check if grid layout is applied
            if (isGridLayout) {
                const selectedCamera = localStorage.getItem('selectedCamera');
                console.log('Selected Camera:', selectedCamera); // Log the selected camera

                const image = document.createElement('img');
                image.src = `./button-img/${selectedCamera.toLowerCase()}/${presetName}.png`;
                image.classList.add('preset-image');

                image.onerror = function () {
                    this.src = `./button-img/${selectedCamera.toLowerCase()}/home.png`;
                    this.style.backgroundColor = '#222222';
                    this.style.filter = 'blur(3px)';
                    this.onerror = function () {
                        this.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
                        this.style.backgroundColor = '#222222';
                        this.style.borderTopLeftRadius = '15px';
                        this.style.borderTopRightRadius = '15px';
                    };
                };
                // Trigger button click event when image is clicked

                const container = document.createElement('div');
                container.classList.add('preset-button-container');
                // Create button element
                const button = document.createElement('button');
                button.classList.add('preset-button');
                button.textContent = presetName;
                button.addEventListener('click', () => sendLoadCommand(selectedCamera, presetName));
                image.addEventListener('click', () => {
                    // Programmatically trigger the click event on the button
                    button.click();
                });

                container.appendChild(image);
                container.appendChild(button);
                filteredPad.appendChild(container);
                uniqueNames.add(presetName);

                updateThumbnailVisibility(thumbnailCheckboxChecked);
                updateButtonHeight(thumbnailCheckboxChecked);
            } else {
                clonedButton.addEventListener('click', () => sendLoadCommand(selectedCamera, presetName));
                const buttonLabel = document.createElement('span');
                buttonLabel.textContent = presetName;
                buttonLabel.classList.add('preset-label');
                clonedButton.appendChild(buttonLabel); // Append label to cloned button

                filteredPad.appendChild(clonedButton);

                uniqueNames.add(presetName);
            }

        }

    });

    if (filteredButtons.length > 0) {
        if (isListLayout) {
            presetPad.style.display = 'none';
            filteredPad.style.display = 'grid';
        } else if (isGridLayout) {
            presetPad.style.display = 'none';
            filteredPad.style.display = 'flex';
        }
    } else {
        if (isListLayout) {
            presetPad.style.display = 'none';
            filteredPad.style.display = 'none';
        } else if (isGridLayout) {
            presetPad.style.display = 'none';
            filteredPad.style.display = 'none';
        }
    }
}

// Event listener for input changes
presetSearchInput.addEventListener('input', function () {
    const query = this.value.trim().toLowerCase(); // Get and normalize input value
    updateFilteredResults(query);
});

// Event listener to handle hiding filteredPad and clearing input when the search input is blurred
presetSearchInput.addEventListener('blur', function (event) {
    // Check if the blur event was caused by clicking on a preset-button

    // Delay the execution to allow time for the button click event to run
    setTimeout(() => {
        // Determine layout using parent container
        const parentContainer = presetPad.closest('.list-layout, .grid-layout');
        const isListLayout = parentContainer && parentContainer.classList.contains('list-layout');
        const isGridLayout = parentContainer && parentContainer.classList.contains('grid-layout');

        // Clear the input box value
        presetSearchInput.value = '';

        // Hide filteredPad and show presetPad
        if (filteredPad) {
            while (filteredPad.firstChild) {
                filteredPad.removeChild(filteredPad.firstChild);
            }
            filteredPad.style.display = 'none';
        }
        if (isListLayout) {
            presetPad.style.display = '';
        } else if (isGridLayout) {
            presetPad.style.display = '';
        }
    }, 100); // Adjust delay time as needed
    return;


    // If not clicking on preset-button, execute immediately
    // Determine layout using parent container
    const parentContainer = presetPad.closest('.list-layout, .grid-layout');
    const isListLayout = parentContainer && parentContainer.classList.contains('list-layout');
    const isGridLayout = parentContainer && parentContainer.classList.contains('grid-layout');

    // Clear the input box value
    presetSearchInput.value = '';

    // Hide filteredPad and show presetPad
    if (filteredPad) {
        while (filteredPad.firstChild) {
            filteredPad.removeChild(filteredPad.firstChild);
        }
        filteredPad.style.display = 'none';
    }
    if (isListLayout) {
        presetPad.style.display = 'grid';
    } else if (isGridLayout) {
        presetPad.style.display = 'flex';
    }
});

