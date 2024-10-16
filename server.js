import express from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql2';
import bcrypt from 'bcrypt';

const app = express();
const port = 3000;

//Middleware

app.use(bodyParser.json()); //analyse les requêtes au format json et les transforme en objet dans req.body

async function getConnection() {
    return mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'naruto1996',
        database:'lokkeroom'
    })
}
//route d'inscription

app.post('/signup', async (res, req) => {
    const {email, password} = req.body;

    try {
        const connection = await getConnection();

        //utilisateur existant
        const [existingUser] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({message : 'utilisateur déjà existant avec cet email'});
        }

        //hacher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);
        //ajout de l'utilisateur dans la base de donnée
        await connection.execute('INSERT INTO users (email, password) VALUES (?, ?)',  [email, hashedPassword]);
        res.json({message: 'inscription réussie'})
    } catch(error) {
        console.error(error);
        res.status(500).json({message :'erreur serveur'});
    }
})

//route de connexion
app.post('/api/signup', async (req, res) => {
    const {email, password} = req.body;

    try {
        const connection = await getConnection();
        const [rows] = await connection.execute('SELECT * FROM users WHERE email = ?' , [email]);

        if (rows.length === 0) {
            return res.status(401).json({message : 'E-mail ou mot de passe incorrect'});
        }

        const user = rows[0];

        //verifier le mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({message : 'email ou mot de passe incorrect'});
        }

        res.json({message: 'connexion réussie !', user: {id : user.id, email: user.email}});
    } catch (error) {
        console.error(error);
        res.status(500).json({message : 'Erreur serveur'});
    }

//démarrer le serveur

app.listen(port, () => {
    console.log(`serveur démarrer sur http://localhost:${port}`);
})})