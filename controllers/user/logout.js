import express from 'express';
import connection from "../../dbConnect.js"
const app = express.Router()
import authenticateToken from '../../auth.js'

app.delete('/', async (req, res) => {
  console.log("test")
    const refreshTokenClient = req.body.token;
    if (refreshTokenClient == null) return res.sendStatus(401).json({message: 'Pas de token envoyé'});
    const refreshTokenServer = await connection.query(
            'SELECT * FROM token WHERE token = ?', [refreshTokenClient]);
    console.log(refreshTokenServer)
    if(refreshTokenServer.length === 0) return res.status(403).json({message: 'Token non valide'});

    const row = refreshTokenServer[0][0];
    console.log(row)
    await connection.query('DELETE FROM token WHERE id = ?', [row.id])
    return res.status(403).json({message: 'Deconnection réussie'})
  })


export default app