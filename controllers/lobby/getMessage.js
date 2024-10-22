import express from 'express';
import connection from "../../dbConnect.js"
const app = express.Router()
import authenticateToken from '../../auth.js'


//Creation lobby pour les coachs
app.get('/',authenticateToken, async(req, res) => {
  //  const {message} = req.body;
    const userId = req.user;
    try {
        //verifier si l'utilisateur est dans un lobby
        const [member] =  await connection.query('SELECT * FROM team_members WHERE user_id = ?', [userId]);
        if (member.length === 0) {
            return res.status(403).json({message: 'Not part of any lobby'});
        }
        const lobbyId = member[0]["lobby_id"]
        // pagination
        const query = req.query
        if(Object.keys(query).length === 2) // vérification qu'il y a 2 valeurs
            if(Object.keys(query)[0] === 'page' && Object.keys(query)[1] === 'limit' ){ // vérification que les valeurs sont dans page et limit
                if (parseInt(query.page) > 0 && parseInt(query.limit) > 0) { // vérification que les valeurs sont valides (valeur > 0 )
                    const start = ((query.page -1)*query.limit)
                const stock = (await connection.query(
                    'SELECT * FROM messages WHERE lobby_id = ? LIMIT ? OFFSET ?', [lobbyId, parseInt(query.limit), start]))[0];
                res.json({message: 'Page envoyée avec succès', stock});
                }else 
                    res.status(403).json({message: 'Query value incorrecte '})
            } else
                res.status(403).json({message: 'Query incorrecte'})
        else{  
        //selection des messages
        const stock = (await connection.query('SELECT * FROM messages WHERE lobby_id = ?', [lobbyId]))[0];
        res.json({message: 'Messages envoyé avec succès', stock})
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'erreur serveur'});
    }
})

export default app