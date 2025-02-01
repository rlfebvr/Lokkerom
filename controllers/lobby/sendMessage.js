import express from 'express';
import connection from "../../dbConnect.js"
const app = express.Router()
import authenticateToken from '../../auth.js'


//Send a message
app.post('/',authenticateToken, async(req, res) => {
    const {message} = req.body;
    const userId = req.user;
    console.log("id= " + userId+ "\nmessage= "+message);
    try {
        //Checking if there is a message
        if (message === null || message === "") {
            return res.status(403).json({message: 'Empty message'});
        }
        //Checking if the user is in a lobby
        const [member] =  await connection.query('SELECT * FROM team_members WHERE user_id = ?', [userId]);
        if (member.length === 0) {
            return res.status(403).json({message: 'Not part of any lobby'});
        }
        const lobbyId = member[0]["lobby_id"]
        //Adding the message
        await connection.query('INSERT INTO messages (user_id, lobby_id, message) VALUES(?, ?, ?)', [ userId, lobbyId, message]);
        res.json({message: 'Message sent successfully'});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'error server'});
    }
})

export default app