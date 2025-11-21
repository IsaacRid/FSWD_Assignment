const db = require('../../database');

const create_item = (item, done) => {
    const sql = `INSERT INTO items (name, description, starting_bid, end_date) VALUES (?, ?, ?, ?)`;
    let values = [item.name, item.description, item.starting_bid, item.end_date];

    db.run(sql, values, function (err) {
        if (err) {
            return done(err);
        }

        done(null, this.lastID);
    });
};

const get_item = (itemId, done) => {
    const sql = `SELECT * FROM items WHERE item_id = ?`;

    db.get(sql, [itemId], (err, row) => {
        if (err) {
            return done(err);
        }
        done(null, row);
    });
};

const place_bid = (bidDetails, done) => {
    const sql = `INSERT INTO bids (item_id, amount, timestamp, user_id, first_name, last_name)
                 VALUES (?, ?, ?, ?, ?, ?)`;
    let values = [
        bidDetails.item_id,
        bidDetails.amount,
        Date.now(),
        bidDetails.user_id,
        bidDetails.first_name,
        bidDetails.last_name
    ];

    db.run(sql, values, function (err) {
        if (err) {
            return done(err);
        }
        done(null, { bid_id: this.lastID });
    });
};

const get_bid_history = (itemId, done) => {
    const sql = `SELECT * FROM bids WHERE item_id = ?`;
    let results = [];

    db.each(sql, [itemId], (err, row) => {
        if (err) return done(err);
        results.push(row);
    }, (err, count) => {
        if (err) return done(err);
        done(null, results);
    });

};

module.exports = {
    create_item,
    place_bid,
    get_item,
    get_bid_history
};
