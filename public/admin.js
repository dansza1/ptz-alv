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

function showInterfaceSettings() {

    const activeMenuItem = document.querySelector('.menu-item.active');
    if (activeMenuItem) {
        activeMenuItem.classList.remove('active');
    }

    // Add 'active' class to Twitch Settings menu item
    document.getElementById('interfaceSettingsLink').classList.add('active');

    // Create the Twitch Settings form HTML
    const interfaceSettingsForm = document.createElement('div');
    interfaceSettingsForm.id = 'interfaceSettingsForm';
    interfaceSettingsForm.classList.add('settings-form');
    interfaceSettingsForm.style.display = 'block';

    interfaceSettingsForm.innerHTML = `
        <h2>Interface Settings</h2>
        <table class="settings-table">
            <tr>
                <td><label class="field-label">Show grid Thumbnails</label></td>
                <td>
                <input type="checkbox" class="edit-checkbox" id="thumbnailCheckbox" checked>
                </td>
            </tr>
             <tr>
                <td><label class="field-label">Enable Direction-pad Arrow keys</label></td>
                <td>
                <input type="checkbox" class="edit-checkbox" id="arrowKeyCheckbox" checked>
                </td>
            </tr>
        </table>
    `;

    // Append the Twitch Settings form to the mainContent container
    const mainContentContainer = document.getElementById('mainContent');
    mainContentContainer.innerHTML = '';
    mainContentContainer.appendChild(interfaceSettingsForm);

}

document.getElementById('interfaceSettingsLink').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default link behavior

    // Ensure the checkbox element is created in the DOM
    const thumbnailCheckbox = document.getElementById('thumbnailCheckbox');
    if (thumbnailCheckbox) {
        // Function to save the checkbox state to localStorage
        const saveCheckboxState = () => {
            localStorage.setItem('thumbnailVisibility', thumbnailCheckbox.checked);
        };

        // Check if there is a previous selection stored in localStorage
        const savedThumbnailVisibility = localStorage.getItem('thumbnailVisibility');
        if (savedThumbnailVisibility !== null) {
            thumbnailCheckbox.checked = savedThumbnailVisibility === 'true'; // Set checkbox state based on saved value
        }

        // Save checkbox state to localStorage when clicked
        thumbnailCheckbox.addEventListener('change', saveCheckboxState);
    } else {
        console.error('Thumbnail checkbox element not found.');
    }
});

document.getElementById('interfaceSettingsLink').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default link behavior

    // Ensure the checkbox element is created in the DOM
    const arrowKeyCheckbox = document.getElementById('arrowKeyCheckbox');
    if (arrowKeyCheckbox) {
        // Function to save the checkbox state to localStorage
        const saveCheckboxState = () => {
            localStorage.setItem('arrowKeyCheckboxState', arrowKeyCheckbox.checked);
        };

        // Check if there is a previous selection stored in localStorage
        const savedCheckboxState = localStorage.getItem('arrowKeyCheckboxState');
        if (savedCheckboxState !== null) {
            arrowKeyCheckbox.checked = savedCheckboxState === 'true'; // Set checkbox state based on saved value
        }

        // Save checkbox state to localStorage when clicked
        arrowKeyCheckbox.addEventListener('change', saveCheckboxState);
    } else {
        console.error('Arrow key checkbox element not found.');
    }
});



// Left Menu with list of Cameras
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


// Add Camera button
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


// Edit Camera button
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


// Manage Cameras table
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



// Manage Camera presets table
function showCameraDetails(cameraName) {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
        <div id="cameraDetails">
            <div class="camera-header">
                <span class="camera-name">Camera Name: ${cameraName}</span>
            </div>
            <button class="btn-add-preset" onclick="addNewPreset('${cameraName}')">Add New Preset</button>
            <button class="btn-add-custom-preset" onclick="showCustomPresetInputs('${cameraName}')">Add Custom Preset</button>
            <button class="btn-sync-preset" onclick="syncPresets('${cameraName}')">Sync Presets</button>
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
            <div style="margin-top: 20px;"></div> <!-- Add a gap between the two tables -->
            <table id="customPresetTable"> <!-- New container for custom presets table -->
                <thead>
                    <tr>
                        <th>#</th> 
                        <th>Preset Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="customPresetList">
                    <!-- Custom presets for the selected camera will be dynamically populated here -->
                </tbody>
            </table>
        </div>
    `;
    fetchAndPopulatePresets(cameraName); // Call to fetch and populate regular presets
    fetchAndPopulateCustomPresets(cameraName); // Call to fetch and populate custom presets
}


// Function to fetch and populate regular presets
function fetchAndPopulatePresets(cameraName) {
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

function fetchAndPopulateCustomPresets(cameraName) {
    fetch('/custom-presets')
        .then(response => response.json())
        .then(data => {
            const customPresetList = document.getElementById('customPresetList');
            customPresetList.innerHTML = ''; // Clear the custom preset list before populating
            
            data.presets.filter(preset => preset.cameraName === cameraName).forEach((preset, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td><span class="preset-name">${preset.presetName}</span></td>
                    <td>
                        <button class="btn-edit" onclick="editCustomPreset('${cameraName}', '${preset.presetName}')">Edit</button>
                        <button class="btn-delete" onclick="deleteCustomPreset('${cameraName}', '${preset.presetName}')">Delete</button>
		        <input type="number" class="move-to-input" placeholder="Enter line number">
                        <button class="btn-move-to-custom" onclick="moveCustomPresetTo('${cameraName}', '${index}')">Move To</button>
                    </td>
                `;
                customPresetList.appendChild(row);
            }); 
            
            // Add event listener to edit button
            document.querySelectorAll('.btn-edit').forEach(button => {
                button.addEventListener('click', () => {
                    const presetName = button.parentElement.parentElement.querySelector('.preset-name').textContent;
                    // Handle edit functionality here
                }); 
            });

            // Show or hide the custom presets table based on whether the list is empty
            const customPresetTable = document.getElementById('customPresetTable');
            if (customPresetList.children.length > 0) {
                customPresetTable.style.display = 'block';
            } else {
                customPresetTable.style.display = 'none';
            }      
        })
        .catch(error => console.error('Error fetching custom presets:', error));
}


function populateCustomPresetInputs(presetName) {
    fetch(`/get-preset-by-name?presetName=${presetName}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch preset data');
            }
            return response.json();
        })
        .then(presetData => {
            // Now populate the inputs with the fetched presetData
            document.getElementById('presetName').value = presetData.presetName;
            document.getElementById('pan').value = presetData.pan;
            document.getElementById('tilt').value = presetData.tilt;
            document.getElementById('zoom').value = presetData.zoom;

            // Pre-select the dropdown option based on selectedPreset
            const selectedPreset = presetData.selectedPreset;
            const dropdownList = document.getElementById('presetSelect');
            Array.from(dropdownList.options).forEach(option => {
                if (option.value === selectedPreset) {
                    option.selected = true;
                }
            });
        })
        .catch(error => {
            console.error('Error fetching preset data:', error);
        });
}


function syncPresets(cameraName) {
    showDialog('Fetching presets from Twitch');
    // Construct the command to be sent
    const command = `!ptzlist ${cameraName.toLowerCase()}`;


    // Send the command to the backend endpoint
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
        console.log('Command sent successfully');
        // After successfully sending the command, listen for Twitch chat messages
        fetchSyncPresets(cameraName);
    })
    .catch(error => {
        console.error('Error sending command:', error);
    });
}

function fetchSyncPresets(cameraName) {
    // Prepare the request body
    const requestBody = {
        cameraName: cameraName
    };

    // Send a POST request to the backend endpoint
    fetch('/fetch-presets', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch presets');
        }
        return response.json();
    })
.then(data => {
    // Check if the presets array is not empty
    if (data.presets && data.presets.length > 0) {
        // Handle the received presets
        const presets = data.presets;
        console.log('Received presets:', presets);
        closeDialog();
        // Display new presets on the UI
        displaySyncPresets(cameraName, presets);
    } else {
        // Handle the case where no presets are received
        console.log('No presets received.');
        closeDialog();
	alert('No presets found');
        // You can add code here to display a message to the user or handle the situation accordingly
    }
})
    .catch(error => {
        console.error('Error fetching presets:', error);
        // Handle the error, display a message to the user, etc.
    });
}

function displaySyncPresets(cameraName, fetchedPresets) {
    // Fetch presets from the server
    fetch('/cameras')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch camera data');
            }
            return response.json();
        })
        .then(data => {
            const selectedCamera = data.cameras.find(camera => camera.name === cameraName);
            if (!selectedCamera) {
                console.error('Selected camera not found:', cameraName);
                return;
            }

            const presetList = document.getElementById('presetList');
            presetList.innerHTML = ''; // Clear the preset list before populating

            // Extract existing presets from the server data
            const existingPresets = selectedCamera.presets;

            // Compare existing presets with the new presets fetched from Twitch chat
            const newPresets = compareSyncPresets(existingPresets, fetchedPresets);

            // Hide the current table
            const currentTable = document.getElementById('presetTable');
            currentTable.style.display = 'none';
            // Hide custom preset list
            const customPresetList = document.getElementById('customPresetTable');
            customPresetList.style.display = 'none';
            // Hide buttons
            const addButton = document.querySelector('.btn-add-preset');
            const addCustomButton = document.querySelector('.btn-add-custom-preset');
            const syncButton = document.querySelector('.btn-sync-preset');
            addButton.style.display = 'none';
            addCustomButton.style.display = 'none';
            syncButton.style.display = 'none';

            // Create a new table for the new presets
            const newPresetTable = document.createElement('table');
            newPresetTable.id = 'newPresetTable';
            newPresetTable.innerHTML = `
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Preset Name</th>
                        <th>Select</th>
                    </tr>
                </thead>
                <tbody id="newPresetList">
                    <!-- New presets for the selected camera will be dynamically populated here -->
                </tbody>
            `;
            const mainContent = document.getElementById('mainContent');
            mainContent.appendChild(newPresetTable);

            const newPresetList = document.getElementById('newPresetList');

            // Populate the new table with the new presets
            newPresets.forEach((preset, index) => {
                const newIndex = index + 1; // Start numbering from 1 for the new presets
                const row = createSyncPresetRow(newIndex, preset, cameraName);
                newPresetList.appendChild(row);
            });

            // Add "Add new presets" button
            const addPresetsButton = document.createElement('button');
            addPresetsButton.textContent = 'Add new presets';
	    addPresetsButton.classList.add('btn-add-presets'); // Add the class to the button
            addPresetsButton.addEventListener('click', () => {
                // Get all selected presets
                const selectedPresets = Array.from(document.querySelectorAll('#newPresetTable input[type="checkbox"]:checked'))
                    .map(checkbox => checkbox.value); // Use value instead of dataset.preset

                // Send selected presets to the server for addition
                fetch('/add-sync-presets', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        cameraName: selectedCamera.name,
                        newPresets: selectedPresets
                    })
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to add new presets');
                    }
                    return response.text();
                })
                .then(data => {
                    console.log('New presets added successfully:', data);
                    // You can perform additional actions here, such as updating the UI
                   window.location.reload();
                })
                .catch(error => {
                    console.error('Error adding new presets:', error);
                    // Handle the error, e.g., display an error message to the user
                });
            });

            mainContent.appendChild(addPresetsButton);
        })
        .catch(error => {
            console.error('Error fetching presets:', error);
            // Handle the error, e.g., display an error message to the user
        });
}


function createSyncPresetRow(index, preset) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${index}</td>
        <td>${preset}</td>
        <td><input type="checkbox" name="presetCheckbox" value="${preset}"></td>
    `;
    return row;
}

function compareSyncPresets(existingPresets, newPresets) {
    return newPresets.filter(preset => !existingPresets.includes(preset.trim()));
}


let isNewPreset = true; // Initially set isNewPreset to true for creating a new preset

function editCustomPreset(cameraName, presetName) {
            showCustomPresetInputs(cameraName);
            populateCustomPresetInputs(presetName);
            isNewPreset = false; // Set isNewPreset flag to false for editing existing preset
            originalPresetName = presetName; // Store the original preset name
}


function showCustomPresetInputs(cameraName) {
    const presetList = document.getElementById('presetList');
    const presetNames = Array.from(presetList.querySelectorAll('.preset-name')).map(preset => preset.textContent);
    originalPresetName = ''; // Store the original preset name
    const mainContent = document.getElementById('mainContent');
    isNewPreset = true;
    mainContent.innerHTML = `
        <div id="customPresetInputs">
            <label for="presetName">Preset Name:</label>
            <input type="text" id="presetName"><br>
            <label for="presetSelect">Select Existing Preset:</label>
            <select id="presetSelect">
                <option value="">Select Preset</option>
                ${presetNames.map(preset => `<option value="${preset}">${preset}</option>`).join('')}
            </select><br>
            <label>Pan Tilt Zoom:</label><br>
            <label for="pan">Pan:</label>
            <input type="number" id="pan"><br>
            <label for="tilt">Tilt:</label>
            <input type="number" id="tilt"><br>
            <label for="zoom">Zoom:</label>
            <input type="number" id="zoom"><br>
            <button onclick="saveCustomPreset('${cameraName}')">Save</button>
        </div>
    `;
}

function saveCustomPreset(cameraName) {
    const presetName = document.getElementById('presetName').value;
    const selectedPreset = document.getElementById('presetSelect').value; // Getting the selected preset
    const pan = document.getElementById('pan').value;
    const tilt = document.getElementById('tilt').value;
    const zoom = document.getElementById('zoom').value;
    console.log('Saving Preset Data:', { cameraName, selectedPreset, presetName, pan, tilt, zoom }); // Log data to be saved
    const payload = {
        cameraName: cameraName,
        selectedPreset: selectedPreset, // Include the selected preset in the payload
        presetName: presetName,
        pan: pan,
        tilt: tilt,
        zoom: zoom,
        isNewPreset: isNewPreset,
        originalPresetName: originalPresetName // Include the original preset name
    };

    fetch('/save-custom-preset', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to save custom preset');
        }
        console.log('Custom preset saved successfully');
        // Optionally, perform additional actions after successful save
        fetchAndPopulatePresets(cameraName); // Re-populate presets
        // Reset input fields
        document.getElementById('presetName').value = '';
        document.getElementById('pan').value = '';
        document.getElementById('tilt').value = '';
        document.getElementById('zoom').value = '';
        showCameraDetails(cameraName); // Show camera details again, which includes preset pad
    })
    .catch(error => {
        console.error('Error saving custom preset:', error);
        // Optionally, handle error or provide feedback to the user
    });
}

function deleteCustomPreset(cameraName, presetName) {
    // Display a confirmation dialog
    if (confirm(`Are you sure you want to delete the custom preset "${presetName}"?`)) {
        // If the user confirms, send an HTTP request to the server to delete the preset
        fetch('/delete-custom-preset', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cameraName: cameraName, presetName: presetName })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete custom preset');
            }
            console.log('Custom preset deleted successfully');
            // Optionally, perform additional actions after successful deletion
            showCameraDetails(cameraName); // Show camera details again, which includes preset pad

        })
        .catch(error => {
            console.error('Error deleting custom preset:', error);
            // Optionally, handle error or provide feedback to the user
        });
    }
}

function updateCustomPresetOrder(cameraName) {
    const customPresetList = document.getElementById('customPresetList');
    const customPresets = customPresetList.getElementsByTagName('tr');

    // Extract preset names in the new order
    const updatedCustomPresets = Array.from(customPresets).map(preset => {
        return preset.querySelector('.preset-name').innerText;
    });

    // Log the extracted presets to verify
    console.log('Updated Custom Presets:', updatedCustomPresets);

    // Update the JSON data with the new order
    fetch('/update-custom-preset-order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ presetNames: updatedCustomPresets }), // Ensure presetNames matches the server-side expectation
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update custom preset order');
        }
        console.log('Custom preset order updated successfully');
        // Additional logic if needed

        sessionStorage.setItem('currentCameraName', cameraName);
        reloadCameraDetails(); // Reload the camera details view after successful update
    })
    .catch(error => {
        console.error('Error updating custom preset order:', error);
    });
}

function moveCustomPresetTo(cameraName, presetId) {
    const customPresetList = document.getElementById('customPresetList');
    const customPresets = customPresetList.getElementsByTagName('tr');
    const moveToInput = customPresets[presetId].querySelector('.move-to-input');
    const lineNumber = parseInt(moveToInput.value);

    if (isNaN(lineNumber) || lineNumber < 1 || lineNumber > customPresets.length) {
        console.error('Invalid line number:', lineNumber);
        return;
    }

    // Insert the current preset at the specified line number
    const currentPreset = customPresets[presetId];
    const targetPreset = customPresets[lineNumber - 1];
    customPresetList.insertBefore(currentPreset, targetPreset);

    // Update the custom preset order
    updateCustomPresetOrder(cameraName);
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

let dialog = null;

function showDialog(text) {
    // Create dialog container
    const dialogContainer = document.createElement('div');
    dialogContainer.classList.add('dialog-container');

    // Create dialog box
    const dialogBox = document.createElement('div');
    dialogBox.classList.add('dialog-box');

    // Create dialog text
    const dialogText = document.createElement('p');
    dialogText.classList.add('dialog-text'); // Add dialog text class
    dialogText.textContent = text;

    // Append dialog text to dialog box
    dialogBox.appendChild(dialogText);

    // Append dialog box to dialog container
    dialogContainer.appendChild(dialogBox);

    // Append dialog container to the body
    document.body.appendChild(dialogContainer);

    // Store reference to dialog
    dialog = dialogContainer;
}

function closeDialog() {
    if (dialog) {
        dialog.remove(); // Remove dialog from the DOM
        dialog = null; // Reset dialog reference
    }
}

