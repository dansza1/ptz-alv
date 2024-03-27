const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const tmi = require('tmi.js');

const app = express();
const port = 3000;

// Load configuration from config.json
const config = require('./config.json');

app.use(express.static('public', { maxAge: 0 }));

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Twitch bot configuration
const client = new tmi.Client({
    connection: {
        secure: true,
        reconnect: true
    },
    identity: {
        username: config.twitch.username,
        password: config.twitch.oauthKey
    },
    channels: [config.twitch.channel]
});

client.connect().catch(console.error);

// Endpoint to fetch current Twitch settings
app.get('/twitch-settings', (req, res) => {
    // Read the Twitch settings from the configuration file (config.json)
    fs.readFile('config.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading Twitch settings:', err);
            return res.status(500).json({ error: 'Error reading Twitch settings' });
        }

        // Parse the JSON data
        const twitchSettings = JSON.parse(data);
        // Send the Twitch settings as JSON response
        res.json(twitchSettings);
    });
});



// Endpoint to save Twitch settings
app.post('/save-twitch-settings', (req, res) => {
    const { username, channel, oauthKey } = req.body;

    // Update only the fields that were edited
    if (username) config.twitch.username = username;
    if (channel) config.twitch.channel = channel;
    if (oauthKey) config.twitch.oauthKey = oauthKey;

    // Write updated configuration back to config.json
    fs.writeFile('./config.json', JSON.stringify(config, null, 4), (err) => {
        if (err) {
            console.error('Error writing config file:', err);
            return res.status(500).send('Error saving settings');
        }
        console.log('Twitch settings saved successfully');
        res.send('Twitch settings saved successfully');
    });
});


// Endpoint to add a new preset to a camera
app.post('/add-preset', (req, res) => {
    const { cameraName, newPresetName } = req.body;
    if (!cameraName || !newPresetName || cameraName.trim() === '' || newPresetName.trim() === '') {
        console.error('Invalid camera name or preset name provided');
        return res.status(400).send('Invalid camera name or preset name provided');
    }

    fs.readFile(path.join(__dirname, 'public', 'cameras.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading cameras data:', err);
            return res.status(500).send('Error reading cameras data');
        }

        let camerasData;
        try {
            camerasData = JSON.parse(data);
        } catch (parseError) {
            console.error('Error parsing cameras data:', parseError);
            return res.status(500).send('Error parsing cameras data');
        }

        const cameraIndex = camerasData.cameras.findIndex(camera => camera.name === cameraName);
        if (cameraIndex === -1) {
            console.error('Camera not found:', cameraName);
            return res.status(404).send('Camera not found');
        }

        camerasData.cameras[cameraIndex].presets.push(newPresetName);

        fs.writeFile(path.join(__dirname, 'public', 'cameras.json'), JSON.stringify(camerasData), 'utf8', (writeErr) => {
            if (writeErr) {
                console.error('Error writing cameras data:', writeErr);
                return res.status(500).send('Error writing cameras data');
            }

            console.log('Preset added successfully:', newPresetName);
            res.send('Preset added successfully');
        });
    });
});

// Endpoint to add a new camera
app.post('/add-camera', (req, res) => {
    const cameraName = req.body.cameraName;
    if (!cameraName || cameraName.trim() === '') {
        console.error('Invalid camera name provided');
        return res.status(400).send('Invalid camera name provided');
    }

    // Load cameras data from the JSON file
    fs.readFile(path.join(__dirname, 'public', 'cameras.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading cameras data:', err);
            return res.status(500).send('Error reading cameras data');
        }

        let camerasData;
        try {
            camerasData = JSON.parse(data);
        } catch (parseError) {
            console.error('Error parsing cameras data:', parseError);
            return res.status(500).send('Error parsing cameras data');
        }

        // Here you can add the logic to save the new camera to your data store
        camerasData.cameras.push({ name: cameraName, presets: [] });

        // Write updated cameras data back to the JSON file
        fs.writeFile(path.join(__dirname, 'public', 'cameras.json'), JSON.stringify(camerasData), 'utf8', (writeErr) => {
            if (writeErr) {
                console.error('Error writing cameras data:', writeErr);
                return res.status(500).send('Error writing cameras data');
            }

            console.log('Camera added successfully:', cameraName);
            res.send('Camera added successfully');
        });
    });
});

// Endpoint to fetch camera data
app.get('/cameras', (req, res) => {
    // Load cameras data from the JSON file
    fs.readFile(path.join(__dirname, 'public', 'cameras.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading cameras data:', err);
            return res.status(500).send('Error reading cameras data');
        }

        const camerasData = JSON.parse(data);
        res.json(camerasData);
    });
});

// Endpoint to update preset order
app.post('/update-preset-order', (req, res) => {
    const { cameraName, presets } = req.body;
    if (!cameraName || !presets || !Array.isArray(presets)) {
        console.error('Invalid camera name or preset data provided');
        return res.status(400).send('Invalid camera name or preset data provided');
    }

    fs.readFile(path.join(__dirname, 'public', 'cameras.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading cameras data:', err);
            return res.status(500).send('Error reading cameras data');
        }

        let camerasData;
        try {
            camerasData = JSON.parse(data);
        } catch (parseError) {
            console.error('Error parsing cameras data:', parseError);
            return res.status(500).send('Error parsing cameras data');
        }

        const cameraIndex = camerasData.cameras.findIndex(camera => camera.name === cameraName);
        if (cameraIndex === -1) {
            console.error('Camera not found:', cameraName);
            return res.status(404).send('Camera not found');
        }

        // Update presets order for the specified camera
        camerasData.cameras[cameraIndex].presets = presets;

        fs.writeFile(path.join(__dirname, 'public', 'cameras.json'), JSON.stringify(camerasData), 'utf8', (writeErr) => {
            if (writeErr) {
                console.error('Error writing cameras data:', writeErr);
                return res.status(500).send('Error writing cameras data');
            }

            console.log('Preset order updated successfully for camera:', cameraName);
            res.send('Preset order updated successfully');
        });
    });
});


app.post('/update-custom-preset-order', (req, res) => {
    const { presetNames } = req.body;
    if (!presetNames || !Array.isArray(presetNames)) {
        console.error('Invalid preset data provided');
        return res.status(400).send('Invalid preset data provided');
    }

    // Read existing custom presets from custom-presets.json
    fs.readFile(path.join(__dirname, 'public', 'custom-presets.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading custom presets data:', err);
            return res.status(500).send('Error reading custom presets data');
        }

        let customPresetsData;
        try {
            customPresetsData = JSON.parse(data);
        } catch (parseError) {
            console.error('Error parsing custom presets data:', parseError);
            return res.status(500).send('Error parsing custom presets data');
        }

        // Update the order of custom presets
        const updatedCustomPresets = [];
        presetNames.forEach(presetName => {
            const existingPreset = customPresetsData.find(preset => preset.presetName === presetName);
            if (existingPreset) {
                updatedCustomPresets.push(existingPreset);
            }
        });

        // Merge updated order with existing presets data
        customPresetsData.forEach(preset => {
            if (!presetNames.includes(preset.presetName)) {
                updatedCustomPresets.push(preset);
            }
        });

        // Write updated custom presets to custom-presets.json
        fs.writeFile(path.join(__dirname, 'public', 'custom-presets.json'), JSON.stringify(updatedCustomPresets, null, 2), 'utf8', (writeErr) => {
            if (writeErr) {
                console.error('Error writing custom presets data:', writeErr);
                return res.status(500).send('Error writing custom presets data');
            }

            console.log('Custom preset order updated successfully');
            res.send('Custom preset order updated successfully');
        });
    });
});


// Endpoint to rename a preset
app.post('/rename-preset', (req, res) => {
    const { cameraName, presetId, newPresetName } = req.body;
    if (!cameraName || !presetId || !newPresetName || cameraName.trim() === '' || newPresetName.trim() === '') {
        console.error('Invalid camera name, preset ID, or new preset name provided');
        return res.status(400).send('Invalid data provided');
    }

    fs.readFile(path.join(__dirname, 'public', 'cameras.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading cameras data:', err);
            return res.status(500).send('Error reading cameras data');
        }

        let camerasData;
        try {
            camerasData = JSON.parse(data);
        } catch (parseError) {
            console.error('Error parsing cameras data:', parseError);
            return res.status(500).send('Error parsing cameras data');
        }

        const cameraIndex = camerasData.cameras.findIndex(camera => camera.name === cameraName);
        if (cameraIndex === -1) {
            console.error('Camera not found:', cameraName);
            return res.status(404).send('Camera not found');
        }

        const presetIndex = parseInt(presetId);
        if (isNaN(presetIndex) || presetIndex < 0 || presetIndex >= camerasData.cameras[cameraIndex].presets.length) {
            console.error('Invalid preset ID:', presetId);
            return res.status(400).send('Invalid preset ID');
        }

        // Update the preset name
        camerasData.cameras[cameraIndex].presets[presetIndex] = newPresetName;

        // Write updated cameras data back to the JSON file
        fs.writeFile(path.join(__dirname, 'public', 'cameras.json'), JSON.stringify(camerasData), 'utf8', (writeErr) => {
            if (writeErr) {
                console.error('Error writing cameras data:', writeErr);
                return res.status(500).send('Error writing cameras data');
            }

            console.log('Preset renamed successfully:', newPresetName);
            res.send('Preset renamed successfully');
        });
    });
});

// Endpoint to delete a preset from a camera
app.post('/delete-preset', (req, res) => {
    const { cameraName, presetId } = req.body;
    if (!cameraName || !presetId) {
        console.error('Invalid camera name or preset ID provided');
        return res.status(400).send('Invalid camera name or preset ID provided');
    }

    fs.readFile(path.join(__dirname, 'public', 'cameras.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading cameras data:', err);
            return res.status(500).send('Error reading cameras data');
        }

        let camerasData;
        try {
            camerasData = JSON.parse(data);
        } catch (parseError) {
            console.error('Error parsing cameras data:', parseError);
            return res.status(500).send('Error parsing cameras data');
        }

        const cameraIndex = camerasData.cameras.findIndex(camera => camera.name === cameraName);
        if (cameraIndex === -1) {
            console.error('Camera not found:', cameraName);
            return res.status(404).send('Camera not found');
        }

        // Remove the preset from the presets array
        camerasData.cameras[cameraIndex].presets.splice(presetId, 1);

        // Write the updated cameras data back to the JSON file
        fs.writeFile(path.join(__dirname, 'public', 'cameras.json'), JSON.stringify(camerasData), 'utf8', (writeErr) => {
            if (writeErr) {
                console.error('Error writing cameras data:', writeErr);
                return res.status(500).send('Error writing cameras data');
            }

            console.log('Preset deleted successfully:', presetId);
            res.send('Preset deleted successfully');
        });
    });
});

// Endpoint to rename a camera
app.post('/rename-camera', (req, res) => {
    const { oldCameraName, newCameraName } = req.body;
    if (!oldCameraName || !newCameraName || oldCameraName.trim() === '' || newCameraName.trim() === '') {
        console.error('Invalid camera names provided');
        return res.status(400).send('Invalid camera names provided');
    }

    fs.readFile(path.join(__dirname, 'public', 'cameras.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading cameras data:', err);
            return res.status(500).send('Error reading cameras data');
        }

        let camerasData;
        try {
            camerasData = JSON.parse(data);
        } catch (parseError) {
            console.error('Error parsing cameras data:', parseError);
            return res.status(500).send('Error parsing cameras data');
        }

        const cameraIndex = camerasData.cameras.findIndex(camera => camera.name === oldCameraName);
        if (cameraIndex === -1) {
            console.error('Camera not found:', oldCameraName);
            return res.status(404).send('Camera not found');
        }

        // Update the camera name
        camerasData.cameras[cameraIndex].name = newCameraName;

        // Write updated cameras data back to the JSON file
        fs.writeFile(path.join(__dirname, 'public', 'cameras.json'), JSON.stringify(camerasData), 'utf8', (writeErr) => {
            if (writeErr) {
                console.error('Error writing cameras data:', writeErr);
                return res.status(500).send('Error writing cameras data');
            }

            console.log('Camera renamed successfully:', oldCameraName, 'to', newCameraName);
            res.send('Camera renamed successfully');
        });
    });
});

// Endpoint to delete a camera and its presets
app.post('/delete-camera', (req, res) => {
    const cameraName = req.body.cameraName;
    if (!cameraName || cameraName.trim() === '') {
        console.error('Invalid camera name provided');
        return res.status(400).send('Invalid camera name provided');
    }

    // Read cameras data from the JSON file
    fs.readFile(path.join(__dirname, 'public', 'cameras.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading cameras data:', err);
            return res.status(500).send('Error reading cameras data');
        }

        let camerasData;
        try {
            camerasData = JSON.parse(data);
        } catch (parseError) {
            console.error('Error parsing cameras data:', parseError);
            return res.status(500).send('Error parsing cameras data');
        }

        // Find the index of the camera to delete
        const cameraIndex = camerasData.cameras.findIndex(camera => camera.name === cameraName);
        if (cameraIndex === -1) {
            console.error('Camera not found:', cameraName);
            return res.status(404).send('Camera not found');
        }

        // Remove the camera and its presets
        camerasData.cameras.splice(cameraIndex, 1);

        // Write the updated cameras data back to the JSON file
        fs.writeFile(path.join(__dirname, 'public', 'cameras.json'), JSON.stringify(camerasData), 'utf8', (writeErr) => {
            if (writeErr) {
                console.error('Error writing cameras data:', writeErr);
                return res.status(500).send('Error writing cameras data');
            }

            console.log('Camera deleted successfully:', cameraName);
            res.send('Camera deleted successfully');
        });
    });
});

// Move camera up in the list
app.post('/move-camera-up', (req, res) => {
    const cameraName = req.body.cameraName;

    fs.readFile(path.join(__dirname, 'public', 'cameras.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading cameras data:', err);
            return res.status(500).send('Error reading cameras data');
        }

        let camerasData;
        try {
            camerasData = JSON.parse(data);
        } catch (parseError) {
            console.error('Error parsing cameras data:', parseError);
            return res.status(500).send('Error parsing cameras data');
        }

        const cameraIndex = camerasData.cameras.findIndex(camera => camera.name === cameraName);
        if (cameraIndex === -1) {
            console.error('Camera not found:', cameraName);
            return res.status(404).send('Camera not found');
        }

        // Check if the camera is already at the top
        if (cameraIndex === 0) {
            console.log('Camera is already at the top:', cameraName);
            return res.send('Camera is already at the top');
        }

        // Swap the camera with the one above it
        [camerasData.cameras[cameraIndex], camerasData.cameras[cameraIndex - 1]] = [camerasData.cameras[cameraIndex - 1], camerasData.cameras[cameraIndex]];

        // Write updated cameras data back to the JSON file
        fs.writeFile(path.join(__dirname, 'public', 'cameras.json'), JSON.stringify(camerasData), 'utf8', (writeErr) => {
            if (writeErr) {
                console.error('Error writing cameras data:', writeErr);
                return res.status(500).send('Error writing cameras data');
            }

            console.log('Camera moved up successfully:', cameraName);
            res.send('Camera moved up successfully');
        });
    });
});

// Move camera to specified line number route
app.post('/move-camera-to', (req, res) => {
    const cameraName = req.body.cameraName;
    const lineNumber = req.body.lineNumber;

    fs.readFile(path.join(__dirname, 'public', 'cameras.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading cameras data:', err);
            return res.status(500).send('Error reading cameras data');
        }

        let camerasData;
        try {
            camerasData = JSON.parse(data);
        } catch (parseError) {
            console.error('Error parsing cameras data:', parseError);
            return res.status(500).send('Error parsing cameras data');
        }

        const cameraIndex = camerasData.cameras.findIndex(camera => camera.name === cameraName);
        if (cameraIndex === -1) {
            console.error('Camera not found:', cameraName);
            return res.status(404).send('Camera not found');
        }

        const newIndex = parseInt(lineNumber) - 1; // Line numbers start from 1
        if (isNaN(newIndex) || newIndex < 0 || newIndex >= camerasData.cameras.length) {
            return res.status(400).send('Invalid line number');
        }

        // Remove the camera from its current position and insert it at the new index
        const [movedCamera] = camerasData.cameras.splice(cameraIndex, 1);
        camerasData.cameras.splice(newIndex, 0, movedCamera);

        // Write updated cameras data back to the JSON file
        fs.writeFile(path.join(__dirname, 'public', 'cameras.json'), JSON.stringify(camerasData), 'utf8', (writeErr) => {
            if (writeErr) {
                console.error('Error writing cameras data:', writeErr);
                return res.status(500).send('Error writing cameras data');
            }

            console.log('Camera moved to line number successfully:', cameraName);
            res.send('Camera moved to line number successfully');
        });
    });
});



app.post('/save-custom-preset', (req, res) => {
    const { cameraName, selectedPreset, presetName, pan, tilt, zoom, isNewPreset, originalPresetName } = req.body;
    console.log('Received request body:', req.body);
    console.log('isNewPreset:', isNewPreset);

    // Read existing presets from custom-presets.json
    fs.readFile(path.join(__dirname, 'public', 'custom-presets.json'), 'utf8', (err, data) => {
        if (err && err.code !== 'ENOENT') {
            console.error('Error reading custom presets:', err);
            return res.status(500).json({ error: 'Failed to save custom preset' });
        }

        let presets = [];
        if (data) {
            presets = JSON.parse(data);
        }

        // Check if a preset with the same name already exists
        const existingPreset = presets.find(preset => preset.presetName === presetName);
        if (existingPreset && isNewPreset) {
            return res.status(400).json({ error: 'A preset with the same name already exists' });
        }

        if (isNewPreset) {
            // For creating a new preset
            presets.push({
                cameraName,
                selectedPreset,
                presetName,
                pan,
                tilt,
                zoom
            });
        } else {
            // For editing an existing preset
            const index = presets.findIndex(preset => preset.presetName === originalPresetName);
            if (index === -1) {
                return res.status(404).json({ error: 'Original preset not found' });
            }
            presets[index] = {
                cameraName,
                selectedPreset,
                presetName,
                pan,
                tilt,
                zoom
            };
        }

        // Write updated presets to custom-presets.json
        fs.writeFile(path.join(__dirname, 'public', 'custom-presets.json'), JSON.stringify(presets, null, 2), 'utf8', err => {
            if (err) {
                console.error('Error writing custom presets:', err);
                return res.status(500).json({ error: 'Failed to save custom preset' });
            }
            // Respond with success message
            res.status(200).json({ message: 'Custom preset saved successfully' });
        });
    });
});



// DELETE route to handle deleting a custom preset
app.delete('/delete-custom-preset', (req, res) => {
    const presetNameToDelete = req.body.presetName;

    // Read existing presets from custom-presets.json
    fs.readFile(path.join(__dirname, 'public', 'custom-presets.json'), 'utf8', (err, data) => {
        if (err && err.code !== 'ENOENT') {
            console.error('Error reading custom presets:', err);
            return res.status(500).json({ error: 'Failed to delete custom preset' });
        }

        let presets = [];
        if (data) {
            presets = JSON.parse(data);
        }

        // Find the index of the preset to delete
        const indexToDelete = presets.findIndex(preset => preset.presetName === presetNameToDelete);
        if (indexToDelete === -1) {
            return res.status(404).json({ error: 'Preset not found' });
        }

        // Remove the preset from the array
        presets.splice(indexToDelete, 1);

        // Write the updated presets back to the JSON file
        fs.writeFile(path.join(__dirname, 'public', 'custom-presets.json'), JSON.stringify(presets, null, 2), 'utf8', err => {
            if (err) {
                console.error('Error writing custom presets:', err);
                return res.status(500).json({ error: 'Failed to delete custom preset' });
            }
            // Respond with success message
            res.status(200).json({ message: 'Custom preset deleted successfully' });
        });
    });
});

app.get('/custom-presets', (req, res) => {
    // Read custom presets from custom-presets.json
    fs.readFile(path.join(__dirname, 'public', 'custom-presets.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading custom presets:', err);
            return res.status(500).json({ error: 'Failed to fetch custom presets' });
        }

        // Parse presets data and send as response
        const presets = JSON.parse(data);
        res.json({ presets });
    });
});

app.get('/get-preset-by-name', (req, res) => {
    const presetName = req.query.presetName;

    fs.readFile(path.join(__dirname, 'public', 'custom-presets.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ error: 'Failed to read file' });
        }

        try {
            const presets = JSON.parse(data);
            const foundPreset = presets.find(preset => preset.presetName === presetName);
            if (foundPreset) {
                res.json(foundPreset);
            } else {
                res.status(404).json({ error: 'Preset not found' });
            }
        } catch (error) {
            console.error('Error parsing JSON:', error);
            res.status(500).json({ error: 'Failed to parse JSON' });
        }
    });
});

let lastCommand = ""; // Variable to store the last command

app.post('/send-command', (req, res) => {
    const command = req.body.command;
    sendMessage(command);
    res.send('Command sent successfully');
});     

// Function to send message to Twitch chat
function sendMessage(message) {
    // Check if the command contains !ptzmove and matches the last command
    if ((message.includes('!ptzmove') || message.includes('!ptzset') || message.includes('!swap')) && message === lastCommand) {
    message += " ."; // Add " ." to the end of the message
    }
    client.say(config.twitch.channel, message);
    
    // Save the last command after the "." check
    lastCommand = message;
}       

function listenForMessages(cameraName) {
    return new Promise((resolve, reject) => {
        let messageReceived = false;

        // Listen for Twitch chat messages
        client.on('message', (channel, tags, message, self) => {
            if (self) return; // Ignore messages from the bot itself

            // Check if the message contains presets
            if (message.startsWith('PTZ Presets:')) {
                // Extract presets from the message
                const presets = message.substring(12).split(',');
                resolve(presets);
                messageReceived = true;
            }
        });

        // Stop listening after 5 seconds
        const timeout = setTimeout(() => {
            if (!messageReceived) {
                console.log('No presets found within the timeout period');
                resolve([]); // Resolve with an empty array if no message received
            }
        }, 5000);

        // Clear the timeout if presets are received before the timeout
        client.once('message', () => {
            clearTimeout(timeout);
        });
    })
    .catch(error => {
        console.error('Error in listenForMessages:', error);
        // Handle any errors encountered during message listening
        throw error; // Rethrow the error to propagate it to the caller
    });
}


// Endpoint to receive the command from the frontend
app.post('/fetch-presets', (req, res) => {
    const cameraName = req.body.cameraName;

    // Listen for Twitch chat messages for 5 seconds
    listenForMessages(cameraName)
        .then(presets => {
            // Send the presets back to the frontend
            res.json({ presets });
        })
        .catch(error => {
            console.error('Error listening for Twitch messages:', error);
            res.status(500).json({ error: 'Failed to fetch presets' });
        });
});

app.post('/add-sync-presets', (req, res) => {
    const { cameraName, newPresets } = req.body;
    if (!cameraName || !newPresets || newPresets.length === 0 || cameraName.trim() === '') {
        console.error('Invalid camera name or presets provided');
        return res.status(400).send('Invalid camera name or presets provided');
    }

    fs.readFile(path.join(__dirname, 'public', 'cameras.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading cameras data:', err);
            return res.status(500).send('Error reading cameras data');
        }

        let camerasData;
        try {
            camerasData = JSON.parse(data);
        } catch (parseError) {
            console.error('Error parsing cameras data:', parseError);
            return res.status(500).send('Error parsing cameras data');
        }

        const cameraIndex = camerasData.cameras.findIndex(camera => camera.name === cameraName);
        if (cameraIndex === -1) {
            console.error('Camera not found:', cameraName);
            return res.status(404).send('Camera not found');
        }

        camerasData.cameras[cameraIndex].presets.push(...newPresets);

        fs.writeFile(path.join(__dirname, 'public', 'cameras.json'), JSON.stringify(camerasData), 'utf8', (writeErr) => {
            if (writeErr) {
                console.error('Error writing cameras data:', writeErr);
                return res.status(500).send('Error writing cameras data');
            }

            console.log('New presets added successfully:', newPresets);
            res.send('New presets added successfully');
        });
    });
});


// Server listening on port 3000
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
