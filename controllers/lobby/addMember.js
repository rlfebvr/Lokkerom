import express from 'express';
import connection from "../../dbConnect.js"
import authenticateToken from '../../auth.js'
const app = express.Router()


//Add a member to a lobby
app.post('/',authenticateToken, async(req, res) => {
    const {memberId, lobbyId} = req.body;
    const coachId = req.user;
    try {
        const [lobby] = await connection.query('SELECT * FROM lobbies WHERE id = ? and admin_id = ?', [lobbyId, coachId])
        if (lobby.length === 0) {
            return res.status(403).json({message: "Only the coach can add member"})
        }
        await connection.query('INSERT INTO team_members (user_id, lobby_id) VALUES (?, ?)', [memberId, lobbyId])
        res.json({message: "Member added to the team"})
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Error server"})
    }
})

export default app