const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
require("dotenv").config();
const app = express();
const port = process.env.PORT;

//Middleware

app.use(bodyParser.json()); //analyse les requêtes au format json et les transforme en objet dans req.body

async function getConnection() {
    return mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    })
}



//Creation lobby pour les coachs
app.post('/create-lobby', async (req, res) => {
    const {userId, lobbyName} = req.body;

    try {
        const connection = await getConnection();

        //verifier si l'utilisateur est coach
        const [user] = await connection.execute('SELECT * FROM users WHERE id = ? AND role = "coach"', [userId]);
        if (user.length === 0) {
            return res.status(403).json({message: 'Seulement les coachs peuvent créer un lobby'});
        }

        //créer un lobby et faire du coach un admin
        await connection.execute('INSERT INTO lobbies (name, admin_id) VALUES(?, ?)', [lobbyName, userId]);
        res.json({message: 'Lobby crée avec succès'});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'erreur serveur'});
    }
})

//ajouter des membres à l'équipe
app.post('/add-member', async(res,req) => {
    const { coachId, memberId, lobbyId} = req.body;

    try {
        const connection = await getConnection();

        const [lobby] = await connection.execute('SELECT * FROM lobbies WHERE id = ? and admin_id = ?', [lobbyId, coachId])
        if (lobby.length === 0) {
            return res.status(403).json({message: "seul l'admin peut ajouter des membres"})
        }
        // ajout membre à l'équipe
        await connection.execute('INSERT INTO team_members (user_id, lobby_id) VALUES (?, ?)', [memberId, lobbyId])
        res.json({message: "Membre ajouté à l'équipe"})
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Erreur serveur"})
    }
})

//démarrer le serveur

const userRouter = require('./controllers/controllers')

app.listen(port, () => {
    console.log(`serveur démarrer sur http://localhost:${port}`);
})