import express from 'express';
import bcrypt from 'bcrypt';
import connection from "../../dbConnect.js"
const router = express.Router()

// Route d'inscription
router.post('/',async (req, res) => {
    const { email, password} = req.body;
    console.log("body" + req.body)
    try {
        // Vérifier si l'utilisateur existe déjà
        const [existingUser] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
        console.log("existingUser= "+ existingUser);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Utilisateur déjà existant avec cet email' });
        }

        // Hacher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("hashpw= "+hashedPassword)
        // Ajouter l'utilisateur à la base de données
        await connection.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);
        res.json({ message: 'Inscription réussie' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

export default router