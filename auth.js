import dotenv from 'dotenv'
import connection from "./dbConnect.js"
import jwt from 'jsonwebtoken'
dotenv.config()

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null)
        return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,async (err, user) => {
        if (err)
            return res.status(403).json({message: "Auth: Token non valide"})
        req.user = user.name;
        await connection.query('UPDATE token SET refreshedAt = NOW() WHERE user_id = ?',[user.name])
        next();
    })
}

export default authenticateToken;

