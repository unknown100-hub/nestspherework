const app = require('./server/server');

if (require.main === module) {
    app.startServer();
}

module.exports = app;
