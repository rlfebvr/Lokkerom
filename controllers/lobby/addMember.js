import express from 'express';
import connection from "../../dbConnect.js"
import authenticateToken from '../../auth.js'
const app = express.Router()


//ajouter des membres à l'équipe
app.post('/',authenticateToken, async(req, res) => {
    const {memberId, lobbyId} = req.body;
    const coachId = req.user;
    console.log("coachID= "+ coachId)
    try {
       
        const [lobby] = await connection.query('SELECT * FROM lobbies WHERE id = ? and admin_id = ?', [lobbyId, coachId])
        if (lobby.length === 0) {
            return res.status(403).json({message: "seul l'admin peut ajouter des membres"})
        }
        // ajout membre à l'équipe
        await connection.query('INSERT INTO team_members (user_id, lobby_id) VALUES (?, ?)', [memberId, lobbyId])
        res.json({message: "Membre ajouté à l'équipe"})
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Erreur serveur"})
    }
})

export default app