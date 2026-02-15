const { app_config } = require('../src/config/env')
const { ensureBucket } = require('./services/objectstorageservice');
const app = require('./app');

const port = app_config.port || 3015;

const server = app.listen(port, async () => {
    await ensureBucket();
    console.log(`Server is Listening on port : ${port}`);
});

