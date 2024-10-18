import express from 'express';
import connection from "../../dbConnect.js"
const app = express.Router()
import authenticateToken from '../../auth.js'


//Creation lobby pour les coachs
app.post('/',authenticateToken, async(req, res) => {
    const {message} = req.body;
    const userId = req.user;
    console.log("id= " + userId+ "\nmessage= "+message);
    try {
        //verifier si il y a un message
        if (message === null || message === "") {
            return res.status(403).json({message: 'Empty message'});
        }
        //verifier si l'utilisateur est dans un lobby
        const [member] =  await connection.query('SELECT * FROM team_members WHERE user_id = ?', [userId]);
        if (member.length === 0) {
            return res.status(403).json({message: 'Not part of any lobby'});
        }
        const lobbyId = member[0]["lobby_id"]
        //Ajout du message
        await connection.query('INSERT INTO messages (user_id, lobby_id, message) VALUES(?, ?, ?)', [ userId, lobbyId, message]);
        res.json({message: 'Message envoyé avec succès'});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'erreur serveur'});
    }
})

export default app