const { app_config } = require('../env')
const app = require('./app');

const port = app_config.port || 3015;

const server = app.listen(port, () => {
    console.log(`Server is Listening on port : ${port}`);
});

