import express from 'express';
import connection from "../../dbConnect.js"
const app = express.Router()

app.delete('/', async (req, res) => {
    const refreshTokenClient = req.body.token;
    if (refreshTokenClient == null) return res.sendStatus(401).json({message: 'No token sent'});
    const refreshTokenServer = await connection.query(
            'SELECT * FROM token WHERE token = ?', [refreshTokenClient]);
    console.log(refreshTokenServer)
    if(refreshTokenServer.length === 0) return res.status(403).json({message: 'Invalid token'});
    const row = refreshTokenServer[0][0];
    console.log(row)
    await connection.query('DELETE FROM token WHERE id = ?', [row.id])
    return res.status(403).json({message: 'Logged out successfully'})
  })


export default app