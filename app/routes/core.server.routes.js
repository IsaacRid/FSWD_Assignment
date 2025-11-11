const item = require('../controllers/core.server.controllers.js');

module.exports = function (app) {
    app.route('/item')
        .post(item.create_item)
    app.route('/item/:itemId')
        .get(item.get_item)
    app.route('/item/:itemId/bid')
        .post(item.place_bid)
        .get(item.get_bid_history)
};