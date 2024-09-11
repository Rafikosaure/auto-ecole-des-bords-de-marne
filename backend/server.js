// imports
const app = require("./app").app
const ENV = require("./config/env").ENV

// sets the server port
const PORT =  ENV.SERVERPORT || 8000;

// listens to incoming requests
app.listen(PORT, () => {
    // warning in case the server is not running on the .env port
    PORT != ENV.SERVERPORT && console.log("Warning! The server is currently running on a backup port");
    console.log(`Listening at http://${ENV.SERVERIP}:${PORT}`);
})