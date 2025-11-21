const users = require('../models/user.server.models.js');
const Joi = require('joi');

const create_account = (req, res) => {
    const createAccountSchema = Joi.object({
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(25).pattern(/[A-Z]/, 'uppercase').pattern(/[a-z]/, 'lowercase').pattern(/[^A-Za-z0-9]/, 'special').pattern(/\d/).required()
    }).unknown(false);
    const { error } = createAccountSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ error_message: error.details[0].message });
    }

    users.addNewUser(req.body, (err, id) => {
        if (err) {
            if (err.code === 'SQLITE_CONSTRAINT' && err.message.includes('UNIQUE constraint failed')) {
                return res.status(400).json({ error_message: 'Email already exists' });
            }
            return res.status(500).json({ error_message: 'Database error' });
        }
        res.status(201).json({ user_id: id });
    });
}

const login = (req, res) => {
    const loginSchema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(25).pattern(/[A-Z]/, 'uppercase').pattern(/[a-z]/, 'lowercase').pattern(/[^A-Za-z0-9]/, 'special').pattern(/\d/).required()
    }).unknown(false);
    const { error } = loginSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ error_message: error.details[0].message });
    }

    users.authenticateUser(req.body.email, req.body.password, (err, id) => {
        if (err === 404) {
            return res.status(400).send('Invalid email or password');
        }
        if (err) {
            return res.status(500).json({ error_message: 'Database error' });
        }

        users.getToken(id, (err, token) => {
            if (err) {
                return res.status(500).json({ error_message: 'Database error' });
            }

            if (token) {
                return res.status(200).json({ user_id: id, session_token: token });
            } else {
                users.setToken(id, (err, token) => {
                    if (err) {
                        return res.status(500).json({ error_message: 'Database error' });
                    }
                    return res.status(200).json({ user_id: id, session_token: token });
                });
            }
        });
    });
}

const logout = (req, res) => {
    users.removeToken(req.token, (err) => {
        if (err) {
            return res.status(500).send('Database error');
        }
        res.status(200).send('Logged out successfully');
    });
}

module.exports = {
    create_account,
    login,
    logout
};
