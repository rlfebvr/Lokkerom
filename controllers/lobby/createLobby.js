import express from 'express';
import connection from "../../dbConnect.js"
const app = express.Router()
import authenticateToken from '../../auth.js'


//Create a lobby
app.post('/',authenticateToken, async(req, res) => {
    const {lobbyName} = req.body;
    const userId = req.user;
    try {
        //Checking in the user is a coach
        const [user] =  await connection.query('SELECT * FROM users WHERE id = ? AND role = "coach"', [userId]);
        if (user.length === 0) {
            return res.status(403).json({message: 'Only coach can create a lobby'});
        }
        //Creating lobby and making the user the admin 
        await connection.query('INSERT INTO lobbies (name, admin_id) VALUES(?, ?)', [lobbyName, userId]);
        res.json({message: 'Lobby created successfully'});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'error server'});
    }
})

export default app