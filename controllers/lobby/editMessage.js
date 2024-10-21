import express from 'express';
import connection from "../../dbConnect.js";
import authenticateToken from '../../auth.js';

const app = express.Router();

// Modifier un message existant
app.put('/:messageId', authenticateToken, async (req, res) => {
    const { messageId } = req.params;
    const { content } = req.body;
    const userId = req.user;  // L'ID de l'utilisateur connecté

    try {
        // Vérifier si le message existe et appartient à l'utilisateur connecté
        const [message] = await connection.query('SELECT * FROM messages WHERE id = ? AND user_id = ?', [messageId, userId]);
        if (message.length === 0) {
            return res.status(403).json({ message: 'Vous ne pouvez modifier que vos propres messages.' });
        }

        // Mettre à jour le contenu du message
        await connection.query('UPDATE messages SET content = ? WHERE id = ?', [content, messageId]);
        res.json({ message: 'Message modifié avec succès.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

export default app;
