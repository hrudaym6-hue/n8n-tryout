const authenticateSession = (req, res, next) => {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    req.user = req.session.user;
    next();
};

const requireAdmin = (req, res, next) => {
    if (!req.user || req.user.userType !== 'A') {
        return res.status(403).json({ error: 'Admin privileges required' });
    }
    next();
};

const authenticateToken = authenticateSession;

module.exports = {
    authenticateSession,
    authenticateToken,
    requireAdmin
};
