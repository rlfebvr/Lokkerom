import express from 'express';
import connection from "../../dbConnect.js";
import authenticateToken from '../../auth.js';

const app = express.Router();

// Edit a message
app.put('/:messageId', authenticateToken, async (req, res) => {
    const { messageId } = req.params;
    const { content } = req.body;
    const userId = req.user;

    try {
        // Checking if the message is from the user
        const [message] = await connection.query('SELECT * FROM messages WHERE id = ? AND user_id = ?', [messageId, userId]);
        if (message.length === 0) {
            return res.status(403).json({ message: 'You can only edit  your own messages' });
        }

        // Editing the message
        await connection.query('UPDATE messages SET content = ? WHERE id = ?', [content, messageId]);
        res.json({ message: 'Message edited successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error server' });
    }
});

export default app;
