import express from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv'
import connection from './dbConnect.js'
import jwt from 'jsonwebtoken'
dotenv.config()
const app = express();
const port = process.env.PORT;

//Middleware

app.use(bodyParser.json()); //analyse les requêtes au format json et les transforme en objet dans req.body

//démarrer le serveur
import lobbyRouter from './controllers/lobby/lobby.js'
app.use('/lobby', lobbyRouter);

import userRouter from './controllers/user/user.js'
app.use('/user', userRouter);

app.listen(port, () => {
    console.log(`serveur démarrer sur http://localhost:${port}`);
})

