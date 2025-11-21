const crypto = require('crypto');
const db = require('../../database');

const getHash = (password, salt) => {
    return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha256').toString('hex');
}

const addNewUser = (user, done) => {
    const salt = crypto.randomBytes(64).toString('hex');
    const hash = getHash(user.password, salt);

    const sql = `INSERT INTO users (first_name, last_name, email, password, salt)
                 VALUES (?, ?, ?, ?, ?)`;
    let values = [
        user.first_name,
        user.last_name,
        user.email,
        hash,
        salt
    ];

    db.run(sql, values, function (err) {
        if (err) {
            return done(err);
        }
        done(null, this.lastID);
    });
}

const authenticateUser = (email, password, done) => {
    const sql = `SELECT user_id, password, salt FROM users WHERE email = ?`
    db.get(sql, [email], (err, row) => {
        if (err) {
            return done(err);
        }
        if (!row) {
            return done(404);
        }
        if (row.salt == null) {
            row.salt = '';
        }

        let salt = Buffer.from(row.salt, 'hex');

        if (row.password === getHash(password, salt)) {
            return done(null, row.user_id);
        }
        return done(404);
    });
}

const getToken = (id, done) => {
    const sql = `SELECT session_token FROM users WHERE user_id = ?`;
    db.get(sql, [id], (err, row) => {
        if (err) return done(err);
        if (!row) return done(null, null);
        return done(null, row.session_token);
    });
}

const setToken = (id, done) => {
    const token = crypto.randomBytes(16).toString('hex');
    const sql = `UPDATE users SET session_token = ? WHERE user_id = ?`;

    db.run(sql, [token, id], function (err) {
        return done(err, token);
    });
}

const removeToken = (token, done) => {
    if (!token) {
        return done(new Error(401));
    }
    const sql = `UPDATE users SET session_token = NULL WHERE session_token = ?`;
    db.run(sql, [token], function (err) {
        return done(err);
    });
}

const getIdByToken = (token, done) => {
    const sql = `SELECT user_id FROM users WHERE session_token = ?`;
    db.get(sql, [token], (err, row) => {
        if (err) return done(err);
        if (!row) return done(null, null);
        return done(null, row.user_id);
    });
}

module.exports = {
    addNewUser,
    authenticateUser,
    getToken,
    setToken,
    removeToken,
    getIdByToken
}