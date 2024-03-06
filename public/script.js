let selectedCamera = ''; // Initialize selected camera as empty string
let camerasData = null; // Initialize variable to store camera data

window.onload = function() {
    fetchCameraDataAndPopulateUI(); // Fetch camera data and populate UI
    setTimeout(setChatBoxWidth, 10); // Set chat box width with a 100ms delay

};

// Function to set chat box width to match preset pad width
function setChatBoxWidth() {
    const presetPad = document.getElementById('presetPad');
    const chatBox = document.getElementById('chatBox');
    chatBox.style.width = presetPad.offsetWidth + 'px';
}


// Set chat box width on window resize
window.addEventListener('resize', setChatBoxWidth);

function fetchCameraDataAndPopulateUI() {
    fetch('cameras.json') // Fetch the JSON file
        .then(response => response.json()) // Parse JSON response
        .then(data => {
            camerasData = data; // Store camera data
            populateCameraButtons(camerasData.cameras); // Populate camera buttons
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
    adjustLayout(); // Adjust layout based on the number of items
    highlightSelectedCameraButton();
}


function populatePresetPad(presets) {
    const presetPad = document.getElementById('presetPad');
    presetPad.innerHTML = ''; // Clear previous preset buttons

    presets.forEach(preset => {
        const button = document.createElement('button');
        button.classList.add('preset-button');
        button.textContent = preset;
        button.addEventListener('click', () => sendCommand(selectedCamera, preset));
        presetPad.appendChild(button);
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

function sendSwapCommand() {
    const swap1 = document.getElementById('swap1').value || '';
    const swap2 = document.getElementById('swap2').value || '';
    const command = `!swap ${swap1} ${swap2}`;
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
    document.getElementById('swap1').value = '';
    document.getElementById('swap2').value = '';
}

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
    // For example:
    // adjustLayout();
    // or
    // callback();
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


