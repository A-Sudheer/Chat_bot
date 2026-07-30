const optionalAuth = ( req, res, next ) => {
    const authHeader = req.headers.authorization;
    if(authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        try {
            const decoded = jwt.verify( token, process.env.JWT_SECRET );
            req.user = { id: decoded.id };
        } catch (err) {
            
        }
    }
    next();
}

export default optionalAuth;