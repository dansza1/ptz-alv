window.onload = function() {
    populateCurrentCameras();
};


// admin.js

// Function to fetch current Twitch settings
function fetchTwitchSettings() {
    // Make an API call to fetch the current Twitch settings
    fetch('/twitch-settings')
        .then(response => {
            if (!response.ok) {
                console.error('Error fetching Twitch settings. Status:', response.status);
                return response.text().then(text => console.error('Response body:', text));
            }
            return response.json();
        })
        .then(data => {
            // Check if the elements exist before populating them with data
            const twitchUsernameElement = document.getElementById('twitchUsername');
            const twitchChannelElement = document.getElementById('twitchChannel');
            const twitchOAuthKeyElement = document.getElementById('twitchOAuthKey');

            if (twitchUsernameElement && twitchChannelElement && twitchOAuthKeyElement) {
                // Populate the paragraph elements with the fetched settings
                twitchUsernameElement.textContent = data.twitch.username || 'Not Available';
                twitchChannelElement.textContent = data.twitch.channel || 'Not Available';
                twitchOAuthKeyElement.textContent = data.twitch.oauthKey || 'Not Available';
            } else {
                console.error('One or more Twitch settings elements not found.');
            }
        })
        .catch(error => console.error('Error fetching Twitch settings:', error));
}


function editField(fieldId) {
    const fieldValue = document.getElementById(fieldId);
    const currentValue = fieldValue.innerText.trim();

    // Show a prompt dialog for editing the field
    const newValue = prompt(`Enter new value for ${fieldId}:`, currentValue);
    
    // If user clicked cancel or entered an empty value, do nothing
    if (newValue === null || newValue.trim() === '') {
        return;
    }

    // Update the field value
    fieldValue.innerText = newValue;

    // Save the new value to the server
    saveTwitchSettings();
}



function saveTwitchSettings() {
    console.log('Save button clicked'); // Add this line to check if the function is being called
    const twitchUsername = document.getElementById('twitchUsername').innerText;
    const twitchChannel = document.getElementById('twitchChannel').innerText;
    const twitchOAuthKey = document.getElementById('twitchOAuthKey').innerText;

    // Make an API call to save the updated Twitch settings
    fetch('/save-twitch-settings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: twitchUsername,
            channel: twitchChannel,
            oauthKey: twitchOAuthKey
        })
    })
    .then(response => {
        if (response.ok) {
            console.log('Twitch settings saved successfully');
            // Optionally, update UI or show a success message
        } else {
            console.error('Failed to save Twitch settings');
            // Optionally, show an error message
        }
    })
    .catch(error => console.error('Error saving Twitch settings:', error));
}

function showTwitchSettings() {

    const activeMenuItem = document.querySelector('.menu-item.active');
    if (activeMenuItem) {
        activeMenuItem.classList.remove('active');
    }

    // Add 'active' class to Twitch Settings menu item
    document.getElementById('twitchSettingsLink').classList.add('active');

    // Create the Twitch Settings form HTML
    const twitchSettingsForm = document.createElement('div');
    twitchSettingsForm.id = 'twitchSettingsForm';
    twitchSettingsForm.classList.add('settings-form');
    twitchSettingsForm.style.display = 'block';

    twitchSettingsForm.innerHTML = `
        <h2>Twitch Settings</h2>
        <table class="settings-table">
            <tr>
                <td><label class="field-label">Username:</label></td>
                <td><p id="twitchUsername" class="field-value"></p></td>
                <td><button class="edit-button" onclick="editField('twitchUsername')">Edit</button></td>
            </tr>
            <tr>
                <td><label class="field-label">Channel:</label></td>
                <td><p id="twitchChannel" class="field-value"></p></td>
                <td><button class="edit-button" onclick="editField('twitchChannel')">Edit</button></td>
            </tr>
            <tr>
                <td><label class="field-label">OAuth Key:</label></td>
                <td><p id="twitchOAuthKey" class="field-value"></p></td>
                <td><button class="edit-button" onclick="editField('twitchOAuthKey')">Edit</button></td>
            </tr>
        </table>
    `;

    // Append the Twitch Settings form to the mainContent container
    const mainContentContainer = document.getElementById('mainContent');
    mainContentContainer.innerHTML = '';
    mainContentContainer.appendChild(twitchSettingsForm);

    // Fetch and populate Twitch settings
    fetchTwitchSettings();
}



function populateCurrentCameras() {
    const currentCameraList = document.getElementById('currentCameraList');
    currentCameraList.innerHTML = '';

    fetch('/cameras')
        .then(response => response.json())
        .then(data => {
            data.cameras.forEach(camera => {
                const listItem = document.createElement('li');
                listItem.textContent = camera.name;
                listItem.classList.add('camera-button');
                listItem.addEventListener('click', () => {
                    // Remove 'selected' class from previously selected item
                    const selectedItems = document.querySelectorAll('.camera-button.selected');
                    selectedItems.forEach(item => item.classList.remove('selected'));

                    // Add 'selected' class to the clicked item
                    listItem.classList.add('selected');

                    // Call the showCameraDetails function or perform any other action
                    showCameraDetails(camera.name);
                });
                currentCameraList.appendChild(listItem);
            });

            // Automatically select the first camera and display its details
            if (data.cameras.length > 0) {
                const firstCameraName = data.cameras[0].name;
                showCameraDetails(firstCameraName);

                // Manually add 'selected' class to the first item in the list
                const firstListItem = currentCameraList.querySelector('li');
                firstListItem.classList.add('selected');
            }
        })
        .catch(error => console.error('Error fetching camera data:', error));
}


function showAddCamera() {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
        <h2>Add Camera</h2>
        <div class="form-group">
            <label for="cameraName">Camera Name:</label>
            <input type="text" id="cameraName" name="cameraName">
        </div>
        <button class="btn-add-preset" onclick="addCamera()">Add Camera</button>
    `;
}


function editCamera(cameraName) {
    const newCameraName = prompt('Enter the new name for the camera:');
    if (newCameraName === null || newCameraName.trim() === '') {
        return; // User clicked cancel or entered an empty string
    }

    // Send a POST request to the server to rename the camera
    fetch('/rename-camera', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ oldCameraName: cameraName, newCameraName }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to rename camera');
        }
        console.log('Camera renamed successfully');
        document.getElementById('manageCamerasLink').click();
    })
    .catch(error => {
        console.error('Error renaming camera:', error);
    });
}


function deleteCamera(cameraName) {
    const confirmation = confirm("Are you sure you want to delete this camera and all its presets?");
    if (confirmation) {
        // Send a POST request to the server to delete the camera and its presets
        fetch('/delete-camera', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cameraName }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete camera');
            }
            console.log('Camera deleted successfully');
            // Optionally, redirect to a different page or perform any other action
            populateCurrentCameras(); // Refresh the list of current cameras
            document.getElementById('manageCamerasLink').click();
        })
        .catch(error => {
            console.error('Error deleting camera:', error);
        });
    }
}

function showCamera() {
    // Remove 'active' class from previously selected menu item
    const activeMenuItem = document.querySelector('.menu-item.active');
    if (activeMenuItem) {
        activeMenuItem.classList.remove('active');
    }

    // Add 'active' class to Manage Cameras menu item
    document.getElementById('manageCamerasLink').classList.add('active');

    console.log("showCamera function is being called."); // Add this line
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
        <div id="cameraDetails">
            <div class="managecamera-header">
            <h2 class="camera-heading">Manage Cameras</h2>
            <button class="btn-add-camera" onclick="addCamera()">Add Camera</button>
	    </div>
            <table id="cameraTable">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Camera Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="cameraList">
                    <!-- Camera list will be dynamically populated here -->
                </tbody>
            </table>
        </div>
    `;

    // Fetch camera data and populate the table dynamically
    fetch('/cameras')
        .then(response => response.json())
        .then(data => {
            const cameraList = document.getElementById('cameraList');
            cameraList.innerHTML = ''; // Clear the camera list before populating
            data.cameras.forEach((camera, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${camera.name}</td>
                    <td>
                        <button class="btn-edit" onclick="editCamera('${camera.name}')">Rename</button>
                        <button class="btn-delete" onclick="deleteCamera('${camera.name}')">Delete</button>
                        <button class="btn-move-up" onclick="moveCameraUp('${camera.name}')">Move Up</button>
                        <input type="number" id="move-to-input-${camera.name}" class="move-to-input" placeholder="Enter line number">
                        <button class="btn-move-to" onclick="moveCameraTo('${camera.name}')">Move To</button>
                    </td>
                `;
                cameraList.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching cameras:', error));
}


function showCameraDetails(cameraName) {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
        <div id="cameraDetails">
            <div class="camera-header">
                <span class="camera-name">Camera Name: ${cameraName}</span>
            </div>
            <button class="btn-add-preset" onclick="addNewPreset('${cameraName}')">Add New Preset</button>
            <table id="presetTable">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Preset Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="presetList">
                    <!-- Presets for the selected camera will be dynamically populated here -->
                </tbody>
            </table>
        </div>
    `;

    fetch('/cameras')
        .then(response => response.json())
        .then(data => {
            const selectedCamera = data.cameras.find(camera => camera.name === cameraName);
            if (!selectedCamera) {
                console.error('Selected camera not found:', cameraName);
                return;
            }

            const presetList = document.getElementById('presetList');
            presetList.innerHTML = ''; // Clear the preset list before populating
            selectedCamera.presets.forEach((preset, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td><span class="preset-name">${preset}</span></td>
                    <td>
                        <button class="btn-edit" onclick="editPreset('${cameraName}', '${index}')">Rename</button>
                        <button class="btn-delete" onclick="deletePreset('${cameraName}', '${index}')">Delete</button>
                        <button class="btn-move-up" onclick="movePresetUp('${cameraName}', '${index}')">Move Up</button>
                        <input type="number" class="move-to-input" placeholder="Enter line number">
                        <button class="btn-move-to" onclick="movePresetTo('${cameraName}', '${index}')">Move To</button>
                    </td>
                `;
                presetList.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching presets:', error));
}


function movePresetTo(cameraName, presetId) {
    const presetList = document.getElementById('presetList');
    const presets = presetList.getElementsByTagName('tr');
    const moveToInput = presets[presetId].querySelector('.move-to-input');
    const lineNumber = parseInt(moveToInput.value);

    if (isNaN(lineNumber) || lineNumber < 1 || lineNumber > presets.length) {
        console.error('Invalid line number:', lineNumber);
        return;
    }

    // Insert the current preset at the specified line number
    const currentPreset = presets[presetId];
    const targetPreset = presets[lineNumber - 1]; // Subtract 1 because line numbers start from 1
    presetList.insertBefore(currentPreset, targetPreset);

    // Update the preset order in the JSON data
    updatePresetOrder(cameraName);
}


function addNewPreset(cameraName) {
    const newPresetName = prompt('Enter the name for the new preset:');
    if (newPresetName === null || newPresetName.trim() === '') {
        return;
    }

    fetch('/add-preset', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cameraName, newPresetName }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to add preset');
        }
        console.log('Preset added successfully');
        showCameraDetails(cameraName); // Refresh preset list for the current camera
    })
    .catch(error => {
        console.error('Error adding preset:', error);
    });
}

function addCamera() {
    const cameraName = prompt('Enter the name for the new camera:');
    if (cameraName === null || cameraName.trim() === '') return;

    fetch('/add-camera', {
        method: 'POST', 
        headers: {      
            'Content-Type': 'application/json',
        },      
        body: JSON.stringify({ cameraName }),
    })              
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to add camera');
        }
        console.log('Camera added successfully');
        document.getElementById('manageCamerasLink').click();
    })  
    .catch(error => { 
        console.error('Error adding camera:', error);
    });     
}           


function editPreset(cameraName, presetId) {
    const newPresetName = prompt('Enter the new name for the preset:');
    if (newPresetName === null || newPresetName.trim() === '') {
        return; // User clicked cancel or entered an empty string
    }

    // Send a POST request to the server to rename the preset
    fetch('/rename-preset', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cameraName, presetId, newPresetName }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to rename preset');
        }
        console.log('Preset renamed successfully');
        showCameraDetails(cameraName); // Reload preset list for the current camera
    })
    .catch(error => {
        console.error('Error renaming preset:', error);
    });
}


function movePresetUp(cameraName, presetId) {
    const presetList = document.getElementById('presetList');
    const presets = presetList.getElementsByTagName('tr');

    // Ensure the presetId is within the valid range
    if (presetId <= 0 || presetId >= presets.length) {
        console.error('Invalid preset ID:', presetId);
        return;
    }

    // Swap the positions of the current preset with the one above it
    const currentPreset = presets[presetId];
    const previousPreset = presets[presetId - 1];
    presetList.insertBefore(currentPreset, previousPreset);

    // Update the preset order in the JSON data
    updatePresetOrder(cameraName);
}

function updatePresetOrder(cameraName) {
    const presetList = document.getElementById('presetList');
    const presets = presetList.getElementsByTagName('tr');

    // Extract preset names in the new order
    const updatedPresets = Array.from(presets).map(preset => {
        return preset.querySelector('.preset-name').innerText;
    });

    // Update the JSON data with the new order
    fetch('/update-preset-order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cameraName, presets: updatedPresets }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update preset order');
        }
        console.log('Preset order updated successfully');
        // Save the currently selected camera name in session storage
        sessionStorage.setItem('currentCameraName', cameraName);
        reloadCameraDetails(); // Reload the camera details view after successful update
    })
    .catch(error => {
        console.error('Error updating preset order:', error);
    });
}



function reloadCameraDetails() {
    // Retrieve the stored camera name
    const currentCameraName = sessionStorage.getItem('currentCameraName');
    if (currentCameraName) {
        showCameraDetails(currentCameraName); // Reload the camera details view with the stored camera name
    }
}


function deletePreset(cameraName, presetId) {
    const confirmation = confirm("Are you sure you want to delete this preset?");
    if (confirmation) {
        // Send a POST request to the server to delete the preset
        fetch('/delete-preset', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cameraName, presetId }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete preset');
            }
            console.log('Preset deleted successfully');
            showCameraDetails(cameraName); // Reload preset list for the current camera
        })
        .catch(error => {
            console.error('Error deleting preset:', error);
        });
    }
}

function moveCameraUp(cameraName) {
    fetch('/move-camera-up', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cameraName }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to move camera up');
        }
        console.log('Camera moved up successfully');

        // Simulate a click on the "Manage Cameras" button to reload the page
        document.getElementById('manageCamerasLink').click();
    })
    .catch(error => {
        console.error('Error moving camera up:', error);
    });
}

function moveCameraTo(cameraName) {
    // Find the input element corresponding to the camera
    const lineNumberInput = document.querySelector(`#move-to-input-${cameraName}`);

    if (!lineNumberInput) {
        console.error('Input element not found for camera:', cameraName);
        return;
    }

    const lineNumber = parseInt(lineNumberInput.value.trim()); // Get the line number as an integer

    if (isNaN(lineNumber) || lineNumber < 1) {
        console.error('Invalid line number:', lineNumber);
        return;
    }

    // Fetch data from the server and move the camera to the specified line number
    fetch('/move-camera-to', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cameraName, lineNumber }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to move camera to line number');
        }
        console.log('Camera moved to line number successfully');

        // Simulate a click on the "Manage Cameras" button to reload the page
        document.getElementById('manageCamerasLink').click();
    })
    .catch(error => {
        console.error('Error moving camera to line number:', error);
    });
}

