const item = require('../controllers/core.server.controllers.js');
const authorise = require('../lib/authentication.js');

module.exports = function (app) {
    app.route('/item')
        .post(authorise, item.create_item)
    app.route('/item/:itemId')
        .get(item.get_item)
    app.route('/item/:itemId/bid')
        .post(authorise, item.place_bid)
        .get(item.get_bid_history)
};