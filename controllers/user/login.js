import express from 'express';
import bcrypt from 'bcrypt';
import connection from "../../dbConnect.js"
import jwt from 'jsonwebtoken'
const router = express.Router()

// login
router.post('*', async(req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] =  await connection.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0)
            return res.status(401).json({ message: 'E-mail or password incorrect' });
        const user = rows[0];
        // Checking the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(401).json({ message: 'E-mail or password incorrect' });
        const accessToken = jwt.sign({name: user.id}, process.env.ACCESS_TOKEN_SECRET/*, {expiresIn: '15s'}*/);
        const refreshToken = jwt.sign(user.id, process.env.REFRESH_TOKEN_SECRET);
        await connection.query('INSERT INTO token (user_id, token) VALUES (?, ?)', [user.id, refreshToken]);
        res.json({accessToken: accessToken , refreshToken: refreshToken});
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error server' });
    }
});

export default router