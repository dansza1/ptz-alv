let selectedCamera = ''; // Initialize selected camera as empty string
let camerasData = null; // Initialize variable to store camera data

window.onload = function() {
    fetchCameraDataAndPopulateUI(); // Fetch camera data and populate UI

};



// Function to update thumbnail visibility based on checkbox state for grid layout
const updateThumbnailVisibility = (isChecked) => {
    const thumbnails = document.querySelectorAll('.grid-layout .preset-image, .grid-layout .custom-preset-image');
    thumbnails.forEach(thumbnail => {
        thumbnail.style.display = isChecked ? 'block' : 'none'; // Show/hide thumbnails based on checkbox state
    });
};

// Function to update button height based on checkbox state for grid layout
const updateButtonHeight = (isChecked) => {
    const buttons = document.querySelectorAll('.grid-layout .preset-button, .grid-layout .custom-preset-button');
    buttons.forEach(button => {
        button.style.height = isChecked ? '30px' : '60px'; // Adjust height based on checkbox state
    });
};

document.addEventListener('DOMContentLoaded', function() {
    const gridIcon = document.getElementById('gridIcon');
    const listIcon = document.getElementById('listIcon');
    const presetContainer = document.querySelector('.preset-container');
    const customPresetContainer = document.querySelector('.custom-preset-container');

    // Function to remove active class from all icons
    const removeActiveClassFromIcons = () => {
        gridIcon.classList.remove('active-icon');
        listIcon.classList.remove('active-icon');
    };

    // Function to switch to grid view
    const switchToGridView = () => {
        removeActiveClassFromIcons(); // Remove active class from all icons
        gridIcon.classList.add('active-icon'); // Add active class to grid icon
        presetContainer.classList.remove('list-layout');
        presetContainer.classList.add('grid-layout');
        customPresetContainer.classList.remove('list-layout');
        customPresetContainer.classList.add('grid-layout');
        localStorage.setItem('viewMode', 'grid'); // Save the selection to localStorage

        // Retrieve the checkbox state from localStorage
        const thumbnailCheckboxState = localStorage.getItem('thumbnailVisibility');
        const thumbnailCheckboxChecked = thumbnailCheckboxState === 'true';

        // Use the checkbox state to determine visibility and button height
        updateThumbnailVisibility(thumbnailCheckboxChecked);
        updateButtonHeight(thumbnailCheckboxChecked);
    };

    // Function to switch to list view
    const switchToListView = () => {
        removeActiveClassFromIcons(); // Remove active class from all icons
        listIcon.classList.add('active-icon'); // Add active class to list icon
        presetContainer.classList.remove('grid-layout');
        presetContainer.classList.add('list-layout');
        customPresetContainer.classList.remove('grid-layout');
        customPresetContainer.classList.add('list-layout');
        localStorage.setItem('viewMode', 'list'); // Save the selection to localStorage

        // Always hide thumbnails in list view
        const thumbnails = document.querySelectorAll('.preset-image, .custom-preset-image');
        thumbnails.forEach(thumbnail => {
            thumbnail.style.display = 'none';
        });
    };

    // Check if there is a previous selection stored in localStorage
    const savedViewMode = localStorage.getItem('viewMode');
    if (savedViewMode === 'grid') {
        switchToGridView();
    } else if (savedViewMode === 'list') {
        switchToListView();
    }

    gridIcon.addEventListener('click', switchToGridView);
    listIcon.addEventListener('click', switchToListView);
});





function toggleCustomPresetContainerVisibility() {
    var customPresetPad = document.getElementById("customPresetPad");
    var customPresetContainer = document.querySelector(".custom-preset-container");

    if (customPresetPad.innerHTML.trim() === "") {
        customPresetContainer.style.display = "none";
    } else {
        customPresetContainer.style.display = "block";
    }
}

function fetchCameraDataAndPopulateUI() {
    fetch('cameras.json') // Fetch the JSON file
        .then(response => response.json()) // Parse JSON response
        .then(data => {
            camerasData = data; // Store camera data
            populateCameraButtons(camerasData.cameras); // Populate camera buttons
            populateDropdowns(camerasData.cameras); // Populate dropdown menus
            const storedCamera = localStorage.getItem('selectedCamera');
            if (storedCamera) {
                selectCamera(storedCamera); // Select the previously selected camera
            } else {
                selectCamera(camerasData.cameras[0].name); // Select the first camera by default
            }
            
    })
        .catch(error => console.error('Error fetching camera data:', error));

    }

function populateCameraButtons(cameras) {
    const cameraContainer = document.querySelector('.camera-container');
    cameras.forEach(camera => {
        const button = document.createElement('button');
        button.classList.add('camera-button');
        button.textContent = camera.name;
        button.addEventListener('click', () => selectCamera(camera.name));
        cameraContainer.appendChild(button);
    });
}

function selectCamera(cameraName) {
    selectedCamera = cameraName; // Set the selected camera
    localStorage.setItem('selectedCamera', selectedCamera); // Store selected camera
    const selectedCameraData = camerasData.cameras.find(camera => camera.name === cameraName);
    populatePresetPad(selectedCameraData.presets); // Populate preset pad with presets for the selected camera
    fetchAndPopulateCustomPresets(cameraName);
    adjustLayout(); // Adjust layout based on the number of items
    highlightSelectedCameraButton();    
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

function populatePresetPad(presets) {
    const presetPad = document.getElementById('presetPad');
    presetPad.innerHTML = ''; // Clear previous preset buttons

    const thumbnailCheckboxState = localStorage.getItem('thumbnailVisibility');
    const thumbnailCheckboxChecked = thumbnailCheckboxState === 'true';

    presets.forEach(preset => {
        // Create container for image-button pair
        const container = document.createElement('div');
        container.classList.add('preset-button-container');

        // Create image element
        const image = document.createElement('img');

        image.src = `./button-img/${selectedCamera}/${preset}.png`;
        image.classList.add('preset-image');

        image.onerror = function() {
            // Set the source to the home image if the preset image fails to load
            this.src = `./button-img/${selectedCamera}/home.png`;
            this.style.backgroundColor = '#222222'; // Replace 'your-color' with the desired color
            this.style.filter = 'blur(3px)'; // Apply a blur effect
            // If the home image also fails to load, set a default image source
            this.onerror = function() {
                this.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
                this.style.backgroundColor = '#222222'; // Replace 'your-color' with the desired color
                this.style.borderTopLeftRadius = '15px'; // Adjust the radius for the top-left corner
                this.style.borderTopRightRadius = '15px'; // Adjust the radius for the top-right corner
            };
        };

        // Create button element
        const button = document.createElement('button');
        button.classList.add('preset-button');
        button.textContent = preset;
        button.addEventListener('click', () => sendCommand(selectedCamera, preset));

        // Trigger button hover effect when image is hovered over
        image.addEventListener('mouseover', () => {
            button.classList.add('preset-button-hover');
        });
        image.addEventListener('mouseout', () => {
            button.classList.remove('preset-button-hover');
        });

        // Append image and button to container
        container.appendChild(image);
        container.appendChild(button);
        // Append container to preset pad
        presetPad.appendChild(container);

        // Update thumbnail visibility and button height based on checkbox state
        updateThumbnailVisibilityForElement(image, thumbnailCheckboxChecked);
        updateButtonHeightForElement(button, thumbnailCheckboxChecked);
    });
}

// Function to update thumbnail visibility based on checkbox state for a specific element
function updateThumbnailVisibilityForElement(element, isChecked) {
    element.style.display = isChecked ? 'block' : 'none';
}

// Function to update button height based on checkbox state for a specific element
function updateButtonHeightForElement(element, isChecked) {
    element.style.height = isChecked ? '30px' : '60px';
}


function fetchCustomPresets(cameraName) {
    return fetch(`/custom-presets`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch custom presets');
            }
            return response.json();
        })
        .then(data => {
            // Filter custom presets based on the cameraName
            return data.presets.filter(preset => preset.cameraName === cameraName);
        })
        .catch(error => {
            console.error('Error fetching custom presets:', error);
            return []; // Return an empty array in case of an error
        });
}

function fetchAndPopulateCustomPresets(cameraName) {
    fetchCustomPresets(cameraName)
        .then(customPresets => {
            populateCustomPresetPad(customPresets); // Pass filtered custom presets
                // Retrieve the checkbox state from localStorage
        })
        .catch(error => {
            console.error('Error fetching custom presets:', error);
        });
}


function populateCustomPresetPad(customPresets) {
    const customPresetPad = document.getElementById('customPresetPad');
    customPresetPad.innerHTML = ''; // Clear previous custom preset buttons

    const thumbnailCheckboxState = localStorage.getItem('thumbnailVisibility');
    const thumbnailCheckboxChecked = thumbnailCheckboxState === 'true';

    customPresets.forEach(customPreset => {
        // Create container for image-button pair
        const container = document.createElement('div');
        container.classList.add('custom-preset-button-container');

        // Create image element
        const image = document.createElement('img');

        image.onerror = function() {
            // Set the source to the home image if the preset image fails to load
            this.src = `./button-img/${selectedCamera}/home.png`;
            this.style.backgroundColor = '#222222'; // Replace 'your-color' with the desired color
            this.style.filter = 'blur(3px)'; // Apply a blur effect
            // If the home image also fails to load, set a default image source
            this.onerror = function() {
                this.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
                this.style.backgroundColor = '#222222'; // Replace 'your-color' with the desired color
                this.style.borderTopLeftRadius = '15px'; // Adjust the radius for the top-left corner
                this.style.borderTopRightRadius = '15px'; // Adjust the radius for the top-right corner
            };
        };

        image.src = `./button-img/${selectedCamera}/${customPreset.presetName}.png`;
        image.classList.add('custom-preset-image');

        // Create button element
        const button = document.createElement('button');
        button.classList.add('custom-preset-button');
        button.textContent = customPreset.presetName; // Use presetName property as the button label
        button.addEventListener('click', () => sendCustomCommand(selectedCamera, customPreset.presetName, customPresets)); // Pass presetName to sendCustomCommand

        // Append image and button to container
        container.appendChild(image);
        container.appendChild(button);

        // Append container to custom preset pad
        customPresetPad.appendChild(container);

        // Update thumbnail visibility and button height based on checkbox state
        updateThumbnailVisibilityForElement(image, thumbnailCheckboxChecked);
        updateButtonHeightForElement(button, thumbnailCheckboxChecked);
    });
    toggleCustomPresetContainerVisibility();
}

// Function to update thumbnail visibility based on checkbox state for a specific element
function updateThumbnailVisibilityForElement(element, isChecked) {
    element.style.display = isChecked ? 'block' : 'none';
}

// Function to update button height based on checkbox state for a specific element
function updateButtonHeightForElement(element, isChecked) {
    element.style.height = isChecked ? '30px' : '60px';
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
    const { cameraName: presetCameraName, selectedPreset, pan, tilt, zoom } = customPreset;

    // Construct the load command using the camera name and preset name
    const loadCommand = `!ptzload ${cameraName.toLowerCase()} ${selectedPreset.toLowerCase()}`;

    // Construct the set command using the extracted data
    const setCommand = `!ptzset ${presetCameraName.toLowerCase()} ${pan} ${tilt} ${zoom}`;

    // Send the load command to the backend server
    fetch('/send-command', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ command: loadCommand })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to send load command');
        }
        return response.text(); // Extract the text response from the server
    })
    .then(message => {
        console.log(message); // Log the message to the console

        // After a slight delay, send the set command
        setTimeout(() => {
            sendSetCommand(setCommand);
        }, 1800); // Adjust the delay time (in milliseconds) as needed
    })
    .catch(error => {
        console.error('Error sending load command:', error);
        // Optionally, display an error message on the UI
    });
}


function sendSetCommand(setCommand) {
    // Send the set command to the backend server
    fetch('/send-command', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ command: setCommand })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to send set command');
        }
        return response.text(); // Extract the text response from the server
    })
    .then(message => {
        console.log(message); // Log the message to the console
        // Optionally, display the message on the UI
    })
    .catch(error => {
        console.error('Error sending set command:', error);
        // Optionally, display an error message on the UI
    });
}



function sendCommand(camera, preset) {
    const command = `!ptzload ${camera.toLowerCase()} ${preset}`;
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
    })
    .catch(error => {
        console.error('Error sending command:', error);
        // Optionally, display an error message on the UI
    });
}

function sendDirectionCommand(direction) {
    const command = `!ptzmove ${selectedCamera.toLowerCase()} ${direction}`;
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
    })
    .catch(error => {
        console.error('Error sending command:', error);
        // Optionally, display an error message on the UI
    });
}

function sendPanTiltZoom() {
    const pan = document.getElementById('panInput').value || '0';
    const tilt = document.getElementById('tiltInput').value || '0';
    const zoom = document.getElementById('zoomInput').value || '0';
    const command = `!ptzset ${selectedCamera.toLowerCase()} ${pan} ${tilt} ${zoom}`;
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
    })
    .catch(error => {
        console.error('Error sending command:', error);
        // Optionally, display an error message on the UI
    });

    // Clear the input values
    document.getElementById('panInput').value = '';
    document.getElementById('tiltInput').value = '';
    document.getElementById('zoomInput').value = '';
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
        return response.text();
    })
    .then(message => {
        console.log(message);
        // Optionally, display the message on the UI
        document.getElementById('swap-dropdown1').value = 'option1';
        document.getElementById('swap-dropdown2').value = 'option1';
    })
    .catch(error => {
        console.error('Error sending command:', error);
        // Optionally, display an error message on the UI
    });

    // Clear the input values
    document.getElementById('swap1').value = '';
    document.getElementById('swap2').value = '';
}


// Add event listeners to both dropdowns to clear both inputs when an option other than "Select" is chosen
document.getElementById('swap-dropdown1').addEventListener('change', function() {
    const selectedOption = this.value;
    // Check if the selected option is not "-Select-"
    if (selectedOption !== 'option1') {
        // Clear the input values for both swap1 and swap2
        document.getElementById('swap1').value = '';
        document.getElementById('swap2').value = '';
    }
});

document.getElementById('swap-dropdown2').addEventListener('change', function() {
    const selectedOption = this.value;
    // Check if the selected option is not "-Select-"
    if (selectedOption !== 'option1') {
        // Clear the input values for both swap1 and swap2
        document.getElementById('swap1').value = '';
        document.getElementById('swap2').value = '';
    }
});

// Add event listeners to both inputs to clear both dropdowns when any input is changed
document.getElementById('swap1').addEventListener('input', function() {
    // Reset the dropdowns to the default "Select" option
    document.getElementById('swap-dropdown1').value = 'option1';
    document.getElementById('swap-dropdown2').value = 'option1';
});

document.getElementById('swap2').addEventListener('input', function() {
    // Reset the dropdowns to the default "Select" option
    document.getElementById('swap-dropdown1').value = 'option1';
    document.getElementById('swap-dropdown2').value = 'option1';
});


function sendFocusCommand() {
    const focus = document.getElementById('focus').value || '';
    const command = `!ptzfocusr ${selectedCamera.toLowerCase()} ${focus}`;
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
    })
    .catch(error => {
        console.error('Error sending command:', error);
        // Optionally, display an error message on the UI
    });
    
    // Clear the input values
    document.getElementById('focus').value = '';
}

function sendAutoFocusCommand() {
    const command = `!ptzautofocus ${selectedCamera.toLowerCase()} on`;
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
    })      
    .catch(error => {
        console.error('Error sending command:', error);
        // Optionally, display an error message on the UI
    });
}   


function highlightSelectedCameraButton() {
    const buttons = document.querySelectorAll('.camera-button');
    buttons.forEach(button => {
        if (button.textContent.toLowerCase() === selectedCamera.toLowerCase()) {
            button.classList.add('selected');
        } else {
            button.classList.remove('selected');
        }
    });
}
function fetchDataAndPopulatePresetPad(callback) {
    // Make AJAX request to fetch data and populate preset-pad
    // Once the request is complete and the preset-pad is populated
    // Call the callback function to adjust the layout
    setTimeout(callback, 1000); // Simulate a delay for demonstration
}

document.addEventListener('DOMContentLoaded', function() {
    // Call fetchDataAndPopulatePresetPad after the DOM is loaded
    fetchDataAndPopulatePresetPad(adjustLayout);
});

// Listen for resize events and adjust the layout accordingly
window.addEventListener('resize', adjustLayout);

// Function to adjust the layout based on the number of items
function adjustLayout() {
    const presetPad = document.querySelector('.preset-pad');
    const numberOfItemsThreshold = 15; // Set your desired threshold here

    try {
        if (presetPad) {
            const numberOfItems = presetPad.querySelectorAll('.preset-button').length;
            console.log("Number of items:", numberOfItems);
            if (numberOfItems <= numberOfItemsThreshold) {
                presetPad.classList.add('single-column');
                presetPad.classList.remove('two-columns');
                console.log("Applying single-column layout.");
            } else {
                presetPad.classList.remove('single-column');
                presetPad.classList.add('two-columns');
                console.log("Applying two-columns layout.");
            }
        } else {
            console.warn("presetPad is null or undefined.");
        }
    } catch (error) {
        console.error("An error occurred in adjustLayout:", error.message);
    }
}

// Function to handle key down events
function handleKeyDown(event) {
    // Check if the arrow key checkbox state is stored in local storage
    const savedArrowKeyCheckboxState = localStorage.getItem('arrowKeyCheckboxState');
    if (savedArrowKeyCheckboxState !== 'true') {
        return; // Exit the function if checkbox is not checked (or if the state is not found in local storage)
    }

    // Check if the pressed key is an arrow key
    switch (event.key) {
        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
            // Check if the target element is an input box or textarea
            if (event.target.tagName.toLowerCase() === 'input' || event.target.tagName.toLowerCase() === 'textarea') {
                // Allow default behavior of arrow keys inside input boxes and textareas
                return;
            }
            event.preventDefault(); // Prevent default only for arrow keys outside input boxes and textareas
            break;
        default:
            break;
    }

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

// Add event listener for keydown event on document
document.addEventListener('keydown', handleKeyDown);


function updatePanTiltZoom() {
    const sliderValue = parseInt(document.getElementById('speedSlider').value);
    const panInput = document.getElementById('panInput');
    const tiltInput = document.getElementById('tiltInput');
    const zoomInput = document.getElementById('zoomInput');
    
    // Update input values based on slider position
    panInput.value = sliderValue;
    tiltInput.value = sliderValue;
    zoomInput.value = sliderValue;

    // Call the sendPanTiltZoom function to send the updated values
    sendPanTiltZoom();
}


function sendPanTiltZoom() {
    const pan = document.getElementById('panInput').value || '0';
    const tilt = document.getElementById('tiltInput').value || '0';
    const zoom = document.getElementById('zoomInput').value || '0';
    const command = `!ptzset ${selectedCamera.toLowerCase()} ${pan} ${tilt} ${zoom}`;
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
    })
    .catch(error => {
        console.error('Error sending command:', error);
        // Optionally, display an error message on the UI
    });

    // Clear the input values
    document.getElementById('panInput').value = '';
    document.getElementById('tiltInput').value = '';
    document.getElementById('zoomInput').value = '';
}




// Get the button element
const button = document.getElementById('sliderValueLabel');

// PanTilt middle button
const values = ['1', '3', '6', '9']; // Define the three values
let currentIndex = 0; // Initialize the index to 0

function toggleValues() {
    currentIndex = (currentIndex + 1) % values.length; // Increment index and loop back to 0 if it exceeds the array length
    document.getElementById('sliderValueLabel').textContent = values[currentIndex]; // Update the button label with the new value
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
    })
    .catch(error => {
        console.error('Error sending command:', error);
        // Optionally, display an error message on the UI
    });
}
function togglePad(selector) {
    const directionPads = document.querySelectorAll('.direction-pad, .pantilt-pad');
    directionPads.forEach(pad => {
        if (pad.classList.contains(selector.replace('.', ''))) {
            pad.classList.remove('hidden'); // Show the pad
        } else {
            pad.classList.add('hidden'); // Hide the pad
        }
    });
}

function setActiveHeading(headingClass) {
    const allHeadings = document.querySelectorAll('.direction-move-heading, .direction-pan-heading');
    allHeadings.forEach(h => h.classList.remove('active'));

    const headings = document.querySelectorAll(headingClass);
    headings.forEach(h => h.classList.add('active'));
}



