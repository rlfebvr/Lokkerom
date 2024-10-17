const express = require('express')
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const router = express.Router()

// Route d'inscription
router.post('/signup', async (req, res) => {
    const { email, password, role } = req.body;  // role peut être 'coach' ou 'player'

    try {
        const connection = await getConnection();

        // Vérifier si l'utilisateur existe déjà
        const [existingUser] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Utilisateur déjà existant avec cet email' });
        }

        // Hacher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Ajouter l'utilisateur à la base de données
        await connection.execute('INSERT INTO users (email, password, role) VALUES (?, ?, ?)', [email, hashedPassword, role || 'player']);
        res.json({ message: 'Inscription réussie' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Route de connexion
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const connection = await getConnection();
        const [rows] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(401).json({ message: 'E-mail ou mot de passe incorrect' });
        }

        const user = rows[0];

        // Vérifier le mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'E-mail ou mot de passe incorrect' });
        }

        res.json({ message: 'Connexion réussie !', user: { id: user.id, email: user.email, role: user.role } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

module.exports = router