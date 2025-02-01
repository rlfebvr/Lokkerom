import express from 'express';
import connection from "../../dbConnect.js"
const app = express.Router()
import authenticateToken from '../../auth.js'


// ?page=x&limit=y  
app.get('/',authenticateToken, async(req, res) => {
    const userId = req.user;
    try {
        //Checking the member user is part of a lobby
        const [member] =  await connection.query('SELECT * FROM team_members WHERE user_id = ?', [userId]);
        if (member.length === 0) {
            return res.status(403).json({message: 'Not part of any lobby'});
        }
        const lobbyId = member[0]["lobby_id"]
        // pagination
        const query = req.query
        if(Object.keys(query).length === 2) // Checking there is only 2 parameters
            if(Object.keys(query)[0] === 'page' && Object.keys(query)[1] === 'limit' ){ // Checking if the parameters are page and limit in order
                if (parseInt(query.page) > 0 && parseInt(query.limit) > 0) { // Checking if the value are valid
                    const start = ((query.page -1)*query.limit)
                const stock = (await connection.query(
                    'SELECT * FROM messages WHERE lobby_id = ? LIMIT ? OFFSET ?', [lobbyId, parseInt(query.limit), start]))[0];
                res.json({message: 'Page sent successfully', stock});
                }else 
                    res.status(403).json({message: 'Query value incorrect '})
            } else
                res.status(403).json({message: 'Query incorrect'})
        else{  
        //selection des messages
        const stock = (await connection.query('SELECT * FROM messages WHERE lobby_id = ?', [lobbyId]))[0];
        res.json({message: 'Message sent successfully', stock})
        }
    } catch (error) {
        res.status(500).json({message: 'error server'});
    }
})

export default app