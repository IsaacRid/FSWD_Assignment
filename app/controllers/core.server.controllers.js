const create_item = (req, res) => {
    res.send('Item created');
};

const get_item = (req, res) => {
    const { itemId } = req.params;
    res.send(`Item details for item ${itemId}`);
};

const place_bid = (req, res) => {
    const { itemId } = req.params;
    res.send(`Bid placed for item ${itemId}`);
};

const get_bid_history = (req, res) => {
    const { itemId } = req.params;
    res.send(`Bid history for item ${itemId}`);
};

module.exports = {
    create_item,
    get_item,
    place_bid,
    get_bid_history
};