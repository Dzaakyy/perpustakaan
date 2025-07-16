import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.accessToken || (req.headers.authorization && req.headers.authorization.split(' ')[1]);

    if (!token) {
        return res.status(401).json({ msg: "Token tidak ditemukan" });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ msg: "Token tidak valid atau kedaluwarsa" });
        }

        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            roleId: decoded.roleId,
            roleName: decoded.roleName
        };

        next();
    });
};