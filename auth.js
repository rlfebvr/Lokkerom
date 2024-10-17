import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
dotenv.config()

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    console.log("auth = " + req.headers['authorization'])
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null)
        return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err)
            return res.sendStatus(403)
        req.user = user;
        console.log("next=" + user)
        next();        
    })
}

export default authenticateToken;