
# CLID Selector Widget

## Description

This custom widget provides Agents/Supervisors with the ability to:
- Set the Caller ID before starting an outbound voice interaction, transferring to, or consulting an external number, utilizing the Workspaces Widget Framework methods.

---

## :warning: **Disclaimer**

> :bulb: This sample application is provided **for demonstration purposes only** and is not intended for production use. We assume no responsibility for any issues arising from its use.

---

## Technical Details

The widget primarily uses `AXP Admin - Voice APIs`, alongside the `Workspaces Widget Framework SDK`.

### Workspaces Widget Framework SDK
- `onDataEvent("onAgentStateEvent", callback)`: Subscribe to changes in the Agent's state (logged in, ready, not ready, etc.).
- `getConfiguration().user`: Retrieve the full logged-in Agent configuration.
- `getCapabilities()`: Determine if the Agent can use VOICE channels.

### Admin APIs
- [Authorization](https://developers.avayacloud.com/avaya-experience-platform/docs/how-to-authenticate-with-axp-apis#client-credentials-grant): Acquire an access token for all API calls.
- [List Phone Numbers](https://developers.avayacloud.com/avaya-experience-platform/reference/searchphonenumbers): Retrieve available administered phone numbers.

## Configuration & Installation

The widget comprises two components: the widget itself (`bundles.js`) and a backend component for authorization and proxying Admin API requests. Both components are not multi-tenanted and require individual deployment per tenant.

Pre-requisites include acquiring AXP Client Credentials `(CLIENT_ID and CLIENT_SECRET)` and an AXP API Application Key `(AXP_API_APP_KEY)`. 
Node.js `v18.0+` is also required.

### Running the Backend Component
Refer to the AXP Proxy API build & deploy guide available [here](https://github.com/AvayaExperiencePlatform/axp-api-proxy).

### Building the Widget Bundle.js File for Your Tenant
The bundle.js file is built out of this react-app 

- Navigate to `src/app/config.js` and update the configuration to match your tenant, for example: 
```js
        export default {
            env: {
                AXP_CLIENT_ID: "YOUR_AXP_CLIENT_ID",
                AXP_PROXY_BASE_URL: "https://your_server_fqdn_running_axp-proxy-api:3001",
                AXP_ACCOUNT_ID: "ABCDEF",
                AXP_API_APP_KEY: "YOUR_AXP_API_APP_KEY"
            },
        };
```
 - After updating, run `yarn install` to install dependencies 
 - Run `npm run prod` to build the `bundle.js` file, to be located in the `build/` folder.

## Dockerized Hosting

### Prerequisites
- Node.js version 18+.
- Docker & Docker Compose.
- SSL Certificate & Key.
- Upload the `clid-selector-widget.json` file to the Avaya Experience Platform Admin Portal -> Widget Management.

### Steps
1. Update `docker-compose-dev.yml` with SSL certificate paths.
2. Run the following commands:
   ```sh
   yarn install
   npm run build
   docker-compose -f docker-compose-dev.yml up # add -d to run in a background process
   ```
3. After any change, run `npm run build` and refresh your workspaces.

If you've done everything correctly, It should look something like this (default view without any changes).

![Widget Screenshot](./public/screenshot.png)

## Manual Hosting

### Hosting the Widget with NGINX
The widget can be served using any web server. Below is an NGINX configuration example:

```nginx
server {
    listen 8443 ssl;
    ssl_certificate /etc/nginx/cer.cer;
    ssl_certificate_key /etc/nginx/key.key;
    add_header Access-Control-Allow-Origin *;
    root /home/username/Projects/clid-dialing-widget/build; # Path to the folder including bundle.js file
    autoindex on;
}
```
