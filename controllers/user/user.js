import express from 'express';
const router = express.Router()


import signUpRoute from './signup.js'
router.use('/signup', signUpRoute);

import loginRoute from './login.js'
router.use('/login', loginRoute);




export default router