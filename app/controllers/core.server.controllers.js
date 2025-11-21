const Joi = require('joi');
const core = require('../models/core.server.models');

const create_item = (req, res) => {
    console.log('=== CREATE ITEM CALLED ===');
    console.log('Request body:', req.body);

    const addItemSchema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        starting_bid: Joi.number().integer().required(),
        end_date: Joi.number().integer().required()
    }).unknown(false);

    const { error } = addItemSchema.validate(req.body);

    if (error) {
        console.log('ITEM VALIDATION ERROR:', error.details[0].message);
        return res.status(400).json({ error_message: error.details[0].message });
    }

    console.log('ITEM VALIDATION PASSED');
    let item = Object.assign({}, req.body);

    core.create_item(item, (err, id) => {
        if (err) {
            console.log('ITEM DATABASE ERROR:', err);
            return res.status(500).json({ error_message: 'Database error' });
        }

        console.log('ITEM CREATED SUCCESSFULLY, ID:', id);
        res.status(201).json({ item_id: id });
    });
};


const get_item = (req, res) => {
    const itemId = parseInt(req.params.itemId);

    core.get_item(itemId, (err, item) => {
        if (err) {
            return res.status(500);
        }
        res.status(200).send(item);
    });
};

const place_bid = (req, res) => {
    const placeBidSchema = Joi.object({
        item_id: Joi.number().integer().required(),
        bid_amount: Joi.number().integer().required()
    });

    const { error } = placeBidSchema.validate(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    core.place_bid(req.body, (err, result) => {
        if (err) {
            return res.status(500).json({ error_message: 'Database error' });
        }

        res.status(201).send(result);
    });
}

const get_bid_history = (req, res) => {
    const itemId = parseInt(req.params.itemId);

    core.get_bid_history(itemId, (err, bids) => {
        if (err) {
            return res.status(500).json({ error_message: 'Database error' });
        }
        res.status(200).send(bids);
    });
};

module.exports = {
    create_item,
    get_item,
    place_bid,
    get_bid_history
};