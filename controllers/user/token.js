import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import express from 'express';
import connection from "../../dbConnect.js"
const app = express.Router()
dotenv.config()

app.post('/',async (req, res) => {
  const refreshTokenClient = req.body.token
  if (refreshTokenClient == null) return res.sendStatus(401).json({message: 'Pas de token envoyé'});
  const refreshTokenServer = (await connection.query(
      'SELECT * FROM token WHERE token = ?', [refreshTokenClient]));
  
  if(refreshTokenServer[0]=== null) return res.status(403).json({message: 'Token non valide'});
  jwt.verify(refreshTokenClient, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
    if (err) return res.sendStatus(403)
    const accessToken = jwt.sign({name: user}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: 25});
    await connection.query('UPDATE token SET refreshedAt = NOW() WHERE user_id = ?',[user.name])
    res.json({ accessToken: accessToken })
  })
})


export default app;