// imports
const app = require("./app").app
const ENV = require("./config/env").ENV

// sets the server port
const PORT =  ENV.PORT || 8000;

// listents to incoming requests
app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`);  
})