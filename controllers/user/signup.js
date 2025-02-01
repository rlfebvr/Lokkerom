import express from 'express';
import bcrypt from 'bcrypt';
import connection from "../../dbConnect.js"
const router = express.Router()

// 
router.post('/',async (req, res) => {
    const { email, password} = req.body;
    try {
        // Checking if the user already exist
        const [existingUser] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'A user with this email already exist' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        // Adding member to the database
        await connection.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);
        res.json({ message: 'Signed up successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error server' });
    }
});

export default router