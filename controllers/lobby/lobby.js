import express from 'express';

const router = express.Router()




import createLobbyRoute from './createLobby.js'
router.use('/create-lobby', createLobbyRoute);

import addMemberRoute from './addMember.js'
router.use('/add-member', addMemberRoute);

import editMessageRoute from './editMessage.js';
router.use('/edit-message', editMessageRoute);



export default router