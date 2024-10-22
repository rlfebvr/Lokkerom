import express from 'express';
const router = express.Router()


import signUpRoute from './signup.js'
router.use('/signup', signUpRoute);

import loginRoute from './login.js'
router.use('/login', loginRoute);

import logoutRoute from './logout.js'
router.use('/logout', logoutRoute);

import tokenRoute from './token.js'
router.use('/token', tokenRoute)

export default router