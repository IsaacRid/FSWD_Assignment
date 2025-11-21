const model = require('../models/user.server.models.js');

function authMiddleware(req, res, next) {
    const token = req.header('X-Authorization');

    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    model.getIdByToken(token, (err, userId) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error" });
        }

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        req.userId = userId;
        req.token = token;
        next();
    });
}

module.exports = authMiddleware;
