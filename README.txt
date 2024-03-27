
Alveus PTZ Control

- Install Nodejs https://nodejs.org

- Run install.bat or "npm install" to install the Nodejs dependencies.

- Create Twitch OAuth key to use within the server.
 
  Use a site like https://twitchtokengenerator.com/ to create the required key.
  The following token keys are required:
  "chat:read" and "chat:edit"

- Run start-ptz.bat or "node server.js" to start the ptz server.
  Once the server is running open http://localhost:3000 in your browser.

- Click the Settings cog next to "Alveus PTZ" and then "Twitch Settings".
  Enter your twitch name and OAuth key

Upgrade NOTE:
  Do not overwrite your existing config.json, public/cameras.json, and public/custom-presets.json files with the template files from GitHub.
  These files contain your custom configurations and presets. Overwriting them will revert your settings to the default values provided in the template files.
