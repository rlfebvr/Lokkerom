import express from 'express';
import bcrypt from 'bcrypt';
import connection from "../../dbConnect.js"
import jwt from 'jsonwebtoken'
import limiter from 'rate-limiter-flexible'
const router = express.Router()
const limiter = rateLimit ({
    max: 5,
    TimeBlock: 60 * 60 * 1000, // bloqué 1H
    message : "trop d'essai vous êtes bloqué"
})

// Route de connexion
router.post('*', limiter ,async(req, res) => {
    const { email, password } = req.body;

    try {
        const [rows] =  await connection.query('SELECT * FROM users WHERE email = ?', [email]);
        console.log("rows= " +rows);
        if (rows.length === 0) {
            return res.status(401).json({ message: 'E-mail ou mot de passe incorrect' });
            
        }   

        const user = rows[0];
        console.log("user= " + user)
        // Vérifier le mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'E-mail ou mot de passe incorrect' });
        }
        const accessToken = jwt.sign(user.id, process.env.ACCESS_TOKEN_SECRET)
        res.json({accessToken: accessToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

export default router