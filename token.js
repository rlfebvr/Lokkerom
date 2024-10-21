import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
dotenv.config()

function refreshed(){
    app.post('/token', (req, res) => {
        const refreshToken = req.body.token
        const refreshTokens // get token from data base
        if (refreshToken == null) return res.sendStatus(401)
        if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
          if (err) return res.sendStatus(403)
          const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' })
          res.json({ accessToken: accessToken })
        })
      })
}

export default refreshed;