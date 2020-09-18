const express = require('express');
const router = express.Router();

const {
    createConversation,
    checkExistConversation,
    conversationDetails,
    getConversations,
    createMessage,
} = require('../controllers/chat/contact.controller');

router.get('/', getConversations);
router.get('/:id', conversationDetails);
router.post('/:id', createMessage);
router.post('/', createConversation);
router.post('/check-exist-conversation', checkExistConversation);

module.exports = router;
