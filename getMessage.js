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

        //verifier si l'utilisateur dans un lobby
        const [user] =  await connection.query('SELECT * FROM users WHERE id = ? AND role = "coach"', [userId]);
        if (user.length === 0) {
            return res.status(403).json({message: 'Seulement les coachs peuvent créer un lobby'});
        }

        //créer un lobby et faire du coach un admin
        await connection.query('INSERT INTO lobbies (name, admin_id) VALUES(?, ?)', [lobbyName, userId]);
        res.json({message: 'Lobby crée avec succès'});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'erreur serveur'});
    }
})

export default app