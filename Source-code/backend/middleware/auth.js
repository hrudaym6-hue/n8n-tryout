const authenticateSession = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    next();
};

const requireAdmin = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    if (req.session.user.userType !== 'A') {
        return res.status(403).json({ error: 'Admin privileges required' });
    }
    next();
};

module.exports = {
    authenticateSession,
    requireAdmin
};
